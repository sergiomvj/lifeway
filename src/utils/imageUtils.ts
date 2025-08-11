/**
 * Utilitário para gerenciar URLs de imagens em diferentes ambientes
 */

// URL base para imagens em produção (mesmo domínio do app para evitar CORS)
const PRODUCTION_BASE_URL = 'https://lifewayusa.fbrnews.co';

/**
 * Retorna o URL completo para uma imagem, considerando o ambiente atual
 * @param path Caminho relativo da imagem (ex: '/storage/images/family/default-1.jpg')
 * @returns URL completo da imagem
 */
export function getImageUrl(path: string): string {
  // Se estamos em produção, use o URL base de produção
  if (import.meta.env.PROD) {
    // Garante que o path comece com '/'
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${PRODUCTION_BASE_URL}${normalizedPath}`;
  }
  
  // Em desenvolvimento, retorna o path original
  return path;
}

/**
 * Retorna o URL para uma imagem da família
 * @param filename Nome do arquivo da imagem (ex: 'default-1.jpg')
 * @returns URL completo da imagem
 */
export function getFamilyImageUrl(filename: string): string {
  return getImageUrl(`/storage/images/family/${filename}`);
}

/**
 * Retorna o URL para uma imagem de cidade principal (main_destiny = true)
 * @param cityIdOrUrl ID da cidade (UUID) ou URL completa
 * @returns URL completo da imagem
 */
export function getMainCityImageUrl(cityIdOrUrl: string | undefined): string {
  console.log('[getMainCityImageUrl] Input:', cityIdOrUrl);
  
  if (!cityIdOrUrl) {
    console.log('[getMainCityImageUrl] Input vazio, usando imagem padrão');
    return getDefaultCityImageUrl();
  }
  
  // Se já for uma URL completa, retorna como está
  if (cityIdOrUrl.startsWith('http') || cityIdOrUrl.startsWith('/')) {
    console.log('[getMainCityImageUrl] URL completa detectada, retornando como está');
    return cityIdOrUrl;
  }
  
  // Verifica se o ID já contém extensão
  if (cityIdOrUrl.endsWith('.jpg') || cityIdOrUrl.endsWith('.png') || cityIdOrUrl.endsWith('.jpeg')) {
    const url = getImageUrl(`/storage/images/maincities/${cityIdOrUrl}`);
    console.log('[getMainCityImageUrl] ID com extensão, URL gerada:', url);
    return url;
  }
  
  // Usa o ID UUID diretamente com extensão .jpg
  const url = getImageUrl(`/storage/images/maincities/${cityIdOrUrl}.jpg`);
  console.log('[getMainCityImageUrl] Usando ID UUID diretamente, URL gerada:', url);
  return url;
}

/**
 * Retorna o URL para uma imagem de cidade (todas as cidades)
 * @param cityIdOrUrl ID da cidade (UUID) ou URL completa
 * @returns URL completo da imagem
 */
export function getCityImageUrl(cityIdOrUrl: string | undefined): string {
  console.log('[getCityImageUrl] Input:', cityIdOrUrl);
  
  if (!cityIdOrUrl) {
    console.log('[getCityImageUrl] Input vazio, usando imagem padrão');
    return getDefaultCityImageUrl();
  }
  
  // Se já for uma URL completa, retorna como está
  if (cityIdOrUrl.startsWith('http') || cityIdOrUrl.startsWith('/')) {
    console.log('[getCityImageUrl] URL completa detectada, retornando como está');
    return cityIdOrUrl;
  }
  
  // Verifica se o ID já contém extensão
  if (cityIdOrUrl.endsWith('.jpg') || cityIdOrUrl.endsWith('.png') || cityIdOrUrl.endsWith('.jpeg')) {
    const url = getImageUrl(`/storage/images/cities/${cityIdOrUrl}`);
    console.log('[getCityImageUrl] ID com extensão, URL gerada:', url);
    return url;
  }
  
  // Usa o ID UUID diretamente com extensão .jpg
  const url = getImageUrl(`/storage/images/cities/${cityIdOrUrl}.jpg`);
  console.log('[getCityImageUrl] Usando ID UUID diretamente, URL gerada:', url);
  return url;
}

/**
 * Retorna o URL para a imagem padrão de cidade
 * @returns URL completo da imagem padrão de cidade
 */
export function getDefaultCityImageUrl(): string {
  return getImageUrl('/storage/images/cities/default-city.jpg');
}

/**
 * Retorna o URL para a imagem fixa da família (para Hero da home)
 * @returns URL completo da imagem fixa
 */
export function getRandomFamilyImageUrl(): string {
  // Imagem fixa para evitar delay no carregamento
  const fixedImage = 'derek-owens-cmzlFICyL6Y-unsplash.jpg';
  
  console.log('[getRandomFamilyImageUrl] Usando imagem fixa:', fixedImage);
  return getFamilyImageUrl(fixedImage);
}
