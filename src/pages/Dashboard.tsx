import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserContextManager from '@/components/UserContextManager';
import FavoriteCitiesSection from '@/components/FavoriteCitiesSection';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  BarChart3, 
  User, 
  Stars, 
  Compass, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Construction,
  MapPin
} from 'lucide-react';
import { useUserContext } from '@/hooks/useUserContext';

const Dashboard = () => {
  const {
    context,
    hasContext,
    isLoading,
    completenessScore
  } = useUserContext();

  // Verificar se o perfil está completo (nome preenchido como indicador básico)
  const hasCompletedProfile = context?.profile?.name && context.profile.name.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Acompanhe seu progresso na jornada de imigração para os EUA
              </p>
            </div>
          </div>
        </div>

        {/* Informações sobre o Dashboard */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Bem-vindo ao seu Dashboard:</strong> Aqui você encontra todas as ferramentas 
            disponíveis para planejar sua jornada de imigração. Explore as opções abaixo para começar.
          </AlertDescription>
        </Alert>

        {/* Cards principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card de Perfil */}
          <Card className="overflow-hidden border-t-4 border-t-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Seu Perfil
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-gray-500">Carregando informações...</p>
              ) : hasCompletedProfile ? (
                <div className="space-y-3">
                  <p className="text-sm">Olá, <span className="font-semibold">{context?.profile.name}</span>!</p>
                  <p className="text-sm text-gray-600">Seu perfil está {completenessScore}% completo.</p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">Clique aqui e crie o seu perfil para usar ferramentas gratuitas</p>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              {hasCompletedProfile ? (
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/profile">
                    Ver Detalhes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <Link to="/profile">
                    Criar Perfil
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Card do Criador de Sonhos */}
          <Card className="overflow-hidden border-t-4 border-t-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Stars className="h-5 w-5 text-purple-500" />
                Criador de Sonhos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Defina seus objetivos e crie um plano personalizado para realizar seu sonho americano.
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/dreams">
                  Acessar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Card do VisaMatch */}
          <Card className="overflow-hidden border-t-4 border-t-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-green-500" />
                VisaMatch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Descubra qual visto americano é mais adequado para o seu perfil e objetivos.
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/visamatch">
                  Acessar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Card de Ferramentas em Desenvolvimento */}
          <Card className="overflow-hidden border-t-4 border-t-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Construction className="h-5 w-5 text-amber-500" />
                Em Desenvolvimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Novas ferramentas estão sendo desenvolvidas para melhorar sua experiência.
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="w-full bg-gray-100 rounded-md p-2 text-center text-sm text-gray-500">
                Em breve
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Seção de cidades favoritas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-500" />
            Seus Destinos
          </h2>
          
          <FavoriteCitiesSection />
        </div>

        {/* Informações Adicionais */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recursos Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Chat com Especialista</p>
                  <p className="text-sm text-gray-600">Tire suas dúvidas com nosso especialista em imigração</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Análise de Perfil</p>
                  <p className="text-sm text-gray-600">Avaliação personalizada das suas chances de imigração</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Plano de Ação</p>
                  <p className="text-sm text-gray-600">Passos concretos para alcançar seus objetivos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Para aproveitar ao máximo a plataforma, recomendamos seguir estes passos:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-bold">1</span>
                  </div>
                  <p className="text-sm">Complete seu perfil com todas as informações</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-bold">2</span>
                  </div>
                  <p className="text-sm">Use o VisaMatch para identificar o visto ideal</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-bold">3</span>
                  </div>
                  <p className="text-sm">Crie seu plano de ação com o Criador de Sonhos</p>
                </div>
              </div>
              <Button asChild className="w-full mt-2">
                <Link to="/especialista">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Falar com Especialista
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
