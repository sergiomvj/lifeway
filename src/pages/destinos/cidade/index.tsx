import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Users, Thermometer, DollarSign, Briefcase, 
  GraduationCap, TrendingUp, Star, ArrowLeft, ExternalLink,
  Home, Building, School, Car, Plane, Coffee
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { getCityImageUrl } from '@/utils/imageUtils';

// Tipo para cidade
interface City {
  id: string;
  name: string;
  state: string;
  country: string;
  population: number;
  average_temperature: any;
  cost_of_living_index: number;
  education_score: number;
  job_market_score: number;
  business_opportunity_score: number;
  description: string;
  region: string;
  image_url?: string;
  highlights?: string[];
}

// Componente de carregamento
const LoadingState = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Carregando informações da cidade...</p>
      </div>
    </div>
  </div>
);

// Componente de erro
const ErrorState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-red-500 text-5xl mb-4">
            <span className="sr-only">Erro</span>
            ⚠️
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Cidade não encontrada</h1>
          <p className="text-gray-600 mb-6">Não foi possível encontrar as informações desta cidade.</p>
          <Button onClick={() => navigate('/destinos')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Destinos
          </Button>
        </div>
      </div>
    </div>
  );
};

// Função para buscar cidade por ID
const getCityById = async (id: string): Promise<City | null> => {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    // Log para debug
    console.log('Dados da cidade recebidos:', data);
    
    // Garantir que os campos numéricos sejam tratados corretamente
    if (data) {
      // Converter campos para número se necessário
      if (data.population) data.population = Number(data.population);
      if (data.cost_of_living_index) data.cost_of_living_index = Number(data.cost_of_living_index);
      
      // Garantir que os campos numéricos sejam tratados corretamente
      if (data.education_score) data.education_score = Number(data.education_score);
      if (data.job_market_score) data.job_market_score = Number(data.job_market_score);
      if (data.business_opportunity_score) data.business_opportunity_score = Number(data.business_opportunity_score);
      
      // Log para debug dos campos de índices
      console.log('Valores dos índices:', {
        education: data.education_score,
        job_market: data.job_market_score,
        business: data.business_opportunity_score
      });
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar cidade:', error);
    return null;
  }
};

// Função para buscar cidades relacionadas
const getRelatedCities = async (cityId: string, limit: number = 3): Promise<City[]> => {
  try {
    // Primeiro, obter a região da cidade atual
    const { data: currentCity } = await supabase
      .from('cities')
      .select('region')
      .eq('id', cityId)
      .single();
    
    if (!currentCity) return [];
    
    // Buscar cidades da mesma região, excluindo a cidade atual
    const { data } = await supabase
      .from('cities')
      .select('*')
      .eq('region', currentCity.region)
      .neq('id', cityId)
      .limit(limit);
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar cidades relacionadas:', error);
    return [];
  }
};

