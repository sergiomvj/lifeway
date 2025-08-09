import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowLeft, Plus, Trash2, BarChart3 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCityImageUrl, getDefaultCityImageUrl } from '@/utils';
import { useFavoriteCities } from '@/contexts';

interface City {
  id: string;
  name: string;
  state: string;
  region?: string;
  population?: number;
  average_temperature?: {
    celsius: number;
    fahrenheit: number;
  };
  cost_of_living_index?: number;
  job_market_score?: number;
  education_score?: number;
  business_opportunity_score?: number;
  job_opportunities?: string;
  main_destiny: boolean;
  description?: string;
  highlights?: string[];
  created_at?: string;
  updated_at?: string;
}

const ComparativoCidades = () => {
  const [allCities, setAllCities] = useState<City[]>([]);
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { favoriteCities } = useFavoriteCities();

  // Buscar todas as cidades do Supabase
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .order('name');

        if (error) {
          console.error('Erro ao buscar cidades:', error);
          return;
        }

        setAllCities(data || []);
      } catch (error) {
        console.error('Erro na consulta:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Adicionar cidade à comparação
  const addCityToComparison = (cityId: string) => {
    const cityToAdd = allCities.find(city => city.id === cityId);
    if (cityToAdd && !selectedCities.some(city => city.id === cityId)) {
      setSelectedCities(prev => [...prev, cityToAdd]);
    }
  };

  // Remover cidade da comparação
  const removeCityFromComparison = (cityId: string) => {
    setSelectedCities(prev => prev.filter(city => city.id !== cityId));
  };

  // Adicionar cidades favoritas à comparação
  const addFavoritesToComparison = () => {
    const favoriteCityIds = favoriteCities.map(fav => fav.city_id);
    const citiesToAdd = allCities.filter(city => 
      favoriteCityIds.includes(city.id) && 
      !selectedCities.some(selectedCity => selectedCity.id === city.id)
    );
    
    setSelectedCities(prev => [...prev, ...citiesToAdd]);
  };

  // Formatar população
  const formatPopulation = (population?: number) => {
    if (!population) return 'N/A';
    
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(0)}K`;
    }
    return population.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-cinza-claro flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petroleo mx-auto mb-4"></div>
          <p className="text-petroleo font-medium">Carregando cidades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/destinos')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Destinos
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-baskerville font-bold text-petroleo">
            Comparativo de Cidades
          </h1>
        </div>

        {/* Seleção de cidades */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-petroleo">Selecione as cidades para comparar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="w-full md:w-64">
                <Select onValueChange={addCityToComparison}>
                  <SelectTrigger>
                    <SelectValue placeholder="Adicionar cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCities
                      .filter(city => !selectedCities.some(selected => selected.id === city.id))
                      .map(city => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}, {city.state}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              {favoriteCities.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={addFavoritesToComparison}
                  className="flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar favoritas
                </Button>
              )}

              <div className="ml-auto text-sm text-gray-500">
                {selectedCities.length === 0 ? (
                  <span>Selecione pelo menos 2 cidades para comparar</span>
                ) : (
                  <span>{selectedCities.length} {selectedCities.length === 1 ? 'cidade selecionada' : 'cidades selecionadas'}</span>
                )}
              </div>
            </div>

            {/* Cidades selecionadas */}
            {selectedCities.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {selectedCities.map(city => (
                  <Badge 
                    key={city.id} 
                    className="pl-2 pr-1 py-1 flex items-center gap-1 bg-petroleo/10 text-petroleo hover:bg-petroleo/20"
                  >
                    <span>{city.name}, {city.state}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-5 w-5 p-0 rounded-full hover:bg-petroleo/20"
                      onClick={() => removeCityFromComparison(city.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabela comparativa */}
        {selectedCities.length >= 2 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-petroleo text-white">
                  <th className="p-4 text-left">Critério</th>
                  {selectedCities.map(city => (
                    <th key={city.id} className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-2 bg-white/20">
                          <img
                            src={getCityImageUrl(city.id)}
                            alt={city.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = getDefaultCityImageUrl();
                            }}
                          />
                        </div>
                        <span>{city.name}</span>
                        <span className="text-xs opacity-80">{city.state}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* População */}
                <tr className="border-b">
                  <td className="p-4 bg-gray-50 font-medium">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-petroleo" />
                      População
                    </div>
                  </td>
                  {selectedCities.map(city => (
                    <td key={city.id} className="p-4 text-center">
                      {formatPopulation(city.population)}
                    </td>
                  ))}
                </tr>

                {/* Temperatura */}
                <tr className="border-b">
                  <td className="p-4 bg-gray-50 font-medium">
                    <div className="flex items-center">
                      <span className="mr-2 text-petroleo">🌡️</span>
                      Temperatura Média
                    </div>
                  </td>
                  {selectedCities.map(city => (
                    <td key={city.id} className="p-4 text-center">
                      {city.average_temperature 
                        ? `${city.average_temperature.celsius}°C / ${city.average_temperature.fahrenheit}°F`
                        : 'N/A'
                      }
                    </td>
                  ))}
                </tr>

                {/* Custo de Vida */}
                <tr className="border-b">
                  <td className="p-4 bg-gray-50 font-medium">
                    <div className="flex items-center">
                      <span className="mr-2 text-petroleo">💰</span>
                      Custo de Vida
                    </div>
                  </td>
                  {selectedCities.map(city => (
                    <td key={city.id} className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-petroleo h-2.5 rounded-full" 
                            style={{ width: `${city.cost_of_living_index ? city.cost_of_living_index * 10 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-1 text-sm">
                        {city.cost_of_living_index ? city.cost_of_living_index : 'N/A'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Mercado de Trabalho */}
                <tr className="border-b">
                  <td className="p-4 bg-gray-50 font-medium">
                    <div className="flex items-center">
                      <span className="mr-2 text-petroleo">💼</span>
                      Mercado de Trabalho
                    </div>
                  </td>
                  {selectedCities.map(city => (
                    <td key={city.id} className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-petroleo h-2.5 rounded-full" 
                            style={{ width: `${city.job_market_score ? city.job_market_score * 10 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-1 text-sm">
                        {city.job_market_score ? `${city.job_market_score}/10` : 'N/A'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Educação */}
                <tr className="border-b">
                  <td className="p-4 bg-gray-50 font-medium">
                    <div className="flex items-center">
                      <span className="mr-2 text-petroleo">🎓</span>
                      Educação
                    </div>
                  </td>
                  {selectedCities.map(city => (
                    <td key={city.id} className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-petroleo h-2.5 rounded-full" 
                            style={{ width: `${city.education_score ? city.education_score * 10 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-1 text-sm">
                        {city.education_score ? `${city.education_score}/10` : 'N/A'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Oportunidades de Negócio */}
                <tr className="border-b">
                  <td className="p-4 bg-gray-50 font-medium">
                    <div className="flex items-center">
                      <span className="mr-2 text-petroleo">📈</span>
                      Oportunidades de Negócio
                    </div>
                  </td>
                  {selectedCities.map(city => (
                    <td key={city.id} className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-petroleo h-2.5 rounded-full" 
                            style={{ width: `${city.business_opportunity_score ? city.business_opportunity_score * 10 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-1 text-sm">
                        {city.business_opportunity_score ? `${city.business_opportunity_score}/10` : 'N/A'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Destaques */}
                <tr>
                  <td className="p-4 bg-gray-50 font-medium">
                    <div className="flex items-center">
                      <span className="mr-2 text-petroleo">✨</span>
                      Destaques
                    </div>
                  </td>
                  {selectedCities.map(city => (
                    <td key={city.id} className="p-4 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {city.highlights && city.highlights.length > 0 ? (
                          city.highlights.map((highlight, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {highlight}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">Sem destaques</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg border">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Selecione pelo menos 2 cidades para comparar
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Adicione cidades à comparação para visualizar suas características lado a lado e tomar decisões mais informadas.
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ComparativoCidades;
