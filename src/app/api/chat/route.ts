import { ApiError, GoogleGenAI } from "@google/genai";
import type { NextRequest } from "next/server";

const MAX_MESSAGES = 40;
const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

// Timeout de cada chamada de IA. DevOps: o cliente do front aborta em 60s e
// a Vercel Hobby aguenta 300s, então dá pra tentar vários providers seguidos.
const REQUEST_TIMEOUT_MS = 25_000;

const SYSTEM_INSTRUCTION = `Você é Ciri (Cirilla), a assistente virtual do portfólio do Marcos — desenvolvedor com raízes em DevOps e infraestrutura, curioso por natureza, hoje construindo soluções que cruzam automação, IA e desenvolvimento web.

# Personalidade
Você é calorosa, curiosa e direta, com um toque sutil de humor, nunca robótica. Fala como alguém genuinamente animado em mostrar o trabalho do Marcos, não como um FAQ automatizado. Demonstra entusiasmo real pelos projetos mais técnicos (adora falar de arquitetura, automações e infraestrutura), mas sem soar arrogante ou técnica demais para quem não é da área.

# Sobre o Marcos (bio)
Nascido em 2001, com contato quase diário com computadores desde 2007. Veio de uma trajetória DevOps/infraestrutura (redes, virtualização com Proxmox, NAS, dispositivos IoT) e hoje cursa Sistemas de Informação na PUC Minas. O que mais o motiva é cruzar infraestrutura complexa com desenvolvimento de software: construir scripts, automações e agentes de IA que realmente resolvem problemas, não só "operar" sistemas prontos.

# Projetos que você conhece bem
- **Luiza**: agente de IA multiagente hierárquico (n8n + LLMs) que automatiza suporte via WhatsApp/Crisp, resolvendo ~70% das conversas de forma autônoma.
- **Nó verificado do n8n (NI)**: integração oficialmente verificada pelo n8n para a API da Notificações Inteligentes, construída em TypeScript.
- **Infraestrutura de Telefonia IP**: Asterisk + FreePBX construído do zero para um coworking, integrando porteiro físico à telefonia IP.
- **Automação IoT**: ecossistema de automação predial (Home Assistant) unificando climatização, iluminação e acesso.
- **SAVAPAGE**: sistema de impressão compartilhada gerenciada, com controle de cotas por sala.
- **Automações do GitLab**: 25 automações via n8n cuidando de board, review e deploy de um time de desenvolvimento.
- **Base de Conhecimento IA**: pipeline de crawler semanal + vetorização (RAG) alimentando agentes de IA.
- **Ecossistema de Notificações**: sistema de handoff que direciona conversas da Luiza para os times certos, com análise automática de onde a IA errou.
- **Infraestrutura de Armazenamento e Backup**: NAS Synology centralizando CFTV, backups de VMs e quórum de cluster.
- **Backup Híbrido (Proxmox Backup Server)**: arquitetura de backup em camadas, local e em nuvem, com verificação de integridade.
- **Este portfólio**: o próprio site, construído em Next.js + TypeScript + Tailwind, bilíngue e com visuais únicos por projeto.

Stack recorrente do Marcos: n8n, TypeScript/JavaScript, Python, PostgreSQL/Supabase, Redis, Docker, Proxmox, Linux, React/Next.js, e bastante automação low-code combinada com código real.

# Regras de resposta
- Responda sempre no idioma da mensagem recebida (português ou inglês), nunca misture os dois.
- Seja objetiva: respostas curtas, no máximo 3-4 frases. Markdown leve é bem-vindo no chat: use **negrito** com moderação para destacar palavras-chave e \`código\` para termos técnicos, mas evite listas longas, títulos e markdown pesado.
- Fale dos projetos com contexto real, não genérico: cite o nome certo, a tecnologia principal, o problema que resolve.
- Se não souber algo específico sobre o Marcos (histórico pessoal, disponibilidade, dados de contato exatos), diga honestamente e sugira a página de Contato.
- Nunca invente informações pessoais, números ou detalhes técnicos que não estejam aqui.
- Se o visitante parecer ser recrutador/cliente, destaque projetos com resultado mensurável (Luiza, GitLab Automations); se parecer mais técnico/curioso, pode aprofundar em arquitetura.`;

type IncomingMessage = { role: string; content: string };

// Rate limit simples em memória (por instância do servidor).
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

function sanitizeMessages(raw: unknown): IncomingMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const messages: IncomingMessage[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) return null;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
      return null;
    }
    if (content.trim().length === 0 || content.length > MAX_MESSAGE_LENGTH) return null;
    messages.push({ role, content });
  }
  return messages.slice(-MAX_MESSAGES);
}

/// Erros da API normalizados: `transient` vale fallback p/ próximo modelo ou
/// provider; `permanent` (ex.: chave inválida) pula o provider inteiro.
class ProviderError extends Error {
  kind: "transient" | "permanent";
  status: number;

  constructor(kind: "transient" | "permanent", status: number, message: string) {
    super(message);
    this.kind = kind;
    this.status = status;
  }
}

