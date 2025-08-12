import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Save, AlertCircle, Clock, Wifi, WifiOff, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useFormValidation, commonValidationRules } from '@/hooks/useFormValidation';
import { ValidationRule, AutoSaveConfig, MultistepFormData, FormType, FormStatus } from '@/types/forms';
import { convertToMultistepForm, convertFromMultistepForm } from '@/lib/formUtils';
import { useToast } from '@/hooks/use-toast';

export interface FormStep<T> {
  id: string;
  title: string;
  description: string;
  fields: (keyof T)[];
  section?: string; // Nova propriedade para agrupar passos em seções
  icon?: React.ReactNode;
  isCompleted?: boolean;
  isOptional?: boolean;
  component: (props: {
    formData: T;
    updateFormData: (field: keyof T, value: any) => void;
    getFieldState: (field: keyof T) => any;
    getValidationSuggestions: (field: keyof T) => any;
    validationSummary: any;
  }) => React.ReactNode;
}

export interface MultistepFormProps<T> {
  steps: FormStep<T>[];
  initialData: T | MultistepFormData;
  onSubmit: (data: T) => Promise<void>;
  onStepChange?: (step: number, data: T) => void;
  className?: string;
  title?: string;
  description?: string;
  formType?: FormType;
  validationRules?: Record<keyof T, ValidationRule[]>;
  autoSaveConfig?: AutoSaveConfig;
  tableName?: string;
  userId?: string;
  recordId?: string;
  // Callback para processar os dados antes de salvar
  beforeSave?: (data: any) => any;
  // Callback para processar os dados após carregar
  afterLoad?: (data: any) => any;
}

