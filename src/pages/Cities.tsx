import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Users, DollarSign, Thermometer, Search, Filter, TrendingUp, GraduationCap, Briefcase, Building2, Heart, BarChart3, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUserContext } from '@/hooks/useUserContext';
import { useFavoriteCities } from '@/contexts';
import { getCityImageUrl, getDefaultCityImageUrl } from '@/utils';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

const Cities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [noResultsMessage, setNoResultsMessage] = useState('');
  const [totalCities, setTotalCities] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();
  const userContext = useUserContext();
  const isAuthenticated = !!userContext.hasContext;
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteCities();
  const { toast } = useToast();

  // Buscar todas as cidades do Supabase com paginação
  useEffect(() => {
    const fetchAllCities = async () => {
      try {
        setLoading(true);
        console.log('Iniciando busca de todas as cidades...');
        
        // Primeiro, obter o total de cidades
        const { count, error: countError } = await supabase
          .from('cities')
          .select('*', { count: 'exact', head: true });

        if (countError) {
          console.error('Erro ao contar cidades:', countError);
        } else {
          setTotalCities(count || 0);
          console.log(`Total de cidades no banco: ${count}`);
        }

        // Buscar todas as cidades em lotes de 1000
        let allCities: City[] = [];
        let offset = 0;
        const limit = 1000;
        let hasMore = true;

        while (hasMore) {
          console.log(`Buscando cidades ${offset + 1} a ${offset + limit}...`);
          
          const { data, error } = await supabase
            .from('cities')
            .select('*')
            .order('name')
            .range(offset, offset + limit - 1);

          if (error) {
            console.error('Erro na consulta Supabase:', error);
            break;
          }

          if (data && data.length > 0) {
            allCities = [...allCities, ...data];
            console.log(`Carregadas ${data.length} cidades. Total acumulado: ${allCities.length}`);
            
            // Se retornou menos que o limite, não há mais dados
            if (data.length < limit) {
              hasMore = false;
            } else {
              offset += limit;
            }
          } else {
            hasMore = false;
          }
        }

        console.log(`Total final de cidades carregadas: ${allCities.length}`);
        setCities(allCities);
        setFilteredCities(allCities);
        
        // Se não conseguiu carregar nenhuma cidade, tentar fallback
        if (allCities.length === 0) {
          console.log('Tentando busca alternativa via API REST...');
          const response = await fetch(
            `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/rest/v1/cities?order=name`,
            {
              method: 'GET',
              headers: {
                'apikey': import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY,
                'Content-Type': 'application/json',
                'Prefer': 'count=exact'
              }
            }
          );

          if (!response.ok) {
            console.error('Erro na resposta da API:', response.status, response.statusText);
            return;
          }

          const fallbackData = await response.json();
          console.log(`Cidades encontradas (fallback): ${fallbackData?.length || 0}`);
          setCities(fallbackData || []);
          setFilteredCities(fallbackData || []);
          setTotalCities(fallbackData?.length || 0);
        }
      } catch (error) {
        console.error('Erro na consulta:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCities();
  }, []);

  // Filtrar e ordenar cidades
  useEffect(() => {
    let filtered = cities.filter(city => {
      const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         city.state.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesState = selectedState === 'all' || city.state === selectedState;
      
      return matchesSearch && matchesState;
    });

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'population':
          return (b.population || 0) - (a.population || 0);
        case 'cost':
          return (a.cost_of_living_index || 0) - (b.cost_of_living_index || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    // Definir mensagem para busca sem resultados
    if (filtered.length === 0 && searchTerm) {
      setNoResultsMessage(`Nenhuma cidade encontrada com "${searchTerm}". Tente outro termo de busca.`);
    } else {
      setNoResultsMessage('');
    }

    setFilteredCities(filtered);
  }, [cities, searchTerm, selectedState, sortBy]);

  // Obter estados únicos
  const uniqueStates = Array.from(new Set(cities.map(city => city.state))).sort();

  // Função para formatar população
  const formatPopulation = (population: number) => {
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
          <p className="text-petroleo font-medium">Carregando todas as cidades americanas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Header com botão voltar */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/destinos')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Destinos Principais
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-baskerville font-bold text-petroleo mb-4">
              {totalCities > 0 ? totalCities.toLocaleString() : cities.length.toLocaleString()} Cidades Americanas
            </h1>
            <p className="text-lg text-gray-600 font-figtree max-w-2xl mx-auto mb-6">
              <span className="hidden md:inline">Tudo organizado e com informações completas. 
              Explore todas as cidades dos Estados Unidos com dados detalhados.</span>
              <span className="md:hidden">Tudo organizado e com informações completas</span>
            </p>
            {loading && (
              <p className="text-sm text-gray-500">
                Carregando todas as cidades... Isso pode levar alguns segundos.
              </p>
            )}
          </div>
        </div>

        {/* Filtros */}
        <section className="py-8 bg-white/50 backdrop-blur-sm rounded-lg border mb-8">
          <div className="px-6">
          <div className="flex flex-wrap gap-2 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar cidade ou estado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro por Estado */}
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Estados" className="md:hidden" />
                <SelectValue placeholder="Todos os Estados" className="hidden md:block" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Estados</SelectItem>
                {uniqueStates.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Ordenação */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="population">População</SelectItem>
                <SelectItem value="cost">Custo de Vida</SelectItem>
              </SelectContent>
            </Select>

            {/* Botão Limpar Filtros */}
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedState('all');
                setSortBy('name');
              }}
              className="w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Limpar Filtros</span>
              <span className="md:hidden">Limpar</span>
            </Button>
          </div>
          </div>
        </section>

        {/* Lista de Cidades */}
        <div className="max-w-7xl mx-auto">
          {filteredCities.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhuma cidade encontrada
              </h3>
              {noResultsMessage ? (
                <Alert className="max-w-lg mx-auto mt-4 bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">Busca sem resultados</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    {noResultsMessage}
                  </AlertDescription>
                </Alert>
              ) : (
                <p className="text-gray-500">
                  Tente ajustar seus filtros para encontrar mais resultados.
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="text-center mb-8 hidden md:block">
                <p className="text-gray-600">
                  Mostrando <span className="font-semibold text-petroleo">{filteredCities.length.toLocaleString()}</span> de <span className="font-semibold text-petroleo">{cities.length.toLocaleString()}</span> cidades
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCities.map((city) => (
                  <Card 
                    key={city.id} 
                    className="group overflow-hidden border border-gray-200 hover:border-petroleo hover:shadow-md transition-all duration-300 h-full flex flex-col cursor-pointer"
                    onClick={() => navigate(`/destinos/cidade/${city.id}`)}
                  >
                    {/* Imagem da Cidade */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={getCityImageUrl(city.id)}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getDefaultCityImageUrl();
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute bottom-2 left-2">
                        {city.main_destiny && (
                          <Badge className="bg-green-600 text-white border-0 text-xs">
                            Principal
                          </Badge>
                        )}
                      </div>
                      
                      {/* Botão de Favorito */}
                      <div className="absolute top-2 right-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`rounded-full p-1 ${isAuthenticated ? 'bg-white/80 hover:bg-white/90' : 'bg-white/50 cursor-not-allowed'}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isAuthenticated) {
                                    if (isFavorite(city.id)) {
                                      removeFavorite(city.id);
                                    } else {
                                      addFavorite(city.id, city.name, city.state);
                                    }
                                  } else {
                                    toast({
                                      title: "Login necessário",
                                      description: "Crie uma conta ou faça login para adicionar cidades aos favoritos.",
                                      variant: "default"
                                    });
                                  }
                                }}
                                disabled={!isAuthenticated}
                              >
                                <Heart
                                  className={`h-4 w-4 ${isFavorite(city.id) ? 'fill-red-500 text-red-500' : isAuthenticated ? 'text-gray-600' : 'text-gray-400'}`}
                                />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              {isAuthenticated
                                ? (isFavorite(city.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos')
                                : 'Crie seu perfil para desbloquear'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    <CardHeader className="pb-2 flex-1">
                      <CardTitle className="text-lg font-baskerville text-petroleo group-hover:text-lilas transition-colors">
                        {city.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {city.state}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0 pb-4">
                      {/* Informações básicas */}
                      <div className="space-y-2 text-sm">
                        {city.population && (
                          <div className="flex items-center text-gray-600">
                            <Users className="w-3 h-3 mr-1" />
                            <span>{formatPopulation(city.population)}</span>
                          </div>
                        )}
                        
                        {city.cost_of_living_index && (
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="w-3 h-3 mr-1" />
                            <span>Custo: {city.cost_of_living_index.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cities;