function isTransientHttp(status: number): boolean {
  return status === 408 || status === 429 || (status >= 500 && status <= 504);
}

/// Chamada OpenAI-compatible (Groq, OpenRouter etc.) via fetch nativo.
async function callOpenAICompatible(opts: {
  baseUrl: string;
  apiKey: string;
  model: string;
  contents: IncomingMessage[];
  extraHeaders?: Record<string, string>;
}): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${opts.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${opts.apiKey}`,
        ...opts.extraHeaders,
      },
      body: JSON.stringify({
        model: opts.model,
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          ...opts.contents.map((m) => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 400,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    // Timeout ou falha de rede: transitório, sobe pra tentar outro provider.
    throw new ProviderError(
      "transient",
      0,
      error instanceof Error ? error.message : String(error),
    );
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ProviderError(
      isTransientHttp(res.status) ? "transient" : "permanent",
      res.status,
      body,
    );
  }

  const data: unknown = await res.json().catch(() => null);
  const content = (data as { choices?: { message?: { content?: string } }[] })?.choices?.[0]?.message?.content;
  const trimmed = content?.trim();
  if (!trimmed) {
    throw new ProviderError("transient", 0, "resposta vazia");
  }
  return trimmed;
}

/// Chamada ao Gemini via @google/genai, no mesmo formato de erro da cadeia.
async function callGemini(opts: {
  apiKey: string;
  model: string;
  contents: IncomingMessage[];
}): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: opts.apiKey });
  try {
    const response = await ai.models.generateContent({
      model: opts.model,
      contents: opts.contents.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });
    const text = response.text?.trim();
    if (!text) throw new ProviderError("transient", 0, "resposta vazia");
    return text;
  } catch (error) {
    if (error instanceof ProviderError) throw error;
    if (error instanceof ApiError) {
      throw new ProviderError(
        isTransientHttp(error.status) ? "transient" : "permanent",
        error.status,
        error.message,
      );
    }
    throw new ProviderError(
      "transient",
      0,
      error instanceof Error ? error.message : String(error),
    );
  }
}

type Provider = {
  name: string;
  models: string[];
  call: (model: string) => Promise<string>;
};

/// Providers habilitados conforme as chaves presentes no ambiente, na ordem
/// de preferência: Groq (rápido, folga de tokens) → OpenRouter (variedade de
/// modelos free com failover próprio) → Gemini (último recurso).
function buildProviders(contents: IncomingMessage[], origin: string | null): Provider[] {
  const providers: Provider[] = [];

  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    providers.push({
      name: "groq",
      models: ["meta-llama/llama-3.3-70b-versatile", "meta-llama/llama-3.1-8b-instant"],
      call: (model) =>
        callOpenAICompatible({
          baseUrl: "https://api.groq.com/openai/v1",
          apiKey: groqKey,
          model,
          contents,
        }),
    });
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey) {
    providers.push({
      name: "openrouter",
      models: ["openrouter/free"],
      call: (model) =>
        callOpenAICompatible({
          baseUrl: "https://openrouter.ai/api/v1",
          apiKey: openRouterKey,
          model,
          contents,
          extraHeaders: {
            ...(origin ? { "HTTP-Referer": origin } : {}),
            "X-Title": "Portfolio do Marcos",
          },
        }),
    });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    providers.push({
      name: "gemini",
      models: ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite"],
      call: (model) => callGemini({ apiKey: geminiKey, model, contents }),
    });
  }

  return providers;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Muitas mensagens. Tente novamente em instantes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const messages = sanitizeMessages((body as { messages?: unknown })?.messages);
  if (!messages) {
    return Response.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const origin = request.headers.get("origin");
  const chain = buildProviders(messages, origin);
  if (chain.length === 0) {
    return Response.json(
      { error: "Chat não configurado no servidor.", code: "no_provider" },
      { status: 503 },
    );
  }

  let anyTransient = false;
  for (const provider of chain) {
    for (const model of provider.models) {
      try {
        const content = await provider.call(model);
        return Response.json({ message: { role: "assistant", content } });
      } catch (error) {
        const providerError = error as ProviderError;
        anyTransient = anyTransient || providerError.kind === "transient";
        console.error(
          `[chat] provider "${provider.name}" modelo "${model}" falhou (${providerError.kind}, status ${providerError.status}): ${providerError.message}`,
        );
        // Transitório: tenta o próximo modelo/provider. Permanente: pula o
        // provider inteiro (a chave/credential não vai melhorar nos modelos
        // seguintes dele), mas ainda tenta os providers restantes.
        if (providerError.kind === "permanent") break;
      }
    }
  }

  // Todos falharam. Se qualquer erro foi transitório (alta demanda/timeout),
  // o retry manual do usuário na bolha de erro faz sentido agora.
  if (anyTransient) {
    return Response.json(
      {
        error: "A IA está em alta demanda no momento. Tente novamente em instantes.",
        code: "busy",
      },
      { status: 503 },
    );
  }

  return Response.json(
    { error: "Não consegui processar sua mensagem." },
    { status: 502 },
  );
}