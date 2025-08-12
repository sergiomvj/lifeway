import { useEffect, useState } from 'react';
import { testSupabaseConnection } from '@/utils/testSupabaseConnection';

export function SupabaseTest() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const runTest = async () => {
      try {
        setIsLoading(true);
        const result = await testSupabaseConnection();
        setTestResult(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    runTest();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-lg font-bold mb-2">Testando conexão com o Supabase...</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-blue-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-bold text-red-700 mb-2">Erro ao testar conexão com o Supabase</h2>
        <pre className="text-xs text-red-600 bg-white p-3 rounded border border-red-100 overflow-auto">
          {error.message}
        </pre>
      </div>
    );
  }

  const isSuccess = testResult?.success;

  return (
    <div className={`p-4 ${isSuccess ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border rounded-lg`}>
      <h2 className={`text-lg font-bold mb-2 ${isSuccess ? 'text-green-700' : 'text-yellow-700'}`}>
        {isSuccess ? 'Conexão com o Supabase bem-sucedida!' : 'Problema na conexão com o Supabase'}
      </h2>
      
      <div className="mt-3 space-y-2">
        <div>
          <span className="font-medium">Status:</span>{' '}
          <span className={isSuccess ? 'text-green-600' : 'text-yellow-600'}>
            {isSuccess ? 'Conectado' : 'Falha na conexão'}
          </span>
        </div>
        
        {testResult?.error && (
          <div>
            <div className="font-medium">Erro:</div>
            <pre className="text-xs bg-white p-3 rounded border overflow-auto">
              {JSON.stringify(testResult.error, null, 2)}
            </pre>
          </div>
        )}
        
        {testResult?.data && (
          <div>
            <div className="font-medium">Dados de teste:</div>
            <pre className="text-xs bg-white p-3 rounded border overflow-auto">
              {JSON.stringify(testResult.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
