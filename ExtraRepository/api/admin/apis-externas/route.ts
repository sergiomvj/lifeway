import { NextRequest, NextResponse } from "next/server";
// Importe seu client do banco de dados (ex: prisma, supabase, pg, etc)
// Exemplo com pg (node-postgres):
// import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, tipo, chave, descricao } = body;
    if (!nome || !tipo || !chave) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
    }
    // const result = await pool.query(
    //   'INSERT INTO apis_externas (nome, tipo, chave, descricao) VALUES ($1, $2, $3, $4) RETURNING *',
    //   [nome, tipo, chave, descricao]
    // );
    // return NextResponse.json(result.rows[0]);
    return NextResponse.json({ success: true, data: { nome, tipo, chave, descricao } });
  } catch (e) {
    return NextResponse.json({ error: "Erro ao cadastrar API externa." }, { status: 500 });
  }
}

export async function GET() {
  // Exemplo com node-postgres:
  // const result = await pool.query('SELECT * FROM apis_externas ORDER BY id DESC');
  // return NextResponse.json(result.rows);
  // Placeholder:
  return NextResponse.json([
    // { id: 1, nome: "Supabase", tipo: "supabase", chave: "...", descricao: "Banco principal" }
  ]);
}

export async function PUT(req: NextRequest) {
  try {
    const id = Number(req.nextUrl.searchParams.get("id"));
    const body = await req.json();
    // const result = await pool.query(
    //   'UPDATE apis_externas SET nome=$1, tipo=$2, chave=$3, descricao=$4, updated_at=NOW() WHERE id=$5 RETURNING *',
    //   [body.nome, body.tipo, body.chave, body.descricao, id]
    // );
    // return NextResponse.json(result.rows[0]);
    return NextResponse.json({ success: true, id, ...body });
  } catch (e) {
    return NextResponse.json({ error: "Erro ao atualizar API externa." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = Number(req.nextUrl.searchParams.get("id"));
    // await pool.query('DELETE FROM apis_externas WHERE id=$1', [id]);
    return NextResponse.json({ success: true, id });
  } catch (e) {
    return NextResponse.json({ error: "Erro ao excluir API externa." }, { status: 500 });
  }
}
