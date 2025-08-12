// Shared types for LifeWay forms and tools

// Tipos para o sistema unificado de formulários
export type FormType = 'profile' | 'dream' | 'visa' | 'especialista';
export type FormStatus = 'draft' | 'in_progress' | 'completed' | 'archived';

// Estrutura principal para todos os formulários
export interface MultistepFormData {
  // Metadados do formulário
  id: string;
  user_id: string | null;
  form_type: FormType;
  status: FormStatus;
  version: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  
  // Dados do formulário
  form_data: {
    // Dados Pessoais
    personal_info?: {
      full_name: string;
      preferred_name?: string;
      birth_date: string;
      gender: string;
      marital_status: string;
      nationality: string;
      current_country: string;
      current_state: string;
      current_city: string;
      phone: string;
      email: string;
      emergency_contact: {
        name: string;
        relationship: string;
        phone: string;
      };
    };
    
    // Formação e Experiência
    education?: Array<{
      level: string;
      institution: string;
      field_of_study: string;
      start_year: number;
      end_year: number | null;
      is_completed: boolean;
      country: string;
    }>;
    
    work_experience?: Array<{
      job_title: string;
      company: string;
      industry: string;
      start_date: string;
      end_date: string | null;
      is_current: boolean;
      country: string;
      responsibilities: string[];
      skills_used: string[];
    }>;
    
    // Habilidades e Idiomas
    languages?: Array<{
      language: string;
      proficiency: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Nativo';
      is_primary: boolean;
    }>;
    
    skills?: Array<{
      name: string;
      category: string;
      proficiency: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Especialista';
      years_of_experience: number;
    }>;
    
    // Objetivos e Preferências
    objectives?: {
      primary_goal: 'work' | 'study' | 'invest' | 'family' | 'visit';
      preferred_destinations: Array<{
        country: string;
        state: string;
        city: string;
        priority: number;
      }>;
      timeline: {
        preferred_start: string;
        flexibility: 'flexible' | 'moderate' | 'fixed';
        urgency: 'immediate' | '6months' | '1year' | '2years';
      };
      budget: {
        amount: number;
        currency: string;
        includes_family: boolean;
      };
    };
    
    // Dados específicos do Criador de Sonhos
    dream_goals?: {
      main_objective: string;
      category: string;
      priority: 'low' | 'medium' | 'high';
      current_situation: string;
      challenges: string[];
      resources_available: string[];
      action_steps: Array<{
        description: string;
        deadline: string;
        completed: boolean;
      }>;
    };

    // Dados específicos do VisaMatch
    visa_match?: {
      professional_info: ProfessionalInfo;
      family_info: FamilyInfo;
      travel_info: TravelInfo;
      financial_info: FinancialInfo;
      goals_info: GoalsInfo;
    };
    
    // Dados específicos do VisaMatch
    visa_profile?: {
      purpose: 'work' | 'study' | 'invest' | 'family' | 'visit';
      education_level: string;
      years_of_experience: number;
      job_offer: 'yes' | 'process' | 'no';
      investment_capacity: 'low' | 'medium' | 'high' | 'very_high';
      preferred_timeline: 'immediate' | '6months' | '1year' | '2years';
      family_situation: {
        has_spouse: boolean;
        has_children: boolean;
        children_under_21: number;
      };
      recommendations?: Array<{
        visa_type: string;
        match_score: number;
        description: string;
        requirements: string[];
        timeline: string;
        estimated_cost: string;
        pros: string[];
        cons: string[];
      }>;
    };
    
    // Dados específicos do Especialista Virtual
    specialist_notes?: Array<{
      id: string;
      specialist_id: string;
      note: string;
      category: 'observation' | 'recommendation' | 'follow_up';
      timestamp: string;
    }>;
  };
  
  // Metadados do sistema
  system_metadata: {
    last_ai_interaction: string;
    data_completeness: number; // 0-100%
    confidence_score: number; // 0-100
    last_validation: string;
    source: 'web' | 'mobile' | 'api';
  };
}

// Interface de compatibilidade para manter compatibilidade com código existente
export interface BaseFormData {
  id?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

// Criador de Sonhos Types
export interface CriadorSonhosFormData extends BaseFormData {
  // Passo 1: Informações pessoais
  nome: string;
  idade: string;
  profissao: string;
  experiencia: string;
  
  // Passo 2: Objetivos
  objetivo_principal: string;
  categoria: 'trabalho' | 'estudo' | 'investimento' | 'familia' | 'aposentadoria' | 'outro';
  timeline: string;
  prioridade: 'baixa' | 'media' | 'alta';
  
  // Passo 3: Situação atual
  situacao_atual: string;
  recursos_disponiveis: string;
  obstaculos: string;
  
