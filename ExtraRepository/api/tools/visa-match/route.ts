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
    console.log('Dados recebidos para Visa Match:', userData);

    // Validação básica
    if (!userData.email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
    }

    const userId = userData.email; // Supondo que o user_id seja o email do usuário

    // Verificar se os dados do formulário existem
    const { data: formData, error: formError } = await supabase
      .from('multistep_forms')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (formError || !formData) {
      return NextResponse.json({
        success: false,
        error: 'Dados do formulário ausentes. Por favor, preencha o formulário antes de prosseguir.',
        redirectUrl: '/formulario' // URL do formulário no frontend
      });
    }

    // Prompt personalizado para Visa Match
    const prompt = `
# VisaMatch - Consultoria Especializada em Vistos Americanos

Baseado no perfil abaixo, forneça uma análise completa de vistos americanos adequados:

## Dados do Candidato:
- Nome: ${userData.fullName || 'Não informado'}
- Email: ${userData.email}
- Idade: ${userData.age || 'Não informado'}
- Profissão: ${userData.profession || 'Não informado'}
- Estado Civil: ${userData.maritalStatus || 'Não informado'}
- Filhos: ${userData.children || 'Não informado'}
- Orçamento: ${userData.budget || 'Não informado'}
- Objetivos nos EUA: ${userData.goals || userData.usaObjectives || 'Não informado'}
- Aspirações: ${userData.aspiracoes || 'Não informado'}

## Estrutura da Consultoria:

### 1. ANÁLISE DE ELEGIBILIDADE
- Avaliação do perfil para diferentes categorias de visto
- Pontos fortes e fracos do candidato
- Requisitos que já atende vs. que precisa desenvolver

### 2. VISTOS RECOMENDADOS (ordenados por viabilidade)
Para cada visto, inclua:
- Nome e categoria (ex: EB-5, H-1B, L-1, etc.)
- Compatibilidade com o perfil (%)
- Investimento/custos necessários
- Prazo estimado do processo
- Taxa de aprovação atual
- Vantagens específicas

### 3. ESTRATÉGIA PERSONALIZADA
- Melhor caminho considerando o perfil
- Passos preparatórios necessários
- Timeline detalhada
- Documentação específica requerida

### 4. CONSIDERAÇÕES LEGAIS IMPORTANTES
- Mudanças recentes na legislação
- Dicas para aumentar chances de aprovação
- Erros comuns a evitar
- Quando buscar assessoria jurídica

### 5. PRÓXIMOS PASSOS PRÁTICOS
- Ações prioritárias nos próximos 30/60/90 dias
- Profissionais/empresas para contatar
- Documentos para preparar

Base suas recomendações nas regulamentações atuais do USCIS e seja específico sobre prazos, custos e probabilidades de sucesso.
`;

    console.log('Dados recebidos:', userData);
    console.log('Prompt gerado:', prompt);

    // Chamada para OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em legislação de imigração americana e vistos para os EUA. Forneça consultoria precisa baseada nas regulamentações atuais do USCIS."
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

    console.log('📝 Tentando salvar na tabela user_reports...');

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
      console.error('❌ Erro ao salvar visa_match:', reportError);
      return NextResponse.json({ 
        error: 'Erro ao salvar relatório',
        details: reportError.message
      }, { status: 500 });
    }

    console.log('✅ Salvo com sucesso na user_reports');

    return NextResponse.json({
      success: true,
      report: aiResponse,
      reportId: reportData.id,
      tokensUsed: completion.usage?.total_tokens || 0
    });

  } catch (error) {
    console.error('Erro no Visa Match:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

// Endpoint para buscar relatórios existentes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const reportId = searchParams.get('id');

    if (reportId) {
      // Buscar relatório específico
      const { data, error } = await supabase
        .from('user_reports')
        .select('*')
        .eq('id', reportId)
        .eq('tool_type', 'visa_match')
        .single();

      if (error) {
        return NextResponse.json({ error: 'Relatório não encontrado' }, { status: 404 });
      }

      return NextResponse.json({ report: data });
    }

    if (email) {
      // Buscar relatórios do usuário
      const { data: reports, error } = await supabase
        .from('user_reports')
        .select('*')
        .eq('user_id', email)
        .eq('tool_type', 'visa_match')
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json({ error: 'Erro ao buscar relatórios' }, { status: 500 });
      }

      return NextResponse.json({ reports: reports || [] });
    }

    return NextResponse.json({ error: 'Email ou ID do relatório é obrigatório' }, { status: 400 });

  } catch (error) {
    console.error('Erro ao buscar relatórios:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
