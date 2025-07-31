import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Search, MessageCircle } from "lucide-react";

const FerramentasPage = () => {
  const ferramentas = [
    {
      id: 'criador-sonhos',
      titulo: 'Criador de Sonhos',
      descricao: 'Descubra qual é o seu perfil ideal para imigrar para os Estados Unidos através de um questionário personalizado.',
      icone: Sparkles,
      link: '/dreams',
      disponivel: true
    },
    {
      id: 'visamatch',
      titulo: 'VisaMatch',
      descricao: 'Análise inteligente para descobrir qual tipo de visto americano é mais adequado ao seu perfil.',
      icone: Search,
      link: '/visamatch',
      disponivel: true
    },
    {
      id: 'especialista',
      titulo: 'Especialista de Plantão',
      descricao: 'Chat com nossa IA especializada em imigração americana para esclarecer todas as suas dúvidas.',
      icone: MessageCircle,
      link: '/especialista',
      disponivel: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cinza-claro to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 text-petroleo hover:text-petroleo/80 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-figtree font-medium">Voltar</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-baskerville font-bold text-petroleo mb-4">
            Ferramentas Disponíveis
          </h1>
          <p className="text-lg text-gray-600 font-figtree max-w-2xl mx-auto">
            Explore nossas ferramentas desenvolvidas para facilitar sua jornada de imigração para os Estados Unidos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {ferramentas.map((ferramenta) => {
            const IconComponent = ferramenta.icone;
            
            return (
              <Card key={ferramenta.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-lilas to-secondary rounded-full flex items-center justify-center mb-4">
                    <IconComponent className="w-8 h-8 text-petroleo" />
                  </div>
                  <CardTitle className="text-xl font-baskerville text-petroleo">
                    {ferramenta.titulo}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 font-figtree mb-6 leading-relaxed">
                    {ferramenta.descricao}
                  </CardDescription>
                  
                  <Button 
                    asChild 
                    className="w-full bg-petroleo hover:bg-petroleo/90 text-white font-figtree"
                  >
                    <Link to={ferramenta.link}>
                      Acessar Ferramenta
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Ferramentas em Desenvolvimento */}
        <div className="mt-16">
          <h2 className="text-2xl font-baskerville font-bold text-petroleo text-center mb-8">
            Em Desenvolvimento
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto opacity-60">
            {['GetOpportunity', 'FamilyPlanner', 'CalcWay', 'Serviceway', 'InterviewSim', 'ProjectUSA'].map((nome) => (
              <Card key={nome} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg font-baskerville text-petroleo">
                    {nome}
                  </CardTitle>
                  <CardDescription className="text-gray-500 font-figtree">
                    Em breve...
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FerramentasPage;