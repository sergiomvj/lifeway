"use client"
import { Briefcase } from 'lucide-react'
import { useUser } from '../../lib/auth-context'
import EnhancedToolInterface from './EnhancedToolInterface'

export default function GetOpportunityClient({ prospectId }: { prospectId: string }) {
  const { user } = useUser()

  const handleGenerateReport = async (): Promise<string> => {
    // Usar o mesmo email que o EnhancedToolInterface usa
    const currentUserEmail = user?.email || 'desenvolvimento@teste.com'
    
    if (!currentUserEmail) throw new Error('Usuário não autenticado')
    
    // Buscar dados do formulário do backend
    const formRes = await fetch(`/api/form/save-local?user_email=${encodeURIComponent(currentUserEmail)}`)
    const formJson = await formRes.json()
    
    if (!formJson.success || !formJson.data) {
      // Se não houver dados do formulário, usar dados padrão para teste
      const defaultData = {
        fullName: 'Usuário Teste',
        email: currentUserEmail,
        aspiracoes: 'Buscar oportunidades profissionais nos Estados Unidos',
        profession: 'Profissional',
        maritalStatus: 'Solteiro(a)',
        usaObjectives: 'Crescimento profissional e melhores oportunidades de carreira'
      }
      
      // Chamar endpoint da ferramenta com dados padrão
      const res = await fetch('/api/tools/get-opportunity/process-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaultData)
      })
      
      const data = await res.json()
      if (!data.success && !data.report) throw new Error(data.error || 'Erro ao gerar análise')
      
      return data.report || data.analysis
    }
    
    const formData = formJson.data.data
    
    // Garantir que o email esteja correto nos dados do formulário
    formData.email = currentUserEmail
    
    // Chamar endpoint da ferramenta
    const res = await fetch('/api/tools/get-opportunity/process-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    
    const data = await res.json()
    if (!data.success && !data.report) throw new Error(data.error || 'Erro ao gerar análise')
    
    return data.report || data.analysis
  }

  return (
    <EnhancedToolInterface
      toolType="get_opportunity"
      toolName="Get Opportunity"
      toolDescription="Descubra oportunidades profissionais e empreendedoras nos EUA personalizadas para seu perfil."
      toolIcon={<Briefcase className="w-6 h-6 text-blue-600" />}
      prospectId={prospectId}
      onGenerateReport={handleGenerateReport}
    />
  )
}
