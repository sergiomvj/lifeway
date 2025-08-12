import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, ArrowRight, RotateCcw, FileText, Clock, DollarSign, Users, Loader2 } from "lucide-react";
import { openaiService } from "@/services/openaiService";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { MultistepForm, FormStep } from "@/components/forms/MultistepForm";
import { VisaMatchFormData, VisaMatchStep1, VisaMatchStep2, VisaMatchStep3, VisaMatchStep4 } from "@/components/forms/VisaMatchFormSteps";
import { convertToMultistepForm, convertFromMultistepForm } from "@/lib/formUtils";
import { FormStatus, FormType } from "@/types/forms";

// Definição das etapas do formulário
const formSteps: FormStep<VisaMatchFormData>[] = [
  {
    id: 'purpose',
    title: 'Objetivo',
    description: 'Qual é o seu principal objetivo nos EUA?',
    fields: ['purpose'],
    component: VisaMatchStep1
  },
  {
    id: 'education_experience',
    title: 'Formação e Experiência',
    description: 'Conte-nos sobre sua formação e experiência profissional',
    fields: ['education', 'experience'],
    component: VisaMatchStep2
  },
  {
    id: 'job_offer',
    title: 'Oferta de Emprego',
    description: 'Você já tem uma oferta de trabalho?',
    fields: ['jobOffer'],
    component: VisaMatchStep3
  },
  {
    id: 'investment_timeline',
    title: 'Investimento e Prazo',
    description: 'Quanto você pode investir e qual seu prazo?',
    fields: ['financial_info.investment_capacity', 'preferences.timeline'],
    component: VisaMatchStep4
  }
];

// Dados iniciais do formulário
const initialFormData: VisaMatchFormData = {
  travel_info: {
    purpose: 'tourism', // tourism, work, study, investment, other
    has_job_offer: false,
    job_offer_details: {
      position: '',
      company: '',
      salary: 0,
      start_date: ''
    },
    family_in_us: false,
    family_details: []
  },
  professional_info: {
    education_level: 'high_school', // high_school, bachelors, masters, phd, other
    years_of_experience: 0,
    current_occupation: '',
    has_us_education: false,
    us_education_details: {
      degree: '',
      field_of_study: '',
      institution: '',
      graduation_year: ''
    },
    has_us_experience: false,
    us_experience_details: []
  },
  financial_info: {
    real_estate_value: 0,
    annual_income: 0,
    investment_capacity: 0,
    debt_obligations: 0,
    financial_dependents: 0
  },
  goals_info: {
    primary_goal: '',
    secondary_goals: [],
    timeline_flexibility: 'flexible',
    location_flexibility: 'anywhere',
    career_goals: [],
    lifestyle_priorities: []
  }
};

interface VisaRecommendation {
  type: string;
  name: string;
  match: number;
  description: string;
  requirements: string[];
  timeline: string;
  cost: string;
  pros: string[];
  cons: string[];
}

interface VisaMatchProps {
  formId?: string;
}

