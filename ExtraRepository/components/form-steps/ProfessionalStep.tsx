'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FormData } from '../../lib/types'

interface StepProps {
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

export default function ProfessionalStep(props: StepProps) {
  const [formData, setFormData] = useState({
    profession: props.data.profession || '',
    experience: props.data.experience || 0,
    currentSalary: props.data.currentSalary || 0,
    skills: props.data.skills || []
  })

  const handleNext = () => {
    props.onNext(formData)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-baskerville mb-2">Experiência Profissional</h2>
        <p className="text-gray-600">
          Conte-nos sobre sua carreira e experiência profissional.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profissão Atual
          </label>
          <input
            type="text"
            value={formData.profession}
            onChange={(e) => setFormData({...formData, profession: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azul-petroleo"
            placeholder="Ex: Desenvolvedor de Software"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Anos de Experiência
          </label>
          <input
            type="number"
            min="0"
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value) || 0})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azul-petroleo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salário Atual (R$)
          </label>
          <input
            type="number"
            min="0"
            value={formData.currentSalary}
            onChange={(e) => setFormData({...formData, currentSalary: parseInt(e.target.value) || 0})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azul-petroleo"
            placeholder="Salário mensal"
          />
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={props.onPrev}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft size={16} />
          <span>Anterior</span>
        </button>
        
        <button
          onClick={handleNext}
          disabled={props.saving}
          className="flex items-center space-x-2 bg-azul-petroleo text-white px-6 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50"
        >
          <span>{props.saving ? 'Salvando...' : 'Próximo'}</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