  // Passo 4: Detalhes específicos
  detalhes_especificos: string;
  motivacao: string;
  
  // Campos adicionais para v1.80
  familia_composicao?: FamilyComposition;
  interesses?: string[];
  cidades_interesse?: string[];
}

export interface FamilyComposition {
  adults: number;
  children: ChildInfo[];
  dependents?: DependentInfo[];
}

export interface ChildInfo {
  age: number;
  interests?: string[];
  special_needs?: string;
}

export interface DependentInfo {
  relationship: string;
  age: number;
  needs?: string;
}

// VisaMatch Types
export interface VisaMatchFormData extends BaseFormData {
  // Dados pessoais
  personal_info: PersonalInfo;
  professional_info: ProfessionalInfo;
  family_info: FamilyInfo;
  travel_info: TravelInfo;
  financial_info: FinancialInfo;
  goals_info: GoalsInfo;
}

export interface PersonalInfo {
  full_name: string;
  age: number;
  nationality: string;
  marital_status: 'single' | 'married' | 'divorced' | 'widowed';
  education_level: 'high_school' | 'bachelor' | 'master' | 'phd' | 'other';
  languages: Language[];
}

export interface Language {
  language: string;
  proficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
  certifications?: string[];
}

export interface ProfessionalInfo {
  current_occupation: string;
  years_experience: number;
  industry: string;
  current_employer: string;
  annual_income: number;
  skills: string[];
  certifications: string[];
  is_executive: boolean;
  has_us_experience: boolean;
}

export interface FamilyInfo {
  has_spouse: boolean;
  spouse_info?: SpouseInfo;
  children: ChildInfo[];
  dependents: DependentInfo[];
}

export interface SpouseInfo {
  name: string;
  age: number;
  occupation: string;
  education: string;
  wants_to_work: boolean;
}

export interface TravelInfo {
  purpose: 'work' | 'study' | 'investment' | 'family' | 'retirement' | 'other';
  intended_duration: number; // em meses
  preferred_states: string[];
  has_job_offer: boolean;
  has_sponsor: boolean;
  sponsor_type?: 'employer' | 'family' | 'investment' | 'other';
  previous_us_visits: number;
  visa_rejections: number;
}

export interface FinancialInfo {
  liquid_assets: number;
  real_estate_value: number;
  annual_income: number;
  investment_capacity: number;
  debt_obligations: number;
  financial_dependents: number;
}

export interface GoalsInfo {
  primary_goal: string;
  secondary_goals: string[];
  timeline_flexibility: 'rigid' | 'flexible' | 'very_flexible';
  location_flexibility: 'specific_city' | 'specific_state' | 'region' | 'anywhere';
  career_goals: string[];
  lifestyle_priorities: string[];
}

// OpenAI Response Types
export interface CriadorSonhosResponse {
  visao_inspiradora: string;
  mapeamento_sonhos: DreamMapping;
  cenarios_transformacao: TransformationScenario[];
  jornada_realizacao: JourneyPhases;
  ferramentas_praticas: PracticalTools;
  destinos_alternativos: AlternativeDestination[];
}

export interface DreamMapping {
  sonhos_individuais: IndividualDreams;
  potenciais_ocultos: string[];
}

export interface IndividualDreams {
  adultos: string[];
  filhos: string[];
  familia: string[];
}

export interface TransformationScenario {
  nome: string;
  localizacao: string;
  essencia: string;
  nova_vida: string;
  crescimento_pessoal: GrowthAspects;
  crescimento_academico: string;
  crescimento_profissional: string;
  caminho_transformacao: TimelinePhase[];
  investimento_mudanca: InvestmentBreakdown;
  beneficios_unicos: string[];
}

export interface GrowthAspects {
  adultos: string;
  criancas: string;
  familia: string;
}

export interface TimelinePhase {
  periodo: string;
  atividades: string[];
}

export interface InvestmentBreakdown {
  recursos_financeiros: string;
  tempo_planejamento: string;
  preparacao_emocional: string;
}

export interface JourneyPhases {
  fase_semear: PhaseDetails;
  fase_crescer: PhaseDetails;
  fase_florescer: PhaseDetails;
}

export interface PhaseDetails {
  duracao: string;
  atividades: string[];
}

export interface PracticalTools {
  visualizacao_planejamento: string[];
  preparacao_pratica: string[];
  mantendo_motivacao: string[];
}

export interface AlternativeDestination {
  nome: string;
  por_que_magico: string;
  oportunidades_unicas: string;
  crescimento_familiar: string;
}

// VisaMatch Response Types
export interface VisaMatchResponse {
  elegibilidade_familiar: EligibilityAnalysis;
  estrategias_recomendadas: VisaStrategy[];
  comparativo_estrategias: StrategyComparison;
  recomendacao_principal: MainRecommendation;
  plano_acao: ActionPlan;
  recursos_especializados: SpecializedResources;
}

export interface EligibilityAnalysis {
  perfil_requerente: ApplicantProfile;
  composicao_familiar: FamilyComposition;
  fatores_forca: string[];
  desafios_potenciais: string[];
}

export interface ApplicantProfile {
  qualificacoes: string[];
  experiencia: string;
  recursos_financeiros: string;
  historico_viagens: string;
}

export interface VisaStrategy {
  tipo_visto: string;
  nome_estrategia: string;
  visto_principal: string;
  vistos_dependentes: string[];
  adequacao_perfil: string;
  requisitos_especificos: VisaRequirements;
  timeline_detalhado: TimelineStep[];
  investimento_financeiro: FinancialBreakdown;
  beneficios_familia: FamilyBenefits;
  caminho_green_card: GreenCardPath;
  riscos_limitacoes: string[];
}

export interface VisaRequirements {
  requerente_principal: string[];
  conjuge: string[];
  filhos: string[];
}

export interface TimelineStep {
  fase: string;
  duracao: string;
  atividades: string[];
}

export interface FinancialBreakdown {
  taxas_governamentais: number;
  advogado_imigracao: number;
  traducoes_certificacoes: number;
  total_estimado: number;
}

export interface FamilyBenefits {
  requerente: string[];
  conjuge: string[];
  filhos: string[];
}

export interface GreenCardPath {
  possibilidade: boolean;
  timeline_estimado: string;
  requisitos_adicionais: string[];
}

export interface StrategyComparison {
  criterios: string[];
  estrategias: StrategyScore[];
}

export interface StrategyScore {
  estrategia: string;
  probabilidade_aprovacao: 'alta' | 'media' | 'baixa';
  tempo_processamento: string;
  investimento_total: number;
  flexibilidade_profissional: 'alta' | 'media' | 'baixa';
  beneficios_conjuge: boolean;
  educacao_filhos: 'publica_gratuita' | 'paga';
  caminho_green_card: 'direto' | 'indireto' | 'inexistente';
}

export interface MainRecommendation {
  estrategia_recomendada: number;
  justificativa: string;
  plano_b: string;
}

export interface ActionPlan {
  proximos_30_dias: ActionItem[];
  proximos_90_dias: ActionItem[];
  proximos_6_12_meses: ActionItem[];
}

export interface ActionItem {
  tarefa: string;
  concluido: boolean;
  prazo?: string;
  prioridade: 'alta' | 'media' | 'baixa';
}

export interface SpecializedResources {
  advogados_recomendados: LawyerInfo[];
  documentacao_essencial: DocumentInfo[];
  preparacao_familiar: PreparationInfo[];
}

export interface LawyerInfo {
  nome: string;
  especializacao: string[];
  experiencia_brasileiros: boolean;
  contato: string;
}

export interface DocumentInfo {
  documento: string;
  orgao_emissor: string;
  traducao_necessaria: boolean;
  apostilamento: boolean;
}

export interface PreparationInfo {
  categoria: string;
  itens: string[];
}

// PDF Generation Types
export interface PDFGenerationRequest {
  user_id: string;
  form_data: CriadorSonhosFormData;
  openai_response: CriadorSonhosResponse;
  selected_images: string[];
  template_type: 'standard' | 'premium';
}

export interface PDFAccessControl {
  launch_date: Date;
  free_period_days: number;
  user_type: 'FREE' | 'PRO';
  can_access_pdf: boolean;
}

// Specialist Chat Types
export interface SpecialistContext {
  user_id: string;
  session_id: string;
  timestamp: string;
  visamatch_analysis?: VisaMatchResponse;
  criador_sonhos_data?: CriadorSonhosFormData;
  family_profile: FamilyProfile;
  conversation_history: ChatMessage[];
  specialist_notes: SpecialistNote[];
}

export interface FamilyProfile {
  composition: FamilyComposition;
  goals: GoalsInfo;
  resources: FinancialInfo;
  timeline: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'specialist' | 'system';
  message: string;
  timestamp: string;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  type: 'pdf' | 'image' | 'document';
  url: string;
  name: string;
}

export interface SpecialistNote {
  id: string;
  specialist_id: string;
  note: string;
  category: 'observation' | 'recommendation' | 'follow_up';
  timestamp: string;
}

// Form Validation Types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any, formData: any) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  type: 'required' | 'format' | 'length' | 'custom';
}

// Auto-save Types
export interface AutoSaveConfig {
  enabled: boolean;
  interval: number; // milliseconds
  storage: 'localStorage' | 'supabase';
  key_prefix: string;
}

export interface SaveState {
  last_saved: Date | null;
  is_saving: boolean;
  has_unsaved_changes: boolean;
}
