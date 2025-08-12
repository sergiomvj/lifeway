import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserContext as UserContextType, ContextUpdate } from '@/types/userContext';
import { userContextService } from '@/services/userContextService';
import { useAuth } from './AuthContext'; // We'll create this next

interface UserContextState {
  context: UserContextType | null;
  isLoading: boolean;
  error: Error | null;
  updateContext: (updates: ContextUpdate[]) => Promise<void>;
  refreshContext: () => Promise<void>;
  isUpdating: boolean;
}

const UserContext = createContext<UserContextState | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [context, setContext] = useState<UserContextType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Function to fetch user context
  const fetchUserContext = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await userContextService.getContext(userId);
      if (response) {
        setContext(response.context);
      } else {
        // Create initial context if it doesn't exist
        const newContext = await userContextService.createContext(userId, {});
        setContext(newContext);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user context:', err);
      setError(err instanceof Error ? err : new Error('Failed to load user context'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update context function
  const updateContext = useCallback(async (updates: ContextUpdate[]) => {
    if (!user?.id) return;
    
    try {
      setIsUpdating(true);
      const updatedContext = await userContextService.updateContext(user.id, updates);
      setContext(updatedContext);
      return updatedContext;
    } catch (err) {
      console.error('Failed to update context:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [user?.id]);

  // Refresh context function
  const refreshContext = useCallback(async () => {
    if (user?.id) {
      await fetchUserContext(user.id);
    }
  }, [user?.id, fetchUserContext]);

  // Effect to handle authentication changes
  useEffect(() => {
    if (!user?.id) {
      setContext(null);
      setIsLoading(false);
      return;
    }

    // Initial fetch
    fetchUserContext(user.id);

    // Subscribe to real-time updates
    const unsubscribe = userContextService.subscribeToContextUpdates(
      user.id,
      (payload) => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          setContext(payload.new as UserContextType);
        } else if (payload.eventType === 'DELETE') {
          setContext(null);
        }
      }
    );

    // Cleanup subscription on unmount or user change
    return () => {
      unsubscribe();
    };
  }, [user?.id, fetchUserContext]);

  // Provide the context value
  const contextValue = {
    context,
    isLoading,
    error,
    updateContext,
    refreshContext,
    isUpdating,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = (): UserContextState => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
