import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, MessageCircle, Bot, User, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Especialista = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Carregar histórico do localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('lia-chat-history');
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    } else {
      // Mensagem de boas-vindas inicial
      const welcomeMessage: Message = {
        id: '1',
        content: `Olá! Eu sou a LIA, sua Especialista de Plantão em imigração para os Estados Unidos! 🇺🇸

Estou aqui para esclarecer suas dúvidas sobre:
• Tipos de visto e qual é ideal para você
• Processo de solicitação e documentação
• Prazos e custos envolvidos
• Dicas para aumentar suas chances de aprovação
• Green Card e cidadania americana
• Trabalho e estudo nos EUA

Como posso ajudá-lo hoje?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Salvar no localStorage quando mensagens mudarem
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('lia-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll para o final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Simular resposta da IA
      await new Promise(resolve => setTimeout(resolve, 2000));

      const aiResponses = [
        `Ótima pergunta! Para ${inputMessage.toLowerCase().includes('visto') ? 'vistos americanos' : 'sua situação'}, preciso entender melhor seu perfil. 

${inputMessage.toLowerCase().includes('visto') ? 
  `Os principais tipos de visto são:
• **H-1B**: Para profissionais especializados com formação superior
• **O-1**: Para pessoas com habilidades extraordinárias
• **EB-2 NIW**: Green card para profissionais de interesse nacional
• **E-2**: Para investidores (Treaty Investor)
• **L-1**: Para transferências intracompanhia

Qual é sua área de atuação profissional? Isso me ajudará a dar recomendações mais específicas.` :
  
  `Com base no que você mencionou, aqui estão algumas orientações importantes:

**Documentação essencial:**
• Diploma e histórico escolar traduzidos
• Cartas de recomendação profissionais
• Comprovantes de experiência de trabalho
• Evidências de conquistas na área

**Próximos passos recomendados:**
1. Avaliar qual tipo de visto se adequa ao seu perfil
2. Reunir toda documentação necessária
3. Consultar um advogado de imigração
4. Preparar-se financeiramente para o processo

Precisa de mais detalhes sobre algum ponto específico?`}`,

        `Entendo sua preocupação! Baseado na minha experiência com milhares de casos, posso te dar algumas dicas valiosas:

**Fatores que aumentam aprovação:**
• Documentação completa e bem organizada
• Histórico profissional consistente
• Evidências claras de vínculos com o Brasil (para vistos temporários)
• Preparação adequada para a entrevista consular

**Prazos típicos:**
• H-1B: 3-6 meses (sorteio em março)
• O-1: 2-4 meses
• EB-2 NIW: 12-18 meses
• E-2: 2-3 meses

**Investimento aproximado:**
• Taxas governamentais: $2.500 - $4.000
• Advogado: $5.000 - $15.000
• Documentação: $1.000 - $3.000

O que mais gostaria de saber sobre o processo?`,

        `Excelente! Essa é uma estratégia muito inteligente. Vou te dar um roadmap personalizado:

**Para sua situação específica, recomendo:**

📋 **Fase 1 - Preparação (3-6 meses)**
• Melhorar nível de inglês (se necessário)
• Reunir documentação acadêmica e profissional
• Construir evidências de expertise na área

🎯 **Fase 2 - Execução (6-12 meses)**
• Definir estratégia de visto mais adequada
• Contratar advogado especializado
• Submeter petição

✅ **Fase 3 - Finalização (3-6 meses)**
• Entrevista consular (se aplicável)
• Preparação para mudança
• Planejamento logístico

**Dica especial:** Comece criando um "portfólio de conquistas" documentando todas suas realizações profissionais. Isso será fundamental para qualquer tipo de visto!

Quer que eu detalhe alguma dessas fases?`
      ];

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      toast({
        title: "Erro na comunicação",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('lia-chat-history');
    toast({
      title: "Chat limpo",
      description: "Histórico de conversas removido.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cinza-claro to-white flex flex-col">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-petroleo" />
              <span className="text-petroleo font-figtree font-medium">Voltar</span>
            </Link>
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-baskerville font-bold text-petroleo">LIA - Especialista de Plantão</span>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                Online
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={clearChat}>
              Limpar Chat
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <Card className="h-full flex flex-col bg-white/80 backdrop-blur-sm shadow-xl border-0">
          
          {/* Chat Header */}
          <CardHeader className="border-b bg-gradient-to-r from-lilas/20 to-secondary/20">
            <CardTitle className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-petroleo to-petroleo/80 text-white">
                  <Bot className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-baskerville text-petroleo">LIA - Legal Immigration Assistant</h3>
                <p className="text-sm text-gray-600 font-figtree">Especialista em Imigração Americana • Resposta em tempo real</p>
              </div>
            </CardTitle>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 p-0 overflow-hidden">
            <div className="h-96 md:h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className={message.isUser ? "bg-petroleo text-white" : "bg-gradient-to-br from-lilas to-secondary text-petroleo"}>
                        {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`p-4 rounded-2xl ${
                      message.isUser 
                        ? 'bg-petroleo text-white rounded-br-sm' 
                        : 'bg-white border border-gray-200 rounded-bl-sm shadow-sm'
                    }`}>
                      <div className="whitespace-pre-line text-sm leading-relaxed">
                        {message.content}
                      </div>
                      <div className={`text-xs mt-2 opacity-70 ${message.isUser ? 'text-white/70' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-lilas to-secondary text-petroleo">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="p-4 rounded-2xl bg-white border border-gray-200 rounded-bl-sm shadow-sm">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-petroleo animate-spin" />
                        <span className="text-sm text-gray-600">LIA está digitando...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Input Area */}
          <div className="border-t bg-gray-50/50 p-4">
            <div className="flex space-x-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta sobre imigração para os EUA..."
                className="flex-1 bg-white border-gray-300 focus:border-petroleo"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              A LIA está disponível 24/7 para esclarecer suas dúvidas sobre imigração americana
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Especialista;