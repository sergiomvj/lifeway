// Teste para verificar se as variáveis de ambiente estão sendo carregadas corretamente
console.log('Testando variáveis de ambiente:');
console.log('VITE_PUBLIC_SUPABASE_URL:', import.meta.env.VITE_PUBLIC_SUPABASE_URL);
console.log('VITE_PUBLIC_SUPABASE_ANON_KEY:', import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY);

// Exporta as variáveis para uso em outros arquivos
export const env = {
  VITE_PUBLIC_SUPABASE_URL: import.meta.env.VITE_PUBLIC_SUPABASE_URL,
  VITE_PUBLIC_SUPABASE_ANON_KEY: import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY,
};
