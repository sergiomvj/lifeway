'use client'

import Link from 'next/link'
import { Settings, ChevronDown, Home as HomeIcon, Users, Info, FileText, BarChart2, DollarSign, Mail, MapPin, BookOpen, LayoutDashboard, LogIn, LogOut, User, Menu, X, Briefcase } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '../lib/auth-context'

const topStates = [
  { name: 'Florida', slug: 'florida' },
  { name: 'California', slug: 'california' },
  { name: 'Texas', slug: 'texas' },
  { name: 'New York', slug: 'new-york' },
  { name: 'Nevada', slug: 'nevada' }
]

export default function Navbar() {
  const { user, signOut } = useUser()
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const [showInfoMenu, setShowInfoMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showMobileDestinos, setShowMobileDestinos] = useState(false)
  const [showMobileInfo, setShowMobileInfo] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const isActiveLink = (href: string) => {
    return pathname === href
  }

  return (
    <nav className="absolute top-8 left-0 right-0 h-24 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-white font-baskerville font-bold text-3xl" style={{ fontWeight: 700 }}>
              LifeWayUSA
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-6 flex items-baseline space-x-3">
              {/* Home Icon */}
              <Link
                href="/"
                className={`px-3 py-2 text-sm font-figtree font-medium transition-colors flex items-center ${
                  isActiveLink('/') 
                    ? 'text-white border-b-2 border-lilac-400' 
                    : 'text-white hover:text-lilac-300'
                }`}
                aria-label="Home"
              >
                <HomeIcon className="w-6 h-6 mr-1" />
              </Link>
              <div className="w-px h-6 bg-white bg-opacity-30"></div>
              
              {/* Destinos Mega Menu */}
              <div 
                className="relative"
                onMouseEnter={() => setShowMegaMenu(true)}
                onMouseLeave={() => setShowMegaMenu(false)}
              >
                <button
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-figtree font-medium transition-colors ${
                    isActiveLink('/destinos') 
                      ? 'text-white border-b-2 border-lilac-400' 
                      : 'text-white hover:text-lilac-300'
                  }`}
                  type="button"
                  onClick={() => router.push('/destinos')}
                >
                  <MapPin className="w-5 h-5 mr-1" />
                  <span>Destinos</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showMegaMenu && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-4xl bg-transparent shadow-xl border border-gray-200 border-opacity-30 rounded-b-lg mt-1 backdrop-blur-md">
                    <div className="grid grid-cols-2 gap-8 p-8">
                      <div className="space-y-4">
                        <h3 className="font-baskerville text-lg text-white border-b border-white border-opacity-30 pb-2">
                          🇺🇸 Estados Unidos
                        </h3>
                        <div className="space-y-2">
                          <Link 
                            href="/destinos" 
                            className="block text-sm text-white hover:text-lilac-300 font-figtree"
                          >
                            Ver todos os destinos
                          </Link>
                          <Link 
                            href="/destinos/comparar" 
                            className="block text-sm text-white hover:text-lilac-300 font-figtree"
                          >
                            Comparar estados
                          </Link>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-baskerville text-lg text-white border-b border-white border-opacity-30 pb-2">
                          Top 5 Estados
                        </h3>
                        <div className="space-y-2">
                          {topStates.map((state) => (
                            <Link 
                              key={state.slug}
                              href={`/destinos/${state.slug}`} 
                              className="block text-sm text-white hover:text-lilac-300 font-figtree"
                            >
                              {state.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Informações Úteis with Mega Menu */}
              <div 
                className="relative"
                onMouseEnter={() => setShowInfoMenu(true)}
                onMouseLeave={() => setShowInfoMenu(false)}
              >
                <button
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-figtree font-medium transition-colors ${
                    isActiveLink('/informacoes-uteis') 
                      ? 'text-white border-b-2 border-lilac-400' 
                      : 'text-white hover:text-lilac-300'
                  }`}
                >
                  <Info className="w-5 h-5 mr-1" />
                  <span>Informações Úteis</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showInfoMenu && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-4xl bg-transparent shadow-xl border border-gray-200 border-opacity-30 rounded-b-lg mt-1 backdrop-blur-md">
                    <div className="grid grid-cols-3 gap-8 p-8">
                      <div className="space-y-4">
                        <h3 className="font-baskerville text-lg text-white border-b border-white border-opacity-30 pb-2">
                          Recursos & Institucional
                        </h3>
                        <div className="space-y-2">
                          <Link href="/quem-somos" className="block text-sm text-white hover:text-lilac-300 font-figtree flex items-center"><Users className="w-4 h-4 mr-2" />Quem Somos</Link>
                          <Link href="/planos" className="block text-sm text-white hover:text-lilac-300 font-figtree flex items-center"><DollarSign className="w-4 h-4 mr-2" />Planos</Link>
                          <Link href="/porque-mudar" className="block text-sm text-white hover:text-lilac-300 font-figtree flex items-center"><BarChart2 className="w-4 h-4 mr-2" />Por que mudar</Link>
                          <Link href="/contato" className="block text-sm text-white hover:text-lilac-300 font-figtree flex items-center"><Mail className="w-4 h-4 mr-2" />Contato</Link>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-baskerville text-lg text-white border-b border-white border-opacity-30 pb-2">
                          Materiais
                        </h3>
                        <div className="space-y-2">
                          <Link href="/recursos-uteis" className="block text-sm text-white hover:text-lilac-300 font-figtree flex items-center"><FileText className="w-4 h-4 mr-2" />Recursos Úteis</Link>
                          <Link href="/comparativo-cidades" className="block text-sm text-white hover:text-lilac-300 font-figtree flex items-center"><BarChart2 className="w-4 h-4 mr-2" />Comparativo de Cidades</Link>
                          <Link href="/destinos/guia-completo" className="block text-sm text-white hover:text-lilac-300 font-figtree flex items-center"><Info className="w-4 h-4 mr-2" />Guia completo de mudança</Link>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-baskerville text-lg text-white border-b border-white border-opacity-30 pb-2">
                          Ferramentas
                        </h3>
                        <div className="space-y-2">
                          <Link href="/#section2" className="block text-sm text-white hover:text-lilac-300 font-figtree flex items-center"><BarChart2 className="w-4 h-4 mr-2" />Ver todas as ferramentas</Link>
                          <Link href="/tools/criador-sonhos" className="block text-sm text-white hover:text-lilac-300 font-figtree flex items-center"><BarChart2 className="w-4 h-4 mr-2" />Criador de Sonhos</Link>
                          <Link href="/tools/visa-match" className="block text-sm text-white hover:text-lilac-300 font-figtree flex items-center"><BarChart2 className="w-4 h-4 mr-2" />VisaMatch</Link>
                          <Link href="/tools/family-planner" className="block text-sm text-white hover:text-lilac-300 font-figtree flex items-center"><BarChart2 className="w-4 h-4 mr-2" />Family Planner</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Blog - Link direto */}
              <Link
                href="/blog"
                className={`flex items-center space-x-1 px-3 py-2 text-sm font-figtree font-medium transition-colors ${
                  isActiveLink('/blog') 
                    ? 'text-white border-b-2 border-lilac-400' 
                    : 'text-white hover:text-lilac-300'
                }`}
              >
                <BookOpen className="w-5 h-5 mr-1" />
                <span>Blog</span>
              </Link>
              <div className="w-px h-6 bg-white bg-opacity-30"></div>
            </div>
          </div>

          {/* Authentication Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Dashboard Link */}
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-figtree font-medium text-white hover:text-lilac-300 transition-colors flex items-center"
                >
                  <LayoutDashboard className="w-5 h-5 mr-2" />
                  Dashboard
                </Link>
                
                {/* User Info and Logout */}
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm">Olá, {user.name}</span>
                  <button
                    onClick={signOut}
                    className="px-4 py-2 text-sm font-figtree font-medium text-white hover:text-red-300 transition-colors flex items-center border border-white border-opacity-30 rounded-lg hover:border-red-300"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Sign In Button */}
                <Link href="/sign-in">
                  <button className="px-4 py-2 text-sm font-figtree font-medium text-white hover:text-lilac-300 transition-colors flex items-center border border-white border-opacity-30 rounded-lg hover:border-lilac-300">
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </button>
                </Link>

                {/* Sign Up Button */}
                <Link href="/sign-up">
                  <button className="px-4 py-2 text-sm font-figtree font-medium bg-lilac-600 text-white hover:bg-lilac-700 transition-colors rounded-lg flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Criar Conta
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white hover:text-lilac-300 transition-colors"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-azul-petroleo backdrop-blur-md border-t border-white border-opacity-20 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {/* Home */}
              <Link
                href="/"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-3 text-white hover:text-lilac-300 transition-colors py-2"
              >
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
              </Link>

              {/* Destinos */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowMobileDestinos(!showMobileDestinos)}
                  className="flex items-center justify-between w-full text-white hover:text-lilac-300 transition-colors py-2"
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5" />
                    <span>Destinos</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showMobileDestinos ? 'rotate-180' : ''}`} />
                </button>
                {showMobileDestinos && (
                  <div className="ml-8 space-y-2">
                    <Link href="/destinos" onClick={() => setShowMobileMenu(false)} className="block text-white hover:text-lilac-300 py-1">Ver todos os destinos</Link>
                    <Link href="/destinos/comparar" onClick={() => setShowMobileMenu(false)} className="block text-white hover:text-lilac-300 py-1">Comparar estados</Link>
                    {topStates.map((state) => (
                      <Link key={state.slug} href={`/destinos/${state.slug}`} onClick={() => setShowMobileMenu(false)} className="block text-white hover:text-lilac-300 py-1">{state.name}</Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Informações Úteis */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowMobileInfo(!showMobileInfo)}
                  className="flex items-center justify-between w-full text-white hover:text-lilac-300 transition-colors py-2"
                >
                  <div className="flex items-center space-x-3">
                    <Info className="w-5 h-5" />
                    <span>Informações Úteis</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showMobileInfo ? 'rotate-180' : ''}`} />
                </button>
                {showMobileInfo && (
                  <div className="ml-8 space-y-2">
                    <div className="text-lilac-300 text-sm font-semibold py-1">Recursos & Institucional</div>
                    <Link href="/quem-somos" onClick={() => setShowMobileMenu(false)} className="block text-white hover:text-lilac-300 py-1">Quem Somos</Link>
                    <Link href="/planos" onClick={() => setShowMobileMenu(false)} className="block text-white hover:text-lilac-300 py-1">Planos</Link>
                    <Link href="/porque-mudar" onClick={() => setShowMobileMenu(false)} className="block text-white hover:text-lilac-300 py-1">Por que mudar</Link>
                    <Link href="/contato" onClick={() => setShowMobileMenu(false)} className="block text-white hover:text-lilac-300 py-1">Contato</Link>
                    
                    <div className="text-lilac-300 text-sm font-semibold py-1 pt-3">Materiais</div>
                    <Link href="/recursos-uteis" onClick={() => setShowMobileMenu(false)} className="block text-white hover:text-lilac-300 py-1">Recursos Úteis</Link>
                    <Link href="/comparativo-cidades" onClick={() => setShowMobileMenu(false)} className="block text-white hover:text-lilac-300 py-1">Comparativo de Cidades</Link>
                    <Link href="/destinos/guia-completo" onClick={() => setShowMobileMenu(false)} className="block text-white hover:text-lilac-300 py-1">Guia completo de mudança</Link>
                    
                    <div className="text-lilac-300 text-sm font-semibold py-1 pt-3">Ferramentas</div>
                    <Link href="/#section2" onClick={() => setShowMobileMenu(false)} className="block text-white hover:text-lilac-300 py-1">Ver todas as ferramentas</Link>
                    <Link href="/tools/criador-sonhos" onClick={() => setShowMobileMenu(false)} className="block text-white hover:text-lilac-300 py-1">Criador de Sonhos</Link>
                    <Link href="/tools/visa-match" onClick={() => setShowMobileMenu(false)} className="block text-white hover:text-lilac-300 py-1">VisaMatch</Link>
                    <Link href="/tools/family-planner" onClick={() => setShowMobileMenu(false)} className="block text-white hover:text-lilac-300 py-1">Family Planner</Link>
                  </div>
                )}
              </div>

              {/* Blog - Link direto */}
              <Link
                href="/blog"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-3 text-white hover:text-lilac-300 transition-colors py-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Blog</span>
              </Link>

              {/* Divider */}
              <div className="border-t border-white border-opacity-20 my-4"></div>

              {/* Authentication */}
              {user ? (
                <div className="space-y-3">
                  <div className="text-lilac-300 text-sm">Olá, {user.name}</div>
                  <Link
                    href="/dashboard"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center space-x-3 text-white hover:text-lilac-300 transition-colors py-2"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setShowMobileMenu(false)
                    }}
                    className="flex items-center space-x-3 text-white hover:text-red-300 transition-colors py-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sair</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/sign-in"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center space-x-3 text-white hover:text-lilac-300 transition-colors py-2"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Entrar</span>
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center space-x-3 bg-lilac-600 text-white hover:bg-lilac-700 transition-colors rounded-lg px-4 py-2"
                  >
                    <User className="w-5 h-5" />
                    <span>Criar Conta</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
