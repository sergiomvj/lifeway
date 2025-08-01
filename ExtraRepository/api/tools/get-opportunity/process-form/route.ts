import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Initialize clients with correct environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    console.log('Process-form Get Opportunity - Dados recebidos:', userData);

    // Validação básica
    if (!userData.email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
    }

    // Prompt otimizado para processo de formulário
    const prompt = `
# Get Opportunity - Análise Personalizada de Oportunidades nos EUA

Com base no formulário preenchido, crie uma análise completa de oportunidades profissionais e empreendedoras:

## Perfil do Candidato:
- Nome: ${userData.fullName || 'Não informado'}
- Email: ${userData.email}
- Profissão: ${userData.profession || 'Não informado'}
- Estado Civil: ${userData.maritalStatus || 'Não informado'}
- Objetivos nos EUA: ${userData.usaObjectives || userData.goals || 'Não informado'}
- Aspirações: ${userData.aspiracoes || 'Não informado'}

## Análise Solicitada:

### 💼 OPORTUNIDADES PROFISSIONAIS PERSONALIZADAS
- Carreiras específicas baseadas na profissão atual
- Salários médios e progressão de carreira
- Certificações/qualificações necessárias
- Mercado de trabalho por região

### 🚀 OPORTUNIDADES EMPREENDEDORAS
- Negócios alinhados com o perfil
- Investimento inicial necessário
- Franchises recomendadas
- Setores em crescimento para imigrantes

### 🗺️ LOCALIZAÇÃO ESTRATÉGICA
- Estados/cidades recomendados
- Custo de vida vs. oportunidades
- Comunidades brasileiras
- Facilidades para profissionais internacionais

### 📋 PLANO DE AÇÃO PRÁTICO
- Próximos 30 dias
- Próximos 6 meses
- Próximos 2 anos
- Recursos e contatos importantes

Seja específico, prático e motivador. Use dados atuais do mercado americano.
`;

    // Chamada para OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um consultor especializado em oportunidades profissionais e empresariais nos EUA para brasileiros. Forneça análises detalhadas e acionáveis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    // Salvar na tabela user_reports
    const { data: reportData, error: reportError } = await supabase
      .from('user_reports')
      .insert([
        {
          user_id: userData.email,
          tool_type: 'get_opportunity',
          input_data: userData,
          ai_response: aiResponse
        }
      ])
      .select()
      .single();

    if (reportError) {
      console.error('❌ Erro ao salvar get_opportunity process-form:', reportError);
      return NextResponse.json({ 
        error: 'Erro ao salvar relatório',
        details: reportError.message
      }, { status: 500 });
    }

    console.log('✅ Get Opportunity process-form salvo com sucesso');

    return NextResponse.json({
      success: true,
      report: aiResponse,
      analysis: aiResponse, // Para compatibilidade
      reportId: reportData.id,
      tokensUsed: completion.usage?.total_tokens || 0
    });

  } catch (error) {
    console.error('Erro no Get Opportunity process-form:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
