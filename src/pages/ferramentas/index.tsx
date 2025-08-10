import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator, Users, Briefcase, Building2, Headphones, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FerramentasIndex = () => {
  const ferramentas = [
    {
      id: "calcway",
      nome: "Calcway",
      descricao: "Calculadora inteligente de custos para seu projeto de mudança para os EUA",
      icon: <Calculator className="w-10 h-10 text-blue-600" />,
      cor: "blue"
    },
    {
      id: "family-planner",
      nome: "Family Planner",
      descricao: "Planejamento familiar completo para sua mudança aos Estados Unidos",
      icon: <Users className="w-10 h-10 text-green-600" />,
      cor: "green"
    },
    {
      id: "get-opportunity",
      nome: "Get Opportunity",
      descricao: "Encontre oportunidades de emprego nos EUA alinhadas ao seu perfil",
      icon: <Briefcase className="w-10 h-10 text-amber-600" />,
      cor: "amber"
    },
    {
      id: "project-usa",
      nome: "Project USA",
      descricao: "Planejamento completo do seu projeto de mudança para os Estados Unidos",
      icon: <Building2 className="w-10 h-10 text-purple-600" />,
      cor: "purple"
    },
    {
      id: "service-way",
      nome: "Service Way",
      descricao: "Conecte-se com prestadores de serviços especializados em imigração",
      icon: <Headphones className="w-10 h-10 text-red-600" />,
      cor: "red"
    },
    {
      id: "simulador-entrevista",
      nome: "Simulador de Entrevista",
      descricao: "Prepare-se para entrevistas de emprego e visto com simulações realistas",
      icon: <MessageSquare className="w-10 h-10 text-teal-600" />,
      cor: "teal"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cinza-claro to-white">
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5 text-petroleo" />
            <span className="text-petroleo font-figtree font-medium">Voltar</span>
          </Link>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-baskerville font-bold text-petroleo mb-4">
            Ferramentas
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Conheça as ferramentas que estamos desenvolvendo para facilitar sua jornada de mudança para os Estados Unidos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {ferramentas.map((ferramenta) => (
            <Card key={ferramenta.id} className="border-t-4 hover:shadow-lg transition-all duration-300" style={{ borderTopColor: `var(--${ferramenta.cor}-600)` }}>
              <CardHeader className="flex flex-row items-center gap-4">
                {ferramenta.icon}
                <div>
                  <CardTitle>{ferramenta.nome}</CardTitle>
                  <Badge variant="outline" className="mt-1">Em desenvolvimento</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{ferramenta.descricao}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/ferramentas/${ferramenta.id}`}>Ver detalhes</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild>
            <Link to="/">Voltar ao início</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FerramentasIndex;