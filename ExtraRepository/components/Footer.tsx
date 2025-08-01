'use client'

import Link from 'next/link'
import { Facebook, Instagram, Youtube, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const handleSocialClick = (platform: string) => {
    // GA outbound tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'social_click', {
        event_category: 'social',
        event_label: platform
      });
    }
  }

  return (
    <footer className="bg-azul-petroleo text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-white rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Links Rápidos */}
          <div>
            <h4 className="font-baskerville text-lg mb-6 text-white">Links Rápidos</h4>
            <ul className="space-y-3 font-figtree">
              <li>
                <Link href="/quem-somos" className="text-gray-300 hover:text-lilac-400 transition-colors">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link href="/por-que-mudar" className="text-gray-300 hover:text-lilac-400 transition-colors">
                  Por Que Mudar
                </Link>
              </li>
              <li>
                <Link href="/destinos" className="text-gray-300 hover:text-lilac-400 transition-colors">
                  Destinos
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-lilac-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-300 hover:text-lilac-400 transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Ferramentas */}
          <div>
            <h4 className="font-baskerville text-lg mb-6 text-white">Ferramentas</h4>
            <ul className="space-y-3 font-figtree">
              <li>
                <Link href="/tools/dream-creator" className="text-gray-300 hover:text-lilac-400 transition-colors">
                  DreamCreator
                </Link>
              </li>
              <li>
                <Link href="/tools/visa-match" className="text-gray-300 hover:text-lilac-400 transition-colors">
                  VisaMatch
                </Link>
              </li>
              <li>
                <Link href="/tools/get-opportunity" className="text-gray-300 hover:text-lilac-400 transition-colors">
                  GetOpportunity
                </Link>
              </li>
              <li>
                <span className="text-gray-400">CalcWay (em breve)</span>
              </li>
              <li>
                <span className="text-gray-400">ServiceWay (em breve)</span>
              </li>
              <li>
                <span className="text-gray-400">InterviewSim (em breve)</span>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="font-baskerville text-lg mb-6 text-white">Recursos</h4>
            <ul className="space-y-3 font-figtree">
              <li>
                <Link href="/planos" className="text-gray-300 hover:text-lilac-400 transition-colors">
                  Planos e Preços
                </Link>
              </li>
              <li>
                <Link href="/webinars" className="text-gray-300 hover:text-lilac-400 transition-colors">
                  Webinars Gratuitos
                </Link>
              </li>
              <li>
                <Link href="/guias" className="text-gray-300 hover:text-lilac-400 transition-colors">
                  Guias PDF
                </Link>
              </li>
              <li>
                <Link href="/calculadoras" className="text-gray-300 hover:text-lilac-400 transition-colors">
                  Calculadoras
                </Link>
              </li>
              <li>
                <Link href="/suporte" className="text-gray-300 hover:text-lilac-400 transition-colors">
                  Central de Ajuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h4 className="font-baskerville text-lg mb-6 text-white">Redes Sociais</h4>
            <div className="flex space-x-4 mb-6">
              <a
                href="https://facebook.com/lifewayusa"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSocialClick('facebook')}
                className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/lifewayusa"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSocialClick('instagram')}
                className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/lifewayusa"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSocialClick('youtube')}
                className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/lifewayusa"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSocialClick('linkedin')}
                className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-2 font-figtree text-sm text-gray-300">
              <p>contato@lifewayusa.com</p>
              <p>+1 (305) 555-USAV</p>
              <p>Miami, Florida, USA</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white border-opacity-20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Brand slogan */}
            <div className="text-center md:text-left">
              <p className="font-baskerville text-lg text-white mb-1">
                Turning Dreams into Plans
              </p>
              <p className="font-figtree text-sm text-gray-300">
                © {currentYear} LifeWayUSA. Todos os direitos reservados.
              </p>
            </div>
            
            {/* Legal links */}
            <div className="flex space-x-6 text-sm font-figtree">
              <Link 
                href="/privacidade" 
                className="text-gray-300 hover:text-lilac-400 transition-colors"
              >
                Política de Privacidade
              </Link>
              <Link 
                href="/termos" 
                className="text-gray-300 hover:text-lilac-400 transition-colors"
              >
                Termos de Uso
              </Link>
              <Link 
                href="/cookies" 
                className="text-gray-300 hover:text-lilac-400 transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
