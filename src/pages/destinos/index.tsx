import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Users, DollarSign, Thermometer, Search, Filter, TrendingUp, GraduationCap, Briefcase, Building2, Heart, BarChart3, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUserContext } from '@/hooks/useUserContext';
import { useFavoriteCities } from '@/contexts';
import { getMainCityImageUrl, getDefaultCityImageUrl } from '@/utils';
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

const DestinosIndex = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [noResultsMessage, setNoResultsMessage] = useState('');
  const navigate = useNavigate();
  const userContext = useUserContext();
  const isAuthenticated = !!userContext.hasContext;
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteCities();
  const { toast } = useToast();

  // Buscar cidades principais do Supabase
  useEffect(() => {
    const fetchMainCities = async () => {
      try {
        setLoading(true);
        console.log('Iniciando busca de cidades principais...');
        
        // Limpar dados anteriores para evitar conflitos
        setCities([]);
        setFilteredCities([]);
        
        // Usar cliente Supabase diretamente para buscar cidades principais
        console.log('URL Supabase:', import.meta.env.VITE_PUBLIC_SUPABASE_URL);
        console.log('Chave anônima definida:', !!import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY);
        
        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .eq('main_destiny', true)
          .order('name');

        if (error) {
          console.error('Erro na consulta Supabase:', error);
          return;
        }

        console.log(`Cidades principais encontradas: ${data?.length || 0}`);
        console.log('Primeira cidade (se existir):', data?.[0]);
        
        // Se não houver dados, tentar busca anônima via API REST como fallback
        if (!data || data.length === 0) {
          console.log('Tentando busca alternativa via API REST...');
          const response = await fetch(
            `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/rest/v1/cities?main_destiny=eq.true&order=name`,
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
            const errorText = await response.text();
            console.error('Detalhes do erro:', errorText);
            return;
          }

          const fallbackData = await response.json();
          console.log(`Cidades principais encontradas (fallback): ${fallbackData?.length || 0}`);
          setCities(fallbackData || []);
          setFilteredCities(fallbackData || []);
        } else {
          setCities(data);
          setFilteredCities(data);
        }
      } catch (error) {
        console.error('Erro na consulta:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMainCities();
  }, [navigate]); // Adicionar navigate como dependência para recarregar quando voltar

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
      setNoResultsMessage(`Nenhuma cidade encontrada com "${searchTerm}". Tente outro termo ou verifique se a cidade está disponível para comparação.`);
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
          <p className="text-petroleo font-medium">Carregando destinos principais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-baskerville font-bold text-petroleo mb-4">
            Destinos Principais
          </h1>
          <p className="text-lg text-gray-600 font-figtree max-w-2xl mx-auto mb-6">
            <span className="hidden md:inline">Descubra as melhores cidades americanas para começar sua nova vida. 
            Explore oportunidades, custos de vida e qualidade de vida.</span>
            <span className="md:hidden">Descubra as melhores cidades americanas</span>
          </p>
          
          {/* Container informativo */}
          <div className="bg-petroleo text-white rounded-lg p-6 max-w-4xl mx-auto shadow-md">
            <p className="text-sm md:text-base leading-relaxed">
              <span className="hidden md:inline">
                Os índices LifeWayUSA de empregabilidade, qualidade de ensino, custo de vida e oportunidades de negócios foram obtidos com o cruzamento de dezenas de relatórios oficiais do governo americano com objetivo de estabelecer um critério justo de comparação entre diferentes cidades, com base num algorítimo exclusivo para oferecer a você essa possibilidade. As médias refletem a situação da cidade frente uma <strong>média nacional igual 1</strong> para atribuir diferenças de abordagem pelas autoridades locais para os parâmetros em questão. Dessa forma índices acima ou abaixo de 1 refletem a situação de cada cidade.
              </span>
              <span className="md:hidden">
                Os índices LifeWayUSA de empregabilidade, qualidade de ensino, custo de vida e oportunidades de negócios foram obtidos com o cruzamento de dezenas de relatórios oficiais do governo americano para dar a você informações para sua escolha.
              </span>
            </p>
          </div>
        </div>

        {/* Filtros */}
        <section className="py-6 bg-white/50 backdrop-blur-sm rounded-lg border mb-8">
          <div className="px-4 md:px-6">
            {/* Layout Mobile - Compacto */}
            <div className="md:hidden space-y-3">
              {/* Linha 1: Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar cidade ou estado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Linha 2: Estado e Ordenação */}
              <div className="grid grid-cols-2 gap-2">
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nome</SelectItem>
                    <SelectItem value="population">População</SelectItem>
                    <SelectItem value="cost">Custo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Linha 3: Botões de Ação */}
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedState('all');
                    setSortBy('name');
                  }}
                  className="text-xs"
                >
                  <Filter className="w-3 h-3 mr-1" />
                  Limpar
                </Button>
                
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => navigate('/destinos/comparativo')}
                  className="bg-blue-600 hover:bg-blue-700 text-xs"
                >
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Comparar
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/cities')}
                  className="border-green-600 text-green-600 hover:bg-green-50 text-xs"
                >
                  <Building2 className="w-3 h-3 mr-1" />
                  Todas
                </Button>
              </div>
            </div>

            {/* Layout Desktop - Uma linha */}
            <div className="hidden md:grid md:grid-cols-12 md:gap-3 md:items-center">
              {/* Busca - Ocupa mais espaço */}
              <div className="relative col-span-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar cidade ou estado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Estado - Compacto */}
              <div className="col-span-2">
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Estados</SelectItem>
                    {uniqueStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ordenação - Compacto */}
              <div className="col-span-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nome</SelectItem>
                    <SelectItem value="population">População</SelectItem>
                    <SelectItem value="cost">Custo de Vida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Botões - Compactos */}
              <div className="col-span-1">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedState('all');
                    setSortBy('name');
                  }}
                  className="w-full text-xs"
                  title="Limpar Filtros"
                >
                  <Filter className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="col-span-1.5">
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => navigate('/destinos/comparativo')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
                >
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Comparar
                </Button>
              </div>
              
              <div className="col-span-1.5">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/cities')}
                  className="w-full border-green-600 text-green-600 hover:bg-green-50 text-xs"
                >
                  <Building2 className="w-3 h-3 mr-1" />
                  Todas
                </Button>
              </div>
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
                  Encontradas <span className="font-semibold text-petroleo">{filteredCities.length}</span> cidades principais
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCities.map((city) => (
                  <Card 
                    key={city.id} 
                    className="group overflow-hidden border border-gray-200 hover:border-petroleo hover:shadow-md transition-all duration-300 h-full flex flex-col cursor-pointer"
                    onClick={() => navigate(`/destinos/cidade/${city.id}`)}
                  >
                    {/* Imagem da Cidade */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getMainCityImageUrl(city.id)}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getDefaultCityImageUrl();
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        {city.region && (
                          <Badge className="bg-white/90 text-petroleo border-0">
                            {city.region}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Botão de Favorito */}
                      <div className="absolute top-4 right-4">
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
                                  className={`h-5 w-5 ${isFavorite(city.id) ? 'fill-red-500 text-red-500' : isAuthenticated ? 'text-gray-600' : 'text-gray-400'}`}
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

                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center justify-between w-full">
                          <CardTitle className="text-xl font-baskerville text-petroleo group-hover:text-lilas transition-colors">
                            {city.name}
                          </CardTitle>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`rounded-full p-1 ${isAuthenticated ? 'hover:bg-gray-100' : 'cursor-not-allowed'}`}
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
                                    className={`h-4 w-4 ${isAuthenticated && isFavorite(city.id) ? 'fill-red-500 text-red-500' : isAuthenticated ? 'text-gray-600' : 'text-gray-400'}`}
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
                        <Badge variant="outline" className="text-xs">
                          {city.state}
                        </Badge>
                      </div>
                      
                      {/* População e Temperatura */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {city.population && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3 text-petroleo" />
                            <span className="text-xs text-gray-600">
                              {formatPopulation(city.population)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-petroleo">🌡️</span>
                          <span className="text-xs text-gray-600">
                            {(() => {
                              // Verificar se average_temperature existe e é uma string (JSONB do Supabase)
                              if (city.average_temperature) {
                                // Se for string, tentar fazer parse
                                if (typeof city.average_temperature === 'string') {
                                  try {
                                    const temp = JSON.parse(city.average_temperature);
                                    return `${temp.celsius || 0}°C / ${temp.fahrenheit || 32}°F`;
                                  } catch (e) {
                                    console.error('Erro ao parsear temperatura:', e);
                                    return '0°C / 32°F';
                                  }
                                }
                                // Se já for objeto, usar diretamente
                                else if (typeof city.average_temperature === 'object') {
                                  return `${city.average_temperature.celsius || 0}°C / ${city.average_temperature.fahrenheit || 32}°F`;
                                }
                              }
                              // Fallback para valores ausentes
                              return '0°C / 32°F';
                            })()}
                          </span>
                        </div>
                      </div>

                      {/* Descrição limitada a 150 caracteres */}
                      {city.description && (
                        <CardDescription className="text-gray-600 leading-relaxed text-sm">
                          {city.description.length > 150 
                            ? `${city.description.substring(0, 150)}...` 
                            : city.description
                          }
                        </CardDescription>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Índices de Avaliação */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {city.cost_of_living_index && (
                          <div className="bg-gray-50 rounded-lg p-2">
                            <div className="flex items-center space-x-1 mb-1">
                              <DollarSign className="w-3 h-3 text-petroleo" />
                              <span className="text-xs font-medium text-gray-700">Custo de Vida</span>
                            </div>
                            <span className="text-sm font-semibold text-petroleo">
                              {city.cost_of_living_index}
                            </span>
                          </div>
                        )}
                        {city.job_market_score && (
                          <div className="bg-gray-50 rounded-lg p-2">
                            <div className="flex items-center space-x-1 mb-1">
                              <Briefcase className="w-3 h-3 text-petroleo" />
                              <span className="text-xs font-medium text-gray-700">Empregabilidade</span>
                            </div>
                            <span className="text-sm font-semibold text-petroleo">
                              {city.job_market_score}
                            </span>
                          </div>
                        )}
                        {city.education_score && (
                          <div className="bg-gray-50 rounded-lg p-2">
                            <div className="flex items-center space-x-1 mb-1">
                              <span className="text-xs text-petroleo">🎓</span>
                              <span className="text-xs font-medium text-gray-700">Ensino</span>
                            </div>
                            <span className="text-sm font-semibold text-petroleo">
                              {city.education_score}
                            </span>
                          </div>
                        )}
                        {city.business_opportunity_score && (
                          <div className="bg-gray-50 rounded-lg p-2">
                            <div className="flex items-center space-x-1 mb-1">
                              <span className="text-xs text-petroleo">💼</span>
                              <span className="text-xs font-medium text-gray-700">Negócios</span>
                            </div>
                            <span className="text-sm font-semibold text-petroleo">
                              {city.business_opportunity_score}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Highlights */}
                      {city.highlights && city.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {city.highlights.slice(0, 3).map((highlight, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Botões */}
                      <div className="grid grid-cols-1 gap-2">
                        {/* Botão Ver Detalhes */}
                        <Button 
                          className="w-full bg-petroleo hover:bg-petroleo/90 text-white group-hover:bg-lilas transition-all"
                          onClick={() => navigate(`/destinos/cidade/${city.id}`)}
                        >
                          Ver Detalhes
                        </Button>
                        
                        {/* Botão Comparar (maior e azul) */}
                        <Button 
                          variant="default"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/destinos/comparativo');
                          }}
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Comparar Cidades
                        </Button>
                        
                        {/* Botão Favoritar */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              className={`w-full ${isFavorite(city.id) ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 hover:bg-gray-400'} text-white transition-all`}
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
                              {isFavorite(city.id) ? (
                                <>
                                  <Heart className="w-4 h-4 mr-2 fill-white" />
                                  Favorito
                                </>
                              ) : (
                                <>
                                  <Heart className="w-4 h-4 mr-2" />
                                  Favoritar
                                </>
                              )}
                            </Button>
                          </TooltipTrigger>
                          {!isAuthenticated && (
                            <TooltipContent side="top">
                              <p>Crie o seu perfil antes</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </div>
                      
                      {/* Link para recursos extras */}
                      {!isAuthenticated && (
                        <div className="mt-2 text-center">
                          <Link 
                              to="/login#top" 
                              className="text-xs text-petroleo hover:text-lilas hover:underline transition-all"
                          >
                            Acesse recursos extras
                          </Link>
                        </div>
                      )}
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

export default DestinosIndex;