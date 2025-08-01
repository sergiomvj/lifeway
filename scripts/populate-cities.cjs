const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Dados das principais cidades americanas para imigrantes brasileiros
const mainCities = [
  {
    name: 'Miami',
    state: 'Florida',
    region: 'Southeast',
    population: 467963,
    cost_of_living_index: 108.2,
    job_opportunities: 'Turismo, Negócios Internacionais, Tecnologia',
    main_destiny: true,
    description: 'Cidade cosmopolita com forte comunidade brasileira, clima tropical e oportunidades de negócios internacionais.'
  },
  {
    name: 'Orlando',
    state: 'Florida',
    region: 'Southeast',
    population: 307573,
    cost_of_living_index: 96.8,
    job_opportunities: 'Turismo, Hospitalidade, Tecnologia',
    main_destiny: true,
    description: 'Capital mundial dos parques temáticos com economia diversificada e crescimento tecnológico.'
  },
  {
    name: 'New York',
    state: 'New York',
    region: 'Northeast',
    population: 8336817,
    cost_of_living_index: 168.1,
    job_opportunities: 'Finanças, Tecnologia, Arte, Mídia',
    main_destiny: true,
    description: 'A cidade que nunca dorme, centro financeiro e cultural mundial com oportunidades ilimitadas.'
  },
  {
    name: 'Los Angeles',
    state: 'California',
    region: 'West',
    population: 3898747,
    cost_of_living_index: 148.2,
    job_opportunities: 'Entretenimento, Tecnologia, Aerospace',
    main_destiny: true,
    description: 'Capital do entretenimento mundial com clima perfeito e diversidade de oportunidades.'
  },
  {
    name: 'Boston',
    state: 'Massachusetts',
    region: 'Northeast',
    population: 695506,
    cost_of_living_index: 149.7,
    job_opportunities: 'Educação, Tecnologia, Saúde, Finanças',
    main_destiny: true,
    description: 'Hub educacional e tecnológico com universidades de renome mundial.'
  },
  {
    name: 'Atlanta',
    state: 'Georgia',
    region: 'Southeast',
    population: 498715,
    cost_of_living_index: 97.8,
    job_opportunities: 'Tecnologia, Logística, Finanças',
    main_destiny: true,
    description: 'Hub de negócios do Sul com custo de vida acessível e crescimento econômico.'
  },
  {
    name: 'Chicago',
    state: 'Illinois',
    region: 'Midwest',
    population: 2693976,
    cost_of_living_index: 106.9,
    job_opportunities: 'Finanças, Tecnologia, Manufatura',
    main_destiny: true,
    description: 'Terceira maior cidade dos EUA com arquitetura impressionante e economia diversificada.'
  },
  {
    name: 'Houston',
    state: 'Texas',
    region: 'South',
    population: 2320268,
    cost_of_living_index: 96.5,
    job_opportunities: 'Energia, Tecnologia, Aeroespacial, Saúde',
    main_destiny: true,
    description: 'Capital energética dos EUA com economia diversificada e sem imposto estadual.'
  },
  {
    name: 'Dallas',
    state: 'Texas',
    region: 'South',
    population: 1343573,
    cost_of_living_index: 101.2,
    job_opportunities: 'Tecnologia, Finanças, Telecomunicações',
    main_destiny: true,
    description: 'Centro de negócios do Texas com forte economia e oportunidades corporativas.'
  },
  {
    name: 'Seattle',
    state: 'Washington',
    region: 'West',
    population: 749256,
    cost_of_living_index: 172.3,
    job_opportunities: 'Tecnologia, Aerospace, Biotecnologia',
    main_destiny: true,
    description: 'Hub tecnológico com empresas como Amazon e Microsoft, cercado por natureza.'
  }
];

async function checkAndPopulateCities() {
  try {
    console.log('🔍 Verificando cidades existentes...');
    
    // Verificar se já existem cidades na tabela
    const { data: existingCities, error: checkError } = await supabase
      .from('cities')
      .select('id, name, main_destiny')
      .limit(10);

    if (checkError) {
      console.error('❌ Erro ao verificar cidades:', checkError);
      return;
    }

    console.log(`📊 Encontradas ${existingCities?.length || 0} cidades na base de dados`);
    
    if (existingCities && existingCities.length > 0) {
      const mainDestinies = existingCities.filter(city => city.main_destiny);
      console.log(`🎯 Cidades marcadas como destino principal: ${mainDestinies.length}`);
      
      if (mainDestinies.length > 0) {
        console.log('✅ Já existem cidades principais na base de dados:');
        mainDestinies.forEach(city => {
          console.log(`   - ${city.name} (${city.id})`);
        });
        console.log('🔄 Mas vou adicionar as cidades principais do dataset...');
      }
    }

    console.log('🚀 Populando base de dados com cidades principais...');

    // Inserir cidades principais
    const { data: insertedCities, error: insertError } = await supabase
      .from('cities')
      .upsert(mainCities, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select();

    if (insertError) {
      console.error('❌ Erro ao inserir cidades:', insertError);
      return;
    }

    console.log(`✅ ${insertedCities?.length || 0} cidades inseridas com sucesso!`);
    
    // Verificar inserção
    const { data: verifyData, error: verifyError } = await supabase
      .from('cities')
      .select('id, name, state, main_destiny')
      .eq('main_destiny', true);

    if (verifyError) {
      console.error('❌ Erro ao verificar inserção:', verifyError);
      return;
    }

    console.log(`🎯 Verificação: ${verifyData?.length || 0} cidades principais na base de dados`);
    verifyData?.forEach(city => {
      console.log(`   ✓ ${city.name}, ${city.state} (${city.id})`);
    });

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar script
checkAndPopulateCities()
  .then(() => {
    console.log('🏁 Script finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
