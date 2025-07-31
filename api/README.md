# LifeWayUSA API

Backend da aplicação LifeWayUSA.

## Estrutura Planejada

```
api/
├── src/
│   ├── routes/        # Rotas da API
│   ├── controllers/   # Controladores
│   ├── services/      # Lógica de negócio
│   ├── models/        # Modelos de dados
│   └── utils/         # Utilitários
├── tests/             # Testes
└── docs/              # Documentação
```

## Endpoints Planejados

- `POST /api/dreams/save` - Salvar formulário de sonhos
- `POST /api/visamatch/generate` - Análise de visto
- `POST /api/specialist/ask` - Chat com especialista
- `GET /api/cities` - Listar cidades
- `GET /api/blog` - Artigos do blog

> Atualmente usando Supabase Edge Functions para backend