import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const VisaMatch = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Resultado simulado da IA
      const resultadoSimulado = `
        **ANÁLISE COMPLETA DO SEU PERFIL**
        
        **Vistos Recomendados para seu perfil:**
        
        🏆 **1º Lugar: Visto O-1 (Habilidade Extraordinária)**
        - Compatibilidade: 85%
        - Motivo: Seu perfil profissional e formação demonstram expertise na área
        - Vantagens: Permite trabalho nos EUA por até 3 anos, renovável
        - Requisitos: Documentação comprobatória de conquistas profissionais
        
        🥈 **2º Lugar: Visto EB-2 NIW (National Interest Waiver)**
        - Compatibilidade: 78%
        - Motivo: Sua formação e experiência podem beneficiar os interesses nacionais dos EUA
        - Vantagens: Green Card direto, sem necessidade de oferta de trabalho
        - Requisitos: Demonstrar benefício nacional através do seu trabalho
        
        🥉 **3º Lugar: Visto H-1B (Trabalhador Especializado)**
        - Compatibilidade: 65%
        - Motivo: Formação superior permite trabalho especializado
        - Vantagens: Permite trabalho por até 6 anos
        - Limitações: Depende de sorteio anual e oferta de trabalho
        
        **Próximos Passos Recomendados:**
        1. Reúna documentação acadêmica e profissional
        2. Obtenha cartas de recomendação de especialistas da área
        3. Compile evidências de reconhecimento profissional
        4. Consulte um advogado de imigração especializado
        
        **Estimativa de Investimento:**
        - Taxas governamentais: $2,500 - $4,000
        - Advogado especializado: $8,000 - $15,000
        - Documentação e traduções: $1,500 - $3,000
        
        *Esta análise é baseada nas informações fornecidas e serve como orientação inicial. Recomendamos consultar um advogado de imigração para análise detalhada do seu caso específico.*
      `;
      
      setResultado(resultadoSimulado);
      
      toast({
        title: "Análise concluída!",
        description: "Sua análise personalizada foi gerada com sucesso.",
      });
      
    } catch (error) {
      toast({
        title: "Erro na análise",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cinza-claro to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-petroleo" />
              <span className="text-petroleo font-figtree font-medium">Voltar</span>
            </Link>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-xl font-baskerville font-bold text-petroleo">VisaMatch</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-lilas to-secondary px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-petroleo" />
              <span className="font-figtree font-medium text-petroleo">Análise Inteligente</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-baskerville font-bold text-petroleo mb-4">
              VisaMatch
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Descubra qual visto americano é ideal para seu perfil através da nossa análise inteligente baseada em IA
            </p>

            {!resultado && (
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 mb-8">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-baskerville text-petroleo">
                    Como funciona?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-lilas to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-petroleo font-bold">1</span>
                      </div>
                      <h3 className="font-figtree font-semibold text-petroleo mb-2">Análise do Perfil</h3>
                      <p className="text-sm text-gray-600">Nossa IA analisa suas informações profissionais e pessoais</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-lilas to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-petroleo font-bold">2</span>
                      </div>
                      <h3 className="font-figtree font-semibold text-petroleo mb-2">Matching Inteligente</h3>
                      <p className="text-sm text-gray-600">Comparamos com centenas de casos de sucesso</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-lilas to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-petroleo font-bold">3</span>
                      </div>
                      <h3 className="font-figtree font-semibold text-petroleo mb-2">Recomendações</h3>
                      <p className="text-sm text-gray-600">Receba sugestões personalizadas e próximos passos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Generate Analysis Button */}
          {!resultado && (
            <div className="text-center mb-12">
              <Button
                onClick={handleGenerateAnalysis}
                disabled={isAnalyzing}
                variant="hero"
                size="lg"
                className="group"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Analisando seu perfil...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Gerar Análise Personalizada
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                A análise leva aproximadamente 30 segundos
              </p>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 mb-4">
                    <Sparkles className="w-6 h-6 text-petroleo animate-spin" />
                    <span className="text-lg font-figtree font-medium text-petroleo">
                      Analisando seu perfil...
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Nossa IA está processando suas informações e comparando com nossa base de dados
                  </p>
                  <div className="max-w-md mx-auto">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-petroleo to-petroleo/80 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {resultado && (
            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <CardTitle className="text-2xl font-baskerville text-petroleo">
                        Sua Análise Personalizada
                      </CardTitle>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <Sparkles className="w-3 h-3 mr-1" />
                      IA Análise
                    </Badge>
                  </div>
                  <CardDescription>
                    Baseado no seu perfil e nossa base de dados com milhares de casos de sucesso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                      {resultado}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-700">
                      <FileText className="w-5 h-5 mr-2" />
                      Próximos Passos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-600 mb-4">Acelere seu processo com nossos parceiros especializados:</p>
                    <ul className="space-y-2 text-sm text-blue-700">
                      <li>• Consultoria jurídica especializada</li>
                      <li>• Preparação de documentação</li>
                      <li>• Tradução juramentada</li>
                      <li>• Acompanhamento do processo</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-amber-700">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Importante
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-amber-600 mb-4">Esta análise é uma orientação inicial baseada em IA:</p>
                    <ul className="space-y-2 text-sm text-amber-700">
                      <li>• Consulte sempre um advogado especializado</li>
                      <li>• Cada caso é único e pode ter particularidades</li>
                      <li>• Mantenha documentação sempre atualizada</li>
                      <li>• Acompanhe mudanças na legislação</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Generate New Analysis */}
              <div className="text-center pt-8">
                <Button
                  onClick={() => {
                    setResultado(null);
                    toast({
                      title: "Nova análise iniciada",
                      description: "Você pode gerar uma nova análise agora.",
                    });
                  }}
                  variant="outline"
                >
                  Gerar Nova Análise
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisaMatch;