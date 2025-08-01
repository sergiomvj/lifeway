import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data', 'forms')

// Garantir que o diretório existe
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataDir()
    
    const body = await request.json()
    const { user_email, form_data, is_completed, qualify } = body

    if (!user_email || !form_data) {
      return NextResponse.json(
        { success: false, error: 'Email do usuário e dados do formulário são obrigatórios' },
        { status: 400 }
      )
    }

    // Sanitizar o email para usar como nome do arquivo
    const filename = user_email.replace(/[^a-zA-Z0-9]/g, '_') + '.json'
    const filepath = path.join(DATA_DIR, filename)

    const formPayload = {
      user_email,
      data: form_data,
      is_completed: is_completed || false,
      qualify: qualify || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Verificar se já existe
    if (existsSync(filepath)) {
      try {
        const existingData = JSON.parse(await readFile(filepath, 'utf8'))
        formPayload.created_at = existingData.created_at // Manter data de criação original
      } catch (error) {
        console.log('Erro ao ler arquivo existente, criando novo')
      }
    }

    await writeFile(filepath, JSON.stringify(formPayload, null, 2))

    return NextResponse.json({
      success: true,
      data: formPayload,
      message: 'Dados do formulário salvos com sucesso (arquivo local)'
    })

  } catch (error) {
    console.error('Erro interno ao salvar formulário:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureDataDir()
    
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('user_email')

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: 'Email do usuário é obrigatório' },
        { status: 400 }
      )
    }

    const filename = userEmail.replace(/[^a-zA-Z0-9]/g, '_') + '.json'
    const filepath = path.join(DATA_DIR, filename)

    if (!existsSync(filepath)) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Nenhum formulário encontrado para este usuário'
      })
    }

    const formData = JSON.parse(await readFile(filepath, 'utf8'))

    return NextResponse.json({
      success: true,
      data: formData,
      message: 'Dados do formulário recuperados com sucesso (arquivo local)'
    })

  } catch (error) {
    console.error('Erro interno ao buscar formulário:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