export function MultistepForm<T extends Record<string, any>>({
  steps,
  initialData,
  onSubmit,
  onStepChange,
  className,
  title,
  description,
  formType = 'profile', // Valor padrão para compatibilidade
  validationRules = {} as Record<keyof T, ValidationRule[]>,
  autoSaveConfig = {
    enabled: true,
    interval: 30000, // 30 seconds
    storage: 'supabase', // Padrão para Supabase
    key_prefix: 'lifeway_form'
  },
  tableName = 'multistep_forms', // Tabela padrão atualizada
  userId,
  recordId,
  beforeSave,
  afterLoad
}: MultistepFormProps<T>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const { toast } = useToast();
  
  // Estado para o formulário unificado
  const [formData, setFormData] = useState<MultistepFormData | T>(
    // Se os dados iniciais já estiverem no formato MultistepFormData, use-os
    // Caso contrário, converta do formato antigo para o novo
    (initialData as MultistepFormData)?.form_type 
      ? initialData 
      : convertToMultistepForm(initialData as T, formType as FormType, userId)
  );
  
  // Verifica se está usando o novo formato de formulário
  const isNewFormat = useMemo(() => {
    return (formData as MultistepFormData)?.form_type !== undefined;
  }, [formData]);
  
  // Converte os dados para o formato esperado pelo componente filho
  const getFormDataForStep = useCallback(() => {
    if (isNewFormat) {
      const multistepData = formData as MultistepFormData;
      // Retorna apenas a parte relevante dos dados para o passo atual
      // Isso pode ser personalizado com base no tipo de formulário
      return {
        ...multistepData.form_data,
        id: multistepData.id,
        user_id: multistepData.user_id,
        created_at: multistepData.created_at,
        updated_at: multistepData.updated_at
      } as unknown as T;
    }
    return formData as T;
  }, [formData, isNewFormat]);

  // Função para atualizar os dados do formulário
  const updateFormData = useCallback((field: keyof T, value: any) => {
    setFormData(prev => {
      if (isNewFormat) {
        const currentData = prev as MultistepFormData;
        const updatedData = { ...currentData };
        
        // Atualiza o campo específico no form_data
        updatedData.form_data = {
          ...currentData.form_data,
          [field as string]: value
        };
        
        // Atualiza a data de atualização
        updatedData.updated_at = new Date().toISOString();
        
        return updatedData;
      } else {
        // Mantém a compatibilidade com o formato antigo
        return {
          ...prev,
          [field]: value,
          updated_at: new Date().toISOString()
        };
      }
    });
  }, [isNewFormat]);

  // Função para atualizar múltiplos campos de uma vez
  const updateMultipleFields = useCallback((updates: Partial<T>) => {
    setFormData(prev => {
      if (isNewFormat) {
        const currentData = prev as MultistepFormData;
        const updatedData = { ...currentData };
        
        // Atualiza os campos no form_data
        updatedData.form_data = {
          ...currentData.form_data,
          ...updates
        };
        
        updatedData.updated_at = new Date().toISOString();
        return updatedData;
      } else {
        return {
          ...prev,
          ...updates,
          updated_at: new Date().toISOString()
        };
      }
    });
  }, [isNewFormat]);

  // Form persistence hook
  const {
    saveState,
    saveNow,
    loadSavedData,
    clearSavedData,
    formatLastSaved,
    autoSave
  } = useFormPersistence<MultistepFormData | T>({
    formData,
    tableName,
    userId,
    recordId: recordId || (formData as any).id,
    config: {
      enabled: autoSaveConfig.enabled,
      interval: autoSaveConfig.interval,
      storage: autoSaveConfig.storage as 'localStorage' | 'supabase',
      key_prefix: autoSaveConfig.key_prefix
    }
  });

  // Form validation hook
  const {
    validateAll,
    validateField,
    touchField,
    getFieldState,
    getValidationSuggestions,
    validationSummary
  } = useFormValidation<T>({
    formData: getFormDataForStep(),
    rules: validationRules,
    validateOnChange: true,
    debounceMs: 300
  });

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const validateCurrentStep = useCallback(() => {
    const currentStepFields = currentStepData.fields;
    let isValid = true;

    for (const field of currentStepFields) {
      const fieldKey = field as keyof T;
      const fieldState = getFieldState(fieldKey);
      if (fieldState.hasError) {
        isValid = false;
        break;
      }

      // Check required fields
      const fieldRules = validationRules[fieldKey] || [];
      const hasRequiredRule = fieldRules.some(rule => rule.required);
      if (hasRequiredRule && (!formData[fieldKey] || formData[fieldKey] === '')) {
        isValid = false;
        break;
      }
    }

    return isValid;
  }, [currentStepData, getFieldState, validationRules, formData]);

  const goToNextStep = useCallback(() => {
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setVisitedSteps(prev => new Set([...prev, nextStep]));

      // Mark current step as completed
      setCompletedSteps(prev => new Set([...prev, currentStep]));

      onStepChange?.(nextStep, formData);
    }
  }, [currentStep, steps.length, formData, onStepChange, validateCurrentStep, toast]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Prepara os dados para envio
      let submissionData: any;
      
      if (isNewFormat) {
        // Para o novo formato, marca como concluído e atualiza os metadados
        const multistepData = {
          ...(formData as MultistepFormData),
          status: 'completed' as FormStatus,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          system_metadata: {
            ...(formData as MultistepFormData).system_metadata,
            last_ai_interaction: new Date().toISOString(),
            data_completeness: 100,
            confidence_score: 100
          }
        };
        
        // Converte para o formato esperado pelo componente pai
        submissionData = convertFromMultistepForm(multistepData);
      } else {
        // Mantém compatibilidade com o formato antigo
        submissionData = formData;
      }
      
      // Chama a função de submissão fornecida
      await onSubmit(submissionData as T);
      
      // Marca todos os passos como concluídos
      const allStepsCompleted = new Set(Array.from({ length: steps.length }, (_, i) => i));
      setCompletedSteps(allStepsCompleted);
      
      // Limpa rascunhos salvos após submissão bem-sucedida
      if (autoSaveConfig.enabled) {
        if (autoSaveConfig.storage === 'localStorage' && recordId) {
          localStorage.removeItem(`${autoSaveConfig.key_prefix}_${recordId}`);
        } else if (autoSaveConfig.storage === 'supabase' && tableName && recordId) {
          return await saveNow();
        }
      }
      
      // Feedback para o usuário
      toast({
        title: 'Success!',
        description: 'Seu formulário foi enviado com sucesso.',
        variant: 'default'
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Tenta salvar como rascunho em caso de erro
      try {
        if (autoSaveConfig.enabled) {
          await saveDraft(formData);
          
          toast({
            title: 'Rascunho salvo',
            description: 'Seu progresso foi salvo como rascunho. Você pode continuar mais tarde.',
            variant: 'default'
          });
        }
      } catch (saveError) {
        console.error('Error saving draft after submission error:', saveError);
      }
      
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao enviar o formulário. Seu progresso foi salvo como rascunho.',
        variant: 'destructive'
      });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const prevStep = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep(prev => Math.max(prev - 1, 0));
    }
  }, [isFirstStep]);

  const canProceedToStep = useCallback((stepIndex: number) => {
    if (stepIndex <= currentStep) return true;

    // Check if all previous steps are completed
    for (let i = 0; i < stepIndex; i++) {
      if (!completedSteps.has(i)) return false;
    }
    return true;
  }, [currentStep, completedSteps]);

  useEffect(() => {
    if (!autoSaveConfig.enabled) return;

    const interval = setInterval(async () => {
      if (formData && Object.keys(formData).length > 0) {
        await autoSave();
      }
    }, autoSaveConfig.interval);

    return () => clearInterval(interval);
  }, [formData, autoSaveConfig, autoSave]);

  return (
    <div className={cn("w-full max-w-full sm:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-6", className)}>
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2 hide-scrollbar gap-1 sm:gap-2">
          {steps.map((step, index) => {
            const status = canProceedToStep(index) ? 'completed' : 'pending';
            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(index)}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200 flex-shrink-0",
                    status === 'completed' && "bg-green-500 border-green-500 text-white",
                    status === 'pending' && "bg-white border-gray-300 text-gray-400"
                  )}
                >
                  {status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <span className="text-xs sm:text-sm font-medium">{index + 1}</span>
                  )}
                </button>

                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-4 sm:w-8 lg:w-16 h-0.5 mx-0.5 sm:mx-1 lg:mx-2 flex-shrink-0",
                    index < currentStep ? "bg-green-500" : "bg-gray-300"
                  )} />
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center px-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{currentStepData.title}</h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">{currentStepData.description}</p>
          {currentStepData.isOptional && (
            <Badge variant="outline" className="mt-1">Opcional</Badge>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            Etapa {currentStep + 1} de {steps.length}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(progress)}% concluído
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Auto-save Status */}
      {autoSaveConfig.enabled && (
        <div className="flex items-center justify-end mb-4 text-xs text-gray-500">
          {saveState.is_saving ? (
            <div className="flex items-center">
              <Save className="w-3 h-3 mr-1 animate-spin" />
              Salvando...
            </div>
          ) : saveState.last_saved ? (
            <div className="flex items-center">
              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
              {formatLastSaved()}
            </div>
          ) : null}
        </div>
      )}

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {currentStepData.icon && <span className="mr-2">{currentStepData.icon}</span>}
            {currentStepData.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepData.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {currentStepData.component({
                formData: processedFormData,
                updateFormData,
                getFieldState,
                getValidationSuggestions,
                validationSummary
              })}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 pt-6 mt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={isFirstStep}
              className="flex items-center justify-center w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={saveNow}
                disabled={saveState.is_saving || !saveState.has_unsaved_changes}
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Save className="w-4 h-4" />
                {saveState.is_saving ? 'Salvando...' : 'Salvar'}
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || validationSummary.errorCount > 0}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Finalizar'
                  )}
                </Button>
              ) : (
                <Button
                  onClick={goToNextStep}
                  disabled={!validateCurrentStep()}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  Próximo →
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MultistepForm;
