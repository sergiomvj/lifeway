'use client'

import { ArrowRight } from 'lucide-react'

export default function VisaMatchCTA() {
  const handleCTAClick = () => {
    // Redirect to VisaMatch tool
    window.location.href = '/tools/visa-match'
  }

  return (
    <section className="py-12 bg-azul-petroleo">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-baskerville text-2xl md:text-3xl text-white mb-4">
          Pronto para começar? Faça o VisaMatch agora.
        </h2>
        <p className="font-figtree text-lg text-white opacity-90 mb-8">
          Descubra qual visto é ideal para seu perfil em menos de 5 minutos
        </p>
        <button
          onClick={handleCTAClick}
          className="inline-flex items-center space-x-3 bg-lilac-500 hover:bg-lilac-600 text-white px-8 py-4 rounded-lg font-figtree font-semibold text-lg transition-all transform hover:scale-105"
        >
          <span>Simular Meu Visto</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  )
}
