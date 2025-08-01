import { NextRequest, NextResponse } from 'next/server'
import supabase from '../../../lib/supabaseClient'

// GET - Buscar post por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Primeiro, buscar apenas o post
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', params.id)
      .single()

    if (postError) {
      console.error('Erro ao buscar post:', postError)
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
    }

    // Buscar categoria se existir
    let category = null
    if (post.category_id) {
      const { data: categoryData } = await supabase
        .from('blog_categories')
        .select('*')
        .eq('id', post.category_id)
        .single()
      
      if (categoryData) {
        category = categoryData
      }
    }

    // Buscar tags
    const { data: tagRelations } = await supabase
      .from('blog_post_tags')
      .select('tag_id')
      .eq('post_id', params.id)

    let tags = []
    if (tagRelations && tagRelations.length > 0) {
      const tagIds = tagRelations.map(rel => rel.tag_id)
      const { data: tagsData } = await supabase
        .from('blog_tags')
        .select('*')
        .in('id', tagIds)
      
      if (tagsData) {
        tags = tagsData
      }
    }
    
    return NextResponse.json({
      ...post,
      category,
      tags
    })
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// PUT - Atualizar post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Atualizar post principal
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .update({
        title: body.title,
        slug: body.slug,
        body: body.content, // Mapear 'content' para 'body' que é o nome da coluna
        summary: body.summary,
        image_url: body.image_url,
        author_name: body.author_name,
        read_time: body.read_time,
        published: body.published,
        category_id: body.category_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (postError) {
      console.error('Erro ao atualizar post:', postError)
      return NextResponse.json({ error: 'Erro ao atualizar post' }, { status: 500 })
    }

    // Atualizar tags se fornecidas
    if (body.tag_ids && Array.isArray(body.tag_ids)) {
      // Remover tags existentes
      await supabase
        .from('blog_post_tags')
        .delete()
        .eq('post_id', params.id)

      // Adicionar novas tags
      if (body.tag_ids.length > 0) {
        const tagInserts = body.tag_ids.map((tagId: string) => ({
          post_id: params.id,
          tag_id: tagId
        }))

        const { error: tagsError } = await supabase
          .from('blog_post_tags')
          .insert(tagInserts)

        if (tagsError) {
          console.error('Erro ao atualizar tags:', tagsError)
          // Não retornar erro, apenas logar
        }
      }
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// DELETE - Excluir post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Erro ao excluir post:', error)
      return NextResponse.json({ error: 'Erro ao excluir post' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
