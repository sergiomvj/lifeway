-- Habilita a extensão realtime se ainda não estiver habilitada
create extension if not exists "wrappers" with schema extensions;
create extension if not exists "supabase_vault" with schema vault;
create extension if not exists "pg_net" with schema extensions;
create extension if not exists "supabase_realtime" with schema extensions;

-- Garante que a tabela user_contexts está configurada para atualizações em tempo real
alter publication supabase_realtime add table user_contexts;

-- Configura as políticas de RLS para a tabela user_contexts
alter table user_contexts enable row level security;

-- Política para permitir que usuários vejam apenas seu próprio contexto
create policy "Users can view their own context"
on user_contexts for select
using (auth.uid() = user_id::uuid);

-- Política para permitir que usuários atualizem apenas seu próprio contexto
create policy "Users can update their own context"
on user_contextes for update
using (auth.uid() = user_id::uuid);

-- Política para permitir que usuários insiram apenas seu próprio contexto
create policy "Users can insert their own context"
on user_contexts for insert
with check (auth.uid() = user_id::uuid);
