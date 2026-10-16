import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "portfolio-owner";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

// Compara os tokens em tempo constante, checando o tamanho antes.
function isValidToken(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(providedBuffer, expectedBuffer);
}

export function GET(request: NextRequest) {
  const ownerToken = process.env.OWNER_TOKEN;
  const token = request.nextUrl.searchParams.get("token") ?? "";

  // 404 de propósito: não revela que a rota existe.
  if (!ownerToken || !isValidToken(token, ownerToken)) {
    return new Response(null, { status: 404 });
  }

  const response = NextResponse.redirect(new URL("/", request.url));

  if (request.nextUrl.searchParams.get("off") === "1") {
    response.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  } else {
    response.cookies.set(COOKIE_NAME, "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
  }

  return response;
}
