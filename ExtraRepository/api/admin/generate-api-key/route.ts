import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/admin/generate-api-key
export async function POST(req: NextRequest) {
  // Autenticação: exige header Authorization: Bearer <JWT do usuário>
  const authHeader = req.headers.get('authorization');
  const jwt = authHeader?.replace('Bearer ', '').trim();
  if (!jwt) {
    return NextResponse.json({ error: 'JWT token missing' }, { status: 401 });
  }

  // Valida o JWT e busca o perfil do usuário
  const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
  if (userError || !user) {
    return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
  }

  // Busca o perfil e verifica se é admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profileError || !profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Apenas admin pode gerar API Keys' }, { status: 403 });
  }

  const { app_name, role } = await req.json();
  if (!app_name || !role) {
    return NextResponse.json({ error: 'app_name e role são obrigatórios' }, { status: 400 });
  }

  // Gera uma chave forte
  const apiKey = crypto.randomBytes(32).toString('hex');

  // Salva no banco
  const { error } = await supabase.from('api_keys').insert({
    key: apiKey,
    app_name,
    role,
    revoked: false
  });

  if (error) {
    return NextResponse.json({ error: 'Erro ao salvar API Key', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ apiKey });
}
