import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: tags, error } = await supabase
      .from('blog_tags')
      .select('*')
      .order('name')

    if (error) {
      console.error('Erro ao buscar tags:', error)
      return NextResponse.json({ error: 'Erro ao buscar tags' }, { status: 500 })
    }

    return NextResponse.json(tags)
  } catch (error) {
    console.error('Erro na API de tags:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }

    const { data: tag, error } = await supabase
      .from('blog_tags')
      .insert([{ name }])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar tag:', error)
      return NextResponse.json({ error: 'Erro ao criar tag' }, { status: 500 })
    }

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error('Erro na API de tags:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
