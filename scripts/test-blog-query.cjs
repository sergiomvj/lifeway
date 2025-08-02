const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testando query específica da página de blog...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBlogPageQuery() {
  try {
    console.log('\n📚 Simulando query corrigida da página de blog...');
    
    // Simular exatamente a query da página de blog corrigida
    const { data: postsData, error: postsError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error('❌ Erro na query básica:', postsError);
      return;
    }

    console.log(`✅ Query básica funcionou: ${postsData?.length || 0} posts encontrados`);
    
    if (postsData && postsData.length > 0) {
      console.log('\n📋 Primeiros 3 posts:');
      postsData.slice(0, 3).forEach(post => {
        console.log(`   - ${post.title}`);
        console.log(`     ID: ${post.id}`);
        console.log(`     Category ID: ${post.category_id}`);
        console.log(`     Published: ${post.published}`);
        console.log(`     Created: ${post.created_at}`);
        console.log('');
      });

      // Testar busca de categoria para o primeiro post
      const firstPost = postsData[0];
      if (firstPost.category_id) {
        console.log('\n🏷️ Testando busca de categoria...');
        const { data: categoryData, error: categoryError } = await supabase
          .from('blog_categories')
          .select('name')
          .eq('id', firstPost.category_id)
          .single();

        if (categoryError) {
          console.error('❌ Erro ao buscar categoria:', categoryError);
        } else {
          console.log(`✅ Categoria encontrada: ${categoryData?.name}`);
        }
      }

      // Testar busca de tags para o primeiro post
      console.log('\n🏷️ Testando busca de tags...');
      const { data: tagsData, error: tagsError } = await supabase
        .from('blog_post_tags')
        .select(`
          blog_tags(name)
        `)
        .eq('post_id', firstPost.id);

      if (tagsError) {
        console.error('❌ Erro ao buscar tags:', tagsError);
      } else {
        console.log(`✅ Tags encontradas: ${tagsData?.length || 0}`);
        tagsData?.forEach(item => {
          console.log(`   - ${item.blog_tags?.name}`);
        });
      }
    }
    
  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

testBlogPageQuery()
  .then(() => {
    console.log('\n🏁 Teste específico finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
