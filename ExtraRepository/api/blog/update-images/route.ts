import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// Função para buscar imagem com fallback entre provedores
async function searchImage(query: string): Promise<string | null> {
  console.log(`🔍 Buscando imagem para: "${query}"`);
  
  // Tentar Unsplash primeiro
  if (process.env.UNSPLASH_ACCESS_KEY && process.env.UNSPLASH_ACCESS_KEY !== 'your_unsplash_access_key_here') {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
          }
        }
      );
      
      const data = await response.json() as any;
      if (data.results && data.results.length > 0) {
        console.log(`✅ Imagem encontrada no Unsplash`);
        return data.results[0].urls.regular;
      }
    } catch (error) {
      console.error('❌ Erro no Unsplash:', error);
    }
  }
  
  // Tentar Pexels
  if (process.env.PEXELS_API_KEY && process.env.PEXELS_API_KEY !== 'your_pexels_api_key_here') {
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        {
          headers: {
            'Authorization': process.env.PEXELS_API_KEY
          }
        }
      );
      
      const data = await response.json() as any;
      if (data.photos && data.photos.length > 0) {
        console.log(`✅ Imagem encontrada no Pexels`);
        return data.photos[0].src.large;
      }
    } catch (error) {
      console.error('❌ Erro no Pexels:', error);
    }
  }
  
  // Tentar Pixabay
  if (process.env.PIXABAY_API_KEY && process.env.PIXABAY_API_KEY !== 'your_pixabay_api_key_here') {
    try {
      const response = await fetch(
        `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=3&min_width=800`
      );
      
      const data = await response.json() as any;
      if (data.hits && data.hits.length > 0) {
        console.log(`✅ Imagem encontrada no Pixabay`);
        return data.hits[0].largeImageURL;
      }
    } catch (error) {
      console.error('❌ Erro no Pixabay:', error);
    }
  }
  
  return null;
}

// Função para extrair palavras-chave relevantes do título
function extractKeywords(title: string): string[] {
  const stopWords = [
    'a', 'o', 'e', 'de', 'do', 'da', 'em', 'um', 'uma', 'para', 'com', 'por', 'que', 'como', 'se', 'na', 'no',
    'guia', 'dicas', 'complete', 'como', 'por que', 'quando', 'onde', 'melhor', 'melhores', 'top'
  ];
  
  const words = title.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
  
  const priorityWords = ['eua', 'usa', 'america', 'estados unidos', 'visto', 'imigracao', 'green card', 'citizenship'];
  const relevant = words.filter(word => priorityWords.some(priority => word.includes(priority)));
  
  return relevant.length > 0 ? relevant.slice(0, 3) : words.slice(0, 3);
}

async function updateArticleImages() {
  console.log('🚀 Iniciando busca de imagens para artigos...\n');
  
  // Buscar todos os artigos sem imagem de capa
  const { data: articles, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, cover_image_url')
    .is('cover_image_url', null);
  
  if (error) {
    console.error('❌ Erro ao buscar artigos:', error);
    throw error;
  }
  
  if (!articles || articles.length === 0) {
    console.log('ℹ️ Nenhum artigo sem imagem encontrado.');
    return;
  }
  
  console.log(`📝 Encontrados ${articles.length} artigos sem imagem de capa\n`);
  
  for (const article of articles) {
    console.log(`\n📄 Processando: "${article.title}"`);
    
    // Extrair palavras-chave do título
    const keywords = extractKeywords(article.title);
    console.log(`🏷️ Palavras-chave: ${keywords.join(', ')}`);
    
    let imageUrl = null;
    
    // Tentar buscar com palavras-chave + "USA" para contexto
    for (const keyword of keywords) {
      const queries = [
        `${keyword} USA america`,
        `${keyword} united states`,
        keyword
      ];
      
      for (const query of queries) {
        imageUrl = await searchImage(query);
        if (imageUrl) break;
      }
      
      if (imageUrl) break;
    }
    
    // Fallback: buscar com título completo
    if (!imageUrl) {
      const titleQuery = article.title.replace(/[^\w\s]/g, ' ').trim();
      imageUrl = await searchImage(titleQuery);
    }
    
    // Fallback: temas relacionados aos EUA
    if (!imageUrl) {
      const fallbackQueries = [
        'american flag usa',
        'united states america',
        'immigration usa',
        'american dream'
      ];
      
      for (const query of fallbackQueries) {
        imageUrl = await searchImage(query);
        if (imageUrl) break;
      }
    }
    
    // Atualizar artigo com a imagem encontrada
    if (imageUrl) {
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ cover_image_url: imageUrl })
        .eq('id', article.id);
      
      if (updateError) {
        console.error(`❌ Erro ao atualizar artigo ${article.id}:`, updateError);
      } else {
        console.log(`✅ Imagem atualizada para "${article.title}"`);
      }
    } else {
      console.log(`⚠️ Nenhuma imagem encontrada para "${article.title}"`);
    }
    
    // Delay para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🎉 Processo concluído!');
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Iniciando atualização de imagens do blog via API...');
    
    // Verificar se há autorização (opcional)
    const authHeader = request.headers.get('authorization');
    const expectedAuth = process.env.BLOG_UPDATE_KEY || 'update-images-2024';
    
    if (authHeader !== `Bearer ${expectedAuth}`) {
      return NextResponse.json({ 
        error: 'Não autorizado',
        message: 'Chave de API inválida' 
      }, { status: 401 });
    }
    
    // Executar a atualização
    await updateArticleImages();
    
    return NextResponse.json({ 
      success: true,
      message: 'Imagens dos artigos atualizadas com sucesso!' 
    });
    
  } catch (error) {
    console.error('Erro ao atualizar imagens:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Use POST para atualizar as imagens dos artigos',
    endpoint: '/api/blog/update-images',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_UPDATE_KEY'
    }
  });
}
