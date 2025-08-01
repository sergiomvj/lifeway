'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { useMultiStepForm } from '../hooks/useMultiStepForm'
import { FormData } from '../lib/types'

// Step Components
import PersonalInfoStep from './form-steps/PersonalInfoStep'
import ProfileTypeStep from './form-steps/ProfileTypeStep'
import FamilyDetailsStep from './form-steps/FamilyDetailsStep'
import EducationStep from './form-steps/EducationStep'
import ProfessionalStep from './form-steps/ProfessionalStep'
import ObjectivesStep from './form-steps/ObjectivesStep'
import FinancialStep from './form-steps/FinancialStep'
import ReviewStep from './form-steps/ReviewStep'

interface FormStepConfig {
  id: number
  title: string
  component: React.ComponentType<any>
  isConditional?: boolean
  condition?: (data: FormData) => boolean
}

const steps: FormStepConfig[] = [
  {
    id: 1,
    title: 'Dados Pessoais',
    component: PersonalInfoStep
  },
  {
    id: 2,
    title: 'Perfil',
    component: ProfileTypeStep
  },
  {
    id: 3,
    title: 'Dados Familiares',
    component: FamilyDetailsStep,
    isConditional: true,
    condition: (data) => data.profileType === 'family'
  },
  {
    id: 4,
    title: 'Educação',
    component: EducationStep,
    isConditional: true,
    condition: (data) => data.profileType === 'student' || data.profileType === 'family'
  },
  {
    id: 5,
    title: 'Profissional',
    component: ProfessionalStep,
    isConditional: true,
    condition: (data) => data.profileType === 'professional' || data.profileType === 'family'
  },
  {
    id: 6,
    title: 'Objetivos nos EUA',
    component: ObjectivesStep
  },
  {
    id: 7,
    title: 'Situação Financeira',
    component: FinancialStep
  },
  {
    id: 8,
    title: 'Revisão',
    component: ReviewStep
  }
]

interface MultiStepFormProps {
  onComplete?: (formData: FormData) => Promise<void>
  isSubmitting?: boolean
}

export default function MultiStepForm({ onComplete, isSubmitting }: MultiStepFormProps = {}) {
  const { 
    formData, 
    loading, 
    saving, 
    updateFormData, 
    nextStep, 
    prevStep, 
    completeForm 
  } = useMultiStepForm()

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filtrar steps baseado nas condições
  const activeSteps = steps.filter(step => {
    if (step.isConditional && step.condition) {
      return step.condition(formData)
    }
    return true
  })

  const currentStepIndex = activeSteps.findIndex(step => step.id === formData.currentStep)
  const currentStep = activeSteps[currentStepIndex]
  const totalSteps = activeSteps.length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azul-petroleo mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seu formulário...</p>
        </div>
      </div>
    )
  }

  const handleNext = async (stepData: Partial<FormData>) => {
    setErrors({})
    
    if (currentStepIndex === totalSteps - 1) {
      // Último step - completar formulário
      if (onComplete) {
        try {
          await onComplete({ ...formData, ...stepData })
        } catch (error) {
          setErrors({ general: 'Erro ao processar dados. Tente novamente.' })
        }
      } else {
        const success = await completeForm(stepData)
        if (!success) {
          setErrors({ general: 'Erro ao salvar dados. Tente novamente.' })
        }
      }
    } else {
      // Próximo step
      const success = await nextStep(stepData)
      if (!success) {
        setErrors({ general: 'Erro ao salvar dados. Tente novamente.' })
      }
    }
  }

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevStepId = activeSteps[currentStepIndex - 1].id
      updateFormData({ currentStep: prevStepId })
    }
  }

  if (!currentStep) {
    return <div>Erro: Step não encontrado</div>
  }

  const StepComponent = currentStep.component

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-baskerville text-gray-900">
              Questionário de Qualificação
            </h1>
            <span className="text-sm text-gray-600">
              {currentStepIndex + 1} de {totalSteps}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-azul-petroleo h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between mt-2">
            {activeSteps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStepIndex 
                    ? 'bg-azul-petroleo text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {index < currentStepIndex ? (
                    <CheckCircle size={16} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs mt-1 text-gray-600 hidden md:block">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{errors.general}</p>
            </div>
          )}

          <StepComponent
            data={formData}
            onNext={handleNext}
            onPrev={handlePrev}
            onUpdate={updateFormData}
            errors={errors}
            setErrors={setErrors}
            saving={saving || isSubmitting}
            isFirst={currentStepIndex === 0}
            isLast={currentStepIndex === totalSteps - 1}
          />
        </div>
      </div>
    </div>
  )
}
