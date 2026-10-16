import type { NextRequest } from "next/server";

const BOT_RE = /bot|crawler|spider|crawling|headless|lighthouse|vercel|preview|monitor|uptime/i;
const MOBILE_RE = /mobile|android|iphone/i;
const MAX_PATH_LENGTH = 200;
const MAX_LANGUAGE_LENGTH = 20;
const NTFY_TIMEOUT_MS = 4000;

type VisitPayload = {
  path: string;
  referrer: string | null;
  language: string;
};

function noContent(): Response {
  return new Response(null, { status: 204 });
}

// Do referrer só interessa o hostname; URL inválida vira null.
function referrerHost(referrer: string): string | null {
  try {
    return new URL(referrer).hostname;
  } catch {
    return null;
  }
}

// A cidade chega codificada em URL pelo header da Vercel.
function decodeHeader(value: string | null): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function parseBody(raw: unknown): VisitPayload {
  if (typeof raw !== "object" || raw === null) {
    return { path: "/", referrer: null, language: "" };
  }
  const { path, referrer, language } = raw as {
    path?: unknown;
    referrer?: unknown;
    language?: unknown;
  };
  return {
    path:
      typeof path === "string" && path.length > 0
        ? path.slice(0, MAX_PATH_LENGTH)
        : "/",
    referrer: typeof referrer === "string" ? referrerHost(referrer) : null,
    language: typeof language === "string" ? language.slice(0, MAX_LANGUAGE_LENGTH) : "",
  };
}

// O IP do dono é comparado e descartado: nunca é logado, guardado ou enviado.
function isOwnerIp(request: NextRequest): boolean {
  const list = process.env.OWNER_IPS;
  if (!list) return false;
  const first = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!first) return false;
  return list
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .includes(first);
}

export async function POST(request: NextRequest) {
  // Fora de produção só imprime o payload no terminal, sem chamar a rede.
  if (process.env.NODE_ENV !== "production") {
    const payload = parseBody(await request.json().catch(() => null));
    console.log("[visit]", payload);
    return noContent();
  }

  if (request.cookies.get("portfolio-owner")?.value === "1") return noContent();
  if (isOwnerIp(request)) return noContent();

  const userAgent = request.headers.get("user-agent") ?? "";
  if (BOT_RE.test(userAgent)) return noContent();

  const topic = process.env.NTFY_TOPIC;
  if (!topic) return noContent();

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const payload = parseBody(raw);
  const city = decodeHeader(request.headers.get("x-vercel-ip-city")) ?? "Local desconhecido";
  const region = request.headers.get("x-vercel-ip-country-region");
  const country = request.headers.get("x-vercel-ip-country");
  const location = [city, region, country].filter(Boolean).join(", ");
  const device = MOBILE_RE.test(userAgent) ? "mobile" : "desktop";
  const message = `${location} · ${device} · origem: ${payload.referrer ?? "acesso direto"} · página: ${payload.path}`;

  const server = (process.env.NTFY_SERVER ?? "https://ntfy.sh").replace(/\/+$/, "");
  const token = process.env.NTFY_TOKEN;

  // JSON no corpo evita erro com acentos e emojis em headers HTTP.
  try {
    await fetch(server, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        topic,
        title: "Nova visita no portfólio",
        message,
        tags: ["eyes"],
        priority: 3,
      }),
      signal: AbortSignal.timeout(NTFY_TIMEOUT_MS),
    });
  } catch {
    // Falha no ntfy nunca quebra a visita.
  }

  return noContent();
}
