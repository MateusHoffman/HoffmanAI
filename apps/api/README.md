# HoffmanAI API

API Spring Boot (Java 21) — um endpoint de chat com streaming SSE, sem banco.

## Endpoint

`POST /api/v1/chat`

```json
{
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

Resposta: SSE com eventos `data: {"content":"..."}`.

O backend injeta o system prompt (com `curriculo.md` na raiz do monorepo) e chama a OpenRouter.

## Configuração

Copie o exemplo e preencha a chave:

```bash
cp apps/api/.env.example apps/api/.env
```

| Variável | Obrigatória | Padrão |
|----------|-------------|--------|
| `OPENROUTER_API_KEY` | sim | — |
| `OPENROUTER_URL` | não | `https://openrouter.ai/api/v1/chat/completions` |
| `OPENROUTER_MODEL` | não | `xiaomi/mimo-v2.6-flash` |
| `OPENROUTER_MAX_INPUT_TOKENS` | não | `20000` |
| `OPENROUTER_MAX_OUTPUT_TOKENS` | não | `20000` |
| `CORS_ALLOWED_ORIGINS` | não | `http://localhost:5173,http://localhost:5174` |
| `CHAT_DAILY_LIMIT` | não | `30` |
| `CHAT_WEEKLY_LIMIT` | não | `100` |

O arquivo `.env` é carregado automaticamente na subida da API (e nunca deve ir para o Git).

## Desenvolvimento

```bash
cd apps/api && mvn spring-boot:run
```

O frontend em dev usa proxy Vite (`/api` → `localhost:8080`).
