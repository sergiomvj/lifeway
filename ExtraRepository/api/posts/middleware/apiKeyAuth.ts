import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializa o Supabase Client (ajuste as variáveis se necessário)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function apiKeyAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const apiKey = authHeader?.replace('Bearer ', '').trim();

  if (!apiKey) {
    return NextResponse.json({ error: 'API Key missing' }, { status: 401 });
  }

  // Busca a chave no banco e verifica se está ativa
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('key', apiKey)
    .eq('revoked', false)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Invalid or revoked API Key' }, { status: 403 });
  }

  // Você pode passar o role ou app_name para o handler da rota via req.headers, cookies, etc
  // Exemplo: req.headers.set('x-api-role', data.role);

  // Se tudo ok, retorna null (continua a execução normal da rota)
  return null;
}

// Exemplo de uso em um endpoint:
// import { apiKeyAuth } from './middleware/apiKeyAuth';
// export async function POST(req: NextRequest) {
//   const auth = await apiKeyAuth(req);
//   if (auth) return auth; // retorna erro se não autorizado
//   // ...continua lógica do endpoint
// }
