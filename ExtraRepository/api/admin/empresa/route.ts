import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TABLE = 'empresa';

export async function GET() {
  const { data, error } = await supabase.from(TABLE).select('*').single();
  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows found
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ empresa: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Upsert: se já existe, atualiza; senão, cria
  const { error } = await supabase.from(TABLE).upsert([body], { onConflict: 'id' });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