const VisaMatch = ({ formId: propFormId }: VisaMatchProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id: urlFormId } = useParams<{ id?: string }>();
  const formId = propFormId || urlFormId;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<VisaMatchFormData>(initialFormData);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<VisaRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(!!formId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  
  // Carregar dados do formulário existente se formId for fornecido
  useEffect(() => {
    const loadFormData = async () => {
      if (!formId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('multistep_forms')
          .select('*')
          .eq('id', formId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Verificar se o formulário é do tipo 'visa'
          if (data.form_type !== 'visa') {
            throw new Error('Este não é um formulário de VisaMatch');
          }
          
          // Converter os dados do formato MultistepFormData para VisaMatchFormData
          const formData = convertFromMultistepForm(data) as VisaMatchFormData;
          setAnswers(formData);
          
          // Se já tiver recomendações, carregar
          if (data.action_plan) {
            try {
              const recs = JSON.parse(data.action_plan);
              if (Array.isArray(recs)) {
                setRecommendations(recs);
                setShowResults(true);
              }
            } catch (e) {
              console.error('Erro ao carregar recomendações:', e);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar formulário:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar o formulário. Tente novamente.',
          variant: 'destructive',
        });
        // Redirecionar para a página inicial em caso de erro
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Obter usuário logado
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    
    getUser();
    loadFormData();
  }, [formId, toast, navigate]);

  // Dados das perguntas para referência
  const questionsData = [
    {
      id: 'purpose',
      question: 'Qual é o seu principal objetivo nos EUA?',
      options: [
        { value: 'work', label: 'Trabalhar' },
        { value: 'study', label: 'Estudar' },
        { value: 'invest', label: 'Investir/Empreender' },
        { value: 'family', label: 'Reunificação Familiar' },
        { value: 'visit', label: 'Viver com tranquilidade' }
      ]
    },
    {
      id: 'education',
      question: 'Qual é o seu nível de educação?',
      options: [
        { value: 'highschool', label: 'Ensino Médio' },
        { value: 'bachelor', label: 'Graduação' },
        { value: 'master', label: 'Mestrado' },
        { value: 'phd', label: 'Doutorado' },
        { value: 'professional', label: 'Certificação Profissional' }
      ]
    },
    {
      id: 'experience',
      question: 'Quantos anos de experiência profissional você tem?',
      options: [
        { value: '0-2', label: '0-2 anos' },
        { value: '3-5', label: '3-5 anos' },
        { value: '6-10', label: '6-10 anos' },
        { value: '10+', label: 'Mais de 10 anos' }
      ]
    },
    {
      id: 'jobOffer',
      question: 'Você tem uma oferta de trabalho nos EUA?',
      options: [
        { value: 'yes', label: 'Sim, já tenho' },
        { value: 'process', label: 'Estou em processo' },
        { value: 'no', label: 'Não tenho' }
      ]
    },
    {
      id: 'investment',
      question: 'Qual é sua capacidade de investimento?',
      options: [
        { value: 'low', label: 'Até $50,000' },
        { value: 'medium', label: '$50,000 - $500,000' },
        { value: 'high', label: '$500,000 - $1,000,000' },
        { value: 'very-high', label: 'Mais de $1,000,000' }
      ]
    },
    {
      id: 'timeline',
      question: 'Qual é seu prazo desejado para imigrar?',
      options: [
        { value: 'immediate', label: 'Imediatamente' },
        { value: '6months', label: '6 meses' },
        { value: '1year', label: '1 ano' },
        { value: '2years', label: '2+ anos' }
      ]
    }
  ];

  const handleFormSubmit = async (formData: VisaMatchFormData) => {
    if (!userId) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para salvar sua análise.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Converter os dados para o formato MultistepFormData
      const newFormData = convertToMultistepForm(formData, 'visa', userId);
      
      // Preparar os dados para salvar no Supabase
      const formToSave = {
        ...newFormData,
        status: 'completed' as FormStatus,
        updated_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        system_metadata: {
          ...newFormData.system_metadata,
          data_completeness: 100,
          last_validation: new Date().toISOString(),
          source: 'web'
        }
      };
      
      // Salvar no Supabase
      const { data, error } = await supabase
        .from('multistep_forms')
        .upsert([
          formId ? { ...formToSave, id: formId } : formToSave
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      // Gerar recomendações
      await calculateRecommendations(formData, data.id);
      
      // Atualizar o ID do formulário se for uma nova criação
      if (!formId) {
        // Atualizar a URL com o novo ID
        navigate(`/visamatch/${data.id}`, { replace: true });
      }
      
      toast({
        title: "Sucesso",
        description: "Sua análise foi salva com sucesso!",
        variant: "default"
      });
      
      return data;
      
    } catch (error) {
      console.error('Erro ao salvar formulário:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar sua análise. Tente novamente.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleStepChange = (step: number, formData: VisaMatchFormData) => {
    setAnswers(formData);
    setCurrentStep(step);
    
    // Marca o passo como visitado
    setVisitedSteps(prev => new Set([...prev, step]));
  };

  const calculateRecommendations = async (formData: VisaMatchFormData, formId: string) => {
    try {
      setIsLoading(true);
      
      // Use enhanced OpenAI service with retry logic and better error handling
      const aiRecommendations = await openaiService.generateVisaRecommendations(formData, {
        onRetry: (attempt, error) => {
          console.log(`Tentativa ${attempt} falhou, tentando novamente...`, error.message);
        },
        onSuccess: (response, duration) => {
          console.log(`Recomendações geradas com sucesso em ${duration}ms`);
        },
        onError: (error, attempts) => {
          console.error(`Falha após ${attempts} tentativas:`, error.message);
        }
      });
      
      let finalRecommendations: VisaRecommendation[] = [];
      
      if (aiRecommendations && Array.isArray(aiRecommendations)) {
        finalRecommendations = aiRecommendations;
      } else {
        // Fallback para lógica local
        finalRecommendations = getFallbackRecommendations(formData);
      }
      
      // Ordenar por compatibilidade
      finalRecommendations.sort((a, b) => b.match - a.match);
      
      // Atualizar estado
      setRecommendations(finalRecommendations);
      setShowResults(true);
      
      // Atualizar o formulário com as recomendações
      await updateFormWithRecommendations(formId, finalRecommendations);
      
      return finalRecommendations;
      
    } catch (error) {
      console.error('Erro ao gerar recomendações com IA:', error);
      const fallbackRecs = getFallbackRecommendations(formData);
      setRecommendations(fallbackRecs);
      setShowResults(true);
      return fallbackRecs;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getFallbackRecommendations = (formData: VisaMatchFormData): VisaRecommendation[] => {
    const recs: VisaRecommendation[] = [];
    
    // Lógica de recomendação baseada nas respostas
    const purpose = formData.travel_info?.purpose;
    const hasJobOffer = formData.travel_info?.has_job_offer;
    const investment = formData.financial_info?.investment_capacity || 0;
    
    // Visto H1-B para trabalho especializado
    if (purpose === 'work' && hasJobOffer) {
      recs.push({
        type: 'H1-B',
        name: 'Visto H1-B - Trabalhador Especializado',
        match: 95,
        description: 'Ideal para profissionais com oferta de trabalho em área especializada',
        requirements: ['Diploma universitário', 'Oferta de trabalho', 'Empresa patrocinadora'],
        timeline: '6-12 meses',
        cost: '$3,000 - $5,000',
        pros: ['Permite trabalho legal', 'Caminho para Green Card', 'Família pode acompanhar'],
        cons: ['Dependente do empregador', 'Processo competitivo', 'Limitações de mudança de emprego']
      });
    }
    
    // Visto L-1 para transferência entre empresas
    if (purpose === 'work' && formData.professional_info?.has_us_experience) {
      recs.push({
        type: 'L-1',
        name: 'Visto L-1 - Transferência entre Empresas',
        match: 85,
        description: 'Para funcionários transferidos para os EUA por uma empresa multinacional',
        requirements: ['Empregado por pelo menos 1 ano', 'Transferência para empresa relacionada nos EUA'],
        timeline: '2-6 meses',
        cost: '$4,000 - $8,000',
        pros: ['Caminho para Green Card', 'Família pode acompanhar', 'Possibilidade de dupla intenção'],
        cons: ['Exige relacionamento entre empresas', 'Processo complexo']
      });
    }
    
    // Visto E-2 para investidores
    if (purpose === 'investment' && investment >= 100000) {
      recs.push({
        type: 'E-2',
        name: 'Visto E-2 - Investidor',
        match: 80,
        description: 'Para investidores de países com tratado de comércio com os EUA',
        requirements: ['Investimento significativo', 'Empresa ativa', 'Plano de negócios'],
        timeline: '2-4 meses',
        cost: '$5,000 - $15,000',
        pros: ['Renovável indefinidamente', 'Pode trabalhar na empresa investida', 'Família pode acompanhar'],
        cons: ['Investimento não é reembolsável', 'Exige geração de empregos']
      });
    }
    
    // Visto F-1 para estudantes
    if (purpose === 'study') {
      recs.push({
        type: 'F-1',
        name: 'Visto F-1 - Estudante',
        match: 75,
        description: 'Para estudantes matriculados em instituições acadêmicas nos EUA',
        requirements: ['Aceitação em escola/universidade', 'Comprovação financeira', 'Intenção de retorno ao país de origem'],
        timeline: '2-3 meses',
        cost: '$350 - $500',
        pros: ['Permite trabalho limitado no campus', 'Pode solicitar OPT/CPT', 'Pode trazer dependentes'],
        cons: ['Não pode trabalhar fora do campus sem autorização', 'Custos de educação elevados']
      });
    }
    
    // Visto B-1/B-2 como fallback
    if (recs.length === 0) {
      recs.push({
        type: 'B-1/B-2',
        name: 'Visto B-1/B-2 - Turismo/Negócios',
        match: 60,
        description: 'Visto temporário para visitas de negócios ou turismo',
        requirements: ['Vínculos com país de origem', 'Comprovação financeira', 'Propósito temporário'],
        timeline: '2-4 semanas',
        cost: '$160',
        pros: ['Processo rápido', 'Baixo custo', 'Múltiplas entradas'],
        cons: ['Temporário', 'Não permite trabalho', 'Não leva à residência']
      });
    }
    
    return recs;
  };
  
  const updateFormWithRecommendations = async (formId: string, recommendations: VisaRecommendation[]) => {
    try {
      await supabase
        .from('multistep_forms')
        .update({
          action_plan: JSON.stringify(recommendations),
          system_metadata: {
            last_ai_interaction: new Date().toISOString(),
            data_completeness: 100,
            confidence_score: recommendations[0]?.match || 0
          }
        })
        .eq('id', formId);
    } catch (error) {
      console.error('Erro ao atualizar recomendações:', error);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers(initialFormData);
    setShowResults(false);
    setRecommendations([]);
    
    // Navegar para a URL limpa (sem formId)
    navigate('/visa-match');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-petroleo animate-spin mx-auto mb-4" />
          <p className="text-petroleo">Carregando sua análise...</p>
        </div>
      </div>
    );
  }

  const progress = showResults ? 100 : ((currentStep + 1) / formSteps.length) * 100;

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cinza-claro to-white">
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-petroleo" />
              <span className="text-petroleo font-figtree font-medium">Voltar</span>
            </Link>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <h1 className="text-4xl font-baskerville font-bold text-petroleo">
                Suas Recomendações
              </h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Baseado no seu perfil, encontramos {recommendations.length} opção(ões) de visto que podem ser adequadas para você.
            </p>
            <Button onClick={resetQuiz} variant="outline" className="mb-8">
              <RotateCcw className="w-4 h-4 mr-2" />
              Refazer Análise
            </Button>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {recommendations.map((rec, index) => (
              <Card key={rec.type} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-petroleo to-petroleo/80 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{rec.name}</CardTitle>
                      <p className="text-white/90">{rec.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{rec.match}%</div>
                      <div className="text-sm text-white/80">Compatibilidade</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-petroleo" />
                      <div>
                        <div className="font-semibold">Timeline</div>
                        <div className="text-gray-600">{rec.timeline}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-petroleo" />
                      <div>
                        <div className="font-semibold">Custo Estimado</div>
                        <div className="text-gray-600">{rec.cost}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-petroleo" />
                      <div>
                        <div className="font-semibold">Tipo</div>
                        <div className="text-gray-600">{rec.type}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-petroleo mb-3">Requisitos Principais</h4>
                      <ul className="space-y-2">
                        {rec.requirements.map((req, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">Vantagens</h4>
                        <ul className="space-y-1">
                          {rec.pros.map((pro, i) => (
                            <li key={i} className="text-sm text-gray-600">• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-orange-600 mb-2">Considerações</h4>
                        <ul className="space-y-1">
                          {rec.cons.map((con, i) => (
                            <li key={i} className="text-sm text-gray-600">• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-petroleo mb-4">
                  Próximos Passos
                </h3>
                <p className="text-gray-600 mb-4">
                  Esta análise é uma orientação inicial. Recomendamos consultar um advogado de imigração 
                  especializado para uma avaliação detalhada do seu caso específico.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button asChild className="bg-petroleo hover:bg-petroleo/90">
                    <Link to="/especialista">
                      <Users className="w-4 h-4 mr-2" />
                      Falar com Especialista
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/dreams">
                      Criar Plano de Ação
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cinza-claro to-white">
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5 text-petroleo" />
            <span className="text-petroleo font-figtree font-medium">Voltar</span>
          </Link>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
            <h1 className="text-4xl font-baskerville font-bold text-petroleo">
              VisaMatch
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Análise inteligente para descobrir o visto ideal para seu perfil. 
            Responda algumas perguntas e receba recomendações personalizadas.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Etapa {currentStep + 1} de {formSteps.length}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(progress)}% completo
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

<MultistepForm
            steps={formSteps as FormStep<VisaMatchFormData>[]}
            initialData={answers}
            onSubmit={handleFormSubmit}
            onStepChange={handleStepChange}
            formType="visa"
            autoSaveConfig={{
              enabled: true,
              interval: 30000,
              storage: 'supabase',
              key_prefix: 'visa_form'
            }}
            tableName="multistep_forms"
            userId={userId || ''}
            title="VisaMatch"
            description="Análise inteligente para descobrir o visto ideal para seu perfil"
          />
        </div>
      </div>
    </div>
  );
};

export default VisaMatch;