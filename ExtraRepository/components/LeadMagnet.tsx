'use client'

import { useState } from 'react'

export default function LeadMagnet() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      // Here you would integrate with your Supabase prospects table
      // and trigger the n8n → Mailgun sequence
      const response = await fetch('/api/newsletter-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setEmail('')
      } else {
        throw new Error('Failed to submit')
      }
    } catch (error) {
      console.error('Newsletter signup error:', error)
      alert('Erro ao cadastrar email. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section 
      className="relative py-20 overflow-hidden"
      style={{
        backgroundImage: 'url(/images/airplane-wing-sunrise.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed' // Parallax effect
      }}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(8,76,97,0.85)' }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
        {/* Quote */}
        <blockquote className="mb-12">
          <p className="font-baskerville text-2xl md:text-4xl leading-relaxed mb-6 italic">
            "Planos bem-traçados encurtam o caminho até o sonho."
          </p>
          <footer className="font-figtree text-lg opacity-90">
            — Mark Twain
          </footer>
        </blockquote>
        
        {/* Newsletter Signup Form */}
        <div className="max-w-md mx-auto">
          <h3 className="font-baskerville text-xl md:text-2xl mb-4">
            Prepare-se para Partir
          </h3>
          <p className="font-figtree text-lg mb-6 opacity-90">
            Cadastre-se em nossa newsletter e receba artigos e informações sobre imigração e vida nos EUA
          </p>
          
          {isSubmitted ? (
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h4 className="font-baskerville text-xl mb-2">Obrigado!</h4>
              <p className="font-figtree">
                Você foi cadastrado em nossa newsletter. Verifique seu email para confirmar.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white placeholder-gray-200 font-figtree focus:outline-none focus:ring-2 focus:ring-lilac-400 focus:border-transparent"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-lilac-500 hover:bg-lilac-600 text-white py-3 px-6 rounded-lg font-figtree font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Cadastrar na Newsletter'}
              </button>
              
              <p className="text-xs opacity-70 font-figtree">
                Receba conteúdo exclusivo sobre imigração e vida nos EUA. Seus dados estão seguros.
              </p>
            </form>
          )}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-white opacity-30 rounded-full animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-16 w-3 h-3 bg-lilac-400 opacity-40 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-white opacity-50 rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
    </section>
  )
}
