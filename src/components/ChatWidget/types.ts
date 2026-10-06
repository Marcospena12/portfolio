// Tipos, constantes e geometria compartilhados do ChatWidget.

export type ChatRole = "user" | "assistant";

export type Message = {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
  /**
   * Marca a mensagem de boas-vindas: o conteúdo é resolvido na hora da
   * renderização (via useLanguage), assim ela muda junto com o idioma (pt/en).
   */
  kind?: "welcome";
};

/** Estado do fluxo de conversa (útil hoje no mock e na integração futura). */
export type ChatStatus = "idle" | "typing";

export type WindowPosition = { x: number; y: number };

export type Viewport = { width: number; height: number };

/** Chaves de persistência no localStorage. */
export const STORAGE_KEYS = {
  open: "chat.open",
  position: "chat.pos",
} as const;

// ---------------------------------------------------------------------------
// Geometria do widget (fonte única de verdade: janela, launcher e drag usam
// as mesmas contas para nunca divergirem)
// ---------------------------------------------------------------------------

export const WINDOW_WIDTH = 380;
export const WINDOW_HEIGHT = 560;
export const WINDOW_MARGIN = 24;
export const LAUNCHER_SIZE = 56;
export const LAUNCHER_GAP = 12;
export const MOBILE_BREAKPOINT = 640;

/** Espaço reservado abaixo da janela: margem + bolha + gap. */
export const WINDOW_BOTTOM_SPACE = WINDOW_MARGIN + LAUNCHER_SIZE + LAUNCHER_GAP;

/** Altura da janela: 560px, mas nunca além do espaço disponível na viewport. */
export function getWindowHeight(viewportHeight: number): number {
  return Math.min(WINDOW_HEIGHT, viewportHeight - WINDOW_BOTTOM_SPACE);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Mantém a janela inteira dentro da viewport, reservando a faixa inferior
 * onde a bolha fica (margem + bolha + gap) para ela nunca se sobrepor. */
export function clampPosition(
  position: WindowPosition,
  viewport: Viewport,
): WindowPosition {
  const yMax = Math.max(
    0,
    viewport.height - getWindowHeight(viewport.height) - WINDOW_BOTTOM_SPACE,
  );
  return {
    x: clamp(position.x, 0, Math.max(0, viewport.width - WINDOW_WIDTH)),
    y: clamp(position.y, 0, yMax),
  };
}

/** Posição inicial: ancorada acima da bolha, no canto inferior direito. */
export function getDefaultWindowPosition(viewport: Viewport): WindowPosition {
  return {
    x: viewport.width - WINDOW_WIDTH - WINDOW_MARGIN,
    y: viewport.height - getWindowHeight(viewport.height) - WINDOW_BOTTOM_SPACE,
  };
}

/**
 * A bolha é derivada da posição da janela (canto inferior direiro + gap).
 * Com a posição default, isso cai exatamente em bottom-6 right-6 — e ao
 * arrastar, a bolha acompanha a janela sem estados extras.
 */
export function getLauncherPosition(
  windowPosition: WindowPosition,
  viewport: Viewport,
): WindowPosition {
  const windowHeight = getWindowHeight(viewport.height);
  return {
    x: clamp(
      windowPosition.x + WINDOW_WIDTH - LAUNCHER_SIZE,
      WINDOW_MARGIN,
      viewport.width - LAUNCHER_SIZE - WINDOW_MARGIN,
    ),
    y: clamp(
      windowPosition.y + windowHeight + LAUNCHER_GAP,
      WINDOW_MARGIN,
      viewport.height - LAUNCHER_SIZE - WINDOW_MARGIN,
    ),
  };
}

/** Lê a posição salva, validando o shape (nunca confie no localStorage). */
export function parseStoredPosition(raw: string | null): WindowPosition | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as WindowPosition).x === "number" &&
      typeof (parsed as WindowPosition).y === "number" &&
      Number.isFinite((parsed as WindowPosition).x) &&
      Number.isFinite((parsed as WindowPosition).y)
    ) {
      return parsed as WindowPosition;
    }
  } catch {
    // JSON inválido: ignora e volta pra posição default.
  }
  return null;
}
