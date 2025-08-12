import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Target, Calendar, CheckCircle, Clock, ArrowRight, Sparkles, Star } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import Navbar from '@/components/Navbar';
import ToolsSection from '@/components/ToolsSection';
import Footer from '@/components/Footer';
import { MultistepForm, FormStep } from '@/components/forms/MultistepForm';
import { PersonalInfoStep, GoalsStep, CurrentSituationStep, SpecificDetailsStep } from '@/components/forms/DreamsFormSteps';
import { CriadorSonhosFormData, MultistepFormData, FormType, FormStatus } from '@/types/forms';
import { dreamsValidationRules } from '@/utils/dreamsValidation';
import { openaiService } from '@/services/openaiService';
import { convertToMultistepForm, convertFromMultistepForm } from '@/lib/formUtils';

// Form steps configuration
const formSteps: FormStep<CriadorSonhosFormData>[] = [
  {
    id: 'personal-info',
    title: 'Informações Pessoais',
    description: 'Conte-nos sobre você',
    fields: ['nome', 'idade', 'profissao', 'experiencia'],
    component: PersonalInfoStep
  },
  {
    id: 'goals',
    title: 'Objetivos',
    description: 'Defina seus sonhos e metas',
    fields: ['objetivo_principal', 'categoria', 'timeline', 'prioridade'],
    component: GoalsStep
  },
  {
    id: 'current-situation',
    title: 'Situação Atual',
    description: 'Entenda seu ponto de partida',
    fields: ['situacao_atual', 'recursos_disponiveis', 'obstaculos'],
    component: CurrentSituationStep
  },
  {
    id: 'specific-details',
    title: 'Detalhes Específicos',
    description: 'Personalize seu plano',
    fields: ['detalhes_especificos', 'motivacao'],
    component: SpecificDetailsStep
  }
];

// Initial form data
const initialFormData: CriadorSonhosFormData = {
  nome: '',
  idade: '',
  profissao: '',
  experiencia: '',
  objetivo_principal: '',
  categoria: 'trabalho',
  timeline: '',
  prioridade: 'media',
  situacao_atual: '',
  recursos_disponiveis: '',
  obstaculos: '',
  detalhes_especificos: '',
  motivacao: ''
};

interface DreamGoal extends Omit<MultistepFormData, 'form_data'> {
  form_data: CriadorSonhosFormData & {
    // Adicionar campos específicos do CriadorSonhosFormData que não estão no form_data base
    nome: string;
    idade: string;
    profissao: string;
    experiencia: string;
    objetivo_principal: string;
    categoria: string;
    timeline: string;
    prioridade: string;
    situacao_atual: string;
    recursos_disponiveis: string;
    obstaculos: string;
    detalhes_especificos: string;
    motivacao: string;
  };
  action_plan?: string;
}

