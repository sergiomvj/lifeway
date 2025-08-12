import { MultistepFormData, FormType, FormStatus } from '@/types/forms';
import { CriadorSonhosFormData, VisaMatchFormData } from '@/types/forms';

export const createEmptyForm = (formType: FormType, userId?: string): MultistepFormData => {
  const now = new Date().toISOString();
  
  return {
    id: '',
    user_id: userId || null,
    form_type: formType,
    status: 'draft' as FormStatus,
    version: '1.0.0',
    created_at: now,
    updated_at: now,
    completed_at: null,
    form_data: {
      // Dados básicos que podem ser preenchidos em qualquer formulário
      personal_info: {
        full_name: '',
        preferred_name: '',
        birth_date: '',
        gender: '',
        marital_status: '',
        nationality: '',
        current_country: '',
        current_state: '',
        current_city: '',
        phone: '',
        email: '',
        emergency_contact: {
          name: '',
          relationship: '',
          phone: ''
        }
      },
      // Os outros campos serão preenchidos conforme necessário
    },
    system_metadata: {
      last_ai_interaction: now,
      data_completeness: 0,
      confidence_score: 0,
      last_validation: now,
      source: 'web'
    }
  };
};

export const convertToMultistepForm = (
  formData: any,
  formType: FormType,
  userId?: string
): MultistepFormData => {
  const now = new Date().toISOString();
  const baseForm = createEmptyForm(formType, userId);
  
  if (formType === 'dream') {
    const dreamData = formData as CriadorSonhosFormData;
    
    return {
      ...baseForm,
      form_data: {
        ...baseForm.form_data,
        personal_info: {
          ...baseForm.form_data.personal_info,
          full_name: dreamData.nome || '',
          birth_date: dreamData.idade ? calculateBirthYear(parseInt(dreamData.idade)).toString() : ''
        },
        dream_goals: {
          main_objective: dreamData.objetivo_principal || '',
          category: dreamData.categoria || '',
          priority: dreamData.prioridade as 'low' | 'medium' | 'high' || 'medium',
          current_situation: dreamData.situacao_atual || '',
          challenges: dreamData.obstaculos ? [dreamData.obstaculos] : [],
          resources_available: dreamData.recursos_disponiveis ? [dreamData.recursos_disponiveis] : [],
          action_steps: []
        },
      },
      system_metadata: {
        ...baseForm.system_metadata,
        data_completeness: calculateCompleteness(dreamData),
        source: 'web'
      }
    };
  } 
  
  if (formType === 'visa') {
    const visaData = formData as VisaMatchFormData;
    
    return {
      ...baseForm,
      form_data: {
        ...baseForm.form_data,
        personal_info: {
          ...baseForm.form_data.personal_info,
          full_name: visaData.personal_info?.full_name || '',
          birth_date: visaData.personal_info?.age ? 
            (new Date().getFullYear() - (visaData.personal_info.age || 0)).toString() : '',
          gender: '', // Preencher se disponível
          marital_status: visaData.personal_info?.marital_status || '',
          nationality: visaData.personal_info?.nationality || '',
          current_country: '', // Preencher se disponível
          email: '' // Preencher se disponível
        },
        // Mapear outros campos específicos do VisaMatch
        visa_match: {
          professional_info: visaData.professional_info,
          family_info: visaData.family_info,
          travel_info: visaData.travel_info,
          financial_info: visaData.financial_info,
          goals_info: visaData.goals_info
        }
      },
      system_metadata: {
        ...baseForm.system_metadata,
        data_completeness: calculateVisaMatchCompleteness(visaData),
        source: 'web'
      }
    };
  }
  
  return baseForm;
};

const calculateBirthYear = (age: number): number => {
  const currentYear = new Date().getFullYear();
  return currentYear - age;
};

const calculateCompleteness = (data: CriadorSonhosFormData): number => {
  let filledFields = 0;
  const totalFields = 10; // Número de campos obrigatórios
  
  // Verificar campos obrigatórios
  if (data.nome) filledFields++;
  if (data.idade) filledFields++;
  if (data.objetivo_principal) filledFields++;
  if (data.categoria) filledFields++;
  if (data.prioridade) filledFields++;
  if (data.situacao_atual) filledFields++;
  if (data.recursos_disponiveis) filledFields++;
  if (data.obstaculos) filledFields++;
  if (data.detalhes_especificos) filledFields++;
  if (data.motivacao) filledFields++;
  
  return Math.round((filledFields / totalFields) * 100);
};

const calculateVisaMatchCompleteness = (data: VisaMatchFormData): number => {
  let filledFields = 0;
  const totalFields = 8; // Número de seções principais para verificar
  
  // Verificar preenchimento das seções principais
  if (data.personal_info) filledFields++;
  if (data.professional_info) filledFields++;
  if (data.family_info) filledFields++;
  if (data.travel_info) filledFields++;
  if (data.financial_info) filledFields++;
  if (data.goals_info) filledFields++;
  
  // Verificar campos obrigatórios dentro de cada seção
  if (data.personal_info?.full_name) filledFields += 0.5;
  if (data.personal_info?.age) filledFields += 0.5;
  
  return Math.min(100, Math.round((filledFields / totalFields) * 100));
};

export const convertFromMultistepForm = <T>(formData: MultistepFormData): T => {
  if (formData.form_type === 'dream') {
    // Converter de volta para CriadorSonhosFormData
    return {
      id: formData.id,
      created_at: formData.created_at,
      updated_at: formData.updated_at,
      user_id: formData.user_id || '',
      nome: formData.form_data.personal_info?.full_name || '',
      idade: formData.form_data.personal_info?.birth_date 
        ? (new Date().getFullYear() - new Date(formData.form_data.personal_info.birth_date).getFullYear()).toString()
        : '',
      // Mapear outros campos conforme necessário
    } as unknown as T;
  }
  
  if (formData.form_type === 'visa' && formData.form_data.visa_match) {
    // Converter de volta para VisaMatchFormData
    const visaData = formData.form_data.visa_match;
    
    return {
      id: formData.id,
      created_at: formData.created_at,
      updated_at: formData.updated_at,
      user_id: formData.user_id || '',
      personal_info: {
        ...formData.form_data.personal_info,
        age: formData.form_data.personal_info?.birth_date
          ? new Date().getFullYear() - new Date(formData.form_data.personal_info.birth_date).getFullYear()
          : 0
      },
      professional_info: visaData.professional_info,
      family_info: visaData.family_info,
      travel_info: visaData.travel_info,
      financial_info: visaData.financial_info,
      goals_info: visaData.goals_info
    } as unknown as T;
  }
  
  return formData as unknown as T;
};
