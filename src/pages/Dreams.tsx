import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Heart, User, Target, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  // Etapa 1: Identificação
  nome: string;
  email: string;
  nascimento: string;
  
  // Etapa 2: Perfil
  profissao: string;
  formacao: string;
  nivelIngles: string;
  rendaFamiliar: string;
  
  // Etapa 3: Objetivos
  cidadesInteresse: string[];
  interesses: string[];
  objetivoPrincipal: string;
  observacoes: string;
}

const Dreams = () => {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    nascimento: '',
    profissao: '',
    formacao: '',
    nivelIngles: '',
    rendaFamiliar: '',
    cidadesInteresse: [],
    interesses: [],
    objetivoPrincipal: '',
    observacoes: ''
  });

  const cidades = [
    "Nova York", "Los Angeles", "Chicago", "Miami", "San Francisco",
    "Boston", "Seattle", "Austin", "Denver", "Atlanta"
  ];

  const interessesOpcoes = [
    "Trabalho", "Estudos", "Investimentos", "Família", "Aposentadoria",
    "Negócios", "Tecnologia", "Arte", "Saúde", "Esportes"
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: 'cidadesInteresse' | 'interesses', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Sonho criado com sucesso!",
        description: "Suas informações foram salvas e nossa equipe entrará em contato em breve.",
      });
      
      // Reset form
      setFormData({
        nome: '', email: '', nascimento: '', profissao: '', formacao: '',
        nivelIngles: '', rendaFamiliar: '', cidadesInteresse: [], interesses: [],
        objetivoPrincipal: '', observacoes: ''
      });
      setEtapaAtual(1);
      
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const proximaEtapa = () => {
    if (etapaAtual < 4) setEtapaAtual(etapaAtual + 1);
  };

  const etapaAnterior = () => {
    if (etapaAtual > 1) setEtapaAtual(etapaAtual - 1);
  };

  const progresso = (etapaAtual / 4) * 100;

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
              <Heart className="w-6 h-6 text-red-500" />
              <span className="text-xl font-baskerville font-bold text-petroleo">Criador de Sonhos</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm font-figtree text-gray-600 mb-2">
              <span>Etapa {etapaAtual} de 4</span>
              <span>{Math.round(progresso)}% concluído</span>
            </div>
            <Progress value={progresso} className="h-2" />
          </div>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-baskerville text-petroleo">
                {etapaAtual === 1 && "Vamos nos conhecer"}
                {etapaAtual === 2 && "Seu perfil profissional"}
                {etapaAtual === 3 && "Seus objetivos"}
                {etapaAtual === 4 && "Resumo do seu sonho"}
              </CardTitle>
              <CardDescription>
                {etapaAtual === 1 && "Conte-nos um pouco sobre você"}
                {etapaAtual === 2 && "Informações sobre sua carreira e formação"}
                {etapaAtual === 3 && "O que você busca nos Estados Unidos"}
                {etapaAtual === 4 && "Confirme suas informações"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Etapa 1: Identificação */}
              {etapaAtual === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome completo</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nascimento">Data de nascimento</Label>
                    <Input
                      id="nascimento"
                      type="date"
                      value={formData.nascimento}
                      onChange={(e) => handleInputChange('nascimento', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Etapa 2: Perfil */}
              {etapaAtual === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="profissao">Profissão atual</Label>
                    <Input
                      id="profissao"
                      value={formData.profissao}
                      onChange={(e) => handleInputChange('profissao', e.target.value)}
                      placeholder="Ex: Engenheiro de Software"
                    />
                  </div>
                  <div>
                    <Label htmlFor="formacao">Nível de formação</Label>
                    <Select value={formData.formacao} onValueChange={(value) => handleInputChange('formacao', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua formação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ensino-medio">Ensino Médio</SelectItem>
                        <SelectItem value="tecnico">Técnico</SelectItem>
                        <SelectItem value="superior">Superior</SelectItem>
                        <SelectItem value="pos-graduacao">Pós-graduação</SelectItem>
                        <SelectItem value="mestrado">Mestrado</SelectItem>
                        <SelectItem value="doutorado">Doutorado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ingles">Nível de inglês</Label>
                    <Select value={formData.nivelIngles} onValueChange={(value) => handleInputChange('nivelIngles', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Avalie seu inglês" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basico">Básico</SelectItem>
                        <SelectItem value="intermediario">Intermediário</SelectItem>
                        <SelectItem value="avancado">Avançado</SelectItem>
                        <SelectItem value="fluente">Fluente</SelectItem>
                        <SelectItem value="nativo">Nativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="renda">Renda familiar mensal (R$)</Label>
                    <Select value={formData.rendaFamiliar} onValueChange={(value) => handleInputChange('rendaFamiliar', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Faixa de renda" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ate-5k">Até R$ 5.000</SelectItem>
                        <SelectItem value="5k-15k">R$ 5.000 - R$ 15.000</SelectItem>
                        <SelectItem value="15k-30k">R$ 15.000 - R$ 30.000</SelectItem>
                        <SelectItem value="30k-50k">R$ 30.000 - R$ 50.000</SelectItem>
                        <SelectItem value="acima-50k">Acima de R$ 50.000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Etapa 3: Objetivos */}
              {etapaAtual === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label>Cidades de interesse (selecione até 3)</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {cidades.map((cidade) => (
                        <div key={cidade} className="flex items-center space-x-2">
                          <Checkbox
                            id={cidade}
                            checked={formData.cidadesInteresse.includes(cidade)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange('cidadesInteresse', cidade, checked as boolean)
                            }
                            disabled={formData.cidadesInteresse.length >= 3 && !formData.cidadesInteresse.includes(cidade)}
                          />
                          <Label htmlFor={cidade} className="text-sm">{cidade}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Principais interesses</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {interessesOpcoes.map((interesse) => (
                        <div key={interesse} className="flex items-center space-x-2">
                          <Checkbox
                            id={interesse}
                            checked={formData.interesses.includes(interesse)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange('interesses', interesse, checked as boolean)
                            }
                          />
                          <Label htmlFor={interesse} className="text-sm">{interesse}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="objetivo">Objetivo principal nos EUA</Label>
                    <Select value={formData.objetivoPrincipal} onValueChange={(value) => handleInputChange('objetivoPrincipal', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Qual seu principal objetivo?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trabalhar">Trabalhar</SelectItem>
                        <SelectItem value="estudar">Estudar</SelectItem>
                        <SelectItem value="investir">Investir</SelectItem>
                        <SelectItem value="morar">Morar permanentemente</SelectItem>
                        <SelectItem value="aposentar">Aposentar</SelectItem>
                        <SelectItem value="empreender">Empreender</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="observacoes">Observações adicionais</Label>
                    <Textarea
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => handleInputChange('observacoes', e.target.value)}
                      placeholder="Conte-nos mais sobre seus planos e sonhos..."
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Etapa 4: Resumo */}
              {etapaAtual === 4 && (
                <div className="space-y-6">
                  <div className="bg-lilas/20 p-6 rounded-lg">
                    <h3 className="font-baskerville font-bold text-petroleo mb-4">Resumo do seu perfil</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nome:</strong> {formData.nome}</p>
                      <p><strong>E-mail:</strong> {formData.email}</p>
                      <p><strong>Profissão:</strong> {formData.profissao}</p>
                      <p><strong>Formação:</strong> {formData.formacao}</p>
                      <p><strong>Inglês:</strong> {formData.nivelIngles}</p>
                      <p><strong>Renda:</strong> {formData.rendaFamiliar}</p>
                      <p><strong>Cidades de interesse:</strong> {formData.cidadesInteresse.join(', ')}</p>
                      <p><strong>Interesses:</strong> {formData.interesses.join(', ')}</p>
                      <p><strong>Objetivo principal:</strong> {formData.objetivoPrincipal}</p>
                      {formData.observacoes && (
                        <p><strong>Observações:</strong> {formData.observacoes}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-center text-gray-600">
                    Confirme suas informações e clique em "Criar Sonho" para finalizar.
                  </p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={etapaAnterior}
                  disabled={etapaAtual === 1}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>

                {etapaAtual < 4 ? (
                  <Button onClick={proximaEtapa} className="flex items-center">
                    Próximo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="flex items-center"
                  >
                    {isSubmitting ? "Enviando..." : "Criar Sonho"}
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dreams;