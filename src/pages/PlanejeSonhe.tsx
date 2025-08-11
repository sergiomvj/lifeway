import { useState } from 'react';
import { Heart, Sparkles, FileText, MessageCircle, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const PlanejeSonhe = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center py-16 px-4">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-10 h-10 md:w-12 md:h-12 mr-3 md:mr-4" />
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold">
              Planeje...Sonhe
            </h1>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            Recursos exclusivos para você simular cenários e antever o que pode acontecer na sua vida se imigrar para os EUA
          </p>
        </div>
      </div>

      {/* Video Section */}
      <div className="w-full bg-gray-100 pb-0">
        <div className="w-full">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/xPYaP7d_FWo"
                title="Planeje e Sonhe - Vídeo Inspiracional"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

      {/* Cards Section */}
      <div className="container mx-auto px-4 py-4 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Card 1 - Criador de Sonhos */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500">
            <CardHeader className="text-center pb-1">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Criador de Sonhos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center px-6">
              <p className="text-gray-600 mb-6 leading-relaxed">
                Que tal simular como seria a experiência de viver nos Estados Unidos? 
                Vida pessoal, profissional, acadêmica e todas as possibilidades que se abririam.
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 group-hover:scale-105">
                <Link to="/dreams">
                  Criar Meu Sonho
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card 2 - VisaMatch */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-green-500">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                VisaMatch
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6 leading-relaxed">
                Você gostaria de morar nos EUA mas não sabe qual o melhor tipo de visto para você? 
                Se isso é algo que você gostaria de saber gratuitamente clique no link abaixo.
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 group-hover:scale-105">
                <Link to="/visamatch">
                  Encontrar Meu Visto
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card 3 - Especialista Virtual */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-500">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Especialista Virtual
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6 leading-relaxed">
                E se você tivesse alguém disposto a te dar gratuitamente todas as informações sobre como obter um visto americano? 
                Se isso seria bom para você clique no link abaixo.
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 group-hover:scale-105">
                <Link to="/especialista">
                  Falar com Especialista
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para transformar seus sonhos em realidade?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Nossos recursos exclusivos estão aqui para ajudar você a planejar cada passo da sua jornada para os EUA.
            </p>
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-all duration-300"
              onClick={() => {
                // Navegar para cadastro/login
                window.location.href = '/login';
              }}
            >
              Começar Agora - É Grátis!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanejeSonhe;
