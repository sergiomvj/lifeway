import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function POST() {
  try {
    console.log('📝 Criando artigos de exemplo...');
    
    const sampleArticles = [
      {
        title: 'Guia Completo do Visto EB-5: Investimento e Green Card',
        slug: 'guia-completo-eb5-investimento-green-card',
        summary: 'Tudo o que você precisa saber sobre o visto EB-5, investimentos necessários e como obter o Green Card através deste programa.',
        body: `
          <h2>O que é o Visto EB-5?</h2>
          <p>O visto EB-5 é uma oportunidade única para investidores estrangeiros obterem o Green Card americano através de investimento em projetos que criam empregos nos Estados Unidos.</p>
          
          <h3>Requisitos de Investimento</h3>
          <ul>
            <li>Investimento mínimo de $800.000 em área de emprego direcionado (TEA)</li>
            <li>Investimento mínimo de $1.050.000 em outras áreas</li>
            <li>Criação de pelo menos 10 empregos em tempo integral</li>
          </ul>
          
          <h3>Processo de Aplicação</h3>
          <p>O processo envolve várias etapas importantes, desde a escolha do projeto até a aprovação final do Green Card.</p>
        `,
        author_name: 'LifeWay USA Team',
        published: true,
        read_time: 8,
        view_count: 245
      },
      {
        title: 'Melhores Cidades para Empreender nos EUA em 2025',
        slug: 'melhores-cidades-empreender-eua-2025',
        summary: 'Descubra as cidades americanas mais promissoras para abrir seu negócio, com baixo custo operacional e alto potencial de crescimento.',
        body: `
          <h2>Cidades em Destaque para Empreendedores</h2>
          <p>Escolher a cidade certa pode determinar o sucesso do seu negócio nos Estados Unidos. Analisamos fatores como custo de vida, incentivos fiscais e mercado consumidor.</p>
          
          <h3>1. Austin, Texas</h3>
          <p>Centro tecnológico emergente com ambiente favorável aos negócios.</p>
          
          <h3>2. Nashville, Tennessee</h3>
          <p>Crescimento econômico acelerado e sem imposto estadual sobre renda.</p>
          
          <h3>3. Miami, Florida</h3>
          <p>Gateway para a América Latina com mercado diversificado.</p>
        `,
        author_name: 'Especialista em Negócios',
        published: true,
        read_time: 6,
        view_count: 189
      },
      {
        title: 'Custo de Vida nos Estados Unidos: Comparativo por Estados',
        slug: 'custo-vida-estados-unidos-comparativo',
        summary: 'Análise detalhada dos custos de vida em diferentes estados americanos para ajudar no planejamento da sua mudança.',
        body: `
          <h2>Comparativo de Custos</h2>
          <p>O custo de vida varia significativamente entre os estados americanos. É essencial entender essas diferenças para planejar adequadamente sua mudança.</p>
          
          <h3>Estados Mais Caros</h3>
          <ul>
            <li>Califórnia</li>
            <li>Nova York</li>
            <li>Massachusetts</li>
          </ul>
          
          <h3>Estados Mais Econômicos</h3>
          <ul>
            <li>Texas</li>
            <li>Florida</li>
            <li>Tennessee</li>
          </ul>
        `,
        author_name: 'Consultor Financeiro',
        published: true,
        read_time: 5,
        view_count: 312
      }
    ];
    
    // Inserir artigos no banco
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(sampleArticles)
      .select();
    
    if (error) {
      console.error('❌ Erro ao criar artigos:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Erro ao criar artigos de exemplo',
        details: error.message
      }, { status: 500 });
    }
    
    console.log(`✅ ${data?.length || 0} artigos criados com sucesso`);
    
    return NextResponse.json({
      success: true,
      message: `${data?.length || 0} artigos de exemplo criados`,
      articles: data
    });
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Verificar artigos existentes
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, title, cover_image_url')
      .limit(10);
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      total: posts?.length || 0,
      articles: posts || []
    });
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao buscar artigos' 
    }, { status: 500 });
  }
}
