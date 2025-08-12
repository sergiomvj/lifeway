import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Stars, 
  Compass, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Construction,
  MapPin,
  Clock,
  Settings,
  TrendingUp,
  Target,
  Calendar,
  Heart,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useFavoriteCities } from '@/contexts';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { hasProfile: hasCompletedProfile, isLoading: profileLoading } = useProfile();
  const { favoriteCities, isLoading: favoritesLoading } = useFavoriteCities();

  // Mock data para ferramentas - em produção, isso viria do banco de dados
  const toolsUsed = []; // Ferramentas já utilizadas
  const lastUpdate = new Date().toLocaleDateString('pt-BR');

  const handleProfileClick = () => {
    if (!hasCompletedProfile) {
      // Se perfil não está completo, vai para o MultistepForm (cadastro completo)
      navigate('/multistep-form');
    } else {
      // Se perfil está completo, vai para Timeline das Ferramentas
      navigate('/timeline-ferramentas');
    }
  };

  const handleToolClick = (toolPath: string) => {
    if (!hasCompletedProfile) {
      // Redireciona para o MultistepForm se o perfil não estiver completo
      navigate('/multistep-form');
    } else {
      // Se o perfil estiver completo, vai direto para a ferramenta
      navigate(toolPath);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Seção: Seu Caminho LifewayUSA */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Seu Caminho LifewayUSA
            </h1>
            <p className="text-xl text-gray-600">
              Passo a passo para você simular sua experiência de viver nos EUA
            </p>
          </div>

          {/* Duas caixas principais */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Caixa 1 - Construa seu perfil */}
            <Card className="bg-petroleo border-0 text-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <User className="h-8 w-8 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold">
                      Construa seu perfil pessoal com maior número de detalhes possível
                    </h3>
                  </div>
                </div>
                <Button 
                  onClick={handleProfileClick}
                  className="bg-black text-white hover:bg-gray-800 w-full md:w-auto"
                >
                  Seu Progresso
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Caixa 2 - Ferramentas */}
            <Card className="bg-teal-600 border-0 text-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Target className="h-8 w-8 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold">
                      Clique nas ferramentas abaixo para gerar o relatório baseado no seu perfil
                    </h3>
                  </div>
                </div>
                <div className="flex items-center text-white/90">
                  <Sparkles className="h-5 w-5 mr-2" />
                  <span>Ferramentas personalizadas disponíveis</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Cards das Ferramentas */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Ferramentas Disponíveis
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Criador de Sonho */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleToolClick('/dreams')}>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Criador de Sonho</CardTitle>
                <CardDescription>
                  Visualize seu futuro nos EUA
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Visamatch */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleToolClick('/visamatch')}>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Compass className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">Visamatch</CardTitle>
                <CardDescription>
                  Encontre o visto ideal para você
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Especialista */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleToolClick('/especialista')}>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Stars className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg">LIA - LifeWay Intelligent Assistant</CardTitle>
                <CardDescription>
                  Consultoria personalizada
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Em Desenvolvimento */}
            <Card className="hover:shadow-lg transition-shadow opacity-75">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Construction className="h-8 w-8 text-gray-600" />
                </div>
                <CardTitle className="text-lg">Em Desenvolvimento</CardTitle>
                <CardDescription>
                  Novas ferramentas em breve
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Seções Inferiores */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Acessar o seu perfil */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Settings className="h-6 w-6 text-blue-600 mr-2" />
                <CardTitle className="text-lg">Acessar o seu perfil</CardTitle>
              </div>
              <CardDescription>
                Altere ou adicione informações ao seu perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/perfil')}
                variant="outline" 
                className="w-full"
              >
                Gerenciar Perfil
                <User className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Timeline das Ferramentas */}
          <Card>
            <CardHeader>
              <div className="flex items-center mb-2">
                <Clock className="h-6 w-6 text-green-600 mr-2" />
                <CardTitle className="text-lg">Timeline das Ferramentas</CardTitle>
              </div>
              <CardDescription>
                Acompanhe seu progresso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Criador de Sonho</span>
                  <CheckCircle className="h-4 w-4 text-gray-300" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Visamatch</span>
                  <CheckCircle className="h-4 w-4 text-gray-300" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Especialista</span>
                  <CheckCircle className="h-4 w-4 text-gray-300" />
                </div>
                <div className="text-xs text-gray-500 mt-4">
                  Última atualização: {lastUpdate}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Novos Passos */}
          <Card>
            <CardHeader>
              <div className="flex items-center mb-2">
                <TrendingUp className="h-6 w-6 text-purple-600 mr-2" />
                <CardTitle className="text-lg">Novos Passos</CardTitle>
              </div>
              <CardDescription>
                Sugestões do que fazer a seguir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {!hasCompletedProfile ? (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium">
                      Complete seu perfil primeiro
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Preencha todas as informações para ter acesso completo às ferramentas
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm">Agende uma consultoria</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">Explore destinos</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cidades Favoritas */}
          <Card>
            <CardHeader>
              <div className="flex items-center mb-2">
                <Heart className="h-6 w-6 text-red-500 mr-2" />
                <CardTitle className="text-lg">Cidades Favoritas</CardTitle>
              </div>
              <CardDescription>
                Suas cidades de interesse nos EUA
              </CardDescription>
            </CardHeader>
            <CardContent>
              {favoritesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-petroleo"></div>
                  <span className="ml-2 text-sm text-gray-600">Carregando...</span>
                </div>
              ) : favoriteCities.length > 0 ? (
                <div className="space-y-3">
                  {favoriteCities.slice(0, 3).map((favorite) => (
                    <div 
                      key={favorite.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/destinos/cidade/${favorite.city_id}`)}
                    >
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-petroleo mr-2" />
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {favorite.city_name}
                          </span>
                          {favorite.city_state && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {favorite.city_state}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                  
                  {favoriteCities.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/destinos')}
                      className="w-full mt-2 text-petroleo hover:text-lilas"
                    >
                      Ver todas as {favoriteCities.length} cidades favoritas
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/destinos')}
                    className="w-full mt-2"
                  >
                    Explorar mais destinos
                    <Compass className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-3">
                    Você ainda não favoritou nenhuma cidade
                  </p>
                  <Button
                    onClick={() => navigate('/destinos')}
                    className="bg-petroleo hover:bg-lilas text-white"
                  >
                    Descobrir destinos
                    <Compass className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
