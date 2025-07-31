# LifeWayUSA Admin Panel

Painel administrativo para gerenciar o conteúdo da aplicação.

## Funcionalidades Planejadas

### Gestão de Conteúdo
- **Artigos** - CRUD de artigos e blog posts
- **Cidades** - Gerenciar destinos e informações
- **Blog** - Posts, categorias e tags
- **Empresa** - Dados institucionais

### Gestão de Usuários
- **Usuários** - Listagem e perfis
- **Prospects** - Leads e interessados
- **Formulários** - Dados do Criador de Sonhos

### Configurações
- **Ferramentas** - Ativar/desativar funcionalidades
- **APIs** - Configurar integrações externas

## Estrutura

```
admin-panel/
├── pages/
│   ├── articles.tsx      # Gestão de artigos
│   ├── cities.tsx        # Gestão de cidades
│   ├── blog.tsx          # Gestão do blog
│   ├── users.tsx         # Gestão de usuários
│   ├── tools-status.tsx  # Status das ferramentas
│   └── empresa.tsx       # Dados da empresa
├── components/           # Componentes do admin
└── hooks/               # Hooks específicos
```