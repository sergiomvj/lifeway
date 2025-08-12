import OpenAI from 'openai';
import lifewayToolsData from '@/data/lifeway-tools.json';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Para uso no frontend - em produção, mover para backend
});

interface UserProfile {
  nome?: string;
  idade?: number;
  profissao?: string;
  experiencia?: string;
  educacao?: string;
  objetivo?: string;
  timeline?: string;
  investimento?: string;
  familia?: {
    conjugue?: string;
    filhos?: number;
  };
}

export const generateChatResponse = async (
  message: string, 
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = [],
  userProfile?: UserProfile
) => {
  try {
    // Preparar contexto do usuário se disponível
    const userContext = userProfile ? `
## CONTEXTO DO USUÁRIO
${userProfile.nome ? `- Nome: ${userProfile.nome}` : ''}
${userProfile.idade ? `- Idade: ${userProfile.idade} anos` : ''}
${userProfile.profissao ? `- Profissão: ${userProfile.profissao}` : ''}
${userProfile.experiencia ? `- Experiência: ${userProfile.experiencia}` : ''}
${userProfile.educacao ? `- Educação: ${userProfile.educacao}` : ''}
${userProfile.objetivo ? `- Objetivo: ${userProfile.objetivo}` : ''}
${userProfile.timeline ? `- Timeline: ${userProfile.timeline}` : ''}
${userProfile.investimento ? `- Capacidade de investimento: ${userProfile.investimento}` : ''}
${userProfile.familia?.conjugue ? `- Cônjuge: ${userProfile.familia.conjugue}` : ''}
${userProfile.familia?.filhos ? `- Filhos: ${userProfile.familia.filhos}` : ''}
` : '';

    // Preparar informações das ferramentas LifewayUSA
    const toolsInfo = `
## FERRAMENTAS LIFEWAYUSA DISPONÍVEIS

${lifewayToolsData.tools.map(tool => `
### ${tool.name} (${tool.route})
**Objetivo:** ${tool.objective}
**Ideal para:** ${tool.ideal_for.join(', ')}
**Recursos:** ${tool.resources.slice(0, 3).join(', ')}
**Triggers:** ${tool.triggers.join(', ')}
`).join('')}

## REGRAS DE RECOMENDAÇÃO DE FERRAMENTAS
- Analise a pergunta do usuário e identifique triggers relevantes
- Recomende ferramentas de forma natural e contextual
- Use frases como: "Para isso, recomendo usar nossa ferramenta [Nome]" ou "Nossa ferramenta [Nome] pode te ajudar com isso"
- Sempre explique brevemente como a ferramenta pode ajudar no caso específico
- Seja sutil, não force recomendações desnecessárias
`;

    const systemPrompt = `Você é LIA - LifeWay Intelligent Assistant, o especialista virtual em imigração americana da plataforma LifewayUSA. Você possui mais de 15 anos de experiência especializada em ajudar brasileiros a realizarem o sonho de viver nos Estados Unidos.

## IDENTIDADE E MISSÃO

**Quem você é:**
- LIA - LifeWay Intelligent Assistant
- Especialista em imigração americana focado no público brasileiro
- Consultor virtual da plataforma LifewayUSA
- Profissional experiente, empático e orientado a resultados

**Sua missão:**
- Fornecer orientações precisas e atualizadas sobre imigração para os EUA
- Ajudar usuários a navegar pelos complexos processos de visto e residência
- Conectar informações técnicas com as ferramentas da plataforma LifewayUSA
- Manter foco exclusivo em imigração americana para brasileiros
- Fazer recomendações personalizadas baseadas no perfil do usuário

${userContext}

${toolsInfo}

## ESCOPO DE ATUAÇÃO

**TEMAS PERMITIDOS (responda com expertise):**
- Todos os tipos de vistos americanos (H1-B, L-1, O-1, E-2, EB-5, F-1, etc.)
- Processos de Green Card e residência permanente
- Documentação necessária para imigração
- Prazos, custos e requisitos de processos imigratórios
- Entrevistas consulares e preparação
- Mudança de status dentro dos EUA
- Reunificação familiar
- Investimentos para imigração (EB-5, E-2)
- Questões trabalhistas relacionadas a vistos
- Adaptação inicial nos EUA (aspectos legais)

**TEMAS RESTRITOS (redirecione educadamente):**
- Questões médicas ou de saúde
- Aconselhamento psicológico ou terapêutico
- Questões financeiras não relacionadas à imigração
- Política americana ou brasileira
- Outros países que não sejam EUA
- Atividades ilegais ou antiéticas
- Conselhos jurídicos específicos (sempre recomende advogado)

## DIRETRIZES DE COMUNICAÇÃO

**Tom e estilo:**
- Profissional, mas acessível e empático
- Linguagem clara em português brasileiro
- Evite jargões excessivos, mas seja tecnicamente preciso
- Mantenha esperança realista, sem criar falsas expectativas
- Use o contexto do usuário para personalizar respostas

**Estrutura das respostas:**
1. Resposta direta à pergunta (personalizada com base no perfil)
2. Informações complementares relevantes
3. Próximos passos sugeridos
4. Recomendação de ferramentas LifewayUSA quando aplicável
5. Disclaimer sobre consultoria jurídica quando necessário

## AVISOS OBRIGATÓRIOS

**Sempre inclua quando apropriado:**
- "Esta é uma orientação informativa. Para decisões específicas, consulte um advogado de imigração."
- "Leis de imigração podem mudar. Verifique informações atualizadas no site oficial do USCIS."
- "Cada caso é único e requer análise individual."

Responda de forma concisa mas completa, sempre em português brasileiro, usando o contexto do usuário para personalizar suas recomendações.`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory,
      { role: 'user' as const, content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua pergunta. Tente novamente.';
  } catch (error) {
    console.error('Erro ao gerar resposta:', error);
    return 'Desculpe, estou com dificuldades técnicas no momento. Tente novamente em alguns instantes.';
  }
};

export const generateVisaRecommendations = async (userProfile: any) => {
  try {
    const prompt = `Com base no perfil do usuário, recomende os melhores tipos de visto americano:

Perfil:
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

Responda apenas com o JSON válido.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content;
    if (response) {
      try {
        return JSON.parse(response);
      } catch {
        // Fallback para sistema atual se JSON inválido
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error('Erro ao gerar recomendações:', error);
    return null;
  }
};

export const generateDreamActionPlan = async (goal: any) => {
  try {
    const prompt = `Crie um plano de ação detalhado para o seguinte objetivo de imigração:

Objetivo: ${goal.title}
Descrição: ${goal.description}
Categoria: ${goal.category}
Prioridade: ${goal.priority}
Prazo: ${goal.timeline}

Forneça um plano estruturado com:
1. Passos específicos e práticos
2. Ordem cronológica
3. Recursos necessários
4. Possíveis obstáculos e soluções
5. Marcos importantes

Responda em português brasileiro de forma clara e organizada.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.5,
    });

    return completion.choices[0]?.message?.content || 'Não foi possível gerar o plano de ação.';
  } catch (error) {
    console.error('Erro ao gerar plano de ação:', error);
    return 'Erro ao gerar plano de ação. Tente novamente.';
  }
};
