'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const heroSlides = [
  {
    id: 1,
    image: '/images/family/arto-suraj-VTDd6VP7Dps-unsplash.jpg',
    title: 'Viva legalmente nos EUA e mude sua vida e da sua família',
    subtitle: 'Simule toda essa experiência gratuitamente em nossas ferramentas',
    cta: 'Simule como seria a sua experiência',
    profileType: 'family',
    duration: 12000 // 12 segundos - slide principal
  },
  {
    id: 2,
    image: '/images/family/daria-trofimova-T-qNefXNUGw-unsplash.jpg',
    title: 'Realize o sonho da sua família',
    subtitle: 'Comece uma nova vida nos EUA com segurança e oportunidades infinitas',
    cta: 'Simule como seria a sua experiência',
    profileType: 'family',
    duration: 6000
  },
  {
    id: 3,
    image: '/images/family/samuel-yongbo-kwon-F4bA_QiMK6U-unsplash.jpg',
    title: 'Educação de qualidade mundial',
    subtitle: 'Garanta o melhor futuro para seus filhos nas universidades americanas',
    cta: 'Simule como seria a sua experiência',
    profileType: 'student',
    duration: 6000
  },
  {
    id: 4,
    image: '/images/family/derek-owens-cmzlFICyL6Y-unsplash.jpg',
    title: 'Empreenda na terra das oportunidades',
    subtitle: 'Construa seu negócio no maior mercado consumidor do mundo',
    cta: 'Simule como seria a sua experiência',
    profileType: 'entrepreneur',
    duration: 6000
  },
  {
    id: 5,
    image: '/images/family/kateryna-hliznitsova-N_6OpdOXcxo-unsplash.jpg',
    title: 'Viva o American Dream',
    subtitle: 'Milhões realizaram este sonho. Agora é a sua vez de conquistar o seu',
    cta: 'Simule como seria a sua experiência',
    profileType: 'family',
    duration: 6000
  }
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    // Preload all images
    const imagePromises = heroSlides.map((slide) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = resolve
        img.onerror = reject
        img.src = slide.image
      })
    })

    Promise.all(imagePromises)
      .then(() => {
        setImagesLoaded(true)
        setIsLoaded(true)
      })
      .catch((error) => {
        console.error('Error loading images:', error)
        setIsLoaded(true) // Continue even if some images fail
      })
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    
    let timeoutId: NodeJS.Timeout
    
    const scheduleNext = () => {
      const currentSlideDuration = heroSlides[currentSlide].duration
      timeoutId = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
      }, currentSlideDuration)
    }
    
    scheduleNext()
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [currentSlide, isLoaded])

  const handleCTAClick = (profileType: string) => {
    // Link para o Criador de Sonhos
    console.log('Opening Criador de Sonhos with profileType:', profileType)
    if (typeof window !== 'undefined') {
      window.location.href = `/tools/criador-sonhos?profile=${profileType}`
    }
  }

  if (!isLoaded) {
    return (
      <div className="h-[600px] bg-azul-petroleo flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="font-baskerville text-4xl md:text-6xl mb-4">
            LifeWayUSA
          </h1>
          <p className="font-figtree text-lg opacity-80">Carregando experiência...</p>
        </div>
      </div>
    )
  }

  return (
    <section className="relative h-[600px] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Ken-Burns background image */}
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105"
            style={{
              backgroundImage: `url(${slide.image})`,
              animation: index === currentSlide ? 'ken-burns 20s ease-in-out infinite' : 'none'
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0" style={{backgroundColor:'#4c191b', opacity:0.85}} />
          
          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
            <div className="max-w-4xl pt-16">
              <h1 className="font-baskerville text-4xl md:text-6xl mb-6 leading-tight">
                {slide.title}
              </h1>
              <p className="font-figtree text-xl md:text-2xl mb-8 opacity-90">
                {slide.subtitle}
              </p>
              <button
                onClick={() => handleCTAClick(slide.profileType)}
                className="inline-block bg-white text-azul-petroleo px-8 py-4 rounded-lg font-figtree font-semibold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 animate-pulse-slow"
              >
                {slide.cta}
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            title={`Slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Swipe indicators for mobile */}
      <div className="absolute inset-x-0 bottom-16 text-center text-white text-sm font-figtree opacity-70 md:hidden">
        Deslize para ver mais →
      </div>
    </section>
  )
}
