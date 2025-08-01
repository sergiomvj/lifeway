import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '../../../../lib/conectAPI';

const supabase = createSupabaseClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_email, form_data, is_completed, qualify } = body;

    if (!user_email || !form_data) {
      return NextResponse.json(
        { success: false, error: 'Email do usuário e dados do formulário são obrigatórios' },
        { status: 400 }
      );
    }

    // Try multiple structures like in the main form save API
    const structures = [
      { name: 'user_email+form_data', data: { user_email, form_data, is_completed, qualify }, conflict: 'user_email' },
      { name: 'user_id+data', data: { user_id: user_email, data: form_data, is_completed, qualify }, conflict: 'user_id' },
      { name: 'user_id+form_data', data: { user_id: user_email, form_data, is_completed, qualify }, conflict: 'user_id' }
    ];

    let success = false;
    let result = null;

    for (const structure of structures) {
      try {
        console.log(`Tentando estrutura ${structure.name}:`, structure.data);
        
        const { data, error } = await supabase
          .from('multistep_forms')
          .upsert([structure.data], { 
            onConflict: structure.conflict,
            ignoreDuplicates: false 
          })
          .select()
          .single();

        if (!error) {
          console.log(`✅ Sucesso com estrutura ${structure.name}:`, data);
          result = data;
          success = true;
          break;
        } else {
          console.log(`Estrutura ${structure.name} falhou:`, error.message);
        }
      } catch (structureError) {
        console.log(`Erro na estrutura ${structure.name}:`, structureError);
      }
    }

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Erro ao salvar dados no banco de dados' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Dados do formulário salvos com sucesso.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