const DreamsPage = () => {
  const [goals, setGoals] = useState<DreamGoal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const { toast } = useToast();
  
  // Obter o ID do usuário autenticado
  const [userId, setUserId] = useState<string | null>(null);
  
  // Efeito para carregar o ID do usuário quando o componente for montado
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    
    getUser();
  }, []);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('multistep_forms')
        .select('*')
        .eq('form_type', 'dream')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Converter os dados para o formato esperado
      const formattedData = data?.map(item => ({
        ...item,
        form_data: item.form_data as CriadorSonhosFormData
      })) || [];
      
      setGoals(formattedData);
    } catch (error) {
      console.error('Erro ao buscar objetivos:', error);
    }
  };

  const handleFormSubmit = async (formData: CriadorSonhosFormData) => {
    if (!userId) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para salvar um sonho.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Converter para o novo formato de formulário
      const newFormData = convertToMultistepForm(formData, 'dream', userId);
      
      const { data, error } = await supabase
        .from('multistep_forms')
        .insert([{
          ...newFormData,
          status: 'draft' as FormStatus,
          user_id: userId,
          form_data: {
            ...newFormData.form_data,
            // Garantir que os campos específicos do sonho estejam presentes
            ...formData
          } as any // Usar 'as any' temporariamente para evitar erros de tipo
        }])
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => [data, ...prev]);
      setShowForm(false);
      
      toast({
        title: "Sonho criado com sucesso!",
        description: "Agora você pode gerar um plano de ação personalizado.",
      });

      // Automatically start generating action plan
      await generateActionPlan(data);
    } catch (error) {
      console.error('Erro ao salvar objetivo:', error);
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente mais tarde.",
      });
    }
  };

  const generateActionPlan = async (goal: DreamGoal) => {
    setIsGeneratingPlan(true);
    
    try {
      // Use enhanced OpenAI service with retry logic and better error handling
      const actionPlan = await openaiService.generateDreamActionPlan(goal.form_data, {
        onRetry: (attempt, error) => {
          console.log(`Tentativa ${attempt} de gerar plano falhou, tentando novamente...`, error.message);
          toast({
            title: `Tentativa ${attempt}`,
            description: "Gerando seu plano personalizado...",
          });
        },
        onSuccess: (response, duration) => {
          console.log(`Plano de ação gerado com sucesso em ${duration}ms`);
        },
        onError: (error, attempts) => {
          console.error(`Falha ao gerar plano após ${attempts} tentativas:`, error.message);
        }
      });

      // Update goal with action plan
      const { error } = await supabase
        .from('multistep_forms')
        .update({ 
          action_plan: actionPlan,
          status: 'completed' as FormStatus,
          completed_at: new Date().toISOString(),
          system_metadata: {
            ...goal.system_metadata,
            last_ai_interaction: new Date().toISOString(),
            data_completeness: 100,
            confidence_score: 100
          }
        })
        .eq('id', goal.id);

      if (error) throw error;

      // Update local state
      setGoals(prev => prev.map(g => 
        g.id === goal.id 
          ? { ...g, action_plan: actionPlan, status: 'completed' }
          : g
      ));

      toast({
        title: "Plano de ação gerado!",
        description: "Seu plano personalizado está pronto.",
      });
    } catch (error) {
      console.error('Erro ao gerar plano:', error);
      toast({
        title: "Erro ao gerar plano",
        description: "Tente novamente mais tarde.",
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const updateGoalStatus = async (goalId: string, newStatus: 'draft' | 'completed') => {
    try {
      const statusUpdate = {
        status: newStatus as FormStatus,
        ...(newStatus === 'completed' ? { completed_at: new Date().toISOString() } : {})
      };
      
      const { error } = await supabase
        .from('multistep_forms')
        .update(statusUpdate)
        .eq('id', goalId);

      if (error) throw error;

      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? { ...goal, status: newStatus } : goal
      ));

      toast({
        title: "Status atualizado",
        description: "O status do seu objetivo foi atualizado.",
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case 'draft':
        return <Badge className="bg-blue-100 text-blue-800">Rascunho</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-6 md:pt-8 mt-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-red-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Criador de Sonhos</h1>
            <Sparkles className="w-8 h-8 text-yellow-500 ml-3" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforme seus sonhos americanos em planos concretos. Nossa IA especializada 
            criará um roteiro personalizado para sua jornada de imigração.
          </p>
        </div>

        {/* Action Button */}
        {!showForm && (
          <div className="text-center mb-8">
            <Button
              onClick={() => setShowForm(true)}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-6 h-6 mr-2" />
              Criar Novo Sonho
            </Button>
          </div>
        )}

        {/* Multistep Form */}
        {showForm && (
          <div className="mb-12">
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
                  <Target className="w-6 h-6 text-blue-600" />
                  Conte-nos sobre seus sonhos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userId ? (
                  <MultistepForm
                    steps={formSteps}
                    initialData={initialFormData as CriadorSonhosFormData}
                    onSubmit={handleFormSubmit}
                    formType="dream"
                    validationRules={dreamsValidationRules}
                    autoSaveConfig={{
                      enabled: true,
                      interval: 30000,
                      storage: 'supabase',
                      key_prefix: 'dreams_form'
                    }}
                    tableName="multistep_forms"
                    userId={userId}
                    title="Criador de Sonhos"
                    description="Vamos criar seu plano personalizado para os EUA"
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Você precisa estar logado para criar um novo sonho.</p>
                    <Button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
                      Entrar com Google
                    </Button>
                  </div>
                )}
                
                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="mr-4"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Goals List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-500" />
            Seus Sonhos
          </h2>

          {goals.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhum sonho criado ainda
                </h3>
                <p className="text-gray-500 mb-6">
                  Comece criando seu primeiro sonho americano e receba um plano personalizado.
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Sonho
                </Button>
              </CardContent>
            </Card>
          ) : (
            goals.map((goal) => (
              <Card key={goal.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      Sonho de {goal.form_data.nome}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(goal.status)}
                      <Badge variant="outline" className="text-sm">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(goal.created_at).toLocaleDateString('pt-BR')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Objetivo Principal:</h4>
                      <p className="text-gray-600">{goal.form_data.objetivo_principal}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Categoria:</h4>
                      <Badge variant="outline" className="capitalize">
                        {goal.form_data.categoria}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Timeline:</h4>
                      <p className="text-gray-600">{goal.form_data.timeline}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Prioridade:</h4>
                      <Badge 
                        variant="outline" 
                        className={`capitalize ${
                          goal.form_data.prioridade === 'alta' ? 'bg-red-50 text-red-700' :
                          goal.form_data.prioridade === 'media' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-green-50 text-green-700'
                        }`}
                      >
                        {goal.form_data.prioridade}
                      </Badge>
                    </div>
                  </div>

                  {goal.action_plan && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Plano de Ação Personalizado
                      </h4>
                      <div className="text-green-700 whitespace-pre-line text-sm">
                        {goal.action_plan}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex gap-2">
                      {goal.status === 'draft' && (
                        <Button
                          onClick={() => updateGoalStatus(goal.id, 'completed')}
                          variant="outline"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Marcar como Concluído
                        </Button>
                      )}
                      {goal.status === 'completed' && (
                        <Button
                          onClick={() => updateGoalStatus(goal.id, 'draft')}
                          variant="outline"
                          size="sm"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Marcar como Rascunho
                        </Button>
                      )}
                    </div>
                    
                    {!goal.action_plan && (
                      <Button
                        onClick={() => generateActionPlan(goal)}
                        disabled={isGeneratingPlan}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isGeneratingPlan ? (
                          <>
                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                            Gerando...
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Gerar Plano de Ação
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <ToolsSection />
      <Footer />
    </div>
  );
};

export default DreamsPage;
