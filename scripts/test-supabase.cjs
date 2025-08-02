const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testando conectividade com Supabase...');
console.log('URL:', supabaseUrl);
console.log('Key (primeiros 20 chars):', supabaseKey?.substring(0, 20) + '...');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n🔗 Testando conexão básica...');
    
    // Teste 1: Verificar se consegue conectar
    const { data: healthCheck, error: healthError } = await supabase
      .from('cities')
      .select('count')
      .limit(1);
    
    if (healthError) {
      console.error('❌ Erro de conectividade:', healthError);
      return;
    }
    
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Teste 2: Verificar tabela cities
    console.log('\n📊 Verificando tabela cities...');
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('*')
      .limit(5);
    
    if (citiesError) {
      console.error('❌ Erro ao buscar cidades:', citiesError);
      return;
    }
    
    console.log(`✅ Encontradas ${cities?.length || 0} cidades (mostrando até 5):`);
    cities?.forEach(city => {
      console.log(`   - ${city.name}, ${city.state} (main_destiny: ${city.main_destiny})`);
    });
    
    // Teste 3: Verificar cidades principais
    console.log('\n🎯 Verificando cidades principais...');
    const { data: mainCities, error: mainError } = await supabase
      .from('cities')
      .select('*')
      .eq('main_destiny', true);
    
    if (mainError) {
      console.error('❌ Erro ao buscar cidades principais:', mainError);
      return;
    }
    
    console.log(`✅ Encontradas ${mainCities?.length || 0} cidades principais:`);
    mainCities?.forEach(city => {
      console.log(`   - ${city.name}, ${city.state}`);
    });
    
    // Teste 4: Verificar outras tabelas importantes
    console.log('\n📚 Verificando outras tabelas...');
    
    // Teste blog posts
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('count')
      .limit(1);
    
    if (postsError) {
      console.log('⚠️  Tabela blog_posts não encontrada ou sem acesso:', postsError.message);
    } else {
      console.log('✅ Tabela blog_posts acessível');
    }
    
    // Teste auth
    console.log('\n🔐 Testando autenticação...');
    const { data: user, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('ℹ️  Nenhum usuário logado (normal):', authError.message);
    } else {
      console.log('✅ Sistema de auth funcionando, usuário:', user?.user?.email || 'anônimo');
    }
    
  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

testConnection()
  .then(() => {
    console.log('\n🏁 Teste finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
