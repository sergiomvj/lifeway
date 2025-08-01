'use client';

import Navbar from '../components/Navbar';
import { getRandomImage } from '../lib/utils';
import { Target, Users, Award, Globe, Heart, Lightbulb, Shield, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function QuemSomosPage() {
  const [heroImage, setHeroImage] = useState('/images/hero/home-hero-mobile.webp'); // Default SSR image
  const [missionImage, setMissionImage] = useState('/images/extra/opportunity.webp'); // Default SSR image
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHeroImage(getRandomImage('hero', 'quem-somos-hero'));
    setMissionImage(getRandomImage('extra', 'mission-image'));
  }, []);

  return (
    <main className="bg-cinza-claro min-h-screen font-figtree">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="relative h-[400px] flex flex-col justify-center items-center text-white mt-10"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-azul-petroleo opacity-95"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="font-baskerville text-3xl md:text-5xl mb-6 leading-tight">
            Quem Somos
          </h1>
          <p className="text-lg md:text-xl font-figtree">
            Transformamos sonhos em realidade através de tecnologia e experiência
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-baskerville mb-6 text-gray-900">
                Nossa Missão
              </h2>
              <p className="text-lg text-gray-600 font-figtree mb-6">
                Na LifeWayUSA, acreditamos que todos merecem a oportunidade de viver seus sonhos. 
                Nossa missão é democratizar o acesso às informações e ferramentas necessárias 
                para que brasileiros possam planejar e realizar sua mudança para os Estados Unidos 
                de forma segura e bem-informada.
              </p>
              <p className="text-gray-600 font-figtree mb-8">
                Combinamos tecnologia de ponta, inteligência artificial e experiência real 
                para criar a plataforma mais completa de planejamento de imigração para os EUA.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="bg-azul-petroleo rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Users className="text-white w-8 h-8" />
                  </div>
                  <h3 className="font-baskerville text-lg mb-2">10,000+</h3>
                  <p className="text-sm text-gray-600">Usuários Atendidos</p>
                </div>
                <div className="text-center">
                  <div className="bg-azul-petroleo rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Award className="text-white w-8 h-8" />
                  </div>
                  <h3 className="font-baskerville text-lg mb-2">95%</h3>
                  <p className="text-sm text-gray-600">Taxa de Satisfação</p>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden">
              <Image
                src={missionImage}
                alt="Nossa missão"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-baskerville text-center mb-12 text-gray-900">
            Nossos Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Transparência */}
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="text-azul-petroleo w-8 h-8" />
              </div>
              <h3 className="font-baskerville text-xl mb-3 text-gray-900">Transparência</h3>
              <p className="text-gray-600 font-figtree text-sm">
                Fornecemos informações claras, honestas e atualizadas sobre todos os processos de imigração.
              </p>
            </div>

            {/* Inovação */}
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="text-purple-600 w-8 h-8" />
              </div>
              <h3 className="font-baskerville text-xl mb-3 text-gray-900">Inovação</h3>
              <p className="text-gray-600 font-figtree text-sm">
                Utilizamos as mais avançadas tecnologias de IA para personalizar sua experiência.
              </p>
            </div>

            {/* Acessibilidade */}
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="text-green-600 w-8 h-8" />
              </div>
              <h3 className="font-baskerville text-xl mb-3 text-gray-900">Acessibilidade</h3>
              <p className="text-gray-600 font-figtree text-sm">
                Democratizamos o acesso às informações que antes só estavam disponíveis para poucos.
              </p>
            </div>

            {/* Excelência */}
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-yellow-600 w-8 h-8" />
              </div>
              <h3 className="font-baskerville text-xl mb-3 text-gray-900">Excelência</h3>
              <p className="text-gray-600 font-figtree text-sm">
                Buscamos constantemente a melhoria contínua em todos os nossos serviços e ferramentas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-baskerville text-center mb-12 text-gray-900">
            Nossa História
          </h2>
          <div className="space-y-8">
            <div className="text-center">
              <Heart className="w-16 h-16 text-azul-petroleo mx-auto mb-6" />
              <p className="text-lg text-gray-600 font-figtree leading-relaxed">
                A LifeWayUSA nasceu de uma necessidade real. Nossos fundadores, brasileiros que 
                passaram pelo complexo processo de imigração para os Estados Unidos, perceberam 
                que faltavam recursos centralizados e confiáveis para ajudar outros brasileiros 
                a navegar por este caminho.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="font-baskerville text-xl mb-4 text-gray-900">2020 - O Início</h3>
              <p className="text-gray-600 font-figtree mb-6">
                Tudo começou com um grupo de amigos brasileiros vivendo em diferentes estados americanos, 
                compartilhando experiências e ajudando conhecidos que sonhavam em se mudar para os EUA. 
                Percebemos que muitas pessoas tinham dúvidas similares e enfrentavam os mesmos desafios.
              </p>
              
              <h3 className="font-baskerville text-xl mb-4 text-gray-900">2022 - A Plataforma</h3>
              <p className="text-gray-600 font-figtree mb-6">
                Decidimos criar uma plataforma que centralizasse todas as informações necessárias, 
                desde pesquisa de destinos até ferramentas de qualificação. Queríamos que outros 
                não passassem pelas mesmas dificuldades que enfrentamos.
              </p>
              
              <h3 className="font-baskerville text-xl mb-4 text-gray-900">2024 - IA e Inovação</h3>
              <p className="text-gray-600 font-figtree">
                Incorporamos inteligência artificial para personalizar a experiência de cada usuário, 
                criando ferramentas que se adaptam ao perfil individual e oferecem orientações específicas 
                para cada situação única.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-azul-petroleo text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-baskerville text-center mb-12">
            Nossa Equipe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <Users className="w-16 h-16 text-white" />
              </div>
              <h3 className="font-baskerville text-xl mb-2">Carlos Silva</h3>
              <p className="text-blue-200 font-figtree mb-3">CEO & Fundador</p>
              <p className="text-sm text-blue-100">
                Engenheiro de software brasileiro, vive em Miami há 8 anos. 
                Especialista em produtos digitais e imigração.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <Target className="w-16 h-16 text-white" />
              </div>
              <h3 className="font-baskerville text-xl mb-2">Ana Rodriguez</h3>
              <p className="text-blue-200 font-figtree mb-3">COO & Co-fundadora</p>
              <p className="text-sm text-blue-100">
                Advogada de imigração certificada, especialista em vistos e 
                processos legais para brasileiros nos EUA.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <Globe className="w-16 h-16 text-white" />
              </div>
              <h3 className="font-baskerville text-xl mb-2">Pedro Santos</h3>
              <p className="text-blue-200 font-figtree mb-3">CTO</p>
              <p className="text-sm text-blue-100">
                Cientista de dados e especialista em IA, responsável pelo 
                desenvolvimento das ferramentas inteligentes da plataforma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-baskerville text-center mb-12 text-gray-900">
            Nossos Números
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-azul-petroleo mb-2">10,000+</div>
              <p className="text-gray-600 font-figtree">Usuários Registrados</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-azul-petroleo mb-2">50+</div>
              <p className="text-gray-600 font-figtree">Cidades Mapeadas</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-azul-petroleo mb-2">2,500+</div>
              <p className="text-gray-600 font-figtree">Sonhos Realizados</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-azul-petroleo mb-2">95%</div>
              <p className="text-gray-600 font-figtree">Taxa de Satisfação</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-baskerville mb-6 text-gray-900">
            Faça Parte da Nossa História
          </h2>
          <p className="text-xl text-gray-600 font-figtree mb-8">
            Junte-se a milhares de brasileiros que já iniciaram sua jornada para os EUA conosco
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/formulario"
              className="bg-azul-petroleo text-white px-8 py-3 rounded-lg font-figtree font-semibold hover:bg-opacity-90 transition-colors"
            >
              Começar Minha Jornada
            </a>
            <a 
              href="/contato"
              className="bg-transparent border-2 border-azul-petroleo text-azul-petroleo px-8 py-3 rounded-lg font-figtree font-semibold hover:bg-azul-petroleo hover:text-white transition-colors"
            >
              Falar Conosco
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
