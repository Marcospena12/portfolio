import { ApiError, GoogleGenAI } from "@google/genai";
import type { NextRequest } from "next/server";

const MAX_MESSAGES = 40;
const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

// Timeout de cada chamada de IA. DevOps: o cliente do front aborta em 60s e
// a Vercel Hobby aguenta 300s, então dá pra tentar vários providers seguidos.
const REQUEST_TIMEOUT_MS = 25_000;

const SYSTEM_INSTRUCTION = `Você é a Luiza, assistente virtual do portfólio de Marcos, desenvolvedor.
Responda sempre no idioma da mensagem recebida (português ou inglês).
Seja objetiva e amigável: respostas curtas (no máximo 3-4 frases), sem markdown pesado.
Você conhece os projetos, experiências e tecnologias do Marcos e ajuda visitantes a explorar o portfólio.
Se não souber algo sobre o Marcos, diga honestamente e sugira que o visitante use a página de contato.
Não invente informações pessoais.`;

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