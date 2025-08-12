import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CreateProfile from '@/components/CreateProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const MultistepForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasProfile, isLoading } = useProfile();

  // Se não há usuário logado, redirecionar para login
  if (!user) {
    navigate('/login');
    return null;
  }

  // Se já tem perfil completo, redirecionar para dashboard
  if (hasProfile && !isLoading) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
          
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Seu Perfil
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Para utilizar todas as ferramentas da LifewayUSA, precisamos conhecer melhor 
              seu perfil e objetivos de imigração. Este processo leva apenas alguns minutos.
            </p>
          </div>

          {/* Benefícios */}
          <Card className="bg-blue-50 border-blue-200 mb-8">
            <CardHeader>
              <CardTitle className="text-center text-blue-900">
                Ao completar seu perfil, você terá acesso a:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-900 mb-1">Criador de Sonho</h3>
                  <p className="text-sm text-blue-700">Visualize seu futuro nos EUA</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-900 mb-1">Visamatch</h3>
                  <p className="text-sm text-blue-700">Encontre o visto ideal</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-900 mb-1">Especialista</h3>
                  <p className="text-sm text-blue-700">Consultoria personalizada</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulário Multistep */}
        <div className="bg-white rounded-lg shadow-lg">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-700">Carregando...</p>
              </div>
            </div>
          ) : (
            <CreateProfile />
          )}
        </div>

        {/* Informações Adicionais */}
        <div className="mt-8 text-center">
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🔒 Suas informações estão seguras
              </h3>
              <p className="text-gray-600">
                Todos os dados são criptografados e utilizados apenas para personalizar 
                suas recomendações de imigração. Você pode editar ou excluir suas 
                informações a qualquer momento.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MultistepForm;
