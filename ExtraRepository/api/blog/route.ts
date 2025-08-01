import { NextRequest, NextResponse } from 'next/server'
import supabase from '../../lib/supabaseClient'

// GET - Listar todos os posts
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar posts:', error)
      return NextResponse.json({ error: 'Erro ao buscar posts' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST - Criar novo post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        title: body.title,
        slug: body.slug,
        summary: body.summary,
        body: body.body,
        author_name: body.author_name || 'LifeWay USA',
        read_time: body.read_time || 5,
        published: body.published || false,
        view_count: 0
      }])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar post:', error)
      return NextResponse.json({ error: 'Erro ao criar post' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
