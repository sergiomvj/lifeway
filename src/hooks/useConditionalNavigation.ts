import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para navegação condicional baseada no status de autenticação
 * - Usuários não logados: redirecionados para login/cadastro
 * - Usuários logados: redirecionados para dashboard ou rota específica
 */
export function useConditionalNavigation() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const navigateConditionally = useCallback(async (
    targetRoute: string,
    options?: {
      requireAuth?: boolean;
      fallbackRoute?: string;
      showToast?: boolean;
      toastMessage?: string;
    }
  ) => {
    const {
      requireAuth = true,
      fallbackRoute = '/dashboard',
      showToast = true,
      toastMessage = 'Faça login para acessar esta funcionalidade'
    } = options || {};

    try {
      // Verificar se o usuário está autenticado
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (user) {
        // Usuário logado - navegar para a rota de destino
        navigate(targetRoute);
      } else {
        // Usuário não logado
        if (requireAuth) {
          // Mostrar toast informativo (sem erro)
          if (showToast) {
            toast({
              title: "Login necessário",
              description: toastMessage,
              variant: "default"
            });
          }
          
          // Redirecionar para login com redirect para a rota original
          navigate(`/login?redirect=${encodeURIComponent(targetRoute)}`);
        } else {
          // Navegar normalmente para rotas que não requerem autenticação
          navigate(targetRoute);
        }
      }
    } catch (error) {
      console.error('Erro na navegação condicional:', error);
      // Em caso de erro, assumir que usuário não está logado e redirecionar para login
      if (requireAuth) {
        navigate(`/login?redirect=${encodeURIComponent(targetRoute)}`);
      } else {
        navigate(targetRoute);
      }
    }
  }, [navigate, toast]);

  const navigateToTool = useCallback(async (toolName: string) => {
    const toolRoutes: Record<string, string> = {
      'dreams': '/dreams',
      'visamatch': '/visamatch',
      'especialista': '/especialista',
      'destinos': '/destinos'
    };

    const targetRoute = toolRoutes[toolName] || '/dashboard';
    
    await navigateConditionally(targetRoute, {
      requireAuth: true,
      fallbackRoute: '/dashboard',
      showToast: true,
      toastMessage: `Faça login para acessar ${toolName === 'dreams' ? 'o Criador de Sonhos' : 
                                                toolName === 'visamatch' ? 'o VisaMatch' :
                                                toolName === 'especialista' ? 'o Especialista' :
                                                'esta ferramenta'}`
    });
  }, [navigateConditionally]);

  const navigateToHeroAction = useCallback(async (action: 'start' | 'discover') => {
    if (action === 'start') {
      await navigateToTool('dreams');
    } else if (action === 'discover') {
      await navigateToTool('visamatch');
    }
  }, [navigateToTool]);

  return {
    navigateConditionally,
    navigateToTool,
    navigateToHeroAction
  };
}

export default useConditionalNavigation;
