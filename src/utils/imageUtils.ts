/**
 * Utilitário para gerenciar URLs de imagens em diferentes ambientes
 */

// URL base para imagens em produção (domínio do Coolify)
const PRODUCTION_BASE_URL = 'https://ikowkkkccc0g8o8c0w8swgk0.fbrnews.co';

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
 * Retorna o URL para uma imagem de cidade
 * @param cityIdOrUrl ID da cidade, nome do arquivo ou URL completa
 * @returns URL completo da imagem
 */
// Mapeamento de IDs de cidades para nomes de arquivos simplificados
const cityIdToFilename: Record<string, string> = {
  // Atlanta
  '877c3132-d65e-477f-b782-6e2c0a0f5bbb': 'atlanta',
  // Boston
  '3412558c-0b0f-4622-b83b-a2538ba47d24': 'boston',
  // Chicago
  'c9884f20-b52f-414d-8078-eeab4bd1c934': 'chicago',
  // Dallas
  '73674253-a9c0-4721-ab9b-d246a17a6582': 'dallas',
  // Denver
  '5bfb3e1a-58d6-4a75-9da9-a482cbdcab6d': 'denver',
  // Houston
  '3ee39bb0-718c-44da-8e34-181810feda4b': 'houston',
  // Los Angeles
  'd24bf4c6-487e-4f88-8c57-89d46aca9aab': 'los-angeles',
  // Miami
  '737804b9-d7b9-402e-9aa9-3be32d4a94dc': 'miami',
  // New York
  '0ef81de2-c9f1-4e63-a0bc-1384808fd0b4': 'new-york',
  // Orlando
  'db57eb45-4de6-4db9-8ccf-90cb1cc379d1': 'orlando',
  // Philadelphia
  '0ecbd347-f9d6-4ca5-8064-b8d6f0e7d5d3': 'philadelphia',
  // Phoenix
  'a8064db4-085c-45a3-9e58-4811fafbc7da': 'phoenix',
  // San Diego
  'fe3ce3cc-7a21-4457-b3c7-816d784dd382': 'san-diego',
  // San Francisco
  '01f472cf-0f8c-4255-977a-c60a99bd580e': 'san-francisco',
  // Seattle
  '20e30b2f-f5fc-41d4-8e58-c9bf0ca0e15a': 'seattle',
  // Washington DC
  '27d957cc-fc01-4043-90d7-4761e1214894': 'washington-dc'
};

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
    const url = getImageUrl(`/storage/images/maincities/${cityIdOrUrl}`);
    console.log('[getCityImageUrl] ID com extensão, URL gerada:', url);
    return url;
  }
  
  // Tenta usar o mapeamento de ID para nome de arquivo simplificado
  if (cityIdToFilename[cityIdOrUrl]) {
    const filename = cityIdToFilename[cityIdOrUrl];
    const url = getImageUrl(`/storage/images/maincities/${filename}.jpg`);
    console.log('[getCityImageUrl] Usando nome simplificado:', filename, 'URL gerada:', url);
    return url;
  }
  
  // Caso contrário, usa o ID original com extensão .jpg
  const url = getImageUrl(`/storage/images/maincities/${cityIdOrUrl}.jpg`);
  console.log('[getCityImageUrl] ID sem extensão e sem mapeamento, URL gerada com .jpg:', url);
  return url;
}

/**
 * Retorna o URL para a imagem padrão de cidade
 * @returns URL completo da imagem padrão de cidade
 */
export function getDefaultCityImageUrl(): string {
  return getImageUrl('/storage/images/cities/default-city.jpg');
}
