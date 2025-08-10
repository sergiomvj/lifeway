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
import { CriadorSonhosFormData } from '@/types/forms';
import { dreamsValidationRules } from '@/utils/dreamsValidation';
import { openaiService } from '@/services/openaiService';

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

interface DreamGoal {
  id: string;
  form_data: CriadorSonhosFormData;
  action_plan?: string;
  status: 'draft' | 'completed';
  created_at: string;
}

const DreamsPage = () => {
  const [goals, setGoals] = useState<DreamGoal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('dream_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Erro ao buscar objetivos:', error);
    }
  };

  const handleFormSubmit = async (formData: CriadorSonhosFormData) => {
    try {
      const { data, error } = await supabase
        .from('dream_goals')
        .insert([{
          form_data: formData,
          status: 'draft'
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
        .from('dream_goals')
        .update({ 
          action_plan: actionPlan,
          status: 'completed'
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
      const { error } = await supabase
        .from('dream_goals')
        .update({ status: newStatus })
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
                <MultistepForm
                  steps={formSteps}
                  initialData={initialFormData}
                  onSubmit={handleFormSubmit}
                  validationRules={dreamsValidationRules}
                  autoSaveConfig={{
                    enabled: true,
                    interval: 30000,
                    storage: 'localStorage',
                    key_prefix: 'dreams_form'
                  }}
                  tableName="dream_goals"
                  title="Criador de Sonhos"
                  description="Vamos criar seu plano personalizado para os EUA"
                />
                
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
