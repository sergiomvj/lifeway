'use client'

import { Brain, Search, TrendingUp, Users, Lock, Star, Crown } from 'lucide-react'
import Navbar from './Navbar'

interface UserData {
  qualify: boolean
  pro: boolean
  profileType: string
  isCompleted: boolean
  full_name?: string | null
  endereco?: string | null
  whatsapp?: string | null
  nascimento?: string | null
  email?: string | null
}

interface ToolCard {
  id: string
  title: string
  description: string
  icon: React.ElementType
  free: boolean
  requiresQualify: boolean
  requiresPro: boolean
  href: string
  category: 'free' | 'pro' | 'premium'
}

const tools: ToolCard[] = [
  {
    id: 'criador-sonhos',
    title: 'Criador de Sonhos',
    description: 'Descubra seus objetivos e visualize seu futuro nos EUA',
    icon: Brain,
    free: true,
    requiresQualify: true,
    requiresPro: false,
    href: '/tools/criador-sonhos',
    category: 'free'
  },
  {
    id: 'visa-match',
    title: 'VisaMatch',
    description: 'Encontre o visto ideal baseado no seu perfil',
    icon: Search,
    free: true,
    requiresQualify: true,
    requiresPro: false,
    href: '/tools/visa-match',
    category: 'free'
  },
  {
    id: 'get-opportunity',
    title: 'GetOpportunity',
    description: 'Análise profunda do seu perfil profissional',
    icon: TrendingUp,
    free: true,
    requiresQualify: true,
    requiresPro: false,
    href: '/tools/get-opportunity',
    category: 'free'
  },
  {
    id: 'family-planner',
    title: 'FamilyPlanner',
    description: 'Roteiro personalizado para mudança familiar',
    icon: Users,
    free: true,
    requiresQualify: true,
    requiresPro: false,
    href: '/tools/family-planner',
    category: 'free'
  },
  {
    id: 'project-usa',
    title: 'ProjectUSA',
    description: 'Planejamento completo e detalhado da sua mudança',
    icon: Star,
    free: false,
    requiresQualify: true,
    requiresPro: true,
    href: '/tools/project-usa',
    category: 'pro'
  },
  {
    id: 'simulador-entrevista',
    title: 'Simulador de Entrevista',
    description: 'Treine entrevistas com IA para vistos e empregos',
    icon: Crown,
    free: false,
    requiresQualify: true,
    requiresPro: true,
    href: '/tools/simulador-entrevista',
    category: 'pro'
  }
]

// Componente desativado: lógica de autenticação removida para ambiente local.
export default function DashboardContent() {
  return <div>Dashboard desativado para ambiente local.</div>;
}
