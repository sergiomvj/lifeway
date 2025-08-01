import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { createApiLogger } from '../../../../lib/ApiLogger';

// Initialize clients
const supabase = createClient(
  'https://oaxkqqamnppkeavunlgo.supabase.co',
  process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: NextRequest) {
  let contextLogger: any;
  let userData: any;

  try {
    // Parse request body
    userData = await request.json();
    const userEmail = userData.email || userData.user_email || 'anonymous';
    
    // Initialize logger with user context
    contextLogger = createApiLogger(
      'get-opportunity', 
      '/api/tools/get-opportunity/analyze-opportunity', 
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
    const promptPath = path.join(process.cwd(), 'prompt_getopportunity.md');
    const promptTemplate = fs.readFileSync(promptPath, 'utf8');

    // Combine prompt with user data
    const fullPrompt = `${promptTemplate}

---

**DADOS DO USUÁRIO:**
${JSON.stringify(userData, null, 2)}

Por favor, forneça uma análise detalhada e personalizada baseada nas informações fornecidas.`;

    await contextLogger.logStep('prompt_loaded', 'success', {
      prompt_content: fullPrompt.substring(0, 500) + '...',
      metadata: { prompt_length: fullPrompt.length }
    });

    // Call OpenAI API
    await contextLogger.logStep('openai_request', 'in_progress');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um consultor especializado em direcionamento profissional e oportunidades de negócio. Gere relatórios detalhados, personalizados e profissionais baseados nas informações fornecidas."
        },
        {
          role: "user",
          content: fullPrompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;
    const tokensUsed = completion.usage?.total_tokens || 0;
    const estimatedCost = (tokensUsed / 1000) * 0.03; // Estimativa baseada no modelo GPT-4

    await contextLogger.logOpenAI(
      fullPrompt.substring(0, 1000),
      "gpt-4o",
      {
        messages: completion.choices.length,
        max_tokens: 4000,
        temperature: 0.7
      },
      {
        response_length: aiResponse?.length || 0,
        finish_reason: completion.choices[0].finish_reason
      },
      tokensUsed,
      estimatedCost
    );

    // Store in database
    await contextLogger.logStep('db_save', 'in_progress');
    const { data, error } = await supabase
      .from('user_reports')
      .insert({
        user_id: userData.email || 'anonymous',
        tool_type: 'get_opportunity',
        input_data: userData,
        ai_response: aiResponse,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      await contextLogger.logError('db_save', error.message, {
        supabase_error: error,
        user_data: userData
      });
      return NextResponse.json({ error: 'Failed to store report' }, { status: 500 });
    }

    await contextLogger.logStep('db_save', 'success', {
      metadata: { report_id: data.id, user_id: data.user_id }
    });

    // Calcular score de qualidade do lead
    const qualityScore = calculateLeadQuality(userData);

    const response = {
      success: true,
      report: aiResponse,
      reportId: data.id,
      message: 'Relatório de oportunidades gerado com sucesso!'
    };

    await contextLogger.logSuccess('completed', response, qualityScore);
    await contextLogger.finish('success', {
      lead_quality_score: qualityScore,
      conversion_step: 'report_generated'
    });

    return NextResponse.json(response);

  } catch (error) {
    await contextLogger.logError('execution', error as Error, {
      user_data: userData,
      step: 'general_execution'
    });
    
    await contextLogger.finish('error', {
      error_context: 'general_api_error'
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Calcula score de qualidade do lead baseado nos dados fornecidos
 */
function calculateLeadQuality(userData: any): number {
  let score = 5; // Base score
  
  // Incrementar baseado em completude dos dados
  if (userData.fullName) score += 1;
  if (userData.email) score += 1;
  if (userData.profileType && userData.profileType !== 'basic') score += 1;
  if (userData.currentSituation && userData.currentSituation.length > 50) score += 1;
  if (userData.goals && userData.goals.length > 30) score += 1;
  
  return Math.min(score, 10); // Max 10
}
