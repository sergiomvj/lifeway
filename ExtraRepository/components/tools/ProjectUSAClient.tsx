"use client"
import { useState } from 'react'

export default function ProjectUSAClient({ prospectId }: { prospectId: string }) {
  const [loading, setLoading] = useState(false)
  const [plano, setPlano] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGerarPlano = async () => {
    setLoading(true)
    setError(null)
    setPlano(null)
    try {
      const res = await fetch('/api/tools/project-usa/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospectId })
      })
      const data = await res.json()
      if (res.ok) {
        setPlano(data.plano)
      } else {
        setError(data.error || 'Erro ao gerar plano')
      }
    } catch (e) {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 my-6">
      <h3 className="font-baskerville text-xl mb-2">ProjectUSA</h3>
      <p className="text-gray-600 mb-4">Gere um plano detalhado de mudança para os EUA, consolidando todos os dados do seu perfil e ferramentas.</p>
      <button
        onClick={handleGerarPlano}
        disabled={loading}
        className="bg-azul-petroleo text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50 mb-4"
      >
        {loading ? 'Gerando plano...' : 'Gerar Plano'}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {plano && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg whitespace-pre-line">
          <h4 className="font-bold mb-2">Plano Gerado:</h4>
          <div>{plano}</div>
        </div>
      )}
    </div>
  )
}
