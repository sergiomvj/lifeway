import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Heart, ArrowRight, BarChart3 } from 'lucide-react';
import { useFavoriteCities } from '@/contexts';
import { getCityImageUrl, getDefaultCityImageUrl } from '@/utils';

const FavoriteCitiesSection: React.FC = () => {
  const { favoriteCities, isLoading, removeFavorite } = useFavoriteCities();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Cidades Favoritas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-petroleo"></div>
            <span className="ml-3 text-sm text-gray-500">Carregando suas cidades favoritas...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (favoriteCities.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Cidades Favoritas
          </CardTitle>
          <CardDescription>
            Você ainda não adicionou nenhuma cidade aos favoritos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">
              Adicione cidades aos seus favoritos para acompanhar e comparar opções de destino
            </p>
            <Button 
              onClick={() => navigate('/destinos')}
              className="bg-petroleo hover:bg-petroleo/90"
            >
              Explorar Destinos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Cidades Favoritas
        </CardTitle>
        <CardDescription>
          {favoriteCities.length} {favoriteCities.length === 1 ? 'cidade favorita' : 'cidades favoritas'} salvas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteCities.map((favorite) => (
            <div 
              key={favorite.id} 
              className="border rounded-lg overflow-hidden flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-32">
                <img
                  src={getCityImageUrl(favorite.city_id)}
                  alt={favorite.city_name || 'Cidade favorita'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getDefaultCityImageUrl();
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-3 text-white">
                  <h3 className="font-semibold">{favorite.city_name}</h3>
                  <div className="flex items-center text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    {favorite.city_state}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/80 hover:bg-white/90"
                  onClick={() => removeFavorite(favorite.city_id)}
                >
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/destinos')}
        >
          <MapPin className="mr-2 h-4 w-4" />
          Ver Todos os Destinos
        </Button>
        
        <Button 
          size="sm"
          className="bg-lilas hover:bg-lilas/90"
          onClick={() => navigate('/destinos/comparativo')}
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          Comparar Cidades
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FavoriteCitiesSection;
