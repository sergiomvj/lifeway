import { supabase } from './supabaseClient';

export async function testSupabaseConnection() {
  console.log('Testando conexão com o Supabase...');
  
  try {
    // Testa a conexão básica
    const { data, error } = await supabase.from('user_contexts').select('*').limit(1);
    
    if (error) {
      console.error('Erro ao conectar ao Supabase:', error);
      return { success: false, error };
    }
    
    console.log('Conexão com o Supabase estabelecida com sucesso!');
    
    // Testa se as extensões necessárias estão habilitadas
    const { data: extensions, error: extensionsError } = await supabase
      .rpc('pg_available_extensions');
    
    if (extensionsError) {
      console.warn('Não foi possível verificar as extensões:', extensionsError);
    } else {
      const requiredExtensions = ['wrappers', 'supabase_vault', 'pg_net', 'supabase_realtime'];
      const missingExtensions = requiredExtensions.filter(ext => 
        !extensions.some((e: any) => e.name === ext && e.installed_version !== null)
      );
      
      if (missingExtensions.length > 0) {
        console.warn(`As seguintes extensões necessárias não estão instaladas: ${missingExtensions.join(', ')}`);
      } else {
        console.log('Todas as extensões necessárias estão instaladas.');
      }
    }
    
    // Testa se a tabela está configurada para atualizações em tempo real
    const { data: tables, error: tablesError } = await supabase
      .from('pg_publication_tables')
      .select('*')
      .eq('schemaname', 'public')
      .eq('tablename', 'user_contexts');
    
    if (tablesError) {
      console.warn('Não foi possível verificar as tabelas de publicação:', tablesError);
    } else if (!tables || tables.length === 0) {
      console.warn('A tabela user_contexts não está configurada para atualizações em tempo real.');
    } else {
      console.log('A tabela user_contexts está configurada para atualizações em tempo real.');
    }
    
    return { success: true };
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
