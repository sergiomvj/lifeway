import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Converte booleanos string para boolean
  if (body.f1_certified !== undefined) body.f1_certified = body.f1_certified === 'true';
  if (body.m1_certified !== undefined) body.m1_certified = body.m1_certified === 'true';
  const { error } = await supabase.from('universities').insert([body]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
