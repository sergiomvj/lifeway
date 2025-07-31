import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Clock, Users, Heart, Calculator, Briefcase, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";
const Index = () => {
  const ferramentasDisponiveis = [{
    titulo: "Criador de Sonhos",
    descricao: "Defina seus objetivos e trace o caminho ideal para alcançá-los",
    icone: Heart,
    link: "/dreams",
    cor: "text-red-500"
  }, {
    titulo: "VisaMatch",
    descricao: "Análise inteligente para descobrir o visto ideal para seu perfil",
    icone: CheckCircle,
    link: "/visamatch",
    cor: "text-green-500"
  }, {
    titulo: "Especialista de Plantão",
    descricao: "Chat com nossa IA especializada em imigração americana",
    icone: MessageCircle,
    link: "/especialista",
    cor: "text-blue-500"
  }];
  const ferramentasFuturas = [{
    titulo: "GetOpportunity",
    icone: Briefcase
  }, {
    titulo: "FamilyPlanner",
    icone: Users
  }, {
    titulo: "CalcWay",
    icone: Calculator
  }, {
    titulo: "Serviceway",
    icone: CheckCircle
  }, {
    titulo: "InterviewSim",
    icone: MessageCircle
  }, {
    titulo: "ProjectUSA",
    icone: ArrowRight
  }];
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-petroleo to-petroleo/80 rounded-lg"></div>
              <span className="text-xl font-baskerville font-bold text-petroleo">LifeWayUSA</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link to="/ferramentas" className="text-gray-700 hover:text-petroleo transition-colors">Ferramentas</Link>
              <Link to="/destinos" className="text-gray-700 hover:text-petroleo transition-colors">Destinos</Link>
              <Link to="/blog" className="text-gray-700 hover:text-petroleo transition-colors">Blog</Link>
              <Link to="/contato" className="text-gray-700 hover:text-petroleo transition-colors">Contato</Link>
            </nav>
            <Link to="/login">
              <Button variant="outline" size="sm">Entrar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url(${heroBackground})`
      }} />
        <div className="absolute inset-0 bg-gradient-to-r from-petroleo/80 to-petroleo/60"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-baskerville font-bold mb-6 leading-tight">
            Planeje sua jornada<br />
            <span className="text-lilas">rumo aos Estados Unidos</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-figtree max-w-3xl mx-auto opacity-90">Ferramentas inteligentes e especializadas para
transformar seu sonho americano em realidade</p>
          <Link to="/dreams">
            <Button variant="hero" size="lg" className="group">
              Começar agora
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Ferramentas Disponíveis */}
      <section className="py-20 bg-gradient-to-b from-white to-cinza-claro">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-baskerville font-bold text-petroleo mb-4">
              Ferramentas Disponíveis
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Acesse nossas ferramentas especializadas
e dê os primeiros passos rumo aos EUA</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {ferramentasDisponiveis.map((ferramenta, index) => <Link key={index} to={ferramenta.link} className="group">
                <Card className="h-full hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 hover:-translate-y-2">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-lilas to-secondary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <ferramenta.icone className={`w-8 h-8 ${ferramenta.cor}`} />
                    </div>
                    <CardTitle className="text-xl font-baskerville text-petroleo">
                      {ferramenta.titulo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {ferramenta.descricao}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>)}
          </div>
        </div>
      </section>

      {/* Ferramentas em Desenvolvimento */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-baskerville font-bold text-petroleo mb-4">
              Em Desenvolvimento
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Novas ferramentas que estarão disponíveis em breve
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {ferramentasFuturas.map((ferramenta, index) => <Card key={index} className="opacity-60 text-center p-6 hover:opacity-80 transition-opacity bg-gradient-to-br from-gray-50 to-gray-100">
                <ferramenta.icone className="w-8 h-8 mx-auto mb-3 text-gray-500" />
                <h3 className="font-figtree font-semibold text-sm text-gray-700">
                  {ferramenta.titulo}
                </h3>
                <Badge variant="outline" className="mt-2 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  Em breve
                </Badge>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-petroleo text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-lilas rounded-lg"></div>
                <span className="text-xl font-baskerville font-bold">LifeWayUSA</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Sua parceira na jornada rumo ao sonho americano. Ferramentas especializadas para cada etapa do processo.
              </p>
            </div>
            
            <div>
              <h3 className="font-baskerville font-bold mb-4">Ferramentas</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/dreams" className="hover:text-lilas transition-colors">Criador de Sonhos</Link></li>
                <li><Link to="/visamatch" className="hover:text-lilas transition-colors">VisaMatch</Link></li>
                <li><Link to="/especialista" className="hover:text-lilas transition-colors">Especialista de Plantão</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-baskerville font-bold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/sobre" className="hover:text-lilas transition-colors">Sobre nós</Link></li>
                <li><Link to="/contato" className="hover:text-lilas transition-colors">Contato</Link></li>
                <li><Link to="/blog" className="hover:text-lilas transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-baskerville font-bold mb-4">Redes Sociais</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-lilas transition-colors">Instagram</a>
                <a href="#" className="text-gray-300 hover:text-lilas transition-colors">LinkedIn</a>
                <a href="#" className="text-gray-300 hover:text-lilas transition-colors">YouTube</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 LifeWayUSA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;