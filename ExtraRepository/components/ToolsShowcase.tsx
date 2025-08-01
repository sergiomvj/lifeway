'use client'

import { Brain, Search, TrendingUp, Calculator, Users, MessageSquare, Database, BarChart3, MapPinned } from 'lucide-react'
import { useState } from 'react'

// Primeira linha: 4 ferramentas principais (3 disponíveis + Family Planner)
const firstRowTools = [
	{
		id: 'criador-sonhos',
		icon: Brain,
		title: 'Criador de Sonhos',
		description: 'Descubra seus objetivos e motive-se para a mudança',
		bgColor: 'bg-pink-700',
		textColor: 'text-white',
		iconColor: 'text-purple-300',
		available: true,
	},
	{
		id: 'get-opportunity',
		icon: BarChart3,
		title: 'GetOpportunity',
		description: 'Analise oportunidades de trabalho no seu perfil',
		bgColor: 'bg-pink-700',
		textColor: 'text-white',
		iconColor: 'text-green-300',
		available: true,
	},
	{
		id: 'visa-match',
		icon: Search,
		title: 'VisaMatch',
		description: 'Encontre o visto ideal para seu perfil e objetivos',
		bgColor: 'bg-pink-700',
		textColor: 'text-white',
		iconColor: 'text-blue-300',
		available: true,
	},
	{
		id: 'family-planner',
		icon: Users,
		title: 'Family Planner',
		description: 'Planeje a mudança de toda sua família',
		bgColor: 'bg-pink-700',
		textColor: 'text-white',
		iconColor: 'text-pink-300',
		available: false,
	},
]

// Segunda linha: 4 ferramentas em breve
const secondRowTools = [
	{
		id: 'calc-way',
		icon: Calculator,
		title: 'CalcWay',
		description: 'Calcule custos da mudança e planejamento financeiro',
		bgColor: 'bg-pink-700',
		textColor: 'text-white',
		iconColor: 'text-yellow-300',
		available: false,
	},
	{
		id: 'service-way',
		icon: Users,
		title: 'ServiceWay',
		description: 'Marketplace de serviços especializados em imigração',
		bgColor: 'bg-pink-700',
		textColor: 'text-white',
		iconColor: 'text-orange-300',
		available: false,
	},
	{
		id: 'interview-sim',
		icon: MessageSquare,
		title: 'InterviewSim',
		description: 'Simule entrevistas de visto com inteligência artificial',
		bgColor: 'bg-pink-700',
		textColor: 'text-white',
		iconColor: 'text-red-300',
		available: false,
	},
	{
		id: 'project-usa',
		icon: Database,
		title: 'ProjectUSA',
		description: 'Planeje, acompanhe e controle os custos, tudo num só lugar',
		bgColor: 'bg-pink-700',
		textColor: 'text-white',
		iconColor: 'text-indigo-300',
		available: false,
	},
]

export default function ToolsShowcase() {
	const [hoveredTool, setHoveredTool] = useState<string | null>(null)

	const handleToolClick = (toolId: string, available: boolean) => {
		if (!available) {
			alert('Esta ferramenta estará disponível em breve!')
			return
		}
		if (typeof window !== 'undefined') {
			window.location.href = `/tools/${toolId}`
		}
	}

	return (
		<section id="tools-showcase" className="pt-[10px] pb-0 bg-azul-petroleo">
			<div className="max-w-7xl mx-auto px-4">
				{/* Primeira linha: 4 ferramentas principais */}
				<div
					className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center mb-8"
					style={{ paddingTop: 20 }}
				>
					{firstRowTools.map((tool) => {
						const IconComponent = tool.icon
						return (
							<div key={tool.id} className="flex flex-col items-center">
								<div
									className={`${tool.bgColor} rounded-xl w-[180px] h-[180px] cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col items-center justify-center mb-3 ${!tool.available ? 'opacity-75' : ''}`}
									onClick={() => handleToolClick(tool.id, tool.available)}
								>
									<div
										className={`w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-4`}
									>
										<IconComponent
											size={32}
											className={`${tool.iconColor}`}
										/>
									</div>
									<h3
										className={`font-baskerville text-lg ${tool.textColor} mb-2 text-center px-2`}
									>
										{tool.title}
										{!tool.available && (
											<span className="block text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-figtree mt-1">
												Em breve
											</span>
										)}
									</h3>
									{tool.available && (
										<div className="mt-2">
											<span
												className={`${tool.textColor} font-figtree font-medium text-xs hover:underline opacity-80`}
											>
												Experimentar →
											</span>
										</div>
									)}
								</div>
								<p className="text-center text-white/90 font-figtree text-sm max-w-[180px] leading-relaxed">
									{tool.description}
								</p>
							</div>
						)
					})}
				</div>
				{/* Segunda linha: 4 ferramentas em breve */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
					{secondRowTools.map((tool) => {
						const IconComponent = tool.icon
						return (
							<div key={tool.id} className="flex flex-col items-center">
								<div
									className={`${tool.bgColor} rounded-xl w-[180px] h-[180px] opacity-75 flex flex-col items-center justify-center mb-3`}
								>
									<div
										className={`w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-4`}
									>
										<IconComponent
											size={32}
											className={`${tool.iconColor}`}
										/>
									</div>
									<h3
										className={`font-baskerville text-lg ${tool.textColor} mb-2 text-center px-2`}
									>
										{tool.title}
										<span className="block text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-figtree mt-1">
											Em breve
										</span>
									</h3>
								</div>
								<p className="text-center text-white/90 font-figtree text-sm max-w-[180px] leading-relaxed">
									{tool.description}
								</p>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
