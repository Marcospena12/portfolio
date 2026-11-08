import { createAgent } from "@/lib/agent/agent";
import { getModelCandidates, getModelLabel, isTransient } from "@/lib/agent/providers";
import { SITE_URL } from "@/data/site";
import { createRateLimiter } from "@/lib/rate-limit";
import type { NextRequest } from "next/server";

export const maxDuration = 60;

const MAX_MESSAGES = 40;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_TOTAL_CHARS = 12_000;
const MAX_BODY_BYTES = 128_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

// Timeout de cada chamada de IA. O cliente do front aborta em 60s, então o
// deadline global mantém a resposta dentro dessa janela mesmo com fallback.
const REQUEST_TIMEOUT_MS = 25_000;
const TOTAL_DEADLINE_MS = 55_000;

type IncomingMessage =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string };

const rateLimit = createRateLimiter({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
});

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "local"
  );
}

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(SITE_URL).origin;
  } catch {
    return false;
  }
}

function sanitizeMessages(raw: unknown): IncomingMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const messages: IncomingMessage[] = [];
  let totalChars = 0;
  for (const item of raw.slice(-MAX_MESSAGES)) {
    if (typeof item !== "object" || item === null) return null;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
      return null;
    }
    if (content.trim().length === 0 || content.length > MAX_MESSAGE_LENGTH) return null;
    totalChars += content.length;
    if (totalChars > MAX_TOTAL_CHARS) return null;
    messages.push({ role, content });
  }
  return messages;
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return Response.json({ error: "Requisição muito grande." }, { status: 413 });
  }

  const ip = getClientIp(request);
  const limit = rateLimit(ip);
  if (limit.limited) {
    return Response.json(
      { error: "Muitas mensagens. Tente novamente em instantes." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin)) {
    return Response.json({ error: "Origem não permitida." }, { status: 403 });
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

  const candidates = getModelCandidates(origin);
  if (candidates.length === 0) {
    return Response.json(
      { error: "Chat não configurado no servidor.", code: "no_provider" },
      { status: 503 },
    );
  }

  let anyTransient = false;
  const deadline = Date.now() + TOTAL_DEADLINE_MS;
  for (const [index, candidate] of candidates.entries()) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) {
      anyTransient = true;
      break;
    }

    const startedAt = Date.now();
    try {
      const agent = createAgent(candidate.model);
      const result = await agent.generate({
        messages,
        timeout: Math.min(REQUEST_TIMEOUT_MS, remaining),
      });

      const durationMs = Date.now() - startedAt;
      const lastStep = result.steps[result.steps.length - 1];
      const model = lastStep
        ? {
            label: getModelLabel(lastStep.model.modelId),
            id: lastStep.model.modelId,
            provider: candidate.provider,
          }
        : undefined;
      const toolCalls = result.steps.flatMap((step) =>
        step.toolCalls.map((call) => ({
          tool: call.toolName,
          input: call.input,
          ms: Math.round(step.performance.toolExecutionMs[call.toolCallId] ?? 0),
        })),
      );

      console.log("[chat] ok", {
        provider: candidate.provider,
        tentativa: `${index + 1}/${candidates.length}`,
        duracaoMs: durationMs,
        steps: result.steps.length,
        tokens: {
          entrada: result.totalUsage.inputTokens,
          saida: result.totalUsage.outputTokens,
        },
        toolCalls,
        passos: result.steps.map((step) => ({
          n: step.stepNumber,
          modelo: `${step.model.provider}/${step.model.modelId}`,
          finish: step.finishReason,
          respostaMs: Math.round(step.performance.responseTimeMs),
        })),
      });

      if (!result.text.trim()) {
        console.warn(
          "[chat] resposta vazia — finishReason:",
          result.steps[result.steps.length - 1]?.finishReason,
        );
      }

      return Response.json({
        message: { role: "assistant", content: result.text },
        ...(model ? { model } : {}),
      });
    } catch (error) {
      anyTransient = anyTransient || isTransient(error);
      console.error(
        `[chat] falha provider="${candidate.provider}" tentativa=${index + 1}/${candidates.length}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

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