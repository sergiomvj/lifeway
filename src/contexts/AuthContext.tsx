import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Função para atualizar a sessão do usuário
  const updateSession = useCallback(async (newSession: Session | null) => {
    console.log('Atualizando sessão:', newSession?.user?.email || 'Nenhum usuário');
    setSession(newSession);
    setUser(newSession?.user ?? null);
  }, []);

  // Função para recarregar a sessão
  const refreshSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao recarregar a sessão:', error);
        return;
      }
      
      await updateSession(currentSession);
    } catch (error) {
      console.error('Erro inesperado ao recarregar a sessão:', error);
    } finally {
      setIsLoading(false);
    }
  }, [updateSession]);

  // Efeito para configurar o listener de mudanças de autenticação
  useEffect(() => {
    let mounted = true;
    
    // Função para lidar com mudanças de autenticação
    const handleAuthChange = async (event: AuthChangeEvent, session: Session | null) => {
      console.log('Mudança de estado de autenticação:', event, 'Usuário:', session?.user?.email);
      
      if (!mounted) return;
      
      // Atualiza a sessão imediatamente
      await updateSession(session);
      
      // Atualiza o estado de carregamento com base no evento
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        setIsLoading(false);
      }
    };
    
    // Configura o listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);
    
    // Carrega a sessão inicial
    const loadInitialSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Erro ao carregar a sessão inicial:', error);
          setIsLoading(false);
          return;
        }
        
        await updateSession(currentSession);
      } catch (error) {
        console.error('Erro inesperado ao carregar a sessão inicial:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Inicializa a sessão
    loadInitialSession();
    
    // Limpeza ao desmontar
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [updateSession]);

  // Função de logout
  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erro ao fazer logout:', error);
        throw error;
      }
      
      // Limpa a sessão local
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Erro inesperado ao fazer logout:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Valor do contexto
  const value = {
    user,
    session,
    isLoading,
    signOut,
    refreshSession,
  };

  // Renderiza o provedor de contexto com os valores atuais
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;
