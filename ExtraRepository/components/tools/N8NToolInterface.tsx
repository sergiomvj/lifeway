// Exemplo de uso do N8N Client
// app/components/tools/N8NToolInterface.tsx

'use client';

import { useState } from 'react';
import { useUser } from '../../lib/auth-context';
import { useN8NClient } from '../../lib/n8n-client';

interface N8NToolInterfaceProps {
  tool: 'criador-sonhos' | 'visa-match' | 'get-opportunity';
  title: string;
  description: string;
  userData: any;
}

export default function N8NToolInterface({ tool, title, description, userData }: N8NToolInterfaceProps) {
  const { user } = useUser();
  const n8nClient = useN8NClient();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!user?.email) {
      setError('Usuário não autenticado');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Enviar para N8N
      const response = await n8nClient.processWithTool({
        tool,
        userData: {
          ...userData,
          email: user.email,
          fullName: user.name || userData.fullName
        }
      });

      if (response.success && response.result) {
        setResult(response.result);
        console.log(`✅ ${title} processado com sucesso!`);
      } else {
        setError(response.error || 'Erro no processamento');
      }
    } catch (err) {
      console.error(`❌ Erro no ${title}:`, err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-baskerville text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      {/* Action Button */}
      <div className="text-center mb-8">
        <button
          onClick={handleProcess}
          disabled={loading}
          className="bg-azul-petroleo text-white px-8 py-3 rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processando...</span>
            </div>
          ) : (
            `Gerar ${title}`
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">❌ {error}</p>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Resultado:</h2>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">
              {result}
            </div>
          </div>
          
          {/* Action buttons para o resultado */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              📋 Copiar
            </button>
            <button
              onClick={() => {
                const blob = new Blob([result], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${tool}-${new Date().toISOString().split('T')[0]}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="bg-azul-petroleo text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
            >
              💾 Download
            </button>
          </div>
        </div>
      )}

      {/* User Data Preview (for debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-8">
          <summary className="cursor-pointer text-gray-500 mb-2">🔍 Ver dados do usuário (dev only)</summary>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
            {JSON.stringify({ tool, userData, user: { email: user?.email, name: user?.name } }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
