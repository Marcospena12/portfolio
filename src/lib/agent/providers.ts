import { createGoogle } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { APICallError, type LanguageModel } from "ai";

export type ModelCandidate = {
  provider: string;
  label: string;
  model: LanguageModel;
};

/** Nomes curados dos modelos configurados no fallback. */
const MODEL_LABELS: Record<string, string> = {
  "openai/gpt-oss-120b": "GPT-OSS 120B",
  "openai/gpt-oss-20b": "GPT-OSS 20B",
  "openrouter/free": "OpenRouter Free",
  "gemini-3.8-flash": "Gemini 3.8 Flash",
  "gemini-3.5-flash": "Gemini 3.5 Flash",
  "gemini-3.5-flash-lite": "Gemini 3.5 Flash Lite",
};

const ACRONYMS = new Set(["gpt", "oss", "ai", "llm", "api", "vl"]);

/**
 * Nome legível do modelo que de fato respondeu. Cobre os ids configurados e
 * formata ids roteados (ex.: `vendor/llama-3.3-70b-instruct:free`).
 */
export function getModelLabel(modelId: string): string {
  const known = MODEL_LABELS[modelId];
  if (known) return known;

  const slug = (modelId.split("/").pop() ?? modelId).replace(/:[^:]*$/, "");
  const parts = slug.replace(/[-_]+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return modelId;

  return parts
    .map((part) => {
      const size = /^(\d+(?:\.\d+)?)b$/i.exec(part);
      if (size) return `${size[1]}B`;
      if (ACRONYMS.has(part.toLowerCase())) return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

export function getModelCandidates(origin: string | null): ModelCandidate[] {
  const candidates: ModelCandidate[] = [];

  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    const groq = createGroq({ apiKey: groqKey });
    candidates.push(
      { provider: "groq", label: "GPT-OSS 120B", model: groq("openai/gpt-oss-120b") },
      { provider: "groq", label: "GPT-OSS 20B", model: groq("openai/gpt-oss-20b") },
    );
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey) {
    const openrouter = createOpenAICompatible({
      name: "openrouter",
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: openRouterKey,
      headers: {
        ...(origin ? { "HTTP-Referer": origin } : {}),
        "X-Title": "Portfolio do Marcos",
      },
    });
    candidates.push({
      provider: "openrouter",
      label: "OpenRouter Free",
      model: openrouter("openrouter/free"),
    });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    const gemini = createGoogle({ apiKey: geminiKey });
    candidates.push(
      { provider: "gemini", label: "Gemini 3.8 Flash", model: gemini("gemini-3.8-flash") },
      { provider: "gemini", label: "Gemini 3.5 Flash", model: gemini("gemini-3.5-flash") },
      {
        provider: "gemini",
        label: "Gemini 3.5 Flash Lite",
        model: gemini("gemini-3.5-flash-lite"),
      },
    );
  }

  return candidates;
}

// 👉 BLANK B: helper isTransient
// - se o erro for APICallError → devolve error.isRetryable
// - qualquer outro erro (rede/timeout) → true (vale tentar o próximo)
export function isTransient(error: unknown): boolean {
  if (error instanceof APICallError) {
    return error.isRetryable;
  }
  return true;
}
