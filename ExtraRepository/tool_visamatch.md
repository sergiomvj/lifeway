# Sistema de Consultoria de Visto Americano com OpenAI Assistant

## Visão Geral

Aplicação completa em TypeScript que integra diretamente com a OpenAI para fornecer consultoria especializada em vistos americanos.

## Características Principais

### 1. Integração Direta com OpenAI Assistant
- **Conexão nativa** com o Assistant específico via ID
- **Sistema de threads** para conversas contínuas
- **Gestão de sessões** com controle de tempo e atividade
- **Follow-up questions** na mesma conversa

### 2. Dados Estruturados do Cliente
- **Perfis diversos** (profissional de tech vs empresário)
- **Formatação especializada** para o Assistant
- **Validação completa** de dados
- **Múltiplos cenários** de teste

### 3. Processamento Inteligente
- **Aguarda conclusão** do Assistant automaticamente
- **Parsing estruturado** das respostas
- **Formatação profissional** para apresentação
- **Histórico completo** de consultas

### 4. Funcionalidades Avançadas
- **Perguntas adicionais** na mesma sessão
- **Limpeza automática** de sessões antigas
- **Relatórios em PDF** (estrutura preparada)
- **Estimativa de custos** da API

## Instalação e Configuração

### Dependências
```bash
npm install openai dotenv @types/node
```

### Variáveis de Ambiente
```bash
OPENAI_API_KEY=sua_chave_da_openai
```

### Execução
```bash
npx ts-node visa-openai-app.ts
```

## Estrutura de Dados

### Interface ClientData
Sugira algo mas os dados são da tabela prospets postados atraves do MultiStepForm

## Fluxo de Funcionamento

1. **Carrega dados** do cliente (simulado com 2 cenários diferentes de visto )
2. **Cria thread** específica para o cliente
3. **Formata dados** de forma estruturada para o Assistant
4. **Envia para Assistant** pré-configurado
5. **Aguarda processamento** com polling automático
6. **Formata resposta** profissionalmente
7. **Salva histórico** em JSON local
8. **Permite follow-ups** na mesma conversa

## Exemplos de Clientes

### Cliente 1 - Profissional de Tech
```typescript
// Apenas exemplo ... adaptar aos campos que o MultiStepForm fornece
{
  id: 'cliente-123',
  personalInfo: {
    name: "Maria Fernanda Oliveira",
    age: 28,
    nationality: "Brazilian",
    maritalStatus: "single",
    hasChildren: false,
    education: "master"
  },
  professional: {
    occupation: "Data Scientist",
    currentEmployer: "TechCorp Brasil",
    yearsOfExperience: 6,
    annualIncome: 95000,
    hasBusinessInUS: false,
    isExecutiveOrManager: false
  },
  travel: {
    purposeOfTravel: "work",
    intendedStayDuration: 365,
    hasUSSponsorship: true,
    sponsorType: "employer",
    previousUSVisits: 1,
    hasVisaRejection: false
  }
  // ... outros campos
}
```

### Cliente 2 - Empresário
```typescript
{
  id: 'cliente-456',
  personalInfo: {
    name: "Roberto Carlos Mendes",
    age: 45,
    nationality: "Brazilian",
    maritalStatus: "married",
    hasChildren: true,
    education: "bachelor"
  },
  professional: {
    occupation: "Business Owner",
    currentEmployer: "Own Company",
    yearsOfExperience: 20,
    annualIncome: 250000,
    hasBusinessInUS: false,
    isExecutiveOrManager: true
  },
  travel: {
    purposeOfTravel: "business",
    intendedStayDuration: 90,
    hasUSSponsorship: false,
    previousUSVisits: 5,
    hasVisaRejection: false
  }
  // ... outros campos
}
```

## Vantagens sobre N8N

✅ **Mais direto** - sem intermediários ou workflows complexos  
✅ **Controle total** - gerenciamento completo das conversas e sessões  
✅ **Respostas mais rápidas** - comunicação direta com a API  
✅ **Debugging simplificado** - logs detalhados e tratamento de erro robusto  
✅ **Customização total** - formatação e processamento específicos  
✅ **Sessões persistentes** - conversas contínuas com o mesmo contexto  

## Recursos Especiais

