import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, Send, Bot, User, Lightbulb, FileText, Clock } from "lucide-react";
import { generateChatResponse } from "@/lib/openai";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion';
}

const Especialista = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou seu especialista em imigração para os EUA. Como posso ajudá-lo hoje? Posso esclarecer dúvidas sobre vistos, processos de imigração, documentação e muito mais.',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickQuestions = [
    'Qual visto é melhor para trabalhar nos EUA?',
    'Como funciona o processo do Green Card?',
    'Quanto tempo demora um visto H1-B?',
    'Posso levar minha família comigo?',
    'Quais documentos preciso preparar?',
    'Como é o processo de entrevista no consulado?'
  ];

  const botResponses: Record<string, string> = {
    'visto trabalho': 'Para trabalhar nos EUA, os vistos mais comuns são: H1-B (trabalhadores especializados), L-1 (transferência interna), O-1 (habilidades extraordinárias), e E-2 (investidor). O H1-B é o mais popular, mas requer diploma universitário e oferta de trabalho de empresa americana.',
    'green card': 'O Green Card (residência permanente) pode ser obtido através de: 1) Patrocínio familiar, 2) Patrocínio de empregador, 3) Investimento (EB-5), 4) Asilo/refúgio, 5) Loteria de diversidade. O processo varia de 1 a vários anos dependendo da categoria.',
    'h1-b tempo': 'O processo do H1-B geralmente leva: 1) Petição inicial: 3-6 meses, 2) Agendamento no consulado: 1-3 meses, 3) Entrevista e processamento: 2-4 semanas. Total: aproximadamente 6-12 meses. Há opção de processamento premium por taxa adicional.',
    'família': 'Sim! A maioria dos vistos permite que cônjuge e filhos solteiros menores de 21 anos acompanhem o portador principal. Cônjuges podem trabalhar com autorização específica (EAD) em muitos casos.',
    'documentos': 'Documentos essenciais incluem: passaporte válido, diploma e histórico escolar, certidões de nascimento/casamento, comprovantes financeiros, carta da empresa (se aplicável), exames médicos, e formulários específicos do visto.',
    'entrevista consulado': 'A entrevista no consulado é obrigatória para a maioria dos vistos. Dura cerca de 5-15 minutos. Prepare-se para perguntas sobre: propósito da viagem, vínculos com o Brasil, situação financeira, e detalhes do trabalho/estudo nos EUA.'
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Busca por palavras-chave nas respostas pré-definidas
    for (const [key, response] of Object.entries(botResponses)) {
      if (lowerMessage.includes(key.replace(' ', '')) || 
          lowerMessage.includes(key) ||
          key.split(' ').some(word => lowerMessage.includes(word))) {
        return response;
      }
    }

    // Respostas baseadas em palavras-chave específicas
    if (lowerMessage.includes('custo') || lowerMessage.includes('preço') || lowerMessage.includes('taxa')) {
      return 'Os custos variam por tipo de visto: H1-B ($3,000-$5,000), F-1 ($160 + mensalidades), EB-5 ($800,000+), E-2 ($50,000-$200,000). Isso inclui taxas governamentais, advogados e outros custos associados.';
    }
    
    if (lowerMessage.includes('advogado') || lowerMessage.includes('ajuda legal')) {
      return 'Recomendo consultar um advogado de imigração especializado, especialmente para casos complexos. Eles podem avaliar seu perfil específico e orientar sobre a melhor estratégia. Posso ajudar com informações gerais, mas cada caso é único.';
    }
    
    if (lowerMessage.includes('inglês') || lowerMessage.includes('idioma')) {
      return 'O domínio do inglês é importante para a maioria dos vistos. Não há teste obrigatório para todos os tipos, mas você precisará se comunicar na entrevista do consulado. Para alguns vistos profissionais, certificações como TOEFL podem ser úteis.';
    }
    
    if (lowerMessage.includes('idade') || lowerMessage.includes('idoso')) {
      return 'Não há limite de idade para a maioria dos vistos americanos. No entanto, a idade pode influenciar alguns aspectos: vínculos com o país de origem, capacidade de trabalho, e tempo para retorno do investimento em educação.';
    }

    // Resposta padrão
    return 'Essa é uma excelente pergunta! Para dar uma resposta mais precisa, preciso de mais detalhes sobre sua situação específica. Você poderia me contar mais sobre seu objetivo nos EUA, sua formação e experiência profissional?';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    const currentInput = inputMessage;
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Prepara histórico da conversa para contexto
      const conversationHistory = messages
        .slice(-6) // Últimas 6 mensagens para contexto
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        }));

      // Usa OpenAI para gerar resposta inteligente
      const aiResponse = await generateChatResponse(currentInput, conversationHistory);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      // Fallback para resposta local em caso de erro
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(currentInput),
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-blue-500 mr-3" />
            <h1 className="text-4xl font-baskerville font-bold text-petroleo">
              Especialista de Plantão
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chat com nossa IA especializada em imigração americana. 
            Tire suas dúvidas sobre vistos, processos e documentação.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Área de sugestões */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                  Perguntas Frequentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full text-left justify-start h-auto p-2 text-xs"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">Online</span>
                </div>
                <p className="text-xs text-gray-600">
                  Especialista disponível 24/7 para suas dúvidas sobre imigração.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Área do chat */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <Bot className="w-6 h-6 text-blue-500" />
                  <div>
                    <CardTitle className="text-lg">Especialista IA</CardTitle>
                    <p className="text-sm text-gray-600">Especializado em Imigração para os EUA</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${
                          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === 'user' 
                            ? 'bg-petroleo text-white' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {message.sender === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </div>
                        
                        <div className={`flex-1 max-w-[80%] ${
                          message.sender === 'user' ? 'text-right' : 'text-left'
                        }`}>
                          <div className={`inline-block p-3 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-petroleo text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {message.timestamp.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Digite sua pergunta sobre imigração..."
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="bg-petroleo hover:bg-petroleo/90"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Dica: Seja específico em suas perguntas para obter respostas mais precisas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Aviso legal */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <FileText className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-600 mb-1">Aviso Importante</h4>
                <p className="text-sm text-gray-600">
                  As informações fornecidas são apenas orientações gerais e não constituem aconselhamento jurídico. 
                  Para casos específicos, sempre consulte um advogado de imigração qualificado. 
                  As leis de imigração podem mudar e cada situação é única.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Especialista;