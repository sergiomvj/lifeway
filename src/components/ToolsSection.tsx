import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Clock, Users, Heart, Calculator, Briefcase, MessageCircle, Sparkles, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import YouTube from 'react-youtube';
import { useConditionalNavigation } from '@/hooks/useConditionalNavigation';

const ToolsSection = () => {
  const { navigateToTool } = useConditionalNavigation();
  
  const ferramentasDisponiveis = [
    {
      titulo: "Criador de Sonhos",
      descricao: "Como seria a sua vida daqui há 5 anos se você imigrasse para os EUA? Simular isso gratuitamente baseado na sua realidade te parece interessante? Assista ao vídeo para entender melhor.",
      videoId: "Q-3atjn57ts",
      link: "/dreams",
      bgImage: "/storage/images/maincities/a8064db4-085c-45a3-9e58-4811fafbc7da.jpg"
    },
    {
      titulo: "VisaMatch",
      descricao: "Você gostaria de morar nos EUA mas não sabe qual o melhor tipo de visto para você? Assista ao vídeo para descobrir como podemos te ajudar.",
      videoId: "iFnI9Tfkk9s",
      link: "/visamatch",
      bgImage: "/storage/images/maincities/009ad6d2-23f0-437e-8163-7370009e7d1b.jpg"
    },
    {
      titulo: "Especialista de Plantão",
      descricao: "Tire suas dúvidas em tempo real com nosso especialista virtual em imigração americana. Assista ao vídeo para ver como funciona.",
      videoId: "CqO4X3xzBfA",
      link: "/especialista",
      bgImage: "/storage/images/maincities/30a06bff-8da0-4049-a87e-ccf3ccbbf047.jpg"
    }
  ];

  const ferramentasFuturas = [
    { titulo: "GetOpportunity", icone: Briefcase, link: "/ferramentas/get-opportunity" },
    { titulo: "FamilyPlanner", icone: Users, link: "/ferramentas/family-planner" },
    { titulo: "CalcWay", icone: Calculator, link: "/ferramentas/calcway" },
    { titulo: "Serviceway", icone: CheckCircle, link: "/ferramentas/service-way" },
    { titulo: "InterviewSim", icone: MessageCircle, link: "/ferramentas/simulador-entrevista" },
    { titulo: "ProjectUSA", icone: ArrowRight, link: "/ferramentas/project-usa" }
  ];

  return (
    <section id="ferramentas" className="bg-white relative z-20 pt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {ferramentasDisponiveis.map((ferramenta, index) => {
            return (
              <Card 
                key={index} 
                className="group relative overflow-hidden h-full min-h-[400px] flex flex-col border-2 hover:border-blue-500 transition-all duration-300 shadow-lg"
              >
                {/* Imagem de fundo com overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-500 group-hover:scale-110"
                  style={{ 
                    backgroundImage: `url(${ferramenta.bgImage})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                  }}
                >
                  <div className="absolute inset-0 bg-purple-700/85"></div>
                </div>
                
                {/* Seção do Vídeo */}
                <div className="relative w-full aspect-video">
                  <YouTube
                    videoId={ferramenta.videoId}
                    className="w-full h-full"
                    iframeClassName="w-full h-full"
                    opts={{
                      playerVars: {
                        autoplay: 0,
                        controls: 1,
                        rel: 0,
                        showinfo: 0,
                        modestbranding: 1
                      },
                    }}
                  />
                </div>
                
                {/* Conteúdo do Card */}
                <CardHeader className="relative z-10 text-center px-4 pt-4 pb-0">
                  <CardTitle className="text-xl font-bold text-white">
                    {ferramenta.titulo}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10 flex-grow flex flex-col px-4 pb-4 pt-2">
                  <p className="text-white/90 mb-4 leading-relaxed flex-grow text-center">
                    {ferramenta.descricao}
                  </p>
                  <Button 
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 rounded-lg transition-all duration-300 group-hover:scale-105 mt-auto"
                    onClick={() => {
                      const toolName = ferramenta.link.replace('/', '');
                      navigateToTool(toolName);
                    }}
                  >
                    {ferramenta.titulo.includes('Sonhos') ? 'Criar Meu Sonho' : ferramenta.titulo.includes('VisaMatch') ? 'Descobrir Meu Visto' : 'Falar com Especialista'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Seção de Ferramentas Futuras */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Próximas Ferramentas
            </h3>
            <p className="text-gray-600">
              Estamos desenvolvendo ainda mais ferramentas para facilitar sua jornada
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {ferramentasFuturas.map((ferramenta, index) => {
              const IconComponent = ferramenta.icone;
              return (
                <div 
                  key={index} 
                  className="block group cursor-pointer"
                  onClick={() => {
                    const toolName = ferramenta.link.replace('/ferramentas/', '');
                    navigateToTool(toolName);
                  }}
                >
                  <div className="h-full p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all text-center hover:border-blue-500">
                    <IconComponent className="w-8 h-8 mx-auto mb-2 text-purple-600 group-hover:text-purple-700 transition-colors" />
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {ferramenta.titulo}
                    </p>
                    <Badge 
                      variant="outline" 
                      className="mt-2 text-xs bg-white/50 backdrop-blur-sm border-purple-200 text-purple-700 group-hover:border-purple-300 group-hover:bg-white/70"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                    Em breve
                  </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
