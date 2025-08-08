import OpenAI from 'openai';
import { cacheService } from './cacheService';

// Configuration interface
interface OpenAIConfig {
  apiKey: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  model: string;
  temperature: number;
}

// Request options interface
interface RequestOptions {
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  onRetry?: (attempt: number, error: Error) => void;
  onSuccess?: (response: any, duration: number) => void;
  onError?: (error: Error, attempts: number) => void;
}

// Logging interface
interface LogEntry {
  timestamp: Date;
  operation: string;
  duration: number;
  success: boolean;
  error?: string;
  retryAttempt?: number;
  requestId: string;
}

class OpenAIService {
  private client: OpenAI;
  private config: OpenAIConfig;
  private logs: LogEntry[] = [];

  constructor(config?: Partial<OpenAIConfig>) {
    this.config = {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
      timeout: 30000, // 30 seconds
      maxRetries: 3,
      retryDelay: 1000, // 1 second
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      ...config
    };

    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      dangerouslyAllowBrowser: true // Para uso no frontend - em produção, mover para backend
    });
  }

  // Generate unique request ID for tracking
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Log request details
  private log(entry: Omit<LogEntry, 'timestamp'>): void {
    const logEntry: LogEntry = {
      ...entry,
      timestamp: new Date()
    };
    
    this.logs.push(logEntry);
    
    // Keep only last 100 logs to prevent memory issues
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }

    // Console logging for development
    if (import.meta.env.DEV) {
      console.log(`[OpenAI Service] ${entry.operation}:`, {
        success: entry.success,
        duration: `${entry.duration}ms`,
        error: entry.error,
        retryAttempt: entry.retryAttempt,
        requestId: entry.requestId
      });
    }
  }

  // Sleep utility for retry delays
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Enhanced request wrapper with retry logic and timeout
  private async makeRequest<T>(
    operation: string,
    requestFn: () => Promise<T>,
    options: RequestOptions = {}
  ): Promise<T> {
    const requestId = this.generateRequestId();
    const startTime = Date.now();
    const maxRetries = options.maxRetries ?? this.config.maxRetries;
    const retryDelay = options.retryDelay ?? this.config.retryDelay;
    const timeout = options.timeout ?? this.config.timeout;

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        // Create timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error(`Request timeout after ${timeout}ms`));
          }, timeout);
        });

        // Race between request and timeout
        const result = await Promise.race([
          requestFn(),
          timeoutPromise
        ]);

        const duration = Date.now() - startTime;

        // Log successful request
        this.log({
          operation,
          duration,
          success: true,
          requestId,
          retryAttempt: attempt > 1 ? attempt : undefined
        });

        // Call success callback
        options.onSuccess?.(result, duration);

        return result;
      } catch (error) {
        lastError = error as Error;
        const duration = Date.now() - startTime;

        // Log failed attempt
        this.log({
          operation,
          duration,
          success: false,
          error: lastError.message,
          requestId,
          retryAttempt: attempt
        });

        // If this is the last attempt, don't retry
        if (attempt > maxRetries) {
          break;
        }

        // Call retry callback
        options.onRetry?.(attempt, lastError);

        // Wait before retrying with exponential backoff
        const delay = retryDelay * Math.pow(2, attempt - 1);
        await this.sleep(delay);
      }
    }

    // Call error callback
    options.onError?.(lastError!, maxRetries + 1);

    throw lastError;
  }

  // Generate chat response with enhanced error handling and caching
  async generateChatResponse(
    message: string,
    conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = [],
    options: RequestOptions = {}
  ): Promise<string> {
    // Create cache key data
    const cacheData = {
      message,
      conversationHistory,
      model: this.config.model,
      temperature: this.config.temperature
    };

    // Try to get from cache first
    const cachedResponse = await cacheService.get('chat', cacheData);
    if (cachedResponse) {
      console.log('[OpenAI Service] Using cached chat response');
      return cachedResponse;
    }
    const systemPrompt = `Você é um especialista em imigração americana com mais de 15 anos de experiência. Você ajuda brasileiros que desejam imigrar para os Estados Unidos.

DIRETRIZES:
- Seja preciso, profissional e empático
- Forneça informações atualizadas sobre vistos e processos de imigração
- Sempre mencione que cada caso é único e recomende consulta com advogado especializado
- Use linguagem clara e acessível
- Seja específico sobre custos, prazos e requisitos quando possível
- Mantenha foco em imigração para os EUA
- Sempre que possível, forneça opções alternativas
- Crie alternativas que componham a utilização de vistos de estudantes como trampolim para outros vistos mais abrangentes

TIPOS DE VISTO PRINCIPAIS:
- EB-1: Para quem se destaca por talento, pesquisa relevante ou atuação executiva.
- EB-2 NIW: Profissionais que impulsionem o crescimento econômico, tecnológico ou cultural dos EUA.
Sempre que possivel recomendar esses dois acima.

- F-1: Estudante : Sempre recomende esse visto como um cenario de alta probabilidade de aprovação para criar condições de status e de investimento menor em outros vistos de residencia.
- H1-B: Trabalhadores especializados
- L-1: Transferência interna de empresa
- O-1: Habilidades extraordinárias
- E-2: Investidor de tratado
- EB-5: Investidor (Green Card)

- K-1: Noivo(a) de cidadão americano

Responda de forma concisa mas completa, sempre em português brasileiro.`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory,
      { role: 'user' as const, content: message }
    ];

    return this.makeRequest(
      'generateChatResponse',
      async () => {
        const completion = await this.client.chat.completions.create({
          model: this.config.model,
          messages: messages,
          max_tokens: 500,
          temperature: this.config.temperature,
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
          throw new Error('Empty response from OpenAI');
        }

        // Cache the response
        await cacheService.set('chat', cacheData, content);

        return content;
      },
      {
        ...options,
        onError: (error, attempts) => {
          console.error(`Failed to generate chat response after ${attempts} attempts:`, error);
          options.onError?.(error, attempts);
        }
      }
    );
  }

  // Generate visa recommendations with enhanced error handling and caching
  async generateVisaRecommendations(
    userProfile: Record<string, any>,
    options: RequestOptions = {}
  ): Promise<any[]> {
    // Create cache key data
    const cacheData = {
      userProfile,
      model: this.config.model,
      temperature: 0.3
    };

    // Try to get from cache first
    const cachedResponse = await cacheService.get('visa_recommendations', cacheData);
    if (cachedResponse) {
      console.log('[OpenAI Service] Using cached visa recommendations');
      return cachedResponse;
    }
    const prompt = `# Prompt: Estratégias de Visto para os Estados Unidos - Análise Familiar Completa

## Objetivo do Relatório
Analisar o perfil completo da família e apresentar 3 estratégias viáveis de obtenção de visto americano, considerando qualificações, estrutura familiar, recursos e objetivos de cada membro. Cada opção será detalhadamente justificada e incluirá timeline, requisitos e impacto familiar.

## Estrutura do Relatório

### 1. ANÁLISE DE ELEGIBILIDADE FAMILIAR

**Perfil do Requerente Principal:**
- Qualificações profissionais e acadêmicas
- Experiência e especialização
- Recursos financeiros disponíveis
- Histórico de viagens internacionais

**Composição Familiar:**
- Cônjuge: qualificações, idade, profissão
- Filhos: idades, situação acadêmica, necessidades especiais
- Dependentes adicionais (se houver)

**Fatores de Força da Aplicação:**
- Vínculos com o Brasil (propriedades, negócios, família)
- Histórico limpo (criminal, fiscal, migratório)
- Recursos financeiros comprovados
- Suporte de empregadores/instituições americanas

**Potenciais Desafios:**
- Limitações identificadas no perfil
- Riscos de negação
- Fatores que precisam ser fortalecidos

### 2. TRÊS ESTRATÉGIAS DE VISTO RECOMENDADAS

---

#### 📋 ESTRATÉGIA 1: [TIPO DE VISTO] - [NOME DA ESTRATÉGIA]
**Visto Principal:** [Ex: H-1B, L-1, O-1, EB-1, etc.]
**Vistos Dependentes:** [H-4, L-2, O-3, etc.]

**Por que esta opção é ideal para seu perfil:**
- Alinhamento com qualificações específicas
- Compatibilidade com histórico profissional
- Adequação à estrutura familiar
- Probabilidade de aprovação baseada no perfil

**Requisitos Específicos:**
- **Para o requerente principal:**
  - Documentação necessária
  - Qualificações exigidas
  - Suporte institucional necessário
- **Para cônjuge:**
  - Documentos requeridos
  - Possibilidade de trabalho nos EUA
- **Para filhos:**
  - Limites de idade
  - Documentação escolar
  - Considerações educacionais

**Timeline Detalhado:**
- **Preparação (Meses 1-3):** Coleta de documentos, certificações, traduções
- **Aplicação (Meses 4-6):** Submissão, entrevistas, processamento
- **Aprovação e Viagem (Meses 7-9):** Recebimento do visto, planejamento da mudança

**Investimento Financeiro:**
- Taxas governamentais: $X,XXX
- Advogado de imigração: $X,XXX
- Traduções e certificações: $X,XXX
- **Total estimado:** $X,XXX

**Benefícios para a Família:**
- **Requerente:** Oportunidades profissionais, possibilidade de residência permanente
- **Cônjuge:** [Direito ao trabalho/estudo conforme o visto]
- **Filhos:** Acesso ao sistema educacional americano, desenvolvimento acadêmico

**Caminho para Green Card:**
- Possibilidade de transição para residência permanente
- Timeline estimado: X anos
- Requisitos adicionais necessários

**Riscos e Limitações:**
- Limitações específicas do visto
- Dependência de empregador/patrocinador
- Restrições geográficas ou profissionais

---

#### 📋 ESTRATÉGIA 2: [TIPO DE VISTO] - [NOME DA ESTRATÉGIA]
**Visto Principal:** [Ex: E-2, EB-5, F-1, etc.]
**Vistos Dependentes:** [E-2, EB-5 derivativo, F-2, etc.]

[Mesma estrutura detalhada da Estratégia 1, adaptada para este tipo específico de visto]

**Justificativa Específica:**
- Por que esta alternativa se adequa ao perfil
- Vantagens comparativas à Estratégia 1
- Cenários onde seria a melhor opção

---

#### 📋 ESTRATÉGIA 3: [TIPO DE VISTO] - [NOME DA ESTRATÉGIA]
**Visto Principal:** [Ex: Visto de turista com mudança de status, asylum, etc.]
**Vistos Dependentes:** [Derivativos correspondentes]

[Mesma estrutura detalhada, adaptada para este tipo específico]

**Justificativa Específica:**
- Quando esta seria a opção mais viável
- Vantagens únicas desta abordagem
- Adequação a situações específicas da família

### 3. COMPARATIVO DAS ESTRATÉGIAS

| Critério | Estratégia 1 | Estratégia 2 | Estratégia 3 |
|----------|--------------|--------------|--------------||
| **Probabilidade de Aprovação** | Alta/Média/Baixa | Alta/Média/Baixa | Alta/Média/Baixa |
| **Tempo de Processamento** | X meses | X meses | X meses |
| **Investimento Total** | $X,XXX | $X,XXX | $X,XXX |
| **Flexibilidade Profissional** | Alta/Média/Baixa | Alta/Média/Baixa | Alta/Média/Baixa |
| **Benefícios para Cônjuge** | Trabalho permitido/não | Trabalho permitido/não | Trabalho permitido/não |
| **Educação dos Filhos** | Pública gratuita/paga | Pública gratuita/paga | Pública gratuita/paga |
| **Caminho para Green Card** | Direto/Indireto/Inexistente | Direto/Indireto/Inexistente | Direto/Indireto/Inexistente |

### 4. RECOMENDAÇÃO PRINCIPAL

**Estratégia Recomendada:** [Número da estratégia]

**Justificativa Detalhada:**
- Por que esta é a melhor opção para seu perfil específico
- Análise risk-benefit personalizada
- Compatibilidade com objetivos familiares de longo prazo

**Plano B:**
- Segunda opção recomendada
- Quando considerar a alternativa
- Como preparar ambas simultaneamente

### 5. PLANO DE AÇÃO IMEDIATO

**Próximos 30 dias:**
- [ ] Avaliação detalhada com advogado de imigração especializado
- [ ] Início da coleta de documentação
- [ ] Pesquisa de oportunidades de trabalho/estudo nos EUA
- [ ] Orçamento detalhado dos custos

**Próximos 90 dias:**
- [ ] Documentação completa e traduzida
- [ ] Networking com contatos nos EUA
- [ ] Preparação financeira para investimentos
- [ ] Planejamento logístico familiar

**Próximos 6-12 meses:**
- [ ] Aplicação submetida
- [ ] Preparação para entrevistas
- [ ] Planejamento da mudança
- [ ] Preparação das crianças para transição

### 6. RECURSOS ESPECIALIZADOS

**Advogados de Imigração Recomendados:**
- Escritórios especializados no tipo de visto escolhido
- Profissionais com experiência em casos brasileiros
- Avaliação de custos e timeline

**Documentação Essencial:**
- Lista completa de documentos por tipo de visto
- Órgãos emissores no Brasil
- Traduções juramentadas necessárias
- Apostilamento de Haia

**Preparação Familiar:**
- Cursos de inglês intensivo
- Preparação psicológica das crianças
- Pesquisa de escolas nos EUA
- Planejamento financeiro para os primeiros meses

### 7. CONSIDERAÇÕES ESPECIAIS PARA FAMÍLIAS

**Educação dos Filhos:**
- Sistema educacional americano vs brasileiro
- Custos de educação por estado
- Programas para estudantes internacionais
- Continuidade do português e cultura brasileira

**Adaptação do Cônjuge:**
- Revalidação de diplomas/certificações
- Oportunidades de trabalho/estudo
- Networking profissional
- Grupos de apoio para brasileiros

**Manutenção dos Vínculos com o Brasil:**
- Propriedades e investimentos
- Obrigações fiscais
- Relacionamentos familiares
- Planejamento de visitas

---

## Variáveis de Entrada Necessárias

### Dados do Requerente Principal
- **Profissionais:** Formação, experiência, especialização, certificações
- **Pessoais:** Idade, estado civil, histórico de viagens
- **Financeiros:** Renda, patrimônio, capacidade de investimento
- **Legais:** Histórico criminal, fiscal, processos judiciais

### Dados do Cônjuge (se aplicável)
- Qualificações profissionais e acadêmicas
- Interesse em trabalhar/estudar nos EUA
- Idade e situação legal

### Dados dos Filhos (se aplicável)
- Idades atuais
- Situação acadêmica
- Necessidades especiais
- Adaptabilidade a mudanças

### Objetivos e Preferências
- **Profissionais:** Carreira desejada nos EUA, setor de interesse
- **Geográficos:** Estados ou cidades preferidas
- **Temporais:** Urgência da mudança, timeline desejado
- **Familiares:** Prioridades para cônjuge e filhos

### Recursos Disponíveis
- Orçamento total para o processo
- Flexibilidade de investimento
- Tempo disponível para preparação
- Suporte de empresas/instituições

### Conexões nos EUA
- Contatos profissionais
- Familiares ou amigos residentes
- Ofertas de trabalho/estudo
- Conhecimento de advogados especializados

---

## Instruções de Uso

1. **Análise Técnica Rigorosa:** Base todas as recomendações na legislação atual de imigração americana
2. **Personalização Total:** Cada estratégia deve ser única para o perfil apresentado
3. **Realismo:** Apresente probabilidades honestas de aprovação
4. **Visão Familiar:** Considere impacto em todos os membros da família
5. **Atualizações:** Sempre mencione que leis de imigração podem mudar
6. **Disclaimer Legal:** Recomende sempre consulta com advogado especializado
7. **Timeline Realista:** Use dados atuais de processamento do USCIS

## Avisos Importantes

- **Este relatório é informativo e não constitui consultoria jurídica**
- **Leis de imigração americanas mudam frequentemente**
- **Consulta com advogado especializado é essencial**
- **Cada caso é único e requer análise individual**
- **Documentação e requisitos podem variar por consulado**

Com base no perfil do usuário:
- Objetivo: ${userProfile.purpose}
- Educação: ${userProfile.education}
- Experiência: ${userProfile.experience}
- Oferta de trabalho: ${userProfile.jobOffer}
- Capacidade de investimento: ${userProfile.investment}
- Prazo desejado: ${userProfile.timeline}

Forneça uma análise detalhada em formato JSON com os 3 melhores vistos, incluindo:
- type: código do visto
- name: nome completo
- match: percentual de compatibilidade (0-100)
- description: descrição breve
- requirements: array de requisitos principais
- timeline: prazo estimado
- cost: faixa de custo
- pros: array de vantagens
- cons: array de desvantagens

Responda apenas com o JSON válido, sem texto adicional.`;

    return this.makeRequest(
      'generateVisaRecommendations',
      async () => {
        const completion = await this.client.chat.completions.create({
          model: this.config.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1500,
          temperature: 0.3,
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
          throw new Error('Empty response from OpenAI');
        }

        try {
          // Clean response to ensure valid JSON
          const cleanedResponse = response.trim().replace(/```json\n?|\n?```/g, '');
          const parsed = JSON.parse(cleanedResponse);
          
          // Validate response structure
          if (!Array.isArray(parsed)) {
            throw new Error('Response is not an array');
          }

          // Validate each recommendation has required fields
          for (const rec of parsed) {
            if (!rec.type || !rec.name || typeof rec.match !== 'number') {
              throw new Error('Invalid recommendation structure');
            }
          }

          // Cache the successful response
          await cacheService.set('visa_recommendations', cacheData, parsed);
          
          return parsed;
        } catch (parseError) {
          throw new Error(`Failed to parse JSON response: ${parseError.message}`);
        }
      },
      {
        ...options,
        onError: (error, attempts) => {
          console.error(`Failed to generate visa recommendations after ${attempts} attempts:`, error);
          options.onError?.(error, attempts);
        }
      }
    );
  }

  // Generate dream action plan with enhanced error handling and caching
  async generateDreamActionPlan(
    goal: Record<string, any>,
    options: RequestOptions = {}
  ): Promise<string> {
    // Create cache key data
    const cacheData = {
      goal,
      model: this.config.model,
      temperature: 0.5
    };

    // Try to get from cache first
    const cachedResponse = await cacheService.get('dream_action_plan', cacheData);
    if (cachedResponse) {
      console.log('[OpenAI Service] Using cached dream action plan');
      return cachedResponse;
    }
    const prompt = `# Prompt: Gerador de Sonhos - Transformação do Estilo de Vida Familiar

## Missão do Relatório
Inspirar e orientar famílias a visualizarem e planejarem mudanças transformadoras de estilo de vida, criando um futuro onde cada membro da família pode florescer pessoal, acadêmica e profissionalmente. Este relatório é um convite para sonhar grande e traçar caminhos concretos para realizar esses sonhos.

## Estrutura do Relatório

### 1. VISÃO INSPIRADORA
**"Imagine sua família daqui a 5 anos..."**
- Cenário inspirador baseado no perfil familiar
- Conquistas pessoais e profissionais alcançadas
- Qualidade de vida transformada
- Legado sendo construído

### 2. MAPEAMENTO DOS SONHOS FAMILIARES

**Sonhos Individuais Identificados:**
- **Adulto(s):** [Aspirações profissionais, pessoais, criativas]
- **Filhos:** [Talentos a desenvolver, paixões a explorar]
- **Família:** [Experiências compartilhadas, valores a cultivar]

**Potenciais Ocultos Descobertos:**
- Talentos naturais não explorados
- Interesses que podem virar oportunidades
- Conexões entre hobbies e possibilidades de crescimento

### 3. TRÊS CENÁRIOS DE TRANSFORMAÇÃO

---

#### 🌟 CENÁRIO 1: [NOME INSPIRADOR DO ESTILO DE VIDA]
**Localização:** [Cidade/Região/País]
**Essência:** [Frase que capture o espírito da mudança]

**A Nova Vida:**
- Como seria o dia a dia da família
- Ambiente físico e social
- Ritmo de vida e prioridades

**Crescimento Pessoal:**
- **Para os Adultos:** Novas habilidades, paixões redescobertas, propósito renovado
- **Para as Crianças:** Experiências únicas de aprendizado, talentos cultivados
- **Para a Família:** Valores fortalecidos, conexões aprofundadas

**Crescimento Acadêmico:**
- Oportunidades educacionais diferenciadas
- Sistemas de ensino inovadores
- Experiências de aprendizado prático
- Intercâmbios culturais e linguísticos

**Crescimento Profissional:**
- Novas carreiras possíveis no local
- Oportunidades de empreendedorismo
- Mercados emergentes a explorar
- Networking internacional

**O Caminho da Transformação:**
- **Ano 1:** Primeiros passos e adaptações
- **Anos 2-3:** Consolidação e crescimento
- **Anos 4-5:** Colheita dos frutos e expansão

**Investimento na Mudança:**
- Recursos financeiros necessários
- Tempo de planejamento e transição
- Preparação emocional e logística

**Benefícios Únicos:**
- Experiências impossíveis no estilo atual
- Oportunidades exclusivas da região
- Impacto positivo no desenvolvimento familiar

---

#### 🌟 CENÁRIO 2: [NOME INSPIRADOR DO ESTILO DE VIDA]
**Localização:** [Cidade/Região/País]
**Essência:** [Frase que capture o espírito da mudança]

[Mesma estrutura detalhada do Cenário 1]

---

#### 🌟 CENÁRIO 3: [NOME INSPIRADOR DO ESTILO DE VIDA]
**Localização:** [Cidade/Região/País]
**Essência:** [Frase que capture o espírito da mudança]

[Mesma estrutura detalhada do Cenário 1]

### 4. DESTINOS ALTERNATIVOS DOS SONHOS

**Baseado nos sonhos familiares, considerem também:**

#### 🏝️ [DESTINO ALTERNATIVO 1]
- **Por que é mágico para vocês:** Conexão com os sonhos familiares
- **Oportunidades únicas:** O que só é possível lá
- **Crescimento familiar:** Como cada membro floresceria

#### 🏔️ [DESTINO ALTERNATIVO 2]
- [Mesma estrutura inspiradora]

### 5. JORNADA DE REALIZAÇÃO DOS SONHOS

**🌱 FASE SEMEAR (Primeiros 6 meses):**
- Pesquisa profunda dos destinos
- Desenvolvimento de habilidades preparatórias
- Construção da reserva financeira
- Alinhamento familiar dos sonhos

**🌿 FASE CRESCER (6-18 meses):**
- Implementação do plano de mudança
- Primeiras experiências no novo local
- Estabelecimento de rotinas e conexões
- Adaptação e descobertas

**🌳 FASE FLORESCER (18 meses em diante):**
- Consolidação do novo estilo de vida
- Colheita das oportunidades plantadas
- Expansão das possibilidades
- Inspiração para outros sonhos

### 6. FERRAMENTAS PARA MATERIALIZAR SONHOS

**Visualização e Planejamento:**
- Quadro de visão familiar
- Diário de sonhos e progressos
- Metas trimestrais inspiradoras
- Celebrações de marcos conquistados

**Preparação Prática:**
- Cursos e capacitações necessárias
- Documentação e burocracias
- Networking estratégico
- Reserva de emergência

**Mantendo a Motivação:**
- Histórias inspiradoras de famílias similares
- Comunidades de apoio online
- Mentores na jornada
- Rituais familiares de reafirmação dos sonhos

### 7. SUPERANDO MEDOS E LIMITAÇÕES

**Medos Comuns e Como Transformá-los:**
- "E se não der certo?" → "E se der melhor que imaginamos?"
- "É muito arriscado" → "Qual o risco de não tentar?"
- "As crianças vão sofrer" → "Que oportunidades únicas terão?"

**Limitações em Oportunidades:**
- Transformar obstáculos em trampolins
- Soluções criativas para cada desafio
- Rede de apoio para superar dificuldades

---

## Variáveis de Entrada Necessárias

### Composição Familiar
- Membros da família (idades, personalidades)
- Dinâmica familiar atual
- Valores e princípios importantes
- Tradições que querem manter/criar

### Sonhos e Aspirações
- **Adultos:** Sonhos profissionais, pessoais, de contribuição
- **Crianças:** Interesses, talentos, curiosidades
- **Família:** Experiências desejadas, legado a construir

### Situação Atual
- Estilo de vida presente
- Satisfações e insatisfações
- Recursos disponíveis
- Flexibilidade para mudanças

### Interesses e Paixões
- Hobbies de cada membro
- Atividades que energizam a família
- Causas que os motivam
- Experiências que sonham viver

### Critérios Importantes
- Tipo de ambiente desejado (urbano/rural/praiano/montanha)
- Clima preferido
- Proximidade com natureza/cultura/oportunidades
- Custo de vida aceitável

### Horizontes Geográficos
- Locais que sempre sonharam conhecer
- Culturas que os fascinam
- Idiomas que gostariam de dominar
- Aventuras geográficas desejadas

---

## Instruções de Uso - Tom Inspirador

1. **Comece sempre com esperança:** Cada família tem potenciais incríveis a desbravar
2. **Pense em abundância:** Foque nas possibilidades, não nas limitações
3. **Seja específico nos sonhos:** Detalhe como seria a vida transformada
4. **Conecte com emoções:** Use linguagem que toque o coração
5. **Mostre caminhos concretos:** Sonhos precisam de planos realizáveis
6. **Celebre a coragem:** Reconheça a bravura de sonhar com mudanças
7. **Inspire ação:** Termine sempre com próximos passos motivadores

## Frases Inspiradoras para Usar

- "Imaginem acordar todos os dias empolgados com as possibilidades..."
- "Seus filhos um dia contarão esta história de coragem..."
- "Este não é apenas um lugar, é o cenário onde seus sonhos ganham vida..."
- "A maior aventura da família está esperando por vocês..."
- "Cada desafio é uma oportunidade disfarçada de crescimento..."

**Lembre-se:** Este relatório não é apenas sobre mudança de local, é sobre transformação de destino. Cada palavra deve plantar sementes de possibilidades no coração da família.


Perfil:
- Nome: ${goal.nome}
- Idade: ${goal.idade}
- Profissão: ${goal.profissao}
- Experiência: ${goal.experiencia}

Objetivo:
- Objetivo principal: ${goal.objetivo_principal}
- Categoria: ${goal.categoria}
- Timeline: ${goal.timeline}
- Prioridade: ${goal.prioridade}

Situação atual:
- ${goal.situacao_atual}
- Recursos disponíveis: ${goal.recursos_disponiveis}
- Obstáculos: ${goal.obstaculos}

Detalhes:
- ${goal.detalhes_especificos}
- Motivação: ${goal.motivacao}

Crie um plano de ação em etapas numeradas, específico e prático, com prazos realistas.`;

    return this.makeRequest(
      'generateDreamActionPlan',
      async () => {
        const completion = await this.client.chat.completions.create({
          model: this.config.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.5,
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
          throw new Error('Empty response from OpenAI');
        }

        // Cache the response
        await cacheService.set('dream_action_plan', cacheData, content);

        return content;
      },
      {
        ...options,
        onError: (error, attempts) => {
          console.error(`Failed to generate dream action plan after ${attempts} attempts:`, error);
          options.onError?.(error, attempts);
        }
      }
    );
  }

  // Get service statistics
  getStats() {
    const totalRequests = this.logs.length;
    const successfulRequests = this.logs.filter(log => log.success).length;
    const failedRequests = totalRequests - successfulRequests;
    const averageDuration = totalRequests > 0 
      ? this.logs.reduce((sum, log) => sum + log.duration, 0) / totalRequests 
      : 0;

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
      averageDuration: Math.round(averageDuration),
      recentLogs: this.logs.slice(-10) // Last 10 logs
    };
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Update configuration
  updateConfig(newConfig: Partial<OpenAIConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

// Create singleton instance
export const openaiService = new OpenAIService();

// Export for backward compatibility
export const generateChatResponse = (
  message: string,
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = []
) => openaiService.generateChatResponse(message, conversationHistory);

export const generateVisaRecommendations = (userProfile: Record<string, any>) => 
  openaiService.generateVisaRecommendations(userProfile);

export const generateDreamActionPlan = (goal: Record<string, any>) => 
  openaiService.generateDreamActionPlan(goal);

export default openaiService;
