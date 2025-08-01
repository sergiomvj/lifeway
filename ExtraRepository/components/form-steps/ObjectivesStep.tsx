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

export default function ObjectivesStep(props: StepProps) {
  const [formData, setFormData] = useState({
    usaObjectives: props.data.usaObjectives || [],
    targetStates: props.data.targetStates || [],
    timeline: props.data.timeline || '',
    freeFormAspirations: props.data.freeFormAspirations || ''
  })

  const handleNext = () => {
    const allowedTimelines = ['', '6months', '1year', '2years', '3years+'] as const;
    const timeline = allowedTimelines.includes(formData.timeline as any)
      ? (formData.timeline as '' | '6months' | '1year' | '2years' | '3years+')
      : '';
    props.onNext({
      usaObjectives: formData.usaObjectives,
      targetStates: formData.targetStates,
      timeline,
      freeFormAspirations: formData.freeFormAspirations
    })
  }

  const objectives = [
    'Trabalhar em empresa americana',
    'Empreender nos EUA',
    'Estudar em universidade americana',
    'Melhor qualidade de vida',
    'Educação para os filhos',
    'Segurança',
    'Oportunidades de carreira'
  ]

  const states = [
    'California', 'Texas', 'Florida', 'New York', 'Nevada', 'Washington', 'Colorado', 'Georgia'
  ]

  const toggleObjective = (objective: string) => {
    const updated = formData.usaObjectives.includes(objective)
      ? formData.usaObjectives.filter(o => o !== objective)
      : [...formData.usaObjectives, objective]
    setFormData({...formData, usaObjectives: updated})
  }

  const toggleState = (state: string) => {
    const updated = formData.targetStates.includes(state)
      ? formData.targetStates.filter(s => s !== state)
      : [...formData.targetStates, state]
    setFormData({...formData, targetStates: updated})
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-baskerville mb-2">Seus Objetivos nos EUA</h2>
        <p className="text-gray-600">
          O que você busca ao se mudar para os Estados Unidos?
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Principais Objetivos (selecione todos que se aplicam)
          </label>
          <div className="grid gap-2 md:grid-cols-2">
            {objectives.map(objective => (
              <label key={objective} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.usaObjectives.includes(objective)}
                  onChange={() => toggleObjective(objective)}
                  className="rounded border-gray-300 text-azul-petroleo focus:ring-azul-petroleo"
                />
                <span className="text-sm">{objective}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Estados de Interesse
          </label>
          <div className="grid gap-2 md:grid-cols-3">
            {states.map(state => (
              <label key={state} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.targetStates.includes(state)}
                  onChange={() => toggleState(state)}
                  className="rounded border-gray-300 text-azul-petroleo focus:ring-azul-petroleo"
                />
                <span className="text-sm">{state}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quando pretende se mudar?
          </label>
          <select
            value={formData.timeline}
            onChange={(e) => setFormData({...formData, timeline: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo"
          >
            <option value="">Selecione...</option>
            <option value="6months">Nos próximos 6 meses</option>
            <option value="1year">Em 1 ano</option>
            <option value="2years">Em 2 anos</option>
            <option value="3years+">Em mais de 3 anos</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conte-nos mais sobre seus sonhos e aspirações 
            <span className="text-xs text-gray-500 block mt-1">
              Descreva livremente o que você realmente deseja para seu futuro nos EUA. 
              Seja específico sobre suas motivações, medos, expectativas e qualquer detalhe que nos ajude a entender melhor seus objetivos.
            </span>
          </label>
          <textarea
            value={formData.freeFormAspirations}
            onChange={(e) => setFormData({...formData, freeFormAspirations: e.target.value})}
            placeholder="Ex: Quero que meus filhos tenham acesso a educação de qualidade, sonho em trabalhar com tecnologia no Vale do Silício, tenho medo do processo ser muito complicado, mas estou determinado a dar essa oportunidade para minha família..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo h-32 resize-none"
            rows={4}
          />
          <div className="text-xs text-gray-400 mt-1">
            💡 Dica: Quanto mais detalhes você compartilhar, melhor poderemos personalizar suas recomendações
          </div>
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
