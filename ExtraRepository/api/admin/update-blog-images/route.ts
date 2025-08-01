import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Iniciando busca de imagens para artigos...');
    
    // Chamar o endpoint de update de imagens
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blog/update-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Script executado com sucesso',
      data: result
    });
    
  } catch (error) {
    console.error('❌ Erro ao executar script:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao executar script de busca de imagens',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Endpoint para executar busca de imagens dos artigos',
    usage: 'Faça uma requisição POST para executar o script'
  });
}