### Sistema de Sessões Inteligente
```typescript
interface ConversationSession {
  threadId: string;
  clientId: string;
  createdAt: Date;
  lastActivity: Date;
  messageCount: number;
}
```

### Formatação Profissional
A resposta do Assistant é formatada automaticamente para apresentação:
- Cabeçalho profissional com data/hora
- Estruturação clara da análise
- Notas importantes destacadas
- Disclaimer legal apropriado

### Perguntas de Follow-up
```typescript
// Cliente pode fazer perguntas adicionais na mesma sessão
await consultant.askFollowUpQuestion(
  'cliente-123', 
  'Quanto tempo demora o processo do visto H1B?'
);
```

### Histórico Completo
Cada consulta é salva com:
- Dados completos do cliente
- Resposta do Assistant
- Metadados da sessão
- Timestamp da consulta

## Estrutura de Resposta do Assistant

O Assistant pré-configurado foi instruído para fornecer:

### 1. Análise do Perfil
- Pontos fortes do candidato
- Áreas de preocupação
- Avaliação geral de elegibilidade

### 2. Recomendações Específicas
- Tipos de visto mais adequados
- Probabilidade de sucesso
- Justificativas detalhadas

### 3. Documentação Necessária
- Lista específica por tipo de visto
- Documentos opcionais que fortalecem o caso
- Certificações ou validações necessárias

### 4. Timeline Realista
- Tempo de preparação
- Processamento esperado
- Marcos importantes do processo

### 5. Próximos Passos
- Ações imediatas
- Preparação de documentos
- Agendamentos necessários

## Exemplo de Saída da Aplicação

```
🚀 Iniciando consulta de visto para cliente: cliente-123
═══════════════════════════════════════════════════════════════════════════════

👤 Cliente: Maria Fernanda Oliveira
🎯 Propósito: work
💼 Profissão: Data Scientist
──────────────────────────────────────────────────────────

🤖 Consultando Assistant OpenAI especializado em vistos...
📤 Dados enviados para o Assistant
⏳ Aguardando resposta do Assistant...
✅ Resposta recebida do Assistant

╔════════════════════════════════════════════════════════════════════════════════╗
║                           CONSULTORIA DE VISTO AMERICANO                      ║
║                              Relatório Personalizado                          ║
╚════════════════════════════════════════════════════════════════════════════════╝

📅 Data da Análise: 22/05/2025 14:30:25
🤖 Analisado por: Specialist AI Assistant (OpenAI)

[Resposta detalhada do Assistant aqui...]
```

## Monitoramento e Custos

### Estimativa de Custos da API
```typescript
static calculateConsultationCost(messageCount: number): number {
  const baseTokens = 2000;
  const additionalTokens = messageCount * 1000;
  const totalTokens = baseTokens + additionalTokens;
  return (totalTokens / 1000) * 0.03; // ~$0.03 por 1k tokens GPT-4
}
```

### Gestão de Sessões
- **Limpeza automática** de sessões antigas (>24h)
- **Controle de atividade** por cliente
- **Limite de mensagens** por sessão (configurável)

## Métodos Principais da Classe

### OpenAIVisaConsultant

#### `getClientData(clientId: string)`
Busca dados do cliente no banco de dados (simulado)

#### `createThread(clientId: string)`
Cria uma nova thread de conversa com o Assistant

#### `consultAssistant(clientData: ClientData)`
Envia dados formatados para o Assistant e aguarda resposta

#### `processVisaConsultation(clientId: string)`
Método principal que executa o fluxo completo de consulta

#### `askFollowUpQuestion(clientId: string, question: string)`
Permite perguntas adicionais na mesma sessão

#### `getActiveSessions()`
Lista todas as sessões ativas

#### `cleanupOldSessions()`
Remove sessões antigas automaticamente

## Extensões Futuras

### 1. Geração de Relatórios PDF
```typescript
class ReportGenerator {
  static async generatePDFReport(consultationData: any): Promise<string> {
    // Implementação com puppeteer ou jsPDF
    // Gera PDF profissional com análise completa
  }
}
```

### 2. Integração com Email
```typescript
static async generateEmailSummary(consultationData: any): Promise<string> {
  // Gera resumo por email para o cliente
  // Inclui próximos passos e contatos importantes
}
```

