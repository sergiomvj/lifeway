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
    console.log('Dados recebidos para Get Opportunity:', userData);

    // Validação básica
    if (!userData.email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
    }

    // Obter dados do formulário para validação
    const { data: formData, error: formError } = await supabase
      .from('multistep_forms')
      .select('*')
      .eq('user_id', userData.email)
      .single();

    if (formError || !formData) {
      return NextResponse.json({
        success: false,
        error: 'Dados do formulário ausentes. Por favor, preencha o formulário antes de prosseguir.',
        redirectUrl: '/formulario' // URL do formulário no frontend
      });
    }

    // Prompt personalizado para Get Opportunity
    const prompt = `
# Get Opportunity - Análise de Oportunidades Profissionais e Empreendedoras nos EUA

Baseado no perfil abaixo, crie uma análise completa de oportunidades nos Estados Unidos:

## Dados do Usuário:
- Nome: ${userData.fullName || 'Não informado'}
- Email: ${userData.email}
- Idade: ${userData.age || 'Não informado'}
- Profissão: ${userData.profession || 'Não informado'}
- Estado Civil: ${userData.maritalStatus || 'Não informado'}
- Filhos: ${userData.children || 'Não informado'}
- Orçamento: ${userData.budget || 'Não informado'}
- Objetivos: ${userData.goals || userData.usaObjectives || 'Não informado'}
- Aspirações: ${userData.aspiracoes || 'Não informado'}

## Estrutura do Relatório:

### 1. OPORTUNIDADES PROFISSIONAIS
- 3-5 carreiras específicas compatíveis com o perfil
- Salários médios por região
- Demanda de mercado
- Requisitos e certificações necessárias

### 2. OPORTUNIDADES EMPREENDEDORAS
- Tipos de negócio mais promissores
- Investimento inicial necessário
- Potencial de retorno
- Setores em crescimento

### 3. REGIÕES ESTRATÉGICAS
- Estados/cidades recomendados
- Custo de vida vs oportunidades
- Comunidades brasileiras/internacionais
- Facilidades para imigrantes

### 4. PRÓXIMOS PASSOS PRÁTICOS
- Ações imediatas
- Networking e contatos
- Preparação acadêmica/profissional
- Timeline de implementação

Use dados atuais do mercado americano e seja específico com valores, prazos e recomendações práticas.
`;

    console.log('Dados recebidos:', userData);
    console.log('Prompt gerado:', prompt);

    // Chamada para OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em mercado de trabalho americano e oportunidades de negócio nos EUA. Forneça análises detalhadas e práticas."
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
          tool_type: 'get_opportunity',
          input_data: userData,
          ai_response: aiResponse
        }
      ])
      .select()
      .single();

    if (reportError) {
      console.error('❌ Erro ao salvar get_opportunity:', reportError);
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
    console.error('Erro no Get Opportunity:', error);
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
        .eq('tool_type', 'get_opportunity')
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
        .eq('tool_type', 'get_opportunity')
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
