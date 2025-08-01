import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Converte booleanos string para boolean
  if (body.has_pre_kindergarten !== undefined) body.has_pre_kindergarten = body.has_pre_kindergarten === 'true';
  if (body.has_kindergarten !== undefined) body.has_kindergarten = body.has_kindergarten === 'true';
  const { error } = await supabase.from('schools').insert([body]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
