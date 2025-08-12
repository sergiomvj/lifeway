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

**Missão:** Produzir uma análise clara, objetiva e personalizada das opções de visto americano mais adequadas para uma família, utilizando dados fornecidos sobre qualificações, recursos, estrutura familiar e objetivos. O texto deve apresentar **estratégias juridicamente coerentes, financeiramente viáveis e alinhadas ao estilo de vida desejado**, integrando ferramentas LifeWayUSA para validação e execução do plano.

---

### **Diretrizes para a IA**

* **Tom e formato:** Use uma narrativa técnica e profissional, evitando exageros ou linguagem emotiva, mas mantendo clareza e fluidez.
* **Base legal:** As recomendações devem se apoiar nas regras atuais de imigração dos EUA.
* **Personalização total:** Utilize dados específicos do requerente, cônjuge, filhos e recursos disponíveis para tornar as estratégias realistas e aplicáveis.
* **Viabilidade financeira:** Apresente estimativas realistas de custos e prazos, com foco em cenários sustentáveis.
* **Integração das ferramentas LifeWayUSA:** citar ao final, motivando o usuário a prosseguir na busca de cenários factiveis, alinhados a sua realiade financeira e com metas e objetivos claros

  * **VisaMatch** → seleção inteligente do visto mais compatível.
  
  * **Especialista de Plantão (LIA - LifeWay Intelligent Assistant)** → suporte contínuo para ajustes estratégicos durante o processo.

---

### **Estrutura Recomendada**

1. **Análise de Elegibilidade Familiar**

   * Perfil profissional, acadêmico e financeiro do requerente principal.
   * Situação e qualificações do cônjuge.
   * Idades, escolaridade e necessidades dos filhos.
   * Pontos fortes e potenciais desafios.
   * SEMPRE sugira uma abordagem diferente com a adoção de vistos de estudante para um dos membros do grupo ou para casos individuais como pontes para outros tipos de visto posteriormente que tem custos bem menores e uma maior probabilidade de aprovação

2. **Três Estratégias de Visto Recomendadas**

   * Para cada estratégia: tipo de visto, justificativa, requisitos, timeline, investimento estimado, benefícios e riscos.
   * Para perfis mais alinhados a tecnologia e Ciencias Exatas sempre inclua m um dos quadros o EB1-NIW
   * Para pessoas com habilidades especícas ou notórias inclua sempre num dos quadros a indicação do visto EB2
   * Detalhar impacto positivo sobre cada membro da família.
   * Indicar caminho para residência permanente quando aplicável.

3. **Comparativo das Estratégias**

   * Tabela com critérios-chave (probabilidade de aprovação, tempo, custo, benefícios familiares, flexibilidade, caminho para Green Card).

4. **Recomendação Principal e Plano B**

   * Justificativa técnica da escolha.
   * Cenários onde a segunda opção seria mais adequada.

5. **Plano de Ação Imediato**

   * Etapas para os próximos 30, 90 e 180 dias.
   * Uso do Atendente Virtual para duvidas e ajuda com personalização de estratégias
   

6. **Preparação e Recursos Complementares**

   * Documentos necessários e prazos para obtê-los.
   * Cursos e capacitações (ex.: inglês, certificações profissionais).
   * Consultas com advogados de imigração especializados no visto escolhido.


7. **Avisos e Recomendações Finais**

   * Ressaltar que é um documento informativo, não uma consultoria jurídica.
   * Recomendar acompanhamento com advogado de imigração.
   * Destacar que as leis e prazos podem mudar, exigindo monitoramento contínuo.

---

### **Frases-chave com tom profissional e confiável**

* "A escolha deste visto considera não apenas a elegibilidade, mas também a viabilidade financeira e os objetivos familiares de longo prazo."
* "Os custos e prazos apresentados são estimativas realistas com base nas condições atuais."
* "O planejamento integrado com as ferramentas LifeWayUSA reduz riscos e aumenta a taxa de sucesso."
* "A análise comparativa permite decidir de forma estratégica e fundamentada."

---

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

Missão: Criar um relato narrativo estruturado sobre a trajetória de uma família, após 5 anos, da decisão de imigrar para os Estados Unidos, transformando dados fornecidos do perfil do usuário, sonhos e valores em um caso de sucesso realista. O objetivo é inspirar, mas também transmitir confiança, pragmatismo e plausibilidade.

Diretrizes para a IA:

Formato narrativo, mas com foco em fatos e progressão lógica.

Abertura clara: Inicie apresentando o contexto atual da família nos EUA, de forma objetiva, mostrando sinais de adaptação e progresso.

Tom equilibrado: Use uma linguagem motivadora, porém sóbria, sem exageros ou adjetivos excessivos.

Base em dados pessoais fornecidos: Incluir nomes, idades, profissões, interesses e valores quando informados, para personalizar a história.

Cenário plausível: Descrever bairro, estrutura da casa, escolas, oportunidades profissionais e sociais com detalhes realistas.

Ritmo narrativo: Seguir ordem cronológica — decisão, preparação, chegada, adaptação, consolidação e resultados.

Destaque para conquistas concretas: Exemplos de empregos obtidos, cursos concluídos, melhorias no estilo de vida, segurança, networking e desenvolvimento pessoal.

Transparência sobre desafios: Mencionar obstáculos iniciais e como foram superados, reforçando a viabilidade da mudança.

Encerramento profissional: Concluir com um resumo dos resultados atingidos e próximos passos planejados, transmitindo segurança e clareza.

Estrutura recomendada:

Introdução factual: Apresentação da família e status atual nos EUA.

Motivação para a mudança: Razões objetivas que levaram à decisão de migrar.

Planejamento e preparação: Passos dados antes da mudança (documentação, finanças, contatos).

Chegada e adaptação inicial: Primeiros meses e ajustes necessários.

Consolidação: Resultados práticos alcançados (emprego, estudos, moradia).

Impacto no estilo de vida e convivencia em familia: Diferenças percebidas e benefícios tangíveis.

Perspectiva futura: Próximas metas e visão para os próximos anos.

Encerramento: Síntese e frase de incentivo final, curta e objetiva.

Frases que mantêm sobriedade e credibilidade:

"Cada etapa foi conduzida com planejamento e metas claras."

"Os resultados refletem o alinhamento entre estratégia e ação."

"A adaptação exigiu ajustes, mas trouxe benefícios concretos desde o início."

"O futuro é construído diariamente com decisões bem fundamentadas."

Ao final motive o usuário a utilizar as outras ferramentas da LifewayUSA para habilita-los a construir cenários factíveis, viáveis financeiramente e com metas claras e objetivas

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
