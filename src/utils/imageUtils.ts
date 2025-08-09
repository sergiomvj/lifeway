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
 * @param cityId ID da cidade ou nome do arquivo
 * @returns URL completo da imagem
 */
export function getCityImageUrl(cityId: string): string {
  return getImageUrl(`/storage/images/maincities/${cityId}.jpg`);
}

/**
 * Retorna o URL para a imagem padrão de cidade
 * @returns URL completo da imagem padrão de cidade
 */
export function getDefaultCityImageUrl(): string {
  return getImageUrl('/storage/images/cities/default-city.jpg');
}
