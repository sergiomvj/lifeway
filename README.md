# LifeWayUSA - Monorepo

Projeto LifeWayUSA organizado em múltiplos módulos para melhor manutenibilidade e escalabilidade.

## Estrutura do Projeto

```
├── frontend/          # Interface principal do usuário (React + Vite)
├── admin-panel/       # Painel administrativo
├── api/              # Backend API (Node.js/Express - futuro)
├── storage/          # Assets e arquivos estáticos
└── supabase/         # Configurações do Supabase
```

## Desenvolvimento

### Frontend Principal
```bash
npm run dev           # Inicia o frontend principal
```

### Admin Panel
```bash
npm run dev:admin     # Inicia o painel administrativo
```

### Build de Produção
```bash
npm run build         # Build do frontend
npm run build:admin   # Build do admin panel
```

## Tecnologias

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase (BaaS)
- **Admin**: React 18, TypeScript, Vite
- **Storage**: Supabase Storage + pasta local
- **Database**: PostgreSQL (Supabase)

## Assets

As imagens das cidades devem ser colocadas em `storage/images/cities/` seguindo o padrão:
- `nome-da-cidade-estado.jpg`
- Exemplo: `miami-florida.jpg`

Para usar as imagens no projeto, referencie como:
```jsx
const cityImage = "/storage/images/cities/miami-florida.jpg"
```