'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, DollarSign } from 'lucide-react'
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

export default function FinancialStep(props: StepProps) {
  const [formData, setFormData] = useState({
    currentSavings: props.data.currentSavings || 0,
    monthlyIncome: props.data.monthlyIncome || 0,
    investmentCapacity: props.data.investmentCapacity || 0
  })

  const handleInputChange = (field: string, value: number) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    props.onUpdate(updated)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.monthlyIncome <= 0) {
      newErrors.monthlyIncome = 'Renda mensal é obrigatória'
    }

    props.setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      props.onNext(formData)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-baskerville mb-2">Situação Financeira</h2>
        <p className="text-gray-600">
          Suas informações financeiras nos ajudam a calcular a viabilidade da mudança.
        </p>
      </div>

      <div className="space-y-6">
        {/* Renda Mensal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Renda Mensal Familiar *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="number"
              min="0"
              value={formData.monthlyIncome || ''}
              onChange={(e) => handleInputChange('monthlyIncome', parseInt(e.target.value) || 0)}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo ${
                props.errors.monthlyIncome ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="5000"
            />
          </div>
          {props.errors.monthlyIncome && (
            <p className="text-red-500 text-sm mt-1">{props.errors.monthlyIncome}</p>
          )}
          {formData.monthlyIncome > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {formatCurrency(formData.monthlyIncome)} por mês
            </p>
          )}
        </div>

        {/* Reservas Atuais */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reservas/Poupança Atual
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="number"
              min="0"
              value={formData.currentSavings || ''}
              onChange={(e) => handleInputChange('currentSavings', parseInt(e.target.value) || 0)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo"
              placeholder="20000"
            />
          </div>
          {formData.currentSavings > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {formatCurrency(formData.currentSavings)} disponível
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Recomendamos pelo menos R$ 20.000 para a mudança inicial
          </p>
        </div>

        {/* Capacidade de Investimento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Capacidade de Investimento Mensal
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="number"
              min="0"
              value={formData.investmentCapacity || ''}
              onChange={(e) => handleInputChange('investmentCapacity', parseInt(e.target.value) || 0)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo"
              placeholder="1000"
            />
          </div>
          {formData.investmentCapacity > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {formatCurrency(formData.investmentCapacity)} por mês
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Quanto você pode destinar mensalmente para preparar a mudança
          </p>
        </div>

        {/* Análise Rápida */}
        {formData.monthlyIncome > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Análise Rápida</h4>
            <div className="space-y-1 text-blue-800 text-sm">
              {formData.monthlyIncome >= 15000 && (
                <p>✅ Sua renda está em uma faixa competitiva para os EUA</p>
              )}
              {formData.monthlyIncome >= 8000 && formData.monthlyIncome < 15000 && (
                <p>⚠️ Sua renda é boa, mas prepare-se para ajustes no padrão de vida inicial</p>
              )}
              {formData.monthlyIncome < 8000 && (
                <p>⚡ Considere aumentar sua renda antes da mudança para facilitar a transição</p>
              )}
              
              {formData.currentSavings >= 100000 && (
                <p>✅ Excelente reserva financeira para a mudança</p>
              )}
              {formData.currentSavings >= 50000 && formData.currentSavings < 100000 && (
                <p>✅ Boa reserva financeira</p>
              )}
              {formData.currentSavings >= 20000 && formData.currentSavings < 50000 && (
                <p>⚠️ Reserva adequada para começar</p>
              )}
              {formData.currentSavings < 20000 && (
                <p>⚡ Recomendamos aumentar suas reservas antes da mudança</p>
              )}
            </div>
          </div>
        )}

        {/* Dicas Financeiras */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">💰 Dicas Importantes</h4>
          <ul className="space-y-1 text-yellow-800 text-sm">
            <li>• Custo médio inicial nos EUA: $15,000 - $30,000 (R$ 75k - 150k)</li>
            <li>• Considere custos de visto, mudança, moradia e adaptação</li>
            <li>• Tenha reserva para pelo menos 6 meses de despesas</li>
            <li>• Planeje fontes de renda desde o primeiro mês</li>
          </ul>
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
