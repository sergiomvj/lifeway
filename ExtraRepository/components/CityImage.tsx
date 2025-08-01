'use client';

import { useState } from 'react';
import Image from 'next/image';
import { City } from '../lib/cities-real';

interface CityImageProps {
  city: City;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

export default function CityImage({ 
  city, 
  className = '',
  fill = false,
  sizes,
  priority = false,
  width,
  height
}: CityImageProps) {
  const [imageError, setImageError] = useState(false);

  // Função para gerar URL da imagem baseada no ID da cidade
  const getCityImageUrl = (): string => {
    // Primeiro verifica se tem campo imagem
    if (city.imagem && !imageError) {
      return city.imagem;
    }
    
    // Usar sempre o ID da cidade
    return `/images/cities/${city.id}.jpg`;
  };

  // Usa a URL da imagem padronizada ou fallback
  const imageUrl = imageError ? '/images/cities/default-city.jpg' : getCityImageUrl();

  return (
    <Image
      src={imageUrl}
      alt={city.name}
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => {
        // Em caso de erro, usa imagem padrão
        setImageError(true);
      }}
    />
  );
}
