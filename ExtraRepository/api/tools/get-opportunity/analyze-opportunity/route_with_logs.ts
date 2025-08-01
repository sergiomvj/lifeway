import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { ApiLogger } from '../../../../../lib/api-logger';

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const toolName = 'get-opportunity';
  
  try {
    // Parse request body
    const userData = await request.json();
    console.log('📊 GET-OPPORTUNITY: Request received', { userData });

    // Read the prompt template
    const promptPath = path.join(process.cwd(), 'prompt_getopportunity.md');
    const promptTemplate = fs.readFileSync(promptPath, 'utf8');
    console.log('📄 GET-OPPORTUNITY: Prompt loaded', { promptLength: promptTemplate.length });

    // Combine prompt with user data
    const fullPrompt = `${promptTemplate}

---

**DADOS DO USUÁRIO:**
${JSON.stringify(userData, null, 2)}

Por favor, forneça uma análise detalhada e personalizada baseada nas informações fornecidas.`;

    // Log prompt loaded
    await ApiLogger.logPromptLoaded(toolName, fullPrompt, userData, request);

    console.log('🚀 GET-OPPORTUNITY: Sending request to OpenAI', { 
      promptLength: fullPrompt.length,
      model: 'gpt-4o'
    });

    const openaiStartTime = Date.now();
    
    // Log OpenAI request
    const openaiRequest = {
      model: 'gpt-4o' as const,
      messages: [{ role: 'user' as const, content: fullPrompt }],
      max_tokens: 4000,
      temperature: 0.7
    };
    
    await ApiLogger.logOpenAIRequest(toolName, openaiRequest, request);

    // Send request to OpenAI
    const response = await openai.chat.completions.create(openaiRequest);
    
    const openaiEndTime = Date.now();
    const openaiExecutionTime = openaiEndTime - openaiStartTime;
    
    console.log('✅ GET-OPPORTUNITY: OpenAI response received', {
      executionTime: openaiExecutionTime,
      usage: response.usage,
      model: response.model
    });

    // Log OpenAI response
    await ApiLogger.logOpenAIResponse(toolName, response, openaiExecutionTime, request);

    const generatedReport = response.choices[0].message.content;

    console.log('💾 GET-OPPORTUNITY: Saving to database', { reportLength: generatedReport?.length });

    // Save to database
    const { data: reportData, error: dbError } = await supabase
      .from('user_reports')
      .insert([
        {
          user_id: 'anonymous',
          tool_type: 'get-opportunity',
          user_data: userData,
          generated_report: generatedReport,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('❌ GET-OPPORTUNITY: Database error', dbError);
      await ApiLogger.logError(toolName, 'db_save', dbError, request);
      throw dbError;
    }

    console.log('✅ GET-OPPORTUNITY: Saved to database', { reportId: reportData.id });

    // Log database save
    await ApiLogger.logDatabaseSave(toolName, reportData, request);

    const totalTime = Date.now() - startTime;
    
    // Log completion
    await ApiLogger.logCompleted(toolName, totalTime, request);

    console.log('🎉 GET-OPPORTUNITY: Process completed', { 
      totalTime,
      reportId: reportData.id 
    });

    return NextResponse.json({
      success: true,
      report: generatedReport,
      reportId: reportData.id,
      executionStats: {
        totalTime,
        openaiTime: openaiExecutionTime,
        promptLength: fullPrompt.length,
        responseLength: generatedReport?.length || 0
      }
    });

  } catch (error) {
    console.error('❌ GET-OPPORTUNITY: Error occurred', error);
    
    // Log error
    await ApiLogger.logError(toolName, 'general', error, request);

    return NextResponse.json(
      { 
        error: 'Failed to generate opportunity analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
