'use client'

import { Check, ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const benefits = [
  {
    title: 'Segurança',
    description: 'Sistema de segurança pública eficiente e ambiente seguro para sua família'
  },
  {
    title: 'Educação', 
    description: 'Universidades de prestígio mundial e sistema educacional de qualidade'
  },
  {
    title: 'Oportunidades',
    description: 'Mercado de trabalho diversificado e economia que valoriza o empreendedorismo'
  },
  {
    title: 'Qualidade de Vida',
    description: 'Infraestrutura moderna, saúde de qualidade e respeito aos direitos'
  }
]

export default function WhyUSAStory() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="why-usa-section" ref={sectionRef} className="py-16 bg-azul-petroleo">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div className="relative">
            <div className="relative z-10">
              <div className="overflow-hidden rounded-3xl h-96 relative">
                <img 
                  src="/images/family/hoi-an-photographer-SVt5gv8xbKM-unsplash (1).jpg"
                  alt="Family enjoying life in the USA"
                  className="w-full h-full object-cover"
                />
                {/* Optional overlay for better text contrast if needed */}
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/30 rounded-full"></div>
          </div>
          
          {/* Right side - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="font-baskerville text-3xl md:text-4xl text-white mb-6">
                Porque você deveria se mudar para os EUA?
              </h2>
              <p className="font-figtree text-lg text-white/90 mb-8">
                Os Estados Unidos oferecem oportunidades únicas para quem busca uma vida melhor, 
                com segurança, educação de qualidade e um mercado próspero.
              </p>
            </div>
            
            {/* Benefits list with animation */}
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className={`flex items-start space-x-4 transition-all duration-700 ${
                    isVisible 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 translate-x-8'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center mt-1">
                    <Check className="text-azul-petroleo w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-baskerville text-xl text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="font-figtree text-white/90">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Continue Reading CTA */}
            <div className="pt-6">
              <a
                href="/blog/por-que-morar-nos-eua"
                className="inline-flex items-center space-x-2 text-white hover:text-white/80 transition-colors group"
              >
                <span className="font-figtree font-medium">Continue lendo</span>
                <ArrowRight 
                  className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
