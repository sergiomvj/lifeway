import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft,
  User,
  Save,
  Edit,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  DollarSign,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Perfil = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data - em produção, isso viria do banco de dados multistep_forms
  const [profileData, setProfileData] = useState({
    // Dados Pessoais
    nome: 'João Silva',
    email: user?.email || '',
    idade: '32',
    estadoCivil: 'Casado',
    filhos: '2',
    
    // Localização
    cidadeAtual: 'São Paulo, SP',
    paisOrigem: 'Brasil',
    cidadeDesejada: 'Miami, FL',
    
    // Profissional
    profissao: 'Engenheiro de Software',
    experiencia: '8 anos',
    nivelIngles: 'Avançado',
    salarioAtual: 'R$ 15.000',
    salarioDesejado: '$8.000',
    
    // Educação
    escolaridade: 'Superior Completo',
    curso: 'Engenharia da Computação',
    instituicao: 'USP',
    
    // Objetivos
    motivacao: 'Buscar melhores oportunidades profissionais e qualidade de vida para a família',
    prazoMudanca: '2-3 anos',
    investimentoDisponivel: '$50.000',
    
    // Preferências
    tipoVisto: 'EB-2 (Profissional Especializado)',
    prioridadeClimatica: 'Clima quente',
    prioridadeEconomica: 'Custo de vida moderado'
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Em produção, aqui faria a chamada para a API para salvar no banco
      // await updateUserProfile(user.id, profileData);
      
      // Simulando delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Perfil atualizado com sucesso!",
        description: "Suas informações foram salvas e podem ser usadas para gerar novos cenários.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar perfil",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const ProfileSection = ({ 
    title, 
    icon, 
    children 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    children: React.ReactNode; 
  }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );

  const ProfileField = ({ 
    label, 
    field, 
    type = "text",
    placeholder = "" 
  }: { 
    label: string; 
    field: string; 
    type?: string;
    placeholder?: string; 
  }) => (
    <div>
      <Label htmlFor={field} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      {type === "textarea" ? (
        <Textarea
          id={field}
          value={profileData[field as keyof typeof profileData]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          disabled={!isEditing}
          placeholder={placeholder}
          className="mt-1"
          rows={3}
        />
      ) : (
        <Input
          id={field}
          type={type}
          value={profileData[field as keyof typeof profileData]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          disabled={!isEditing}
          placeholder={placeholder}
          className="mt-1"
        />
      )}
    </div>
  );

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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Meu Perfil
              </h1>
              <p className="text-xl text-gray-600">
                Gerencie suas informações pessoais e gere novos cenários
              </p>
            </div>
            
            <div className="flex space-x-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={loading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Salvando...' : 'Salvar'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dados Pessoais */}
        <ProfileSection 
          title="Dados Pessoais" 
          icon={<User className="h-5 w-5 text-blue-600" />}
        >
          <ProfileField label="Nome Completo" field="nome" />
          <ProfileField label="E-mail" field="email" type="email" />
          <ProfileField label="Idade" field="idade" type="number" />
          <ProfileField label="Estado Civil" field="estadoCivil" />
          <ProfileField label="Número de Filhos" field="filhos" type="number" />
        </ProfileSection>

        {/* Localização */}
        <ProfileSection 
          title="Localização" 
          icon={<MapPin className="h-5 w-5 text-green-600" />}
        >
          <ProfileField label="Cidade Atual" field="cidadeAtual" />
          <ProfileField label="País de Origem" field="paisOrigem" />
          <ProfileField label="Cidade Desejada (EUA)" field="cidadeDesejada" />
        </ProfileSection>

        {/* Informações Profissionais */}
        <ProfileSection 
          title="Informações Profissionais" 
          icon={<Briefcase className="h-5 w-5 text-purple-600" />}
        >
          <ProfileField label="Profissão" field="profissao" />
          <ProfileField label="Experiência Profissional" field="experiencia" />
          <ProfileField label="Nível de Inglês" field="nivelIngles" />
          <ProfileField label="Salário Atual" field="salarioAtual" />
          <ProfileField label="Salário Desejado (EUA)" field="salarioDesejado" />
        </ProfileSection>

        {/* Educação */}
        <ProfileSection 
          title="Educação" 
          icon={<GraduationCap className="h-5 w-5 text-indigo-600" />}
        >
          <ProfileField label="Escolaridade" field="escolaridade" />
          <ProfileField label="Curso" field="curso" />
          <ProfileField label="Instituição" field="instituicao" />
        </ProfileSection>

        {/* Objetivos e Motivação */}
        <ProfileSection 
          title="Objetivos e Motivação" 
          icon={<Heart className="h-5 w-5 text-red-600" />}
        >
          <div className="md:col-span-2">
            <ProfileField 
              label="Motivação para Imigrar" 
              field="motivacao" 
              type="textarea"
              placeholder="Descreva suas motivações para se mudar para os EUA..."
            />
          </div>
          <ProfileField label="Prazo para Mudança" field="prazoMudanca" />
          <ProfileField label="Investimento Disponível" field="investimentoDisponivel" />
        </ProfileSection>

        {/* Preferências */}
        <ProfileSection 
          title="Preferências" 
          icon={<Calendar className="h-5 w-5 text-orange-600" />}
        >
          <ProfileField label="Tipo de Visto Preferido" field="tipoVisto" />
          <ProfileField label="Preferência Climática" field="prioridadeClimatica" />
          <ProfileField label="Prioridade Econômica" field="prioridadeEconomica" />
        </ProfileSection>

        {/* Call to Action */}
        <div className="mt-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-blue-900 mb-2">
                  Perfil Atualizado
                </h3>
                <p className="text-blue-700 mb-4">
                  Com suas informações atualizadas, você pode gerar novos cenários 
                  e relatórios mais precisos usando nossas ferramentas.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    Voltar ao Dashboard
                  </Button>
                  <Button onClick={() => navigate('/dreams')}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Gerar Novo Cenário
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Perfil;
