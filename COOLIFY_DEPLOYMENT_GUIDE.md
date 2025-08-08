# Guia de Implantação do Lifeway no Coolify

Este documento fornece um guia passo a passo para implantar o projeto Lifeway no Coolify, uma plataforma de auto-hospedagem para aplicações web.

## Pré-requisitos

- Acesso a um servidor Coolify
- Git instalado na sua máquina local
- Acesso ao repositório do projeto Lifeway

## Passo 1: Preparar o Projeto para Implantação

### 1.1 Configurar Variáveis de Ambiente

Crie um arquivo `.env.production` na raiz do projeto com as variáveis de ambiente necessárias:

```
# Supabase
VITE_PUBLIC_SUPABASE_URL=https://pgxhwkifayptucnkjcpk.supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase

# URLs
NEXT_PUBLIC_APP_URL=https://seu-dominio-de-producao.com

# OpenAI (use variáveis de ambiente seguras no Coolify)
VITE_OPENAI_API_KEY=${OPENAI_API_KEY}

# Outras variáveis necessárias para produção
```

### 1.2 Verificar o Script de Build

Confirme que o script de build no `package.json` está configurado corretamente:

```json
"scripts": {
  "build": "tsc -b && vite build"
}
```

### 1.3 Criar arquivo Dockerfile (opcional)

Se desejar usar contêineres Docker, crie um arquivo `Dockerfile` na raiz do projeto:

```dockerfile
FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

E um arquivo `nginx.conf`:

```
server {
    listen 80;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Passo 2: Configurar o Projeto no Coolify

### 2.1 Fazer Login no Coolify

1. Acesse o painel de controle do Coolify através do navegador
2. Faça login com suas credenciais

### 2.2 Criar um Novo Projeto

1. Clique em "Adicionar Novo" > "Aplicação"
2. Selecione "Aplicação Web"
3. Escolha a fonte do seu código (GitHub, GitLab, etc.)
4. Conecte ao repositório do Lifeway
5. Selecione a branch principal (geralmente `main` ou `master`)

### 2.3 Configurar a Aplicação

1. Selecione "Vite" como tipo de aplicação
2. Configure as seguintes opções:
   - **Nome da Aplicação**: Lifeway
   - **Diretório de Publicação**: dist
   - **Comando de Instalação**: npm ci
   - **Comando de Build**: npm run build
   - **Porta**: 80 (ou a porta configurada no seu aplicativo)

### 2.4 Configurar Variáveis de Ambiente

1. Na seção "Variáveis de Ambiente", adicione todas as variáveis do seu arquivo `.env.production`
2. Certifique-se de marcar como secretas as variáveis sensíveis como chaves de API

## Passo 3: Implantar a Aplicação

### 3.1 Iniciar a Implantação

1. Clique no botão "Implantar" para iniciar o processo de implantação
2. Acompanhe o progresso da implantação nos logs

### 3.2 Verificar a Implantação

1. Após a conclusão da implantação, clique no link fornecido para acessar sua aplicação
2. Verifique se todas as funcionalidades estão operando corretamente

## Passo 4: Configurar Domínio Personalizado (opcional)

### 4.1 Adicionar Domínio

1. Na página de detalhes da aplicação, vá para a seção "Domínios"
2. Clique em "Adicionar Domínio"
3. Digite seu domínio personalizado (ex: lifeway.seudominio.com)

### 4.2 Configurar DNS

1. Configure os registros DNS do seu domínio para apontar para o servidor Coolify:
   - Tipo: A
   - Nome: lifeway (ou subdomínio desejado)
   - Valor: [Endereço IP do servidor Coolify]

### 4.3 Configurar SSL

1. Na seção de domínios, ative o SSL para seu domínio personalizado
2. Escolha entre Let's Encrypt (automático) ou certificado personalizado

## Passo 5: Manutenção e Atualizações

### 5.1 Configurar Implantação Automática

1. Na página de detalhes da aplicação, vá para a seção "Configurações"
2. Ative a opção "Implantação Automática" para implantar automaticamente quando houver novos commits

### 5.2 Monitorar Logs

1. Acesse a seção "Logs" para monitorar a atividade da aplicação
2. Configure alertas para ser notificado sobre problemas

## Solução de Problemas Comuns

### Falha na Compilação
- Verifique os logs de build para identificar erros
- Confirme se todas as dependências estão instaladas corretamente
- Verifique se as variáveis de ambiente necessárias estão configuradas

### Problemas de Conexão com APIs
- Verifique se as variáveis de ambiente para chaves de API estão configuradas corretamente
- Confirme se as APIs externas (Supabase, OpenAI) estão acessíveis a partir do servidor Coolify

### Problemas de Roteamento
- Verifique a configuração do nginx para garantir que as rotas estejam sendo tratadas corretamente
- Confirme se o arquivo de configuração do React Router está configurado para funcionar em produção

## Recursos Adicionais

- [Documentação oficial do Coolify](https://coolify.io/docs)
- [Documentação do Vite para implantação](https://vitejs.dev/guide/static-deploy.html)
- [Guia de implantação do React Router](https://reactrouter.com/en/main/guides/deploy)
