"use client";

import Navbar from './Navbar';
import Footer from './Footer';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import WhyUSAStory from './WhyUSAStory';
import LeadMagnet from './LeadMagnet';

interface TemplatePagesProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  heroImages?: string[]; // lista de imagens para sortear
  children: React.ReactNode;
}

const defaultImages = [
  '/images/family/arto-suraj-VTDd6VP7Dps-unsplash.jpg',
  '/images/family/daria-trofimova-T-qNefXNUGw-unsplash.jpg',
  '/images/family/samuel-yongbo-kwon-F4bA_QiMK6U-unsplash.jpg',
  '/images/family/derek-owens-cmzlFICyL6Y-unsplash.jpg',
  '/images/family/kateryna-hliznitsova-N_6OpdOXcxo-unsplash.jpg',
];

function getRandomImage(images: string[]) {
  return images[Math.floor(Math.random() * images.length)];
}

export default function TemplatePages({
  title,
  subtitle = 'Descubra como a LifeWayUSA pode transformar sua jornada.',
  ctaText = 'Comece agora',
  ctaHref = '/',
  heroImages = defaultImages,
  children
}: TemplatePagesProps) {
  const [heroImage, setHeroImage] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setHeroImage(getRandomImage(heroImages));
  }, [heroImages]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      {/* Section 1 - Hero */}
      <section className="relative w-full h-[350px] flex items-center justify-center overflow-hidden">
        {isClient && heroImage && (
          <Image
            src={heroImage}
            alt="Hero background"
            fill
            className="object-cover object-center z-0"
            priority
          />
        )}
        <div className="absolute inset-0 bg-azul-petroleo" style={{opacity:0.85}} />
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full text-center pt-[50px]">
          <h1 className="text-white font-baskerville text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">{title}</h1>
          <p className="text-white text-lg md:text-xl mb-4 drop-shadow-lg">{subtitle}</p>
          <a href={ctaHref} className="inline-block bg-lilac-400 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-lilac-500 transition">{ctaText}</a>
        </div>
      </section>
      {/* Section 2 - Conteúdo da página */}
      <section id="section2" className="flex-1 w-full bg-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          {children}
        </div>
      </section>
      {/* Section 3 - WhyUSAStory */}
      <section className="w-full bg-gray-50 py-12 border-t border-gray-100">
        <WhyUSAStory />
      </section>
      {/* Section 4 - LeadMagnet */}
      <section className="w-full bg-gray-100 py-12 border-t border-gray-200">
        <LeadMagnet />
      </section>
      <Footer />
    </div>
  );
}
