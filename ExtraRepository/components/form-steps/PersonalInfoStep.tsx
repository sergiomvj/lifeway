'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { FormData } from '../../lib/types'

interface PersonalInfoStepProps {
  data: FormData
  onNext: (data: Partial<FormData>) => void
  onUpdate: (data: Partial<FormData>) => void
  errors: Record<string, string>
  setErrors: (errors: Record<string, string>) => void
  saving: boolean
  isFirst: boolean
  isLast: boolean
}

export default function PersonalInfoStep({
  data,
  onNext,
  onUpdate,
  errors,
  setErrors,
  saving,
  isFirst,
  isLast
}: PersonalInfoStepProps) {
  const [formData, setFormData] = useState({
    fullName: data.fullName || '',
    birthDate: data.birthDate || ''
  })

  const handleInputChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    onUpdate(updated)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório'
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória'
    } else {
      // Cálculo correto da idade considerando mês e dia
      const birthDate = new Date(formData.birthDate)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      // Se ainda não fez aniversário este ano, diminui 1 da idade
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      if (age < 18) {
        newErrors.birthDate = 'Você deve ter pelo menos 18 anos'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-baskerville mb-2">Dados Pessoais</h2>
        <p className="text-gray-600">
          Vamos começar com suas informações básicas para criar seu perfil.
        </p>
      </div>

      <div className="space-y-6">
        {/* Nome Completo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Seu nome completo"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Data de Nascimento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Nascimento *
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo ${
              errors.birthDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.birthDate && (
            <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <div></div> {/* Espaço vazio pois é o primeiro step */}
        
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
