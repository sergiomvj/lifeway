import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Users, DollarSign, Briefcase, Search, Filter, Star, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface City {
  id: string;
  name: string;
  state: string;
  region?: string;
  population?: number;
  cost_of_living_index?: number;
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
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  // Buscar cidades principais do Supabase
  useEffect(() => {
    const fetchMainCities = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .eq('main_destiny', true)
          .order('name');

        if (error) {
          console.error('Erro ao buscar cidades:', error);
          return;
        }

        setCities(data || []);
        setFilteredCities(data || []);
      } catch (error) {
        console.error('Erro na consulta:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMainCities();
  }, []);

  // Filtrar e ordenar cidades
  useEffect(() => {
    let filtered = cities.filter(city => {
      const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           city.state.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesState = selectedState === 'all' || city.state === selectedState;
      const matchesRegion = selectedRegion === 'all' || city.region === selectedRegion;
      
      return matchesSearch && matchesState && matchesRegion;
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

    setFilteredCities(filtered);
  }, [cities, searchTerm, selectedState, selectedRegion, sortBy]);

  // Obter estados únicos
  const uniqueStates = Array.from(new Set(cities.map(city => city.state))).sort();
  const uniqueRegions = Array.from(new Set(cities.map(city => city.region).filter(Boolean))).sort();

  // Função para obter URL da imagem da cidade
  const getCityImageUrl = (cityId: string) => {
    return `/storage/images/maincities/${cityId}.jpg`;
  };

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
    <div className="min-h-screen bg-gradient-to-b from-white to-cinza-claro">
      {/* Header */}
      <section className="py-20 bg-gradient-to-r from-petroleo to-petroleo/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-baskerville font-bold mb-6">
            Destinos Principais
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto font-figtree">
            Descubra as melhores cidades americanas para começar sua nova vida. 
            Explore oportunidades, custos de vida e qualidade de vida.
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                <SelectValue placeholder="Todos os Estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Estados</SelectItem>
                {uniqueStates.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro por Região */}
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as Regiões" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Regiões</SelectItem>
                {uniqueRegions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
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
                setSelectedRegion('all');
                setSortBy('name');
              }}
              className="w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              Limpar Filtros
            </Button>
          </div>
        </div>
      </section>

      {/* Lista de Cidades */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredCities.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhuma cidade encontrada
              </h3>
              <p className="text-gray-500">
                Tente ajustar seus filtros para encontrar mais resultados.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <p className="text-gray-600">
                  Encontradas <span className="font-semibold text-petroleo">{filteredCities.length}</span> cidades principais
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCities.map((city) => (
                  <Card key={city.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                    {/* Imagem da Cidade */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getCityImageUrl(city.id)}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/storage/images/cities/default-city.jpg';
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
                    </div>

                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-baskerville text-petroleo group-hover:text-lilas transition-colors">
                          {city.name}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {city.state}
                        </Badge>
                      </div>
                      {city.description && (
                        <CardDescription className="text-gray-600 leading-relaxed">
                          {city.description}
                        </CardDescription>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Estatísticas */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {city.population && (
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-petroleo" />
                            <span className="text-sm text-gray-600">
                              {formatPopulation(city.population)}
                            </span>
                          </div>
                        )}
                        {city.cost_of_living_index && (
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-petroleo" />
                            <span className="text-sm text-gray-600">
                              Índice: {city.cost_of_living_index}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Oportunidades de Trabalho */}
                      {city.job_opportunities && (
                        <div className="flex items-center space-x-2 mb-4">
                          <Briefcase className="w-4 h-4 text-petroleo" />
                          <span className="text-sm text-gray-600">
                            {city.job_opportunities}
                          </span>
                        </div>
                      )}

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

                      {/* Botão Ver Detalhes */}
                      <Button 
                        className="w-full bg-petroleo hover:bg-petroleo/90 text-white group-hover:bg-lilas transition-all"
                        onClick={() => {
                          // Implementar navegação para detalhes da cidade
                          console.log(`Ver detalhes de ${city.name}`);
                        }}
                      >
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default DestinosIndex;