'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Users, GraduationCap, Briefcase } from 'lucide-react'
import { FormData } from '../../lib/types'

interface ProfileTypeStepProps {
  data: FormData
  onNext: (data: Partial<FormData>) => void
  onPrev: () => void
  onUpdate: (data: Partial<FormData>) => void
  errors: Record<string, string>
  setErrors: (errors: Record<string, string>) => void
  saving: boolean
  isFirst: boolean
  isLast: boolean
}

export default function ProfileTypeStep({
  data,
  onNext,
  onPrev,
  onUpdate,
  errors,
  setErrors,
  saving,
  isFirst,
  isLast
}: ProfileTypeStepProps) {
  const [selectedProfile, setSelectedProfile] = useState<string>(data.profileType || '')

  const profileOptions = [
    {
      id: 'family',
      title: 'Família',
      description: 'Planejando mudar com cônjuge e/ou filhos',
      icon: Users,
      details: [
        'Orientações específicas para famílias',
        'Análise de custos familiares',
        'Planejamento educacional para filhos',
        'Vistos familiares'
      ]
    },
    {
      id: 'student',
      title: 'Estudante',
      description: 'Buscando oportunidades acadêmicas nos EUA',
      icon: GraduationCap,
      details: [
        'Universidades e programas de estudo',
        'Vistos de estudante',
        'Bolsas e financiamentos',
        'Transição para trabalho pós-graduação'
      ]
    },
    {
      id: 'professional',
      title: 'Profissional',
      description: 'Focado em oportunidades de trabalho e carreira',
      icon: Briefcase,
      details: [
        'Mercado de trabalho americano',
        'Vistos de trabalho',
        'Reconhecimento profissional',
        'Oportunidades de empreendedorismo'
      ]
    }
  ]

  const handleSelectProfile = (profileId: string) => {
    setSelectedProfile(profileId)
    onUpdate({ profileType: profileId as FormData['profileType'] })
    setErrors({})
  }

  const validateForm = () => {
    if (!selectedProfile) {
      setErrors({ profileType: 'Selecione um perfil para continuar' })
      return false
    }
    return true
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext({ profileType: selectedProfile as FormData['profileType'] })
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-baskerville mb-2">Qual é o seu perfil?</h2>
        <p className="text-gray-600">
          Isso nos ajudará a personalizar as recomendações e ferramentas específicas para você.
        </p>
      </div>

      {errors.profileType && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{errors.profileType}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {profileOptions.map((option) => {
          const Icon = option.icon
          const isSelected = selectedProfile === option.id
          
          return (
            <div
              key={option.id}
              onClick={() => handleSelectProfile(option.id)}
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-lg ${
                isSelected 
                  ? 'border-azul-petroleo bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center mb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  isSelected ? 'bg-azul-petroleo text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon size={32} />
                </div>
                
                <h3 className="text-lg font-baskerville mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{option.description}</p>
              </div>

              <ul className="space-y-2">
                {option.details.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                      isSelected ? 'bg-azul-petroleo' : 'bg-gray-400'
                    }`} />
                    <span className="text-sm text-gray-700">{detail}</span>
                  </li>
                ))}
              </ul>

              {isSelected && (
                <div className="mt-4 p-3 bg-azul-petroleo text-white rounded-lg text-center">
                  <span className="text-sm font-medium">✓ Perfil Selecionado</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft size={16} />
          <span>Anterior</span>
        </button>
        
        <button
          onClick={handleNext}
          disabled={saving}
          className="flex items-center space-x-2 bg-azul-petroleo text-white px-6 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50"
        >
          <span>{saving ? 'Salvando...' : 'Próximo'}</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
