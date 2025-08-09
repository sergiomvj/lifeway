import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useUserContext } from '@/hooks/useUserContext';

// Interface para cidade favorita
export interface FavoriteCity {
  id: string;
  city_id: string;
  user_id: string;
  created_at: string;
  city_name?: string;
  city_state?: string;
}

// Interface para o contexto
interface FavoriteCitiesContextType {
  favoriteCities: FavoriteCity[];
  isLoading: boolean;
  addFavorite: (cityId: string, cityName: string, cityState: string) => Promise<void>;
  removeFavorite: (cityId: string) => Promise<void>;
  isFavorite: (cityId: string) => boolean;
}

// Criando o contexto
const FavoriteCitiesContext = createContext<FavoriteCitiesContextType | undefined>(undefined);

// Provider component
export const FavoriteCitiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteCities, setFavoriteCities] = useState<FavoriteCity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userContext = useUserContext();
  const user = userContext.user;
  const isAuthenticated = !!user?.user_id;

  // Carregar cidades favoritas do usuário
  useEffect(() => {
    const fetchFavoriteCities = async () => {
      if (!isAuthenticated || !user?.user_id) {
        setFavoriteCities([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Buscar cidades favoritas do usuário atual
        const { data, error } = await supabase
          .from('favorite_cities')
          .select('*, cities(name, state)')
          .eq('user_id', user.user_id);

        if (error) {
          console.error('Erro ao buscar cidades favoritas:', error);
          return;
        }

        // Formatar os dados para incluir nome e estado da cidade
        const formattedData = data.map(item => ({
          id: item.id,
          city_id: item.city_id,
          user_id: item.user_id,
          created_at: item.created_at,
          city_name: item.cities?.name,
          city_state: item.cities?.state
        }));

        setFavoriteCities(formattedData);
      } catch (error) {
        console.error('Erro na consulta de cidades favoritas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteCities();
  }, [isAuthenticated, user?.user_id]);

  // Adicionar cidade aos favoritos
  const addFavorite = async (cityId: string, cityName: string, cityState: string) => {
    if (!isAuthenticated || !user?.user_id) {
      console.log('Usuário não autenticado');
      return;
    }

    try {
      // Verificar se já é favorito
      const existingFavorite = favoriteCities.find(fav => fav.city_id === cityId);
      if (existingFavorite) {
        console.log('Cidade já é favorita');
        return;
      }

      console.log(`Adicionando cidade ${cityName} (${cityId}) aos favoritos para usuário ${user.user_id}`);
      
      // Adicionar aos favoritos
      const { data, error } = await supabase
        .from('favorite_cities')
        .insert([
          { 
            city_id: cityId, 
            user_id: user.user_id 
          }
        ])
        .select();

      if (error) {
        console.error('Erro ao adicionar cidade favorita:', error);
        return;
      }

      // Adicionar à lista local
      if (data && data.length > 0) {
        const newFavorite = {
          ...data[0],
          city_name: cityName,
          city_state: cityState
        };
        console.log('Novo favorito adicionado:', newFavorite);
        setFavoriteCities(prev => [...prev, newFavorite]);
      }
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
    }
  };

  // Remover cidade dos favoritos
  const removeFavorite = async (cityId: string) => {
    if (!isAuthenticated || !user?.user_id) {
      console.log('Usuário não autenticado');
      return;
    }

    try {
      // Encontrar o registro a ser removido
      const favoriteToRemove = favoriteCities.find(fav => fav.city_id === cityId);
      
      if (!favoriteToRemove) {
        console.log('Cidade não encontrada nos favoritos');
        return;
      }

      console.log(`Removendo cidade ${favoriteToRemove.city_name || cityId} dos favoritos para usuário ${user.user_id}`);

      // Remover do banco de dados
      const { error } = await supabase
        .from('favorite_cities')
        .delete()
        .eq('id', favoriteToRemove.id);

      if (error) {
        console.error('Erro ao remover cidade favorita:', error);
        return;
      }

      console.log('Cidade removida com sucesso dos favoritos');
      
      // Remover da lista local
      setFavoriteCities(prev => prev.filter(fav => fav.city_id !== cityId));
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  };

  // Verificar se uma cidade é favorita
  const isFavorite = (cityId: string) => {
    if (!isAuthenticated || !user?.user_id) {
      return false;
    }
    return favoriteCities.some(fav => fav.city_id === cityId);
  };

  return (
    <FavoriteCitiesContext.Provider value={{
      favoriteCities,
      isLoading,
      addFavorite,
      removeFavorite,
      isFavorite
    }}>
      {children}
    </FavoriteCitiesContext.Provider>
  );
};

// Hook para usar o contexto
export const useFavoriteCities = () => {
  const context = useContext(FavoriteCitiesContext);
  if (context === undefined) {
    throw new Error('useFavoriteCities deve ser usado dentro de um FavoriteCitiesProvider');
  }
  return context;
};
