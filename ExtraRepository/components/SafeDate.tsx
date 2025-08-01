'use client'

import { useEffect, useState } from 'react'

interface SafeDateProps {
  dateString: string
  format?: 'short' | 'long' | 'full'
  className?: string
}

export default function SafeDate({ dateString, format = 'short', className }: SafeDateProps) {
  const [formattedDate, setFormattedDate] = useState<string>('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    try {
      const date = new Date(dateString)
      
      let formatted = ''
      switch (format) {
        case 'short':
          formatted = date.toLocaleDateString('pt-BR')
          break
        case 'long':
          formatted = date.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
          break
        case 'full':
          formatted = date.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long'
          })
          break
        default:
          formatted = date.toLocaleDateString('pt-BR')
      }
      
      setFormattedDate(formatted)
    } catch (error) {
      console.error('Erro ao formatar data:', error)
      setFormattedDate(dateString)
    }
  }, [dateString, format])

  return (
    <span className={className} suppressHydrationWarning>
      {isMounted ? formattedDate : ''}
    </span>
  )
}
