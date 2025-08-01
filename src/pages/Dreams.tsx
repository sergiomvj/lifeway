import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Plus, Target, Calendar, CheckCircle, Clock, ArrowRight, Sparkles, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from '@/components/Navbar';
import ToolsSection from '@/components/ToolsSection';
import Footer from '@/components/Footer';

// MultiStepForm data interface
interface FormStep {
  step: number;
  title: string;
  description: string;
}

interface MultiStepFormData {
  // Passo 1: Informações pessoais
  nome: string;
  idade: string;
  profissao: string;
  experiencia: string;
  
  // Passo 2: Objetivos
  objetivo_principal: string;
  categoria: string;
  timeline: string;
  prioridade: 'baixa' | 'media' | 'alta';
  
  // Passo 3: Situação atual
  situacao_atual: string;
  recursos_disponiveis: string;
  obstaculos: string;
  
  // Passo 4: Detalhes específicos
  detalhes_especificos: string;
  motivacao: string;
}

interface DreamGoal {
  id: string;
  form_data: MultiStepFormData;
  action_plan?: string;
  status: 'planejando' | 'em_progresso' | 'concluido';
  created_at: string;
}

const DreamsPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [goals, setGoals] = useState<DreamGoal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<MultiStepFormData>({
    nome: '',
    idade: '',
    profissao: '',
    experiencia: '',
    objetivo_principal: '',
    categoria: '',
    timeline: '',
    prioridade: 'media',
    situacao_atual: '',
    recursos_disponiveis: '',
    obstaculos: '',
    detalhes_especificos: '',
    motivacao: ''
  });

  const steps: FormStep[] = [
    {
      step: 1,
      title: "Informações Pessoais",
      description: "Conte-nos sobre você"
    },
    {
      step: 2,
      title: "Seus Objetivos",
      description: "Qual é o seu sonho americano?"
    },
    {
      step: 3,
      title: "Situação Atual",
      description: "Onde você está agora?"
    },
    {
      step: 4,
      title: "Detalhes Finais",
      description: "Vamos finalizar seu perfil"
    }
  ];

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

  const handleInputChange = (field: keyof MultiStepFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('dream_goals')
        .insert([{
          form_data: formData,
          status: 'planejando'
        }])
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => [data, ...prev]);
      setFormData({
        nome: '',
        idade: '',
        profissao: '',
        experiencia: '',
        objetivo_principal: '',
        categoria: '',
        timeline: '',
        prioridade: 'media',
        situacao_atual: '',
        recursos_disponiveis: '',
        obstaculos: '',
        detalhes_especificos: '',
        motivacao: ''
      });
      setCurrentStep(1);
      setShowForm(false);
      
      toast({
        title: "Sonho criado com sucesso!",
        description: "Agora você pode gerar um plano de ação personalizado.",
      });
    } catch (error) {
      console.error('Erro ao salvar objetivo:', error);
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente mais tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateActionPlan = async (goal: DreamGoal) => {
    setGeneratingPlan(true);
    
    try {
      // Criar prompt baseado nos dados do MultiStepForm
      const prompt = `
        Crie um plano de ação detalhado para ajudar ${goal.form_data.nome} a alcançar seu objetivo de imigração para os EUA.
        
        Perfil:
        - Nome: ${goal.form_data.nome}
        - Idade: ${goal.form_data.idade}
        - Profissão: ${goal.form_data.profissao}
        - Experiência: ${goal.form_data.experiencia}
        
        Objetivo:
        - Objetivo principal: ${goal.form_data.objetivo_principal}
        - Categoria: ${goal.form_data.categoria}
        - Timeline: ${goal.form_data.timeline}
        - Prioridade: ${goal.form_data.prioridade}
        
        Situação atual:
        - ${goal.form_data.situacao_atual}
        - Recursos disponíveis: ${goal.form_data.recursos_disponiveis}
        - Obstáculos: ${goal.form_data.obstaculos}
        
        Detalhes:
        - ${goal.form_data.detalhes_especificos}
        - Motivação: ${goal.form_data.motivacao}
        
        Crie um plano de ação em etapas numeradas, específico e prático.
      `;
      
      // Aqui você integraria com OpenAI - por agora vou simular
      const actionPlan = `Plano de Ação Personalizado para ${goal.form_data.nome}:

1. PREPARAÇÃO INICIAL (Mês 1-2)
   - Avaliar perfil profissional atual
   - Pesquisar oportunidades na área de ${goal.form_data.profissao}
   - Iniciar curso de inglês se necessário

2. DOCUMENTAÇÃO (Mês 2-4)
   - Reunir documentos pessoais e profissionais
   - Traduzir e apostilar documentos
   - Preparar portfólio profissional

3. ESTRATÉGIA DE VISTO (Mês 3-6)
   - Identificar tipo de visto mais adequado
   - Preparar aplicação específica
   - Buscar sponsor ou oportunidades de trabalho

4. PREPARAÇÃO FINANCEIRA (Mês 1-12)
   - Calcular custos totais do processo
   - Criar plano de poupança
   - Pesquisar opções de financiamento

5. NETWORKING E OPORTUNIDADES (Mês 4-12)
   - Conectar com profissionais da área nos EUA
   - Participar de eventos e conferências online
   - Aplicar para vagas ou programas específicos

Próximos passos imediatos:
- ${goal.form_data.prioridade === 'alta' ? 'Iniciar imediatamente com preparação de documentos' : 'Focar primeiro no aperfeiçoamento profissional'}
- Considerar recursos disponíveis: ${goal.form_data.recursos_disponiveis}`;
      
      const { error } = await supabase
        .from('dream_goals')
        .update({ action_plan: actionPlan })
        .eq('id', goal.id);

      if (error) throw error;

      setGoals(prev => prev.map(g => 
        g.id === goal.id ? { ...g, action_plan: actionPlan } : g
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
      setGeneratingPlan(false);
    }
  };

  const updateGoalStatus = async (goalId: string, newStatus: DreamGoal['status']) => {
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
        title: "Status atualizado!",
        description: `Objetivo marcado como ${newStatus.replace('_', ' ')}.`,
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'em_progresso': return 'bg-blue-100 text-blue-800';
      case 'planejando': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>
            <div>
              <Label htmlFor="idade">Idade *</Label>
              <Input
                id="idade"
                value={formData.idade}
                onChange={(e) => handleInputChange('idade', e.target.value)}
                placeholder="Sua idade"
                required
              />
            </div>
            <div>
              <Label htmlFor="profissao">Profissão atual *</Label>
              <Input
                id="profissao"
                value={formData.profissao}
                onChange={(e) => handleInputChange('profissao', e.target.value)}
                placeholder="Sua profissão atual"
                required
              />
            </div>
            <div>
              <Label htmlFor="experiencia">Anos de experiência *</Label>
              <Input
                id="experiencia"
                value={formData.experiencia}
                onChange={(e) => handleInputChange('experiencia', e.target.value)}
                placeholder="Quantos anos de experiência você tem?"
                required
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="objetivo_principal">Qual é seu objetivo principal? *</Label>
              <Textarea
                id="objetivo_principal"
                value={formData.objetivo_principal}
                onChange={(e) => handleInputChange('objetivo_principal', e.target.value)}
                placeholder="Descreva seu sonho americano..."
                rows={3}
                required
              />
            </div>
            <div>
              <Label htmlFor="categoria">Categoria *</Label>
              <Select value={formData.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trabalho">Trabalho</SelectItem>
                  <SelectItem value="estudo">Estudo</SelectItem>
                  <SelectItem value="investimento">Investimento</SelectItem>
                  <SelectItem value="familia">Reunião Familiar</SelectItem>
                  <SelectItem value="aposentadoria">Aposentadoria</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timeline">Em quanto tempo? *</Label>
              <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o prazo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6-meses">6 meses</SelectItem>
                  <SelectItem value="1-ano">1 ano</SelectItem>
                  <SelectItem value="2-anos">2 anos</SelectItem>
                  <SelectItem value="3-anos">3 anos</SelectItem>
                  <SelectItem value="5-anos">5 anos ou mais</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="prioridade">Prioridade *</Label>
              <Select value={formData.prioridade} onValueChange={(value) => handleInputChange('prioridade', value as 'baixa' | 'media' | 'alta')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="situacao_atual">Descreva sua situação atual *</Label>
              <Textarea
                id="situacao_atual"
                value={formData.situacao_atual}
                onChange={(e) => handleInputChange('situacao_atual', e.target.value)}
                placeholder="Onde você está agora em relação ao seu objetivo?"
                rows={3}
                required
              />
            </div>
            <div>
              <Label htmlFor="recursos_disponiveis">Recursos disponíveis *</Label>
              <Textarea
                id="recursos_disponiveis"
                value={formData.recursos_disponiveis}
                onChange={(e) => handleInputChange('recursos_disponiveis', e.target.value)}
                placeholder="Que recursos você tem? (financeiros, tempo, conhecimentos, etc.)"
                rows={3}
                required
              />
            </div>
            <div>
              <Label htmlFor="obstaculos">Principais obstáculos *</Label>
              <Textarea
                id="obstaculos"
                value={formData.obstaculos}
                onChange={(e) => handleInputChange('obstaculos', e.target.value)}
                placeholder="Quais são os maiores desafios que você enxerga?"
                rows={3}
                required
              />
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="detalhes_especificos">Detalhes específicos</Label>
              <Textarea
                id="detalhes_especificos"
                value={formData.detalhes_especificos}
                onChange={(e) => handleInputChange('detalhes_especificos', e.target.value)}
                placeholder="Algum detalhe específico que devemos saber?"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="motivacao">O que te motiva? *</Label>
              <Textarea
                id="motivacao"
                value={formData.motivacao}
                onChange={(e) => handleInputChange('motivacao', e.target.value)}
                placeholder="Qual é a sua maior motivação para alcançar esse objetivo?"
                rows={3}
                required
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-red-500 mr-3" />
            <h1 className="text-4xl font-baskerville font-bold text-petroleo">
              Criador de Sonhos
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Defina seus objetivos e trace o caminho ideal para sua jornada de imigração para os EUA. 
            Organize suas metas, acompanhe o progresso e transforme seus sonhos em realidade.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!showForm ? (
            <div className="text-center mb-8">
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-petroleo hover:bg-petroleo/90 text-white px-8 py-3 text-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Novo Sonho
              </Button>
            </div>
          ) : (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    {steps[currentStep - 1].title}
                  </CardTitle>
                  <div className="text-sm text-gray-500">
                    Passo {currentStep} de {steps.length}
                  </div>
                </div>
                <p className="text-gray-600">{steps[currentStep - 1].description}</p>
                <Progress value={(currentStep / steps.length) * 100} className="mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {renderStepContent()}
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={prevStep}
                      disabled={currentStep === 1}
                    >
                      Anterior
                    </Button>
                    
                    <div className="flex space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowForm(false);
                          setCurrentStep(1);
                        }}
                      >
                        Cancelar
                      </Button>
                      
                      {currentStep < steps.length ? (
                        <Button 
                          type="button" 
                          onClick={nextStep}
                          className="bg-petroleo hover:bg-petroleo/90"
                        >
                          Próximo
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button 
                          type="button" 
                          onClick={handleSubmit}
                          disabled={loading}
                          className="bg-petroleo hover:bg-petroleo/90"
                        >
                          {loading ? 'Salvando...' : 'Criar Sonho'}
                          <Sparkles className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {goals.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-baskerville font-bold text-petroleo mb-4">
                Seus Sonhos ({goals.length})
              </h2>
              
              <div className="grid gap-6">
                {goals.map((goal) => (
                  <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center mb-2">
                            <Heart className="w-5 h-5 mr-2 text-red-500" />
                            {goal.form_data.objetivo_principal.substring(0, 50)}...
                          </CardTitle>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getPriorityColor(goal.form_data.prioridade)}>
                              Prioridade {goal.form_data.prioridade}
                            </Badge>
                            <Badge className={getStatusColor(goal.status)}>
                              {goal.status === 'planejando' && '📋 Planejando'}
                              {goal.status === 'em_progresso' && '⏳ Em Progresso'}
                              {goal.status === 'concluido' && '✅ Concluído'}
                            </Badge>
                            {goal.form_data.timeline && (
                              <Badge variant="outline">
                                <Calendar className="w-3 h-3 mr-1" />
                                {goal.form_data.timeline}
                              </Badge>
                            )}
                            <Badge variant="outline">
                              <Star className="w-3 h-3 mr-1" />
                              {goal.form_data.categoria}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Perfil:</h4>
                          <p className="text-sm text-gray-600">
                            {goal.form_data.nome}, {goal.form_data.idade} anos, {goal.form_data.profissao}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Objetivo:</h4>
                          <p className="text-sm text-gray-600">{goal.form_data.objetivo_principal}</p>
                        </div>
                        
                        {goal.action_plan && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Plano de Ação:</h4>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                                {goal.action_plan}
                              </pre>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          {goal.status === 'planejando' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateGoalStatus(goal.id, 'em_progresso')}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              <Clock className="w-4 h-4 mr-1" />
                              Iniciar
                            </Button>
                          )}
                          {goal.status === 'em_progresso' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateGoalStatus(goal.id, 'concluido')}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Concluir
                            </Button>
                          )}
                          {goal.status === 'concluido' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateGoalStatus(goal.id, 'em_progresso')}
                            >
                              Reabrir
                            </Button>
                          )}
                          
                          {!goal.action_plan && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => generateActionPlan(goal)}
                              disabled={generatingPlan}
                              className="border-petroleo text-petroleo hover:bg-petroleo hover:text-white"
                            >
                              {generatingPlan ? (
                                <>
                                  <Clock className="w-4 h-4 mr-1 animate-spin" />
                                  Gerando...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4 mr-1" />
                                  Gerar Plano
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {goals.length === 0 && !showForm && (
            <Card className="text-center py-12">
              <CardContent>
                <Heart className="w-16 h-16 text-red-200 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Ainda não há sonhos definidos
                </h3>
                <p className="text-gray-500 mb-6">
                  Comece criando seu primeiro sonho americano e trace o caminho para realizá-lo!
                </p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-petroleo hover:bg-petroleo/90"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Criar Primeiro Sonho
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <ToolsSection />
      <Footer />
    </div>
  );
};

export default DreamsPage;