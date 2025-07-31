import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Thermometer, Briefcase, DollarSign, GraduationCap, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface City {
  id: string;
  name: string;
  state: string;
  image_url: string | null;
  average_temperature: any;
  job_market_score: number | null;
  cost_of_living_index: number | null;
  education_score: number | null;
  business_opportunity_score: number | null;
  population: number | null;
  description: string | null;
}

const DestinosPage = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    applySortAndFilter();
  }, [cities, stateFilter, sortBy]);

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('main_destiny', true);

      if (error) throw error;
      setCities(data || []);
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const applySortAndFilter = () => {
    let filtered = [...cities];

    // Filtrar por estado
    if (stateFilter !== "all") {
      filtered = filtered.filter(city => city.state === stateFilter);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "population":
          return (b.population || 0) - (a.population || 0);
        case "job_market":
          return (b.job_market_score || 0) - (a.job_market_score || 0);
        case "cost_of_living":
          return (a.cost_of_living_index || 0) - (b.cost_of_living_index || 0);
        case "education":
          return (b.education_score || 0) - (a.education_score || 0);
        case "business":
          return (b.business_opportunity_score || 0) - (a.business_opportunity_score || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredCities(filtered);
  };

  const getUniqueStates = () => {
    const states = [...new Set(cities.map(city => city.state))];
    return states.sort();
  };

  const formatScore = (score: number | null) => {
    if (!score) return "N/A";
    return (score * 10).toFixed(1);
  };

  const getTemperature = (tempData: any) => {
    if (!tempData) return "N/A";
    if (typeof tempData === 'object' && tempData.average) {
      return `${tempData.average}°F`;
    }
    return "N/A";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cinza-claro to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petroleo mx-auto mb-4"></div>
          <p className="text-petroleo font-figtree">Carregando destinos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cinza-claro to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 text-petroleo hover:text-petroleo/80 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-figtree font-medium">Voltar</span>
            </Link>
            <Button variant="outline" className="font-figtree">
              Ver Todas as Cidades
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-baskerville font-bold text-petroleo mb-4">
            Destinos Mais Procurados
          </h1>
          <p className="text-lg text-gray-600 font-figtree max-w-2xl mx-auto">
            Explore as cidades americanas mais populares entre imigrantes brasileiros
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os estados</SelectItem>
              {getUniqueStates().map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="population">População</SelectItem>
              <SelectItem value="job_market">Empregabilidade</SelectItem>
              <SelectItem value="cost_of_living">Custo de Vida</SelectItem>
              <SelectItem value="education">Educação</SelectItem>
              <SelectItem value="business">Oportunidades de Negócio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredCities.map((city) => (
            <Card key={city.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                {city.image_url ? (
                  <img 
                    src={city.image_url} 
                    alt={city.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-lilas to-secondary rounded-t-lg flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-petroleo" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-petroleo">
                    {city.state}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl font-baskerville text-petroleo">
                  {city.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Temperature */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-figtree text-gray-600">Temperatura</span>
                  </div>
                  <span className="text-sm font-figtree font-medium">
                    {getTemperature(city.average_temperature)}
                  </span>
                </div>

                {/* Job Market */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-figtree text-gray-600">Empregabilidade</span>
                  </div>
                  <Badge variant="secondary">
                    {formatScore(city.job_market_score)}
                  </Badge>
                </div>

                {/* Cost of Living */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-figtree text-gray-600">Custo de Vida</span>
                  </div>
                  <Badge variant="secondary">
                    {formatScore(city.cost_of_living_index)}
                  </Badge>
                </div>

                {/* Education */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-figtree text-gray-600">Educação</span>
                  </div>
                  <Badge variant="secondary">
                    {formatScore(city.education_score)}
                  </Badge>
                </div>

                {/* Business Opportunities */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-figtree text-gray-600">Negócios</span>
                  </div>
                  <Badge variant="secondary">
                    {formatScore(city.business_opportunity_score)}
                  </Badge>
                </div>

                {city.description && (
                  <p className="text-sm text-gray-600 font-figtree mt-4 line-clamp-2">
                    {city.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCities.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 font-figtree text-lg">
              Nenhuma cidade encontrada com os filtros selecionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinosPage;