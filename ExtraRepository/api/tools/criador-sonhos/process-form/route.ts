import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const userData = await request.json();
    console.log('userData recebido:', userData);
    
    if (!userData.fullName || !userData.email) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes: fullName e email' }, { status: 400 });
    }

    // Check if form data exists
    const userId = userData.email; // Assuming user_id is the email for this example
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

    // Create comprehensive prompt template
    const promptTemplate = `
Você é um especialista em planejamento de imigração para os Estados Unidos, especializado em criar relatórios personalizados baseados no perfil familiar.

## DADOS DA FAMÍLIA PARA ANÁLISE:

### Informações Básicas:
- Nome: ${userData.fullName}
- Email: ${userData.email}
- Aspirações: ${userData.aspiracoes || userData.freeFormAspirations || 'Buscar uma vida melhor nos EUA'}

### Composição Familiar:
- Membros da família: ${userData.familyMembers || userData.fullName || 'Não informado'}
- Estado civil: ${userData.maritalStatus || 'Não informado'}
- Cônjuge: ${userData.spouse ? `${userData.spouse.name}, ${userData.spouse.profession}` : 'Não informado'}
- Filhos: ${userData.children && userData.children.length > 0 ? userData.children.map((c: any) => `${c.name} (${c.education})`).join(', ') : 'Não informado'}
- Pets: ${userData.pets && userData.pets.length > 0 ? userData.pets.map((p: any) => `${p.name} (${p.type}, porte ${p.size})`).join(', ') : 'Não informado'}

### Sonhos e Aspirações:
- Sonhos dos adultos: ${userData.adultDreams || userData.freeFormAspirations || 'Buscar uma vida melhor nos EUA'}
- Objetivos específicos nos EUA: ${userData.usaObjectives || 'Não informado'}
- Estados de interesse: ${userData.targetStates || 'Não informado'}
- Timeline desejado: ${userData.timeline || 'Não informado'}

### Situação Atual:
- Profissão atual: ${userData.profession || 'Não informado'}
- Escolaridade: ${userData.education || 'Não informado'}
- Nível de inglês: ${userData.englishLevel || 'Não informado'}
- Recursos disponíveis: ${userData.resources || `Poupança: ${userData.currentSavings || 'Não informado'}, Renda mensal: ${userData.monthlyIncome || 'Não informado'}`}

### Critérios Importantes:
- Tipo de ambiente desejado: ${userData.environment || 'Ambiente familiar e seguro'}
- Clima preferido: ${userData.climate || 'Não informado'}

---

Por favor, gere um relatório inspirador e motivacional que:
1. Reconheça os sonhos e aspirações da família
2. Identifique oportunidades específicas nos EUA baseadas no perfil
3. Forneça um plano de ação prático e realista
4. Use linguagem emocional e inspiradora
5. Inclua próximos passos concretos

O relatório deve ser estruturado, profissional, mas também tocante e motivador.
`;

    console.log('Dados recebidos:', userData);
    console.log('Prompt gerado:', promptTemplate);

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um consultor inspiracional especializado em transformação de estilo de vida familiar. Gere relatórios que inspirem e motivem famílias a sonharem grande e realizarem mudanças transformadoras. Use linguagem emocional, inspiradora e esperançosa.'
        },
        {
          role: 'user',
          content: promptTemplate
        }
      ],
      max_tokens: 4000,
      temperature: 0.8,
    });

    const aiResponse = completion.choices[0]?.message?.content || '';

    if (!aiResponse) {
      return NextResponse.json({ error: 'OpenAI não gerou resposta' }, { status: 500 });
    }

    // Save to database - try both table structures
    let saveSuccess = false;
    let saveError = null;

    // Try criador_sonhos table first
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('criador_sonhos')
        .insert({
          user_id: userData.email,
          nome_completo: userData.fullName,
          aspiracoes: userData.aspiracoes || userData.freeFormAspirations || null,
          relatorio_ia: aiResponse,
          criado_em: new Date().toISOString()
        });

      if (!insertError) {
        saveSuccess = true;
      } else {
        saveError = insertError;
      }
    } catch (err) {
      saveError = err;
    }

    // If first table failed, try user_reports table
    if (!saveSuccess) {
      try {
        const { data: insertData2, error: insertError2 } = await supabase
          .from('user_reports')
          .insert({
            user_id: userData.email,
            tool_type: 'criador_sonhos',
            input_data: userData,
            ai_response: aiResponse,
            created_at: new Date().toISOString()
          });

        if (!insertError2) {
          saveSuccess = true;
        } else {
          console.error('Erro ao salvar em user_reports:', insertError2);
        }
      } catch (err) {
        console.error('Erro ao tentar user_reports:', err);
      }
    }

    if (!saveSuccess) {
      console.error('Erro ao salvar no banco:', saveError);
      // Still return success since OpenAI worked, just log the DB error
      console.warn('Relatório gerado mas não salvo no banco de dados');
    }

    return NextResponse.json({
      success: true,
      message: 'Relatório criado com sucesso',
      report: aiResponse,
      saved: saveSuccess
    });

  } catch (error) {
    console.error('Erro no process-form:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}