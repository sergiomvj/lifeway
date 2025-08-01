'use client'

import { Play, Clock, Tag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import SafeDate from './SafeDate'

const blogPosts = [
	{
		id: 1,
		title: 'Como conseguir o visto EB-5 através de investimento',
		slug: 'visto-eb5-investimento',
		excerpt: 'Descubra como investir nos EUA pode ser seu caminho para o Green Card. Valores, requisitos e processo completo.',
		coverImage: '/images/blog/eb5-investment.jpg',
		tag: 'Investimento',
		tagIcon: '💼',
		readTime: '8 min',
		publishedAt: '2025-06-10',
		hasAudio: true
	},
	{
		id: 2,
		title: 'Melhores universidades americanas para brasileiros',
		slug: 'universidades-americanas-brasileiros',
		excerpt: 'Rankings, bolsas de estudo e dicas para aumentar suas chances de aprovação nas top universidades dos EUA.',
		coverImage: '/images/blog/universities-usa.jpg',
		tag: 'Educação',
		tagIcon: '🎓',
		readTime: '6 min',
		publishedAt: '2025-06-08',
		hasAudio: true
	},
	{
		id: 3,
		title: 'Mercado de TI nos EUA: oportunidades e salários',
		slug: 'mercado-ti-eua-salarios',
		excerpt: 'Análise completa do mercado tech americano, skills mais valorizadas e como se posicionar para uma vaga.',
		coverImage: '/images/blog/tech-market-usa.jpg',
		tag: 'Carreira',
		tagIcon: '💻',
		readTime: '10 min',
		publishedAt: '2025-06-05',
		hasAudio: false
	}
]

export default function BlogPodcastTeasers() {
	const handlePlayAudio = (postSlug: string) => {
		// This would play the TTS audio snippet
		console.log('Playing audio for:', postSlug)
	}

	return (
		<section className="py-16 bg-white">
			<div className="max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-12">
					<h2 className="font-baskerville text-3xl md:text-4xl text-gray-900 mb-4">
						Últimas do Blog
					</h2>
					<p className="font-figtree text-lg text-gray-600 max-w-2xl mx-auto">
						Conteúdo especializado para sua jornada de imigração para os EUA
					</p>
				</div>

				{/* Blog Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
					{blogPosts.map((post) => (
						<article
							key={post.id}
							className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
						>
							{/* Cover Image */}
							<div className="relative h-48 overflow-hidden">							<Image
								src={`/images/blog/${post.slug}.jpg`}
								alt={post.title}
								fill
								className="transition-transform duration-300 group-hover:scale-105 object-cover"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							/>
								
								{/* Overlay gradient for better text readability */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

								{/* Tag */}
								<div className="absolute top-4 left-4 z-10">
									<span className="bg-white bg-opacity-90 text-azul-petroleo px-3 py-1 rounded-full text-xs font-figtree font-medium flex items-center space-x-1">
										<span>{post.tagIcon}</span>
										<span>{post.tag}</span>
									</span>
								</div>

								{/* Audio button */}
								{post.hasAudio && (
									<button
										onClick={() => handlePlayAudio(post.slug)}
										className="absolute top-4 right-4 z-10 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-azul-petroleo hover:bg-opacity-100 transition-colors"
										title="Ouça o resumo"
									>
										<Play className="w-4 h-4 ml-0.5" />
									</button>
								)}
							</div>

							{/* Content */}
							<div className="p-6">
								{/* Meta */}
								<div className="flex items-center space-x-4 text-sm text-gray-500 mb-3 font-figtree">
									<span className="flex items-center space-x-1">
										<Clock className="w-4 h-4" />
										<span>{post.readTime}</span>
									</span>
									<SafeDate dateString={post.publishedAt} />
								</div>

								{/* Title */}
								<h3 className="font-baskerville text-xl text-gray-900 mb-3 group-hover:text-azul-petroleo transition-colors">
									{post.title}
								</h3>

								{/* Excerpt */}
								<p className="font-figtree text-gray-600 text-sm leading-relaxed mb-4">
									{post.excerpt}
								</p>

								{/* Audio CTA */}
								<div className="flex items-center justify-between">
									<Link
										href={`/blog/${post.slug}`}
										className="text-azul-petroleo hover:text-lilac-600 font-figtree font-medium text-sm transition-colors"
									>
										Ler artigo completo →
									</Link>

									{post.hasAudio && (
										<button
											onClick={() => handlePlayAudio(post.slug)}
											className="text-xs bg-lilac-100 text-lilac-700 px-2 py-1 rounded-full font-figtree font-medium hover:bg-lilac-200 transition-colors flex items-center space-x-1"
										>
											<Play className="w-3 h-3" />
											<span>Ouça o resumo</span>
										</button>
									)}
								</div>
							</div>
						</article>
					))}
				</div>

				{/* View All CTA */}
				<div className="text-center">
					<Link
						href="/blog"
						className="inline-block bg-azul-petroleo text-white px-8 py-3 rounded-lg font-figtree font-semibold hover:bg-opacity-90 transition-colors"
					>
						Ver Todos os Artigos
					</Link>
				</div>
			</div>
		</section>
	)
}
