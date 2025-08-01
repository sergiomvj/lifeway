import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    // Criar categorias primeiro
    const categories = [
      { name: 'Destinos', slug: 'destinos' },
      { name: 'Visto Americano', slug: 'visto-americano' },
      { name: 'Dicas de Viagem', slug: 'dicas-viagem' }
    ]

    const categoryResults = await Promise.all(
      categories.map(async (category) => {
        const { data, error } = await supabase
          .from('blog_categories')
          .upsert(category, { onConflict: 'slug' })
          .select()
          .single()
        
        if (error) {
          console.error('Erro ao criar categoria:', error)
          return null
        }
        return data
      })
    )

    // Criar tags
    const tags = [
      { name: 'EUA', slug: 'eua' },
      { name: 'Turismo', slug: 'turismo' },
      { name: 'Imigração', slug: 'imigracao' },
      { name: 'Documentos', slug: 'documentos' }
    ]

    const tagResults = await Promise.all(
      tags.map(async (tag) => {
        const { data, error } = await supabase
          .from('blog_tags')
          .upsert(tag, { onConflict: 'slug' })
          .select()
          .single()
        
        if (error) {
          console.error('Erro ao criar tag:', error)
          return null
        }
        return data
      })
    )

    // Criar posts de exemplo
    const posts = [
      {
        title: 'Como Solicitar o Visto Americano: Guia Completo 2024',
        slug: 'como-solicitar-visto-americano-guia-completo-2024',
        content: `# Como Solicitar o Visto Americano: Guia Completo 2024

O processo de solicitação do visto americano pode parecer complexo, mas com as informações certas e preparação adequada, você pode aumentar significativamente suas chances de aprovação.

## Tipos de Visto

### Visto de Turista (B1/B2)
O visto B1/B2 é o mais comum para turismo, negócios ou visitas familiares.

### Documentos Necessários
- Passaporte válido
- Formulário DS-160
- Foto 5x5cm
- Comprovante de renda
- Vínculos com o Brasil

## Processo Passo a Passo

### 1. Preenchimento do DS-160
O formulário DS-160 deve ser preenchido online no site oficial do Departamento de Estado americano.

### 2. Agendamento da Entrevista
Após pagar a taxa, você pode agendar sua entrevista no consulado.

### 3. Preparação para a Entrevista
- Seja honesto e direto
- Leve todos os documentos originais
- Vista-se adequadamente

## Dicas Importantes

- Nunca minta na entrevista
- Demonstre vínculos fortes com o Brasil
- Tenha um planejamento financeiro claro
- Pratique possíveis perguntas

## Conclusão

Com preparação adequada e documentação completa, o processo de visto pode ser mais tranquilo do que parece.`,
        summary: 'Guia completo para solicitar o visto americano em 2024, com dicas práticas e passo a passo detalhado.',
        image_url: '/images/blog/visto-americano.jpg',
        author_name: 'LifeWay USA',
        read_time: 8,
        published: true,
        category_id: categoryResults[1]?.id || null
      },
      {
        title: 'Os 10 Destinos Mais Procurados nos EUA',
        slug: 'os-10-destinos-mais-procurados-nos-eua',
        content: `# Os 10 Destinos Mais Procurados nos EUA

Os Estados Unidos oferecem uma incrível diversidade de destinos, desde as praias da Califórnia até as montanhas do Colorado.

## 1. Nova York
A cidade que nunca dorme oferece atrações icônicas como Times Square, Central Park e Estátua da Liberdade.

## 2. Orlando - Florida
Capital mundial dos parques temáticos, lar da Disney World e Universal Studios.

## 3. Las Vegas - Nevada
A cidade do entretenimento, famosa pelos cassinos, shows e vida noturna.

## 4. Los Angeles - Califórnia
Hollywood, Beverly Hills e as praias de Santa Monica atraem milhões de visitantes.

## 5. San Francisco - Califórnia
Golden Gate Bridge, Alcatraz e os famosos bondes elétricos.

## 6. Miami - Florida
Praias paradisíacas, vida noturna agitada e arquitetura Art Deco.

## 7. Chicago - Illinois
Arquitetura impressionante, museus de classe mundial e deep dish pizza.

## 8. Washington DC
Capital do país, com monumentos históricos e museus gratuitos.

## 9. Boston - Massachusetts
Rica em história americana, universidades prestigiosas e charme colonial.

## 10. Havaí
Praias paradisíacas, vulcões ativos e cultura polinésia única.

## Planejando sua Viagem

Cada destino oferece experiências únicas. Considere:
- Época do ano
- Orçamento disponível
- Interesses pessoais
- Duração da viagem

## Conclusão

Os EUA têm destinos para todos os gostos e bolsos. Planeje com antecedência para aproveitar ao máximo sua experiência.`,
        summary: 'Descubra os destinos mais populares dos Estados Unidos e planeje sua próxima viagem com nossas dicas exclusivas.',
        image_url: '/images/blog/destinos-eua.jpg',
        author_name: 'Equipe LifeWay',
        read_time: 6,
        published: true,
        category_id: categoryResults[0]?.id || null
      },
      {
        title: 'Dicas de Economia para Viajar pelos EUA',
        slug: 'dicas-economia-viajar-pelos-eua',
        content: `# Dicas de Economia para Viajar pelos EUA

Viajar pelos Estados Unidos não precisa quebrar o banco. Com planejamento inteligente, você pode economizar significativamente.

## Hospedagem Econômica

### Hotéis Budget
- Motel 6
- Red Roof Inn
- Super 8

### Alternativas
- Airbnb
- Hostels
- Camping

## Transporte

### Aluguel de Carro
- Compare preços online
- Evite o aeroporto para retirar
- Considere seguros próprios

### Transporte Público
- Metrô em grandes cidades
- Ônibus intermunicipais
- Passes diários/semanais

## Alimentação

### Economize em Restaurantes
- Happy hours
- Lunch specials
- Food trucks

### Compre no Supermercado
- Prepare lanches
- Café da manhã no hotel
- Bebidas próprias

## Atrações

### Passes Turísticos
- CityPASS
- Go City
- Groupon

### Atrações Gratuitas
- Museus com entrada gratuita
- Parques públicos
- Praias

## Planejamento Financeiro

### Orçamento Diário
- Hospedagem: $50-100
- Alimentação: $30-50
- Transporte: $20-40
- Atrações: $20-60

### Dicas Extras
- Viaje na baixa temporada
- Reserve com antecedência
- Use aplicativos de desconto

## Conclusão

Com essas dicas, você pode explorar os EUA gastando muito menos do que imagina.`,
        summary: 'Aprenda como economizar em hospedagem, transporte, alimentação e atrações durante sua viagem pelos Estados Unidos.',
        image_url: '/images/blog/economia-viagem.jpg',
        author_name: 'LifeWay USA',
        read_time: 5,
        published: false,
        category_id: categoryResults[2]?.id || null
      }
    ]

    const postResults = await Promise.all(
      posts.map(async (post) => {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert(post)
          .select()
          .single()
        
        if (error) {
          console.error('Erro ao criar post:', error)
          return null
        }
        return data
      })
    )

    // Adicionar tags aos posts
    if (postResults[0] && tagResults[0] && tagResults[2]) {
      await supabase.from('blog_post_tags').insert([
        { post_id: postResults[0].id, tag_id: tagResults[0].id }, // EUA
        { post_id: postResults[0].id, tag_id: tagResults[2].id }  // Imigração
      ])
    }

    if (postResults[1] && tagResults[0] && tagResults[1]) {
      await supabase.from('blog_post_tags').insert([
        { post_id: postResults[1].id, tag_id: tagResults[0].id }, // EUA
        { post_id: postResults[1].id, tag_id: tagResults[1].id }  // Turismo
      ])
    }

    if (postResults[2] && tagResults[1]) {
      await supabase.from('blog_post_tags').insert([
        { post_id: postResults[2].id, tag_id: tagResults[1].id }  // Turismo
      ])
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Posts de exemplo criados com sucesso!',
      categories: categoryResults.filter(Boolean),
      tags: tagResults.filter(Boolean),
      posts: postResults.filter(Boolean)
    })
  } catch (error) {
    console.error('Erro ao criar posts de exemplo:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
