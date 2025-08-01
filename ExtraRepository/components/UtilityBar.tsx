'use client'

import { MessageCircle } from 'lucide-react'

export default function UtilityBar() {
  return (
    <div className="h-8 bg-azul-petroleo text-white text-sm font-figtree font-medium sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Left side - Immigration hotline */}
        <div className="flex items-center space-x-2">
          <span className="text-lg">🇧🇷→🇺🇸</span>
          <span>24/7 +1 (407) LIF-EWAY</span>
        </div>
        
        {/* Right side - Language switcher and WhatsApp */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <button className="hover:text-lilac-400 transition-colors">PT</button>
            <span>•</span>
            <button className="hover:text-lilac-400 transition-colors opacity-70">EN</button>
          </div>
          <a 
            href="https://wa.me/13055555872" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-lilac-400 transition-colors"
            onClick={() => {
              // GA event tracking
              if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'click_hotline', {
                  event_category: 'engagement',
                  event_label: 'whatsapp_utility_bar'
                });
              }
            }}
          >
            <MessageCircle size={16} />
          </a>
        </div>
      </div>
    </div>
  )
}
