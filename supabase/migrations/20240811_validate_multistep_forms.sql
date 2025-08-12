-- Script de validação para a tabela multistep_forms
-- Data: 2024-08-11

-- 1. Verificar se a tabela existe
SELECT 
    'Tabela multistep_forms existe' AS check_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'multistep_forms') 
        THEN '✅' 
        ELSE '❌' 
    END AS status;

-- 2. Verificar colunas da tabela
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns 
WHERE 
    table_name = 'multistep_forms'
ORDER BY 
    ordinal_position;

-- 3. Verificar tipos personalizados
SELECT 
    'Tipo form_status existe' AS check_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'form_status') 
        THEN '✅' 
        ELSE '❌' 
    END AS status
UNION ALL
SELECT 
    'Tipo form_type existe' AS check_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'form_type') 
        THEN '✅' 
        ELSE '❌' 
    END AS status;

-- 4. Verificar valores dos enums
SELECT 
    t.typname AS enum_type,
    e.enumlabel AS enum_value
FROM 
    pg_type t 
    JOIN pg_enum e ON t.oid = e.enumtypid  
    JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE 
    t.typname IN ('form_status', 'form_type')
ORDER BY 
    enum_type, e.enumsortorder;

-- 5. Verificar índices
SELECT
    i.relname AS index_name,
    am.amname AS index_type,
    idx.indisunique AS is_unique,
    idx.indisprimary AS is_primary,
    array_agg(a.attname ORDER BY array_position(idx.indkey, a.attnum)) AS columns,
    pg_get_indexdef(i.oid) AS definition
FROM
    pg_index idx
    JOIN pg_class i ON i.oid = idx.indexrelid
    JOIN pg_am am ON i.relam = am.oid
    JOIN pg_namespace n ON n.oid = i.relnamespace
    JOIN pg_class t ON t.oid = idx.indrelid
    JOIN pg_attribute a ON a.attrelid = t.oid
WHERE
    n.nspname = 'public'
    AND t.relname = 'multistep_forms'
    AND a.attnum = ANY(idx.indkey)
    AND a.attnum > 0
GROUP BY
    i.relname, am.amname, idx.indisunique, idx.indisprimary, i.oid, idx.indkey
ORDER BY
    i.relname;

-- 6. Verificar triggers
SELECT
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing
FROM
    information_schema.triggers
WHERE
    event_object_table = 'multistep_forms';

-- 7. Testar inserção de dados
DO $$
DECLARE
    new_id UUID;
BEGIN
    -- Inserir um registro de teste
    INSERT INTO multistep_forms (
        user_id,
        form_type,
        status,
        version,
        form_data,
        system_metadata
    ) VALUES (
        NULL, -- user_id pode ser nulo para teste
        'profile',
        'draft',
        '1.0.0',
        jsonb_build_object(
            'personal_info', jsonb_build_object(
                'full_name', 'Usuário Teste',
                'email', 'teste@example.com'
            ),
            'objectives', jsonb_build_object(
                'primary_goal', 'work'
            )
        ),
        jsonb_build_object(
            'source', 'test',
            'tested_at', NOW()::text
        )
    ) RETURNING id INTO new_id;

    -- Verificar se o registro foi inserido
    RAISE NOTICE '✅ Registro de teste inserido com ID: %', new_id;
    
    -- Atualizar o registro
    UPDATE multistep_forms 
    SET 
        status = 'completed',
        completed_at = NOW()
    WHERE id = new_id;
    
    RAISE NOTICE '✅ Registro atualizado com sucesso';
    
    -- Verificar o registro atualizado
    PERFORM * FROM multistep_forms WHERE id = new_id;
    
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '❌ Erro durante o teste: %', SQLERRM;
END $$;

-- 8. Contar registros na tabela
SELECT 
    'Total de registros' AS metric,
    COUNT(*) AS value 
FROM 
    multistep_forms
UNION ALL
SELECT 
    'Registros por tipo' AS metric,
    COUNT(*) AS value 
FROM 
    multistep_forms
GROUP BY 
    form_type
UNION ALL
SELECT 
    'Registros por status' AS metric,
    COUNT(*) AS value 
FROM 
    multistep_forms
GROUP BY 
    status;
