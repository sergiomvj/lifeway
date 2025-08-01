'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const stories = [
  {
    id: 1,
    name: 'Maria Silva',
    location: 'São Paulo → Miami',
    role: 'Cliente Pro',
    photo: '/images/testimonials/maria-silva.jpg',
    story: 'Com o LifeWayUSA conseguimos o Green Card em apenas 12 meses. O suporte foi incrível e as ferramentas nos guiaram em cada etapa.',
    result: 'Green Card em 12 meses',
    rating: 5
  },
  {
    id: 2,
    name: 'João Santos',
    location: 'Rio de Janeiro → California',
    role: 'Cliente Premium',
    photo: '/images/testimonials/joao-santos.jpg', 
    story: 'Consegui uma vaga de TI em uma big tech americana através das conexões do ServiceWay. Mudei minha vida completamente.',
    result: 'Visto H1-B aprovado',
    rating: 5
  },
  {
    id: 3,
    name: 'Ana Costa',
    location: 'Belo Horizonte → New York',
    role: 'Cliente Pro',
    photo: '/images/testimonials/ana-costa.jpg',
    story: 'O VisaMatch me mostrou exatamente qual visto aplicar. Hoje estou estudando em Columbia University com bolsa integral.',
    result: 'Visto F-1 + Bolsa integral',
    rating: 5
  }
]

export default function SuccessStories() {
  const [currentStory, setCurrentStory] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % stories.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % stories.length)
    setIsAutoPlaying(false)
  }

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length)
    setIsAutoPlaying(false)
  }

  const goToStory = (index: number) => {
    setCurrentStory(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-baskerville text-3xl md:text-4xl text-gray-900 mb-4">
            Histórias de Sucesso
          </h2>
          <p className="font-figtree text-lg text-gray-600">
            Veja como nossos clientes realizaram o sonho americano
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Main story */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-lilac-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-azul-petroleo opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              {/* Rating */}
              <div className="flex justify-center mb-6">
                {[...Array(stories[currentStory].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Story text */}
              <blockquote className="font-figtree text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                "{stories[currentStory].story}"
              </blockquote>

              {/* Author info */}
              <div className="flex items-center justify-center space-x-4">
                {/* Photo */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-azul-petroleo to-lilac-400 flex items-center justify-center text-white font-baskerville text-xl">
                  {stories[currentStory].name.charAt(0)}
                </div>
                
                <div className="text-left">
                  <h4 className="font-baskerville text-lg text-gray-900">
                    {stories[currentStory].name}
                  </h4>
                  <p className="font-figtree text-sm text-gray-600">
                    {stories[currentStory].location}
                  </p>
                  <p className="font-figtree text-xs text-azul-petroleo font-medium">
                    {stories[currentStory].role}
                  </p>
                </div>
              </div>

              {/* Result badge */}
              <div className="mt-6">
                <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-figtree text-sm font-medium">
                  ✅ {stories[currentStory].result}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevStory}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-azul-petroleo transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextStory}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-azul-petroleo transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {stories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStory(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentStory
                  ? 'bg-azul-petroleo'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="font-figtree text-gray-600 mb-4">
            Pronto para escrever sua própria história de sucesso?
          </p>
          <button 
            onClick={() => window.location.href = '/tools/dream-creator'}
            className="bg-azul-petroleo text-white px-8 py-3 rounded-lg font-figtree font-semibold hover:bg-opacity-90 transition-colors"
          >
            Comece Agora
          </button>
        </div>
      </div>
    </section>
  )
}