// Componente principal
const CityDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [city, setCity] = useState<City | null>(null);
  const [relatedCities, setRelatedCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadCityData() {
      if (!id) {
        setError(true);
        setLoading(false);
        return;
      }
      
      try {
        const cityData = await getCityById(id);
        if (!cityData) {
          setError(true);
          return;
        }
        
        setCity(cityData);
        
        // Carregar cidades relacionadas
        const related = await getRelatedCities(id, 4);
        setRelatedCities(related);
      } catch (err) {
        console.error('Erro ao carregar dados da cidade:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadCityData();
  }, [id]);

  if (loading) return <LoadingState />;
  if (error || !city) return <ErrorState />;

  // Função para formatar a temperatura
  const formatTemperature = (temp: any): string => {
    if (!temp) return "N/A";
    
    try {
      // Se for string JSON, converter para objeto
      const tempObj = typeof temp === 'string' ? JSON.parse(temp) : temp;
      
      // Verificar se temos a propriedade average
      if (tempObj && typeof tempObj.average === 'number') {
        return `${tempObj.average.toFixed(1)}°C`;
      }
      
      // Fallback para outros formatos
      if (typeof tempObj === 'number') {
        return `${tempObj.toFixed(1)}°C`;
      }
      
      // Verificar se é um objeto com outras propriedades
      if (tempObj && typeof tempObj === 'object') {
        // Tentar encontrar alguma propriedade numérica
        const numericValue = Object.values(tempObj).find(val => typeof val === 'number');
        if (numericValue !== undefined) {
          return `${Number(numericValue).toFixed(1)}°C`;
        }
      }
      
      console.log('Formato de temperatura não reconhecido:', temp);
      return "N/A";
    } catch (e) {
      console.error("Erro ao formatar temperatura:", e);
      return "N/A";
    }
  };
  
  // Função para formatar índices numéricos
  const formatIndex = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    
    try {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        return numValue.toFixed(1);
      }
      return "N/A";
    } catch (e) {
      console.error("Erro ao formatar índice:", e);
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div 
        className="relative h-80 bg-cover bg-center" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${getCityImageUrl(city.id)})` 
        }}
      >
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/90 w-fit mb-4"
            onClick={() => navigate('/destinos')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Destinos
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            {city.name}
          </h1>
          
          <div className="flex items-center text-white/90 mb-4">
            <MapPin className="w-5 h-5 mr-1" />
            <span>{city.state}, {city.country}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white/20 text-white border-white/30">
              {city.region}
            </Badge>
            {city.highlights?.map((highlight, index) => (
              <Badge key={index} variant="outline" className="bg-white/20 text-white border-white/30">
                {highlight}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Sobre {city.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">
                  {city.description || `${city.name} é uma cidade localizada em ${city.state}, ${city.country}.`}
                </p>
              </CardContent>
            </Card>
            
            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Users className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="font-medium">População</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    {city.population ? Number(city.population).toLocaleString() : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">habitantes</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Thermometer className="w-5 h-5 text-red-500 mr-2" />
                    <h3 className="font-medium">Temperatura Média</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    {formatTemperature(city.average_temperature)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">anual</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-medium">Custo de Vida</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    {formatIndex(city.cost_of_living_index)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">índice comparativo</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <GraduationCap className="w-6 h-6 mr-2 text-primary" />
                    <h3 className="font-medium">Educação</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    {formatIndex(city.education_score)}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Briefcase className="w-5 h-5 text-amber-600 mr-2" />
                    <h3 className="font-medium">Empregabilidade</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    {formatIndex(city.job_market_score)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">índice de oportunidades</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="w-5 h-5 text-teal-600 mr-2" />
                    <h3 className="font-medium">Negócios</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    {formatIndex(city.business_opportunity_score)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">índice de ambiente empresarial</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Right Column - Related Cities */}
          <div>
            <h2 className="text-xl font-bold mb-4">Cidades Relacionadas</h2>
            <div className="space-y-4">
              {relatedCities.length > 0 ? (
                relatedCities.map((relatedCity) => (
                  <Card 
                    key={relatedCity.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/destinos/cidade/${relatedCity.id}`)}
                  >
                    <div className="flex">
                      <div 
                        className="w-24 h-24 bg-cover bg-center" 
                        style={{ 
                          backgroundImage: `url(${getCityImageUrl(relatedCity.id)})` 
                        }}
                      />
                      <div className="p-4">
                        <h3 className="font-bold">{relatedCity.name}</h3>
                        <p className="text-sm text-gray-600">{relatedCity.state}, {relatedCity.country}</p>
                        <div className="flex items-center mt-2">
                          <Star className="w-4 h-4 text-amber-500 mr-1" />
                          <span className="text-sm">{relatedCity.education_score?.toFixed(1) || 'N/A'} índice educacional</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-gray-500">Nenhuma cidade relacionada encontrada.</p>
              )}
            </div>
            
            <div className="mt-8">
              <Button 
                className="w-full"
                onClick={() => navigate('/destinos')}
              >
                Ver Todos os Destinos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityDetailPage;
