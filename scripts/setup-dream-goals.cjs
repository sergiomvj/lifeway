const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  console.error('Certifique-se de que VITE_PUBLIC_SUPABASE_URL e VITE_SUPABASE_SERVICE_ROLE_KEY estão definidas no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDreamGoalsTable() {
  try {
    console.log('🔧 Configurando tabela dream_goals...');

    // SQL para criar a tabela e configurações
    const createTableSQL = `
      -- Criar tabela dream_goals para o formulário multistep Dreams
      CREATE TABLE IF NOT EXISTS dream_goals (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        form_data JSONB NOT NULL,
        action_plan TEXT,
        status VARCHAR(50) DEFAULT 'planejando',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Criar índices para melhor performance
      CREATE INDEX IF NOT EXISTS idx_dream_goals_user_id ON dream_goals(user_id);
      CREATE INDEX IF NOT EXISTS idx_dream_goals_status ON dream_goals(status);
      CREATE INDEX IF NOT EXISTS idx_dream_goals_created_at ON dream_goals(created_at);
    `;

    // Executar SQL para criar tabela
    const { error: createError } = await supabase.rpc('exec_sql', { 
      sql: createTableSQL 
    });

    if (createError) {
      console.error('❌ Erro ao criar tabela:', createError);
      
      // Tentar método alternativo usando query direto
      console.log('🔄 Tentando método alternativo...');
      
      const { error: altError } = await supabase
        .from('dream_goals')
        .select('id')
        .limit(1);
        
      if (altError && altError.code === 'PGRST116') {
        console.log('✅ Tabela dream_goals não existe, será criada automaticamente no primeiro uso');
        console.log('📝 Execute o SQL manualmente no painel do Supabase:');
        console.log(createTableSQL);
        return;
      }
    }

    // Verificar se a tabela foi criada
    const { data: tableCheck, error: checkError } = await supabase
      .from('dream_goals')
      .select('id')
      .limit(1);

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        console.log('⚠️  Tabela dream_goals ainda não existe');
        console.log('📋 Execute este SQL no painel do Supabase SQL Editor:');
        console.log('---');
        console.log(createTableSQL);
        console.log('---');
      } else {
        console.error('❌ Erro ao verificar tabela:', checkError);
      }
    } else {
      console.log('✅ Tabela dream_goals configurada com sucesso!');
    }

    // Inserir dados de exemplo (opcional)
    console.log('📝 Inserindo dados de exemplo...');
    
    const exampleData = {
      form_data: {
        nome: 'João Silva',
        idade: '30',
        profissao: 'Desenvolvedor',
        experiencia: '5 anos',
        objetivo_principal: 'Trabalhar nos EUA como desenvolvedor',
        categoria: 'Carreira',
        timeline: '1-2 anos',
        prioridade: 'alta',
        situacao_atual: 'Trabalhando no Brasil',
        recursos_disponiveis: 'Inglês fluente, experiência técnica',
        obstaculos: 'Visto de trabalho',
        detalhes_especificos: 'Interesse em empresas de tecnologia',
        motivacao: 'Crescimento profissional e qualidade de vida'
      },
      status: 'planejando'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('dream_goals')
      .insert([exampleData])
      .select();

    if (insertError) {
      console.log('⚠️  Não foi possível inserir dados de exemplo:', insertError.message);
    } else {
      console.log('✅ Dados de exemplo inseridos com sucesso!');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar setup
setupDreamGoalsTable()
  .then(() => {
    console.log('🎉 Setup concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Falha no setup:', error);
    process.exit(1);
  });
