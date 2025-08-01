'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FormData } from '../../lib/types'

interface EducationStepProps {
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

export default function EducationStep({
  data,
  onNext,
  onPrev,
  onUpdate,
  errors,
  setErrors,
  saving,
  isFirst,
  isLast
}: EducationStepProps) {
  const [formData, setFormData] = useState({
    education: data.education || {
      level: '',
      institution: '',
      course: '',
      gpa: undefined
    },
    englishLevel: (data.englishLevel as '' | 'basic' | 'intermediate' | 'advanced' | 'fluent') || ''
  })

  const handleInputChange = (field: string, value: any) => {
    let updated = { ...formData, [field]: value }
    // Corrigir tipagem para englishLevel
    if (field === 'englishLevel') {
      const allowed = ['', 'basic', 'intermediate', 'advanced', 'fluent'] as const;
      if (!allowed.includes(value as any)) {
        updated.englishLevel = ''
      } else {
        updated.englishLevel = value as '' | 'basic' | 'intermediate' | 'advanced' | 'fluent';
      }
    }
    setFormData(updated)
    onUpdate({ ...updated, englishLevel: updated.englishLevel as '' | 'basic' | 'intermediate' | 'advanced' | 'fluent' })
  }

  const handleEducationChange = (field: string, value: string | number) => {
    const updatedEducation = { ...formData.education, [field]: value }
    handleInputChange('education', updatedEducation)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.education.level) {
      newErrors.educationLevel = 'Nível de escolaridade é obrigatório'
    }

    if (!formData.englishLevel) {
      newErrors.englishLevel = 'Nível de inglês é obrigatório'
    }

    if (formData.education.level && !formData.education.institution.trim()) {
      newErrors.institution = 'Nome da instituição é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext({
        education: formData.education,
        englishLevel: formData.englishLevel as '' | 'basic' | 'intermediate' | 'advanced' | 'fluent'
      })
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-baskerville mb-2">Educação</h2>
        <p className="text-gray-600">
          Suas qualificações educacionais são importantes para determinar as melhores oportunidades nos EUA.
        </p>
      </div>

      <div className="space-y-6">
        {/* Nível de Escolaridade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maior Nível de Escolaridade *
          </label>
          <select
            value={formData.education.level}
            onChange={(e) => handleEducationChange('level', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo ${
              errors.educationLevel ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecione...</option>
            <option value="high_school">Ensino Médio</option>
            <option value="undergraduate">Superior Completo</option>
            <option value="graduate">Pós-graduação</option>
            <option value="postgraduate">Mestrado/Doutorado</option>
          </select>
          {errors.educationLevel && (
            <p className="text-red-500 text-sm mt-1">{errors.educationLevel}</p>
          )}
        </div>

        {/* Instituição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instituição de Ensino *
          </label>
          <input
            type="text"
            value={formData.education.institution}
            onChange={(e) => handleEducationChange('institution', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo ${
              errors.institution ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nome da universidade/escola"
          />
          {errors.institution && (
            <p className="text-red-500 text-sm mt-1">{errors.institution}</p>
          )}
        </div>

        {/* Curso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Curso/Área de Estudo
          </label>
          <input
            type="text"
            value={formData.education.course}
            onChange={(e) => handleEducationChange('course', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo"
            placeholder="Ex: Engenharia de Software, Administração..."
          />
        </div>

        {/* GPA/Nota */}
        {formData.education.level !== 'high_school' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nota Média (CRA/GPA)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={formData.education.gpa || ''}
              onChange={(e) => handleEducationChange('gpa', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo"
              placeholder="Ex: 8.5"
            />
            <p className="text-sm text-gray-500 mt-1">
              Escala de 0 a 10 (opcional, mas melhora sua qualificação)
            </p>
          </div>
        )}

        {/* Nível de Inglês */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nível de Inglês *
          </label>
          <select
            value={formData.englishLevel}
            onChange={(e) => handleInputChange('englishLevel', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo ${
              errors.englishLevel ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecione...</option>
            <option value="basic">Básico</option>
            <option value="intermediate">Intermediário</option>
            <option value="advanced">Avançado</option>
            <option value="fluent">Fluente</option>
          </select>
          {errors.englishLevel && (
            <p className="text-red-500 text-sm mt-1">{errors.englishLevel}</p>
          )}
          <div className="mt-2 text-sm text-gray-600">
            <p><strong>Básico:</strong> Consigo me comunicar em situações simples</p>
            <p><strong>Intermediário:</strong> Consigo me comunicar na maioria das situações</p>
            <p><strong>Avançado:</strong> Domino bem o idioma, com pequenas dificuldades</p>
            <p><strong>Fluente:</strong> Domino completamente o idioma</p>
          </div>
        </div>

        {/* Dica sobre Inglês */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Dica Importante</h4>
          <p className="text-blue-800 text-sm">
            O domínio do inglês é um dos fatores mais importantes para o sucesso nos EUA. 
            Considere investir em cursos ou certificações como TOEFL/IELTS se seu nível ainda não é avançado.
          </p>
        </div>
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
