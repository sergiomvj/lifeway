'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { FormData } from '../../lib/types'

interface FamilyDetailsStepProps {
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

export default function FamilyDetailsStep({
  data,
  onNext,
  onPrev,
  onUpdate,
  errors,
  setErrors,
  saving,
  isFirst,
  isLast
}: FamilyDetailsStepProps) {
  const [formData, setFormData] = useState(() => ({
    maritalStatus: data.maritalStatus || '',
    spouse: data.spouse || { name: '', birthDate: '', education: '', profession: '' },
    children: data.children || []
  }))

  useEffect(() => {
    setFormData({
      maritalStatus: data.maritalStatus || '',
      spouse: data.spouse || { name: '', birthDate: '', education: '', profession: '' },
      children: data.children || []
    })
  }, [data])

  const handleInputChange = (field: string, value: any) => {
    let updated = { ...formData, [field]: value }
    // Corrigir tipagem para maritalStatus
    if (field === 'maritalStatus') {
      const allowed = ['', 'single', 'married', 'divorced', 'widowed'] as const;
      if (!allowed.includes(value as any)) {
        updated.maritalStatus = ''
      } else {
        updated.maritalStatus = value as '' | 'single' | 'married' | 'divorced' | 'widowed';
      }
      setFormData(updated)
      onUpdate({
        ...updated,
        maritalStatus: updated.maritalStatus as '' | 'single' | 'married' | 'divorced' | 'widowed'
      })
      return;
    }
    setFormData(updated)
    // Corrigir tipagem para garantir compatibilidade com Partial<FormData>
    onUpdate({
      ...updated,
      maritalStatus: updated.maritalStatus as '' | 'single' | 'married' | 'divorced' | 'widowed'
    })
  }

  const handleSpouseChange = (field: string, value: string) => {
    const updatedSpouse = { ...formData.spouse, [field]: value }
    handleInputChange('spouse', updatedSpouse)
  }

  const addChild = () => {
    const newChild = { name: '', birthDate: '', education: '' }
    const updatedChildren = [...formData.children, newChild]
    handleInputChange('children', updatedChildren)
  }

  const removeChild = (index: number) => {
    const updatedChildren = formData.children.filter((_, i) => i !== index)
    handleInputChange('children', updatedChildren)
  }

  const handleChildChange = (index: number, field: string, value: string) => {
    const updatedChildren = formData.children.map((child, i) => 
      i === index ? { ...child, [field]: value } : child
    )
    handleInputChange('children', updatedChildren)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.maritalStatus) {
      newErrors.maritalStatus = 'Estado civil é obrigatório'
    }

    if (formData.maritalStatus === 'married') {
      if (!formData.spouse.name.trim()) {
        newErrors.spouseName = 'Nome do cônjuge é obrigatório'
      }
      if (!formData.spouse.birthDate) {
        newErrors.spouseBirthDate = 'Data de nascimento do cônjuge é obrigatória'
      }
    }

    // Validar filhos
    formData.children.forEach((child, index) => {
      if (child.name && !child.birthDate) {
        newErrors[`child${index}BirthDate`] = 'Data de nascimento é obrigatória'
      }
      if (child.birthDate && !child.name.trim()) {
        newErrors[`child${index}Name`] = 'Nome é obrigatório'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext({
        maritalStatus: formData.maritalStatus as '' | 'single' | 'married' | 'divorced' | 'widowed',
        spouse: formData.spouse,
        children: formData.children
      })
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-baskerville mb-2">Dados Familiares</h2>
        <p className="text-gray-600">
          Conte-nos sobre sua família para planejarmos a mudança de todos.
        </p>
      </div>

      <div className="space-y-6 section2" style={{ marginTop: 20 }}>
        {/* Estado Civil */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado Civil *
          </label>
          <select
            value={formData.maritalStatus}
            onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo ${
              errors.maritalStatus ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecione...</option>
            <option value="single">Solteiro(a)</option>
            <option value="married">Casado(a)</option>
            <option value="divorced">Divorciado(a)</option>
            <option value="widowed">Viúvo(a)</option>
          </select>
          {errors.maritalStatus && (
            <p className="text-red-500 text-sm mt-1">{errors.maritalStatus}</p>
          )}
        </div>

        {/* Dados do Cônjuge */}
        {formData.maritalStatus === 'married' && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-4">Dados do Cônjuge</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.spouse.name}
                  onChange={(e) => handleSpouseChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azul-petroleo ${
                    errors.spouseName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nome do cônjuge"
                />
                {errors.spouseName && (
                  <p className="text-red-500 text-sm mt-1">{errors.spouseName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  value={formData.spouse.birthDate}
                  onChange={(e) => handleSpouseChange('birthDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-azul-petroleo ${
                    errors.spouseBirthDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.spouseBirthDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.spouseBirthDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Escolaridade
                </label>
                <select
                  value={formData.spouse.education}
                  onChange={(e) => handleSpouseChange('education', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo"
                >
                  <option value="">Selecione...</option>
                  <option value="high_school">Ensino Médio</option>
                  <option value="undergraduate">Superior</option>
                  <option value="graduate">Pós-graduação</option>
                  <option value="postgraduate">Mestrado/Doutorado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profissão
                </label>
                <input
                  type="text"
                  value={formData.spouse.profession}
                  onChange={(e) => handleSpouseChange('profession', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo"
                  placeholder="Profissão atual"
                />
              </div>
            </div>
          </div>
        )}

        {/* Filhos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Filhos
            </label>
            <button
              type="button"
              onClick={addChild}
              className="flex items-center space-x-1 text-azul-petroleo hover:text-blue-700"
            >
              <Plus size={16} />
              <span className="text-sm">Adicionar filho</span>
            </button>
          </div>

          {formData.children.map((child, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Filho {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeChild(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={child.name}
                    onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo ${
                      errors[`child${index}Name`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nome do filho"
                  />
                  {errors[`child${index}Name`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`child${index}Name`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    value={child.birthDate}
                    onChange={(e) => handleChildChange(index, 'birthDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo ${
                      errors[`child${index}BirthDate`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors[`child${index}BirthDate`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`child${index}BirthDate`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Escolaridade
                  </label>
                  <select
                    value={child.education}
                    onChange={(e) => handleChildChange(index, 'education', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo"
                  >
                    <option value="">Selecione...</option>
                    <option value="preschool">Pré-escola</option>
                    <option value="elementary">Fundamental</option>
                    <option value="middle">Ensino Médio</option>
                    <option value="high_school">Ensino Médio</option>
                    <option value="college">Faculdade</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          {formData.children.length === 0 && (
            <p className="text-gray-500 text-sm">
              Nenhum filho adicionado. Clique em "Adicionar filho" se tiver filhos.
            </p>
          )}
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
