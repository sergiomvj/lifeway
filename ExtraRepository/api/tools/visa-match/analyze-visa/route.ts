import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { createApiLogger } from '../../../../lib/ApiLogger';

// Initialize Supabase client
const supabase = createClient(
  'https://oaxkqqamnppkeavunlgo.supabase.co',
  process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  let contextLogger: any;
  let userData: any;

  try {
    // Parse request body
    userData = await request.json();
    const userEmail = userData.email || userData.user_email || 'anonymous';
    
    // Initialize logger with user context
    contextLogger = createApiLogger(
      'visa-match', 
      '/api/tools/visa-match/analyze-visa', 
      'POST', 
      request,
      userEmail
    );

    await contextLogger.logRequest(userData);
    await contextLogger.logStep('data_received', 'success', {
      user_data: userData,
      metadata: { data_keys: Object.keys(userData) }
    });

    // Read the prompt template
    await contextLogger.logStep('prompt_loading', 'in_progress');
    const promptPath = path.join(process.cwd(), 'prompt_visamatch.md');
    const promptTemplate = fs.readFileSync(promptPath, 'utf8');

    // Combine prompt with user data
    const fullPrompt = `${promptTemplate}

---

## DADOS DA FAMÍLIA PARA ANÁLISE DE VISTO:

### Dados do Requerente Principal:
- Formação acadêmica: ${userData.education || 'Não informado'}
- Experiência profissional: ${userData.experience || 'Não informado'}
- Especialização: ${userData.specialization || 'Não informado'}
- Certificações: ${userData.certifications || 'Não informado'}
- Idade: ${userData.age || 'Não informado'}
- Estado civil: ${userData.maritalStatus || 'Não informado'}
- Histórico de viagens: ${userData.travelHistory || 'Não informado'}
- Renda atual: ${userData.income || 'Não informado'}
- Patrimônio: ${userData.assets || 'Não informado'}
- Capacidade de investimento: ${userData.investmentCapacity || 'Não informado'}

### Dados do Cônjuge (se aplicável):
- Qualificações profissionais: ${userData.spouseEducation || 'Não informado'}
- Experiência profissional: ${userData.spouseExperience || 'Não informado'}
- Interesse em trabalhar nos EUA: ${userData.spouseWorkInterest || 'Não informado'}
- Idade: ${userData.spouseAge || 'Não informado'}

### Dados dos Filhos (se aplicável):
- Idades dos filhos: ${userData.childrenAges || 'Não informado'}
- Situação acadêmica: ${userData.childrenEducation || 'Não informado'}
- Necessidades especiais: ${userData.childrenSpecialNeeds || 'Não informado'}

### Objetivos e Preferências:
- Carreira desejada nos EUA: ${userData.desiredCareer || 'Não informado'}
- Setor de interesse: ${userData.sector || 'Não informado'}
- Estados ou cidades preferidas: ${userData.preferredLocations || 'Não informado'}
- Urgência da mudança: ${userData.urgency || 'Não informado'}
- Timeline desejado: ${userData.timeline || 'Não informado'}
- Prioridades para cônjuge e filhos: ${userData.familyPriorities || 'Não informado'}

### Recursos Disponíveis:
- Orçamento total para o processo: ${userData.budget || 'Não informado'}
- Flexibilidade de investimento: ${userData.investmentFlexibility || 'Não informado'}
- Tempo disponível para preparação: ${userData.preparationTime || 'Não informado'}
- Suporte de empresas/instituições: ${userData.institutionalSupport || 'Não informado'}

### Conexões nos EUA:
- Contatos profissionais: ${userData.professionalContacts || 'Não informado'}
- Familiares ou amigos residentes: ${userData.personalContacts || 'Não informado'}
- Ofertas de trabalho/estudo: ${userData.jobOffers || 'Não informado'}
- Conhecimento de advogados especializados: ${userData.legalContacts || 'Não informado'}

---

Por favor, gere um relatório técnico e detalhado seguindo exatamente a estrutura do prompt acima, com análise rigorosa das opções de visto mais viáveis para este perfil específico.`;

    // For now, we'll store the prompt and user data, but will need to add OpenAI integration
    // when the OpenAI package is properly installed
    const analysisResult = `Análise de visto em processamento...

**DADOS RECEBIDOS:**
${JSON.stringify(userData, null, 2)}

**PROMPT APLICADO:**
Prompt técnico de análise de visto foi aplicado com os dados fornecidos.

Este é um relatório temporário. A integração completa com OpenAI será ativada após a instalação das dependências necessárias.`;

    // Store in database
    const { data, error } = await supabase
      .from('user_reports')
      .insert({
        user_id: 'anonymous',
        tool_type: 'visa_match',
        input_data: userData,
        ai_response: analysisResult,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to store report' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      report: analysisResult,
      reportId: data.id,
      message: 'Análise de visto processada com sucesso! (Integração OpenAI será ativada em breve)'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}