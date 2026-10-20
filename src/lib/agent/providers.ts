import { createGoogle } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { APICallError, type LanguageModel } from "ai";

export type ModelCandidate = {
  provider: string;
  model: LanguageModel;
};

export function getModelCandidates(origin: string | null): ModelCandidate[] {
  const candidates: ModelCandidate[] = [];

  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    const groq = createGroq({ apiKey: groqKey });
    candidates.push(
      { provider: "groq", model: groq("openai/gpt-oss-120b") },
      { provider: "groq", model: groq("openai/gpt-oss-20b") },
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
    candidates.push({ provider: "openrouter", model: openrouter("openrouter/free") });
  }

  const GeminiKey =         process.env.GEMINI_API_KEY;
  if(GeminiKey)
  {
    const gemini = createGoogle ({apiKey: GeminiKey});
    candidates.push(
      {provider: "gemini", model: gemini("gemini-3.8-flash"),},
      { provider: "gemini", model: gemini("gemini-3.5-flash") },
      { provider: "gemini", model: gemini("gemini-3.5-flash-lite") },
    )


    
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