### 3. Dashboard Web
- Interface web para consultas
- Histórico de clientes
- Métricas de aprovação
- Acompanhamento de casos

## Vantagens para o Negócio

### Escalabilidade
- **Processamento simultâneo** de múltiplos clientes
- **Respostas consistentes** e profissionais
- **Redução de 80%** no tempo de análise manual

### Qualidade
- **Expertise especializada** do Assistant configurado
- **Análises detalhadas** e personalizadas
- **Recomendações baseadas** em dados estruturados

### Eficiência Operacional
- **Automatização completa** do processo inicial
- **Histórico organizado** para follow-ups
- **Integração fácil** com sistemas existentes

## Utilitários Incluídos

### VisaConsultantUtils

#### `validateEnvironment()`
Valida se todas as variáveis de ambiente necessárias estão configuradas

#### `formatCurrency(amount: number)`
Formata valores monetários em USD

#### `calculateConsultationCost(messageCount: number)`
Calcula custo estimado da consulta baseado no uso da API

## Estrutura de Arquivos

```
projeto/
├── visa-openai-app.ts           # Aplicação principal
├── consultation_history/        # Histórico de consultas (gerado)
│   ├── cliente-123_timestamp.json
│   └── cliente-456_timestamp.json
├── .env                        # Variáveis de ambiente
├── package.json               # Dependências
└── README.md                  # Esta documentação
```

## Tratamento de Erros

A aplicação inclui tratamento robusto de erros para:
- Falhas na conexão com a API OpenAI
- Timeouts de resposta do Assistant
- Dados de cliente inválidos ou ausentes
- Problemas de criação/gerenciamento de threads
- Erros de parsing de resposta

## Logs e Debugging

Sistema completo de logs com emojis para fácil identificação:
- 🚀 Início de processo
- ✅ Sucesso
- ❌ Erro
- 🤖 Interação com Assistant
- 💾 Salvamento de dados
- 🧹 Limpeza de sessões
- 📊 Métricas e estatísticas

## Considerações de Segurança

- **API Key** armazenada em variável de ambiente
- **Dados sensíveis** não expostos em logs
- **Sessões temporárias** com expiração automática
- **Validação de entrada** em todos os métodos públicos

## Performance

- **Polling inteligente** para aguardar respostas
- **Reutilização de threads** para múltiplas perguntas
- **Limpeza automática** de recursos não utilizados
- **Controle de rate limiting** da API

## Implementação já realizada

- **Backend independente:**
  - Arquivo: `api/tools-visamatch.ts`
  - Recebe `prospectId` via POST (e `followUpQuestion` opcional).
  - Busca o perfil do usuário no Supabase.
  - Gerencia sessão (thread) para cada cliente.
  - Gera resposta simulada do Assistant (substitua por chamada real à OpenAI Assistant).
  - Retorna resposta, threadId e dados da sessão para o frontend.

- **Frontend modular (Vite + React + Tailwind):**
  - Componente criado em `web/src/components/tools/visamatch/`:
    - `VisaMatchClient.tsx` (componente principal)
  - Página de exemplo: `web/src/pages/VisaMatchPage.jsx`
  - Integração frontend-backend via fetch para `/api/tools-visamatch`.
  - Suporte a perguntas de follow-up na mesma sessão.

## Como reutilizar no Dashboard do usuário

O componente principal `VisaMatchClient` foi projetado para ser facilmente reutilizado em qualquer parte do sistema, inclusive no Dashboard do usuário. Basta importar e renderizar o componente, passando o `prospectId` do usuário logado:

```jsx
import VisaMatchClient from '../components/tools/visamatch/VisaMatchClient'

function Dashboard({ user }) {
  // ...outros widgets/cards...
  return (
    <div>
      {/* ...outros elementos do dashboard... */}
      <VisaMatchClient prospectId={user.prospectId} />
    </div>
  )
}
```

Dessa forma, a consultoria de visto aparece como um card/widget interativo dentro do Dashboard, mantendo a experiência integrada e reaproveitando toda a lógica já implementada.

Esta solução oferece uma alternativa mais direta e controlável ao N8N, mantendo toda a inteligência do Assistant especializado da OpenAI, com flexibilidade completa de customização do processo de negócio.