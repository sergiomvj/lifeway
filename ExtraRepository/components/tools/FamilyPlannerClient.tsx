"use client"
import { useState } from 'react'

export default function FamilyPlannerClient({ prospectId }: { prospectId: string }) {
  const [loading, setLoading] = useState(false)
  const [analise, setAnalise] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGerarAnalise = async () => {
    setLoading(true)
    setError(null)
    setAnalise(null)
    try {
      const res = await fetch('/api/tools/family-planner/analyze-family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospectId })
      })
      const data = await res.json()
      if (res.ok) {
        setAnalise(data.analise)
      } else {
        setError(data.error || 'Erro ao gerar análise')
      }
    } catch (e) {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 my-6">
      <h3 className="font-baskerville text-xl mb-2">FamilyPlanner</h3>
      <p className="text-gray-600 mb-4">Receba um roteiro personalizado de viagem e checklist para sua família migrar para os EUA.</p>
      <button
        onClick={handleGerarAnalise}
        disabled={loading}
        className="bg-azul-petroleo text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50 mb-4"
      >
        {loading ? 'Gerando...' : 'Gerar Roteiro Familiar'}
      </button>
      {analise && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <h4 className="font-semibold mb-2">Resultado:</h4>
          <div className="whitespace-pre-line text-gray-800">{analise}</div>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>
      )}
    </div>
  )
}
