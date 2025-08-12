import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const AuthTest: React.FC = () => {
  const { user, session, signOut, isLoading: authLoading } = useAuth();
  const { context, isLoading: contextLoading, updateContext } = useUser();
  const [testUpdate, setTestUpdate] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Função para testar atualização do contexto
  const handleTestUpdate = async () => {
    if (!user?.id) return;
    
    try {
      setIsUpdating(true);
      await updateContext([{
        section: 'profile',
        data: {
          name: testUpdate || 'Teste de atualização',
          updated_at: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
        source: 'test',
        reason: 'Teste de atualização de contexto'
      }]);
      
      alert('Contexto atualizado com sucesso! Verifique o console para ver as atualizações em tempo real.');
    } catch (error) {
      console.error('Erro ao atualizar contexto:', error);
      alert('Erro ao atualizar contexto. Verifique o console para mais detalhes.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Efeito para logar mudanças no contexto
  useEffect(() => {
    console.log('Contexto do usuário atualizado:', context);
  }, [context]);

  if (authLoading) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Teste de Autenticação e Contexto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Status de Autenticação:</h3>
          {user ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
              <p>✅ Usuário autenticado</p>
              <p>Email: {user.email}</p>
              <p>ID: {user.id}</p>
              <Button 
                onClick={signOut} 
                variant="outline" 
                className="mt-2"
              >
                Sair
              </Button>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
              <p>🔒 Usuário não autenticado</p>
              <p className="text-sm mt-2">Faça login para ver as informações do contexto</p>
            </div>
          )}
        </div>

        {user && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium">Contexto do Usuário:</h3>
            
            {contextLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : context ? (
              <div className="space-y-2">
                <div className="p-4 bg-muted/50 rounded-md">
                  <pre className="text-xs overflow-auto max-h-60">
                    {JSON.stringify(context, null, 2)}
                  </pre>
                </div>
                
                <div className="pt-4 space-y-2">
                  <h4 className="font-medium">Testar Atualização:</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testUpdate}
                      onChange={(e) => setTestUpdate(e.target.value)}
                      placeholder="Digite um nome para teste"
                      className="flex-1 p-2 border rounded"
                    />
                    <Button 
                      onClick={handleTestUpdate}
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Atualizando...' : 'Atualizar Nome'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-muted/50 rounded-md">
                <p>Nenhum contexto encontrado para este usuário.</p>
                <Button 
                  onClick={() => context && updateContext([{
                    section: 'profile',
                    data: { name: 'Novo Usuário', updated_at: new Date().toISOString() },
                    timestamp: new Date().toISOString(),
                    source: 'test',
                    reason: 'Criação inicial de contexto'
                  }])}
                  className="mt-2"
                  variant="outline"
                >
                  Criar Contexto Inicial
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthTest;
