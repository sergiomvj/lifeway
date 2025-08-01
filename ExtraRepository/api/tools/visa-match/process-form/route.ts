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
    console.log('Process-form Visa Match - Dados recebidos:', userData);

    // Validação básica
    if (!userData.email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
    }

    // Prompt otimizado para processo de formulário
    const prompt = `
# VisaMatch - Consultoria Personalizada de Vistos Americanos

Com base no formulário preenchido, forneça uma consultoria especializada em vistos:

## Perfil do Candidato:
- Nome: ${userData.fullName || 'Não informado'}
- Email: ${userData.email}
- Profissão: ${userData.profession || 'Não informado'}
- Estado Civil: ${userData.maritalStatus || 'Não informado'}
- Objetivos nos EUA: ${userData.usaObjectives || userData.goals || 'Não informado'}
- Aspirações: ${userData.aspiracoes || 'Não informado'}

## Consultoria Personalizada:

### 🎯 ANÁLISE DE ELEGIBILIDADE
- Avaliação do perfil para diferentes categorias
- Pontos fortes que favorecem aprovação
- Áreas que precisam ser desenvolvidas
- Recomendações específicas para o perfil

### 📋 VISTOS RECOMENDADOS (em ordem de viabilidade)
Para cada opção de visto:
- Categoria e tipo (EB-1, EB-5, H-1B, L-1, etc.)
- Compatibilidade com o perfil (%)
- Investimento necessário
- Prazo médio do processo
- Taxa de aprovação atual
- Vantagens específicas para o caso

### 🛠️ ESTRATÉGIA PERSONALIZADA
- Melhor caminho considerando recursos e objetivos
- Preparação necessária antes da aplicação
- Timeline detalhada do processo
- Documentação específica requerida

### ⚖️ ASPECTOS LEGAIS IMPORTANTES
- Mudanças recentes na legislação que afetam o caso
- Requisitos específicos para a profissão
- Dicas para maximizar chances de aprovação
- Quando buscar assessoria jurídica especializada

### 📅 PLANO DE AÇÃO IMEDIATO
- Próximos 30 dias: preparação inicial
- Próximos 3-6 meses: documentação e qualificações
- Próximos 12 meses: processo de aplicação
- Contatos e recursos recomendados

Base todas as recomendações nas regulamentações atuais do USCIS e seja específico sobre prazos, custos e probabilidades.
`;

    // Chamada para OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um consultor especializado em imigração americana e legislação de vistos. Forneça consultoria precisa baseada nas regulamentações atuais do USCIS e nas melhores práticas de imigração."
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
          tool_type: 'visa_match',
          input_data: userData,
          ai_response: aiResponse
        }
      ])
      .select()
      .single();

    if (reportError) {
      console.error('❌ Erro ao salvar visa_match process-form:', reportError);
      return NextResponse.json({ 
        error: 'Erro ao salvar relatório',
        details: reportError.message
      }, { status: 500 });
    }

    console.log('✅ Visa Match process-form salvo com sucesso');

    return NextResponse.json({
      success: true,
      report: aiResponse,
      analysis: aiResponse, // Para compatibilidade
      reportId: reportData.id,
      tokensUsed: completion.usage?.total_tokens || 0
    });

  } catch (error) {
    console.error('Erro no Visa Match process-form:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
