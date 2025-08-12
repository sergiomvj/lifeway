import { supabase } from '@/lib/supabaseClient';

export async function testSupabaseConnection() {
  console.log('Testando conexão com o Supabase...');
  
  try {
    // Testa a conexão básica
    const { data, error } = await supabase
      .from('user_contexts')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Erro ao conectar ao Supabase:', error);
      return { success: false, error };
    }
    
    console.log('Conexão com o Supabase estabelecida com sucesso!');
    return { success: true, data };
  } catch (error) {
    console.error('Erro inesperado ao testar conexão com o Supabase:', error);
    return { success: false, error };
  }
}

// Executa o teste quando o módulo for importado
if (typeof window !== 'undefined') {
  testSupabaseConnection().then(result => {
    if (result.success) {
      console.log('Teste de conexão concluído com sucesso!');
    } else {
      console.error('Falha no teste de conexão com o Supabase.');
    }
  });
}
