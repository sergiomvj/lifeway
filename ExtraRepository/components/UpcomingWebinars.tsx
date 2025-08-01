'use client'

import { Calendar, Clock, Users } from 'lucide-react'
import { useState, useEffect } from 'react'
import SafeDate from './SafeDate'

const upcomingWebinars = [
  {
    id: 1,
    title: 'Como conseguir o visto H1-B em 2025',
    date: '2025-06-20',
    time: '19:00',
    timezone: 'EST',
    attendees: 234,
    featured: true,
    type: 'Webinar Gratuito',
    host: 'Dr. Maria Santos'
  },
  {
    id: 2,
    title: 'Investimento EB-5: Guia completo',
    date: '2025-06-25',
    time: '20:00',
    timezone: 'EST',
    attendees: 189,
    featured: false,
    type: 'Live',
    host: 'João Silva'
  },
  {
    id: 3,
    title: 'Mercado de trabalho em tech nos EUA',
    date: '2025-06-28',
    time: '18:30',
    timezone: 'EST',
    attendees: 156,
    featured: false,
    type: 'Workshop',
    host: 'Ana Costa'
  },
  {
    id: 4,
    title: 'Educação nos EUA: Como escolher universidade',
    date: '2025-07-02',
    time: '19:30',
    timezone: 'EST',
    attendees: 203,
    featured: false,
    type: 'Webinar',
    host: 'Prof. Carlos Lima'
  },
  {
    id: 5,
    title: 'Planejamento financeiro para mudança',
    date: '2025-07-05',
    time: '20:00',
    timezone: 'EST',
    attendees: 178,
    featured: false,
    type: 'Live',
    host: 'Marina Ferreira'
  }
]

export default function UpcomingWebinars() {
  const [timeLeft, setTimeLeft] = useState<{[key: number]: string}>({})

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const newTimeLeft: {[key: number]: string} = {}

      upcomingWebinars.forEach(webinar => {
        const eventDate = new Date(`${webinar.date}T${webinar.time}:00`)
        const difference = eventDate.getTime() - now.getTime()

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

          if (days > 0) {
            newTimeLeft[webinar.id] = `${days}d ${hours}h ${minutes}m`
          } else if (hours > 0) {
            newTimeLeft[webinar.id] = `${hours}h ${minutes}m`
          } else {
            newTimeLeft[webinar.id] = `${minutes}m`
          }
        } else {
          newTimeLeft[webinar.id] = 'Evento finalizado'
        }
      })

      setTimeLeft(newTimeLeft)
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const featuredWebinar = upcomingWebinars.find(w => w.featured)
  const otherWebinars = upcomingWebinars.filter(w => !w.featured).slice(0, 4)

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-baskerville text-3xl md:text-4xl text-gray-900 mb-4">
            Próximos Webinars e Lives
          </h2>
          <p className="font-figtree text-lg text-gray-600">
            Participe dos nossos eventos gratuitos sobre imigração para os EUA
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Webinar */}
          {featuredWebinar && (
            <div className="lg:row-span-2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
                {/* Featured badge */}
                <div className="bg-gradient-to-r from-azul-petroleo to-lilac-500 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-figtree font-medium">
                      ✨ Destaque
                    </span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-figtree">
                      {featuredWebinar.type}
                    </span>
                  </div>
                  
                  {/* Date badge */}
                  <div className="inline-block transform rotate-3 mb-4">
                    <div className="bg-lilac-200 text-azul-petroleo px-4 py-3 rounded-lg text-center min-w-[80px]">
                      <div className="font-baskerville text-xl font-bold">
                        <SafeDate dateString={featuredWebinar.date} format="short" />
                      </div>
                      <div className="font-figtree text-sm uppercase">
                        &nbsp;
                      </div>
                    </div>
                  </div>

                  <h3 className="font-baskerville text-2xl mb-3">
                    {featuredWebinar.title}
                  </h3>
                  
                  <div className="space-y-2 text-sm font-figtree opacity-90">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{featuredWebinar.time} {featuredWebinar.timezone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{featuredWebinar.attendees} inscritos</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <p className="font-figtree text-gray-600 mb-4">
                      Apresentado por <strong>{featuredWebinar.host}</strong>
                    </p>
                    
                    {timeLeft[featuredWebinar.id] && (
                      <div className="bg-lilac-100 text-lilac-700 p-3 rounded-lg text-center">
                        <div className="font-figtree text-sm">Começa em:</div>
                        <div className="font-baskerville text-lg font-bold">
                          {timeLeft[featuredWebinar.id]}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button className="w-full bg-azul-petroleo text-white py-3 rounded-lg font-figtree font-semibold hover:bg-opacity-90 transition-colors">
                    Inscrever-se Grátis
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Other Webinars List */}
          <div className="space-y-4">
            {otherWebinars.map((webinar) => (
              <div key={webinar.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-azul-petroleo text-white px-2 py-1 rounded text-xs font-figtree">
                        {webinar.type}
                      </span>
                      <span className="text-gray-500 text-sm font-figtree">
                        <SafeDate dateString={webinar.date} format="short" /> • {webinar.time} {webinar.timezone}
                      </span>
                    </div>
                    
                    <h4 className="font-baskerville text-lg text-gray-900 mb-2">
                      {webinar.title}
                    </h4>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 font-figtree">
                      <span>{webinar.host}</span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{webinar.attendees}</span>
                      </span>
                    </div>
                    
                    {timeLeft[webinar.id] && (
                      <div className="mt-2 text-sm text-lilac-600 font-figtree font-medium">
                        Começa em {timeLeft[webinar.id]}
                      </div>
                    )}
                  </div>
                  
                  <button className="ml-4 bg-lilac-100 text-lilac-700 px-4 py-2 rounded-lg text-sm font-figtree font-medium hover:bg-lilac-200 transition-colors">
                    Inscrever
                  </button>
                </div>
              </div>
            ))}
            
            {/* View All Events */}
            <div className="text-center pt-4">
              <button 
                onClick={() => window.location.href = '/webinars'}
                className="text-azul-petroleo hover:text-lilac-600 font-figtree font-medium transition-colors"
              >
                Ver Agenda Completa →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
