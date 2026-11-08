# Portfólio — Marcos

Site pessoal com projetos, cursos, tecnologias e um chat com agente de IA.
Construído com Next.js 16 (App Router), React 19, Tailwind CSS v4 e AI SDK.

## Requisitos

- Node.js 20+
- npm

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra <http://localhost:3000>.

## Scripts

```bash
npm run dev        # servidor de desenvolvimento
npm run build      # build de produção
npm run start      # serve o build
npm run lint       # ESLint
npm run typecheck  # TypeScript sem emitir arquivos
npm run smoke      # testes de fumaça do /api/chat (precisa do servidor rodando)
```

O `smoke` usa `SMOKE_BASE_URL` (padrão `http://localhost:3000`).

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha apenas o que for usar:

| Variável | Função |
| --- | --- |
| `GROQ_API_KEY` | Provider primário do chat |
| `OPENROUTER_API_KEY` | Fallback do chat |
| `GEMINI_API_KEY` | Último fallback do chat |
| `NTFY_TOPIC` | Tópico do ntfy para alertas de visita |
| `NTFY_SERVER` | Servidor ntfy (padrão `https://ntfy.sh`) |
| `NTFY_TOKEN` | Token opcional do ntfy |
| `OWNER_TOKEN` | Segredo do link `/api/owner?token=...` |
| `OWNER_IPS` | IPs do dono separados por vírgula |

Todas são server-only. Nunca comite o `.env.local`.

## Estrutura

- `src/app` — rotas, metadata, sitemap, robots e API routes
- `src/components` — UI, widget de chat e cenas de background
- `src/data` — conteúdo do portfólio (projetos, cursos, tecnologias, textos)
- `src/lib/agent` — agente, providers e tools do chat
- `evals` — casos de teste do chat
- `public` — imagens e certificados

## Segurança

- Headers de segurança e CSP definidos em `next.config.ts`.
- `/api/chat` tem rate limit, limites de payload e deadline global.
- `/api/visit` ignora dono, bots, chamadas cross-site e aplica rate limit.
- Links externos usam `rel="noopener noreferrer"`.

## Deploy

Deploy padrão na Vercel. Configure as variáveis de ambiente no projeto e
publique a branch principal.
