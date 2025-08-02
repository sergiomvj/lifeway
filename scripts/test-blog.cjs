const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testando conectividade com tabelas do Blog...');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBlogTables() {
  try {
    console.log('\n📚 Testando tabela blog_posts...');
    
    // Teste 1: Verificar se a tabela blog_posts existe e tem dados
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(5);
    
    if (postsError) {
      console.error('❌ Erro ao acessar blog_posts:', postsError);
      return;
    }
    
    console.log(`✅ Tabela blog_posts acessível com ${posts?.length || 0} posts (mostrando até 5):`);
    posts?.forEach(post => {
      console.log(`   - ${post.title} (published: ${post.published})`);
    });
    
    // Teste 2: Verificar posts publicados
    console.log('\n📖 Verificando posts publicados...');
    const { data: publishedPosts, error: publishedError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true);
    
    if (publishedError) {
      console.error('❌ Erro ao buscar posts publicados:', publishedError);
      return;
    }
    
    console.log(`✅ Posts publicados: ${publishedPosts?.length || 0}`);
    publishedPosts?.forEach(post => {
      console.log(`   - ${post.title} (${post.created_at})`);
    });
    
    // Teste 3: Verificar tabela blog_categories
    console.log('\n🏷️ Testando tabela blog_categories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('blog_categories')
      .select('*');
    
    if (categoriesError) {
      console.error('❌ Erro ao acessar blog_categories:', categoriesError);
    } else {
      console.log(`✅ Categorias encontradas: ${categories?.length || 0}`);
      categories?.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.id})`);
      });
    }
    
    // Teste 4: Verificar tabela blog_tags
    console.log('\n🏷️ Testando tabela blog_tags...');
    const { data: tags, error: tagsError } = await supabase
      .from('blog_tags')
      .select('*');
    
    if (tagsError) {
      console.error('❌ Erro ao acessar blog_tags:', tagsError);
    } else {
      console.log(`✅ Tags encontradas: ${tags?.length || 0}`);
      tags?.slice(0, 5).forEach(tag => {
        console.log(`   - ${tag.name}`);
      });
    }
    
    // Teste 5: Verificar tabela blog_post_tags
    console.log('\n🔗 Testando tabela blog_post_tags...');
    const { data: postTags, error: postTagsError } = await supabase
      .from('blog_post_tags')
      .select('*')
      .limit(5);
    
    if (postTagsError) {
      console.error('❌ Erro ao acessar blog_post_tags:', postTagsError);
    } else {
      console.log(`✅ Relações post-tags encontradas: ${postTags?.length || 0}`);
    }
    
    // Teste 6: Simular query da página de blog
    console.log('\n🔄 Simulando query da página de blog...');
    const { data: blogPageData, error: blogPageError } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories!inner(name)
      `)
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    if (blogPageError) {
      console.error('❌ Erro na query da página de blog:', blogPageError);
    } else {
      console.log(`✅ Query da página de blog funcionou: ${blogPageData?.length || 0} posts`);
      blogPageData?.slice(0, 3).forEach(post => {
        console.log(`   - ${post.title} (categoria: ${post.blog_categories?.name || 'N/A'})`);
      });
    }
    
  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

testBlogTables()
  .then(() => {
    console.log('\n🏁 Teste do blog finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
