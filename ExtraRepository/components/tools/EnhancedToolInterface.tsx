"use client"
import { useState, useEffect } from 'react'
import { useUser } from '../../lib/auth-context'
import { Eye, Play, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import SafeDate from '../SafeDate'

interface ToolReport {
  id: number
  user_id: string
  tool_type: string
  input_data: any
  ai_response: string
  created_at: string
}

interface EnhancedToolInterfaceProps {
  toolType: 'criador_sonhos' | 'get_opportunity' | 'visa_match'
  toolName: string
  toolDescription: string
  toolIcon: React.ReactNode
  prospectId: string
  onGenerateReport: () => Promise<string>
}

export default function EnhancedToolInterface({
  toolType,
  toolName,
  toolDescription,
  toolIcon,
  prospectId,
  onGenerateReport
}: EnhancedToolInterfaceProps) {
  const { user } = useUser()
  
  // Email de teste para desenvolvimento quando não há usuário logado
  const currentUserEmail = user?.email || 'desenvolvimento@teste.com'
  
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [hasExistingReport, setHasExistingReport] = useState(false)
  const [existingReports, setExistingReports] = useState<ToolReport[]>([])
  const [currentReport, setCurrentReport] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showReports, setShowReports] = useState(false)

  // Verificar se há relatórios existentes
  useEffect(() => {
    checkExistingReports()
  }, [currentUserEmail, toolType])

  const checkExistingReports = async () => {
    if (!currentUserEmail) {
      return
    }

    try {
      const url = `/api/tools/${toolType.replace('_', '-')}?email=${encodeURIComponent(currentUserEmail)}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      })
      
      if (!response.ok) {
        setExistingReports([])
        setHasExistingReport(false)
        return
      }
      
      const data = await response.json()
      
      if (data.reports && Array.isArray(data.reports) && data.reports.length > 0) {
        setExistingReports(data.reports)
        setHasExistingReport(true)
      } else if (data.report) {
        // Caso seja um único relatório no formato antigo
        setExistingReports([data.report])
        setHasExistingReport(true)
      } else {
        setExistingReports([])
        setHasExistingReport(false)
      }
    } catch (error) {
      setExistingReports([])
      setHasExistingReport(false)
    }
  }

  const handleGenerateReport = async () => {
    if (!currentUserEmail) {
      setError('Usuário não autenticado')
      return
    }

    setLoading(true)
    setError(null)
    setCurrentReport(null)
    setProgress(0)

    try {
      // Simular progresso da geração
      const progressSteps = [
        { progress: 10, message: 'Carregando dados do usuário...' },
        { progress: 25, message: 'Analisando perfil...' },
        { progress: 40, message: 'Consultando OpenAI...' },
        { progress: 60, message: 'Gerando relatório personalizado...' },
        { progress: 80, message: 'Finalizando análise...' },
        { progress: 95, message: 'Salvando no banco de dados...' },
        { progress: 100, message: 'Relatório concluído!' }
      ]

      // Executar steps de progresso
      for (const step of progressSteps) {
        setProgress(step.progress)
        setProgressMessage(step.message)
        
        // Delay para mostrar o progresso
        if (step.progress < 100) {
          await new Promise(resolve => setTimeout(resolve, 800))
        }
      }

      // Gerar o relatório real
      const report = await onGenerateReport()
      setCurrentReport(report)
      
      // Atualizar lista de relatórios
      await checkExistingReports()

    } catch (e: any) {
      setError(e.message || 'Erro ao gerar relatório')
      setProgress(0)
      setProgressMessage('')
    } finally {
      setLoading(false)
    }
  }

  const handleViewReport = (report: ToolReport) => {
    setCurrentReport(report.ai_response)
    setShowReports(false)
  }

  const handleDownloadReport = (report: ToolReport) => {
    const blob = new Blob([report.ai_response], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const date = new Date(report.created_at)
    const formattedDate = date.toLocaleDateString('pt-BR').replace(/\//g, '-')
    a.download = `${toolName}_${formattedDate}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header da ferramenta */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {toolIcon}
            <div>
              <h3 className="font-baskerville text-xl font-semibold text-gray-900">
                {toolName}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {toolDescription}
              </p>
            </div>
          </div>
          
          {/* Status da ferramenta */}
          <div className="flex items-center space-x-2">
            {hasExistingReport && (
              <div className="flex items-center text-green-600 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span>Relatório disponível</span>
              </div>
            )}
            {!hasExistingReport && (
              <div className="flex items-center text-gray-500 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>Nenhum relatório gerado</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Área de controles */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Botão Gerar Relatório */}
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="flex-1 bg-azul-petroleo text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>{loading ? 'Gerando...' : 'Gerar Novo Relatório'}</span>
          </button>

          {/* Botão Ver Resultado */}
          <button
            onClick={() => setShowReports(!showReports)}
            disabled={!hasExistingReport}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 ${
              hasExistingReport 
                ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
            }`}
            title={hasExistingReport ? 'Clique para ver seus relatórios' : 'Nenhum relatório encontrado - gere um primeiro'}
          >
            <Eye className="w-5 h-5" />
            <span>Ver Resultados</span>
            {existingReports.length > 0 && (
              <span className="bg-white bg-opacity-20 text-white text-xs px-2 py-1 rounded-full ml-2">
                {existingReports.length}
              </span>
            )}
          </button>
        </div>

        {/* Barra de progresso */}
        {loading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">
                Gerando relatório...
              </span>
              <span className="text-sm font-medium text-blue-900">
                {progress}%
              </span>
            </div>
            
            <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="flex items-center text-sm text-blue-800">
              <Clock className="w-4 h-4 mr-2" />
              <span>{progressMessage}</span>
            </div>
          </div>
        )}

        {/* Lista de relatórios existentes */}
        {showReports && existingReports.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Relatórios Anteriores</h4>
            <div className="space-y-2">
              {existingReports.map((report, index) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      Relatório #{existingReports.length - index}
                    </div>
                    <div className="text-sm text-gray-500">
                      <SafeDate dateString={report.created_at} format="full" />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewReport(report)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver</span>
                    </button>
                    <button
                      onClick={() => handleDownloadReport(report)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exibição do erro */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Exibição do relatório atual */}
        {currentReport && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Relatório Gerado com Sucesso
              </h4>
              <button
                onClick={() => handleDownloadReport({
                  id: 0,
                  user_id: user?.email || '',
                  tool_type: toolType,
                  input_data: {},
                  ai_response: currentReport,
                  created_at: new Date().toISOString()
                })}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed bg-white p-4 rounded border">
                {currentReport}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
