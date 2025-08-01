'use client'

import { Check, Star, Crown } from 'lucide-react'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    yearlyPrice: 0,
    description: 'Perfeito para começar sua jornada',
    features: [
      '4 ferramentas gratuitas de IA',
      'Acesso completo ao blog',
      'Informações sobre 50+ destinos',
      'Questionário de qualificação',
      'Suporte por email'
    ],
    cta: 'Começar Grátis',
    highlighted: false,
    badge: null
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.90,
    yearlyPrice: 199,
    description: 'Para quem quer acelerar o processo',
    features: [
      'Tudo do plano Free',
      'ProjectUSA - Planejamento completo',
      'Simulador de Entrevista com IA',
      'Análises avançadas de perfil',
      'Suporte prioritário',
      'Relatórios em PDF'
    ],
    cta: 'Assinar Pro',
    highlighted: true,
    badge: 'Mais Popular'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99,
    yearlyPrice: 990,
    setupFee: 599,
    description: 'Solução completa com consultoria',
    features: [
      'Tudo do plano Pro',
      'ServiceWay - Marketplace completo',
      'Consultoria personalizada 1:1',
      'Acesso antecipado a features',
      'Rede exclusiva de contatos',
      'Suporte 24/7 via WhatsApp'
    ],
    cta: 'Assinar Premium',
    highlighted: false,
    badge: null
  }
]

export default function PricingPlans() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: price % 1 === 0 ? 0 : 2
    }).format(price).replace('US$', '$')
  }

  const handlePlanSelect = (planId: string) => {
    // Handle plan selection - integrate with Stripe
    console.log('Selected plan:', planId)
    if (planId === 'free') {
      window.location.href = '/dashboard'
    } else {
      window.location.href = `/checkout?plan=${planId}`
    }
  }

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background with blur effect */}
      <div 
        className="absolute inset-0 bg-azul-petroleo"
        style={{
          backgroundImage: 'url(/images/pricing-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-azul-petroleo bg-opacity-90 backdrop-blur-sm" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 text-white">
          <h2 className="font-baskerville text-3xl md:text-4xl mb-4">
            Escolha Seu Plano
          </h2>
          <p className="font-figtree text-lg opacity-90 max-w-2xl mx-auto">
            Encontre o plano perfeito para acelerar sua jornada para os EUA
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-2xl p-8 relative transform transition-all duration-300 hover:scale-105 ${
                plan.highlighted ? 'md:scale-105 border-2 border-lilac-400' : ''
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-azul-petroleo text-white px-6 py-2 rounded-full text-sm font-figtree font-semibold">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <h3 className="font-baskerville text-2xl text-gray-900 flex items-center">
                    {plan.id === 'pro' && <Star className="text-yellow-500 mr-2" size={24} />}
                    {plan.id === 'premium' && <Crown className="text-yellow-600 mr-2" size={24} />}
                    {plan.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="mb-4">
                  {plan.setupFee ? (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Taxa de setup</div>
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {formatPrice(plan.setupFee)}
                      </div>
                      <div className="text-sm text-gray-500">+</div>
                    </div>
                  ) : null}
                  
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(plan.price)}
                  </span>
                  <span className="text-gray-600 ml-1">
                    {plan.price > 0 ? '/mês' : ''}
                  </span>
                  
                  {plan.yearlyPrice > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      ou {formatPrice(plan.yearlyPrice)}/ano
                    </p>
                  )}
                </div>

                <p className="text-gray-600 font-figtree">
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span className="font-figtree text-sm text-gray-700">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handlePlanSelect(plan.id)}
                className={`w-full py-3 px-6 rounded-lg font-figtree font-semibold transition-all ${
                  plan.highlighted
                    ? 'bg-azul-petroleo text-white hover:bg-opacity-90'
                    : plan.id === 'premium'
                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white hover:opacity-90'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 text-white">
          <p className="font-figtree mb-4 opacity-90">
            Não tem certeza qual plano escolher?
          </p>
          <button 
            onClick={() => window.location.href = '/contato'}
            className="bg-white text-azul-petroleo px-6 py-3 rounded-lg font-figtree font-semibold hover:bg-opacity-90 transition-colors"
          >
            Fale com Nossa Equipe
          </button>
        </div>
      </div>
    </section>
  )
}
