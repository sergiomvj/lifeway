import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

// POST - Upload de imagem
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const slug = formData.get('slug') as string
    const imageFile = formData.get('image') as File
    const imageUrl = formData.get('url') as string

    if (!slug) {
      return NextResponse.json({ error: 'Slug é obrigatório' }, { status: 400 })
    }

    const blogImagesDir = join(process.cwd(), 'public', 'images', 'blog')
    
    // Criar diretório se não existir
    if (!existsSync(blogImagesDir)) {
      mkdirSync(blogImagesDir, { recursive: true })
    }

    const imagePath = join(blogImagesDir, `${slug}.jpg`)

    if (imageFile) {
      // Upload de arquivo
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      await writeFile(imagePath, buffer)
      
    } else if (imageUrl) {
      // Download de URL
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error('Erro ao baixar imagem da URL')
      }
      
      const buffer = Buffer.from(await response.arrayBuffer())
      await writeFile(imagePath, buffer)
    } else {
      return NextResponse.json({ error: 'Arquivo ou URL da imagem é obrigatório' }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      path: `/images/blog/${slug}.jpg` 
    })

  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: 'Erro ao fazer upload da imagem' }, { status: 500 })
  }
}
