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

-- Habilitar RLS (Row Level Security)
ALTER TABLE dream_goals ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam apenas seus próprios objetivos
CREATE POLICY "Users can view own dream goals" ON dream_goals
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Política para permitir que usuários insiram seus próprios objetivos
CREATE POLICY "Users can insert own dream goals" ON dream_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Política para permitir que usuários atualizem seus próprios objetivos
CREATE POLICY "Users can update own dream goals" ON dream_goals
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Política para permitir que usuários deletem seus próprios objetivos
CREATE POLICY "Users can delete own dream goals" ON dream_goals
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_dream_goals_updated_at 
  BEFORE UPDATE ON dream_goals 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
