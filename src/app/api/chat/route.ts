import { createAgent } from "@/lib/agent/agent";
import { getModelCandidates, getModelLabel, isTransient } from "@/lib/agent/providers";
import type { NextRequest } from "next/server";

const MAX_MESSAGES = 40;
const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

// Timeout de cada chamada de IA. DevOps: o cliente do front aborta em 60s e
// a Vercel Hobby aguenta 300s, então dá pra tentar vários providers seguidos.
const REQUEST_TIMEOUT_MS = 25_000;
type IncomingMessage =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string };

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
  const candidates = getModelCandidates(origin);
  if (candidates.length === 0) {
    return Response.json(
      { error: "Chat não configurado no servidor.", code: "no_provider" },
      { status: 503 },
    );
  }

  let anyTransient = false;
  for (const [index, candidate] of candidates.entries()) {
    const startedAt = Date.now();
    try {
      const agent = createAgent(candidate.model);
      const result = await agent.generate({
        messages,
        timeout: REQUEST_TIMEOUT_MS,
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