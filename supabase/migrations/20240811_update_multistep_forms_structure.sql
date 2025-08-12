-- Migração para atualizar a estrutura da tabela multistep_forms
-- Data: 2024-08-11
-- Autor: Cascade AI

-- Habilitar extensão para UUID se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tipo ENUM para status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'form_status') THEN
        CREATE TYPE form_status AS ENUM ('draft', 'in_progress', 'completed', 'archived');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'form_type') THEN
        CREATE TYPE form_type AS ENUM ('profile', 'dream', 'visa', 'especialista');
    END IF;
END$$;

-- Criar a nova estrutura da tabela se ela não existir
CREATE TABLE IF NOT EXISTS multistep_forms_new (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    form_type form_type NOT NULL,
    status form_status NOT NULL DEFAULT 'draft',
    version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    -- Dados do formulário
    form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Metadados do sistema
    system_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Índices para melhorar performance
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Criar índices para campos frequentemente consultados
CREATE INDEX IF NOT EXISTS idx_multistep_forms_user_id ON multistep_forms_new(user_id);
CREATE INDEX IF NOT EXISTS idx_multistep_forms_form_type ON multistep_forms_new(form_type);
CREATE INDEX IF NOT EXISTS idx_multistep_forms_status ON multistep_forms_new(status);
CREATE INDEX IF NOT EXISTS idx_multistep_forms_created_at ON multistep_forms_new(created_at);

-- Criar índice GIN para consultas em campos JSONB
CREATE INDEX IF NOT EXISTS idx_multistep_forms_form_data ON multistep_forms_new USING GIN (form_data);

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar o campo updated_at
DROP TRIGGER IF EXISTS update_multistep_forms_updated_at ON multistep_forms_new;
CREATE TRIGGER update_multistep_forms_updated_at
BEFORE UPDATE ON multistep_forms_new
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Migrar dados existentes se a tabela antiga existir
DO $$
BEGIN
    -- Verificar se a tabela antiga existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'multistep_forms') THEN
        -- Inserir os dados existentes na nova tabela
        INSERT INTO multistep_forms_new (
            id, 
            user_id, 
            form_data, 
            created_at, 
            updated_at,
            status,
            form_type,
            version,
            system_metadata
        )
        SELECT 
            id,
            NULL, -- user_id será atualizado posteriormente se houver mapeamento
            COALESCE(form_data, '{}'::jsonb) || 
            jsonb_build_object(
                'personal_info', jsonb_build_object(
                    'fullName', (form_data->>'fullName'),
                    'email', (form_data->>'email'),
                    'birthDate', (form_data->>'birthDate'),
                    'maritalStatus', (form_data->>'maritalStatus')
                    -- Adicione outros campos conforme necessário
                )
            ),
            COALESCE(created_at, NOW()),
            COALESCE(updated_at, NOW()),
            CASE 
                WHEN is_completed = 'true' THEN 'completed'::form_status 
                ELSE 'draft'::form_status 
            END,
            'profile'::form_type, -- Definir como 'profile' por padrão para dados existentes
            '1.0.0',
            jsonb_build_object(
                'source', 'migration',
                'migrated_at', NOW(),
                'original_data', form_data
            )
        FROM multistep_forms;
        
        -- Renomear tabelas para substituir a antiga pela nova
        ALTER TABLE multistep_forms RENAME TO multistep_forms_old;
        ALTER TABLE multistep_forms_new RENAME TO multistep_forms;
        
        -- Recriar índices, triggers, etc. na tabela renomeada
        ALTER INDEX idx_multistep_forms_user_id RENAME TO idx_multistep_forms_user_id_old;
        ALTER INDEX idx_multistep_forms_form_type RENAME TO idx_multistep_forms_form_type_old;
        ALTER INDEX idx_multistep_forms_status RENAME TO idx_multistep_forms_status_old;
        ALTER INDEX idx_multistep_forms_created_at RENAME TO idx_multistep_forms_created_at_old;
        ALTER INDEX idx_multistep_forms_form_data RENAME TO idx_multistep_forms_form_data_old;
        
        -- Recriar os índices com os nomes corretos
        CREATE INDEX idx_multistep_forms_user_id ON multistep_forms(user_id);
        CREATE INDEX idx_multistep_forms_form_type ON multistep_forms(form_type);
        CREATE INDEX idx_multistep_forms_status ON multistep_forms(status);
        CREATE INDEX idx_multistep_forms_created_at ON multistep_forms(created_at);
        CREATE INDEX idx_multistep_forms_form_data ON multistep_forms USING GIN (form_data);
        
        -- Recriar o trigger
        DROP TRIGGER IF EXISTS update_multistep_forms_updated_at ON multistep_forms;
        CREATE TRIGGER update_multistep_forms_updated_at
        BEFORE UPDATE ON multistep_forms
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
        
        -- Adicionar comentários para documentação
        COMMENT ON TABLE multistep_forms IS 'Tabela unificada para armazenar formulários multi-etapa do sistema Lifeway';
        COMMENT ON COLUMN multistep_forms.form_data IS 'Dados do formulário estruturados em JSONB';
        COMMENT ON COLUMN multistep_forms.system_metadata IS 'Metadados do sistema, como histórico de alterações, origem dos dados, etc.';
        
        -- Log de migração
        RAISE NOTICE 'Migração concluída: % linhas migradas', (SELECT COUNT(*) FROM multistep_forms);
    ELSE
        -- Se a tabela antiga não existir, apenas criar a nova
        CREATE TABLE IF NOT EXISTS multistep_forms (LIKE multistep_forms_new INCLUDING ALL);
        DROP TABLE IF EXISTS multistep_forms_new;
        RAISE NOTICE 'Tabela multistep_forms criada com sucesso';
    END IF;
END $$;
