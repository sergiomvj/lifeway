'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, CheckCircle, AlertCircle, Calendar, MapPin, DollarSign, GraduationCap, Users } from 'lucide-react'
import { FormData } from '../../lib/types'
import { calculateQualification, getQualificationReport } from '../../lib/qualification'

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

export default function ReviewStep(props: StepProps) {
  const [qualificationReport, setQualificationReport] = useState<any>(null)

  useEffect(() => {
    const report = getQualificationReport(props.data)
    setQualificationReport(report)
  }, [props.data])

  const handleComplete = () => {
    const finalData = {
      ...props.data,
      qualify: qualificationReport?.isQualified || false,
      isCompleted: true
    }
    props.onNext(finalData)
  }

  const getAge = (birthDate: string) => {
    if (!birthDate) return 'Não informado'
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear()
    return `${age} anos`
  }

  const formatCurrency = (value: number | undefined) => {
    if (!value) return 'Não informado'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getEducationLabel = (level: string) => {
    const labels: Record<string, string> = {
      'high_school': 'Ensino Médio',
      'undergraduate': 'Superior',
      'graduate': 'Pós-graduação',
      'postgraduate': 'Mestrado/Doutorado'
    }
    return labels[level] || level
  }

  const getEnglishLabel = (level: string) => {
    const labels: Record<string, string> = {
      'basic': 'Básico',
      'intermediate': 'Intermediário',
      'advanced': 'Avançado',
      'fluent': 'Fluente'
    }
    return labels[level] || level
  }

  const getTimelineLabel = (timeline: string) => {
    const labels: Record<string, string> = {
      '6months': 'Próximos 6 meses',
      '1year': '1 ano',
      '2years': '2 anos',
      '3years+': 'Mais de 3 anos'
    }
    return labels[timeline] || timeline
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-baskerville mb-2">Revisão e Resultado</h2>
        <p className="text-gray-600">
          Revise suas informações e veja sua análise de qualificação para os EUA.
        </p>
      </div>

      {/* Resultado da Qualificação */}
      {qualificationReport && (
        <div className={`p-6 rounded-lg border-2 mb-8 ${
          qualificationReport.isQualified 
            ? 'border-green-200 bg-green-50' 
            : 'border-yellow-200 bg-yellow-50'
        }`}>
          <div className="flex items-center mb-4">
            {qualificationReport.isQualified ? (
              <CheckCircle className="text-green-600 mr-3" size={32} />
            ) : (
              <AlertCircle className="text-yellow-600 mr-3" size={32} />
            )}
            <div>
              <h3 className={`text-xl font-baskerville ${
                qualificationReport.isQualified ? 'text-green-900' : 'text-yellow-900'
              }`}>
                {qualificationReport.isQualified ? 'Parabéns! Você está qualificado!' : 'Quase lá!'}
              </h3>
              <p className={`${
                qualificationReport.isQualified ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {qualificationReport.message}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Pontuação: {qualificationReport.score}/24 pontos
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  qualificationReport.isQualified ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${(qualificationReport.score / 24) * 100}%` }}
              />
            </div>
          </div>

          {qualificationReport.recommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Recomendações para melhorar:</h4>
              <ul className="space-y-1">
                {qualificationReport.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Resumo dos Dados */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Dados Pessoais */}
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Users className="mr-2 text-azul-petroleo" size={20} />
            Dados Pessoais
          </h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Nome:</span> {props.data.fullName}</p>
            <p><span className="font-medium">Idade:</span> {getAge(props.data.birthDate)}</p>
            <p><span className="font-medium">Perfil:</span> {
              props.data.profileType === 'family' ? 'Família' :
              props.data.profileType === 'student' ? 'Estudante' :
              props.data.profileType === 'professional' ? 'Profissional' : 'Não definido'
            }</p>
            <p><span className="font-medium">Passaporte:</span> {props.data.passport ? 'Sim' : 'Não'}</p>
          </div>
        </div>

        {/* Educação */}
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <GraduationCap className="mr-2 text-azul-petroleo" size={20} />
            Educação
          </h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Escolaridade:</span> {
              props.data.education?.level ? getEducationLabel(props.data.education.level) : 'Não informado'
            }</p>
            <p><span className="font-medium">Inglês:</span> {
              props.data.englishLevel ? getEnglishLabel(props.data.englishLevel) : 'Não informado'
            }</p>
            <p><span className="font-medium">Instituição:</span> {props.data.education?.institution || 'Não informado'}</p>
          </div>
        </div>

        {/* Profissional */}
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <DollarSign className="mr-2 text-azul-petroleo" size={20} />
            Situação Financeira
          </h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Renda Mensal:</span> {formatCurrency(props.data.monthlyIncome)}</p>
            <p><span className="font-medium">Reservas:</span> {formatCurrency(props.data.currentSavings)}</p>
            <p><span className="font-medium">Profissão:</span> {props.data.profession || 'Não informado'}</p>
            <p><span className="font-medium">Experiência:</span> {
              props.data.experience ? `${props.data.experience} anos` : 'Não informado'
            }</p>
          </div>
        </div>

        {/* Objetivos */}
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <MapPin className="mr-2 text-azul-petroleo" size={20} />
            Objetivos nos EUA
          </h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Quando:</span> {
              props.data.timeline ? getTimelineLabel(props.data.timeline) : 'Não definido'
            }</p>
            <p><span className="font-medium">Estados:</span> {
              props.data.targetStates?.length ? props.data.targetStates.join(', ') : 'Não selecionados'
            }</p>
            <p><span className="font-medium">Objetivos:</span> {
              props.data.usaObjectives?.length ? `${props.data.usaObjectives.length} selecionados` : 'Nenhum'
            }</p>
          </div>
        </div>
      </div>

      {/* Família (se aplicável) */}
      {props.data.profileType === 'family' && (
        <div className="bg-white border rounded-lg p-4 mt-6">
          <h4 className="font-medium text-gray-900 mb-3">Família</h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Estado Civil:</span> {
              props.data.maritalStatus === 'married' ? 'Casado(a)' :
              props.data.maritalStatus === 'single' ? 'Solteiro(a)' :
              props.data.maritalStatus === 'divorced' ? 'Divorciado(a)' :
              props.data.maritalStatus === 'widowed' ? 'Viúvo(a)' : 'Não informado'
            }</p>
            {props.data.spouse?.name && (
              <p><span className="font-medium">Cônjuge:</span> {props.data.spouse.name}</p>
            )}
            <p><span className="font-medium">Filhos:</span> {
              props.data.children?.length ? `${props.data.children.length} filhos` : 'Nenhum filho informado'
            }</p>
          </div>
        </div>
      )}

      {/* Próximos Passos */}
      <div className="mt-8 p-6 bg-azul-petroleo text-white rounded-lg">
        <h4 className="font-baskerville text-lg mb-3">🚀 Próximos Passos</h4>
        <div className="space-y-2 text-sm">
          {qualificationReport?.isQualified ? (
            <>
              <p>✅ Acesse seu dashboard personalizado</p>
              <p>✅ Use nossas ferramentas gratuitas de planejamento</p>
              <p>✅ Explore oportunidades específicas para seu perfil</p>
              <p>✅ Considere nosso plano Pro para ferramentas avançadas</p>
            </>
          ) : (
            <>
              <p>📝 Siga as recomendações para melhorar sua qualificação</p>
              <p>🎯 Use nossas ferramentas gratuitas para se preparar</p>
              <p>📚 Acesse conteúdo educacional no nosso blog</p>
              <p>🔄 Refaça o questionário quando melhorar seu perfil</p>
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={props.onPrev}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft size={16} />
          <span>Anterior</span>
        </button>
        
        <button
          onClick={handleComplete}
          disabled={props.saving}
          className="flex items-center space-x-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
        >
          <CheckCircle size={20} />
          <span>{props.saving ? 'Finalizando...' : 'Finalizar Questionário'}</span>
        </button>
      </div>
    </div>
  )
}
