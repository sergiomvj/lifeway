import { useEffect } from 'react';
import { env } from '@/utils/envTest';

export function EnvTest() {
  useEffect(() => {
    console.log('Teste de Variáveis de Ambiente:');
    console.log('VITE_PUBLIC_SUPABASE_URL:', env.VITE_PUBLIC_SUPABASE_URL);
    console.log('VITE_PUBLIC_SUPABASE_ANON_KEY:', env.VITE_PUBLIC_SUPABASE_ANON_KEY);
  }, []);

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
      <h2 className="text-lg font-bold mb-2">Teste de Variáveis de Ambiente</h2>
      <p>Verifique o console do navegador para ver os valores das variáveis de ambiente.</p>
      
      <div className="mt-4 p-3 bg-white rounded border">
        <p className="font-mono text-sm break-all">
          <strong>VITE_PUBLIC_SUPABASE_URL:</strong> {env.VITE_PUBLIC_SUPABASE_URL || 'Não definido'}
        </p>
        <p className="font-mono text-sm break-all mt-2">
          <strong>VITE_PUBLIC_SUPABASE_ANON_KEY:</strong> {env.VITE_PUBLIC_SUPABASE_ANON_KEY ? '*** (oculto por segurança)' : 'Não definido'}
        </p>
      </div>
    </div>
  );
}
