// Tipos, constantes e geometria compartilhados do ChatWidget.

export type ChatRole = "user" | "assistant";

export type Message = {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
  /**
   * `welcome`: conteúdo resolvido na renderização (via useLanguage), muda
   * junto com o idioma (pt/en).
   * `error`: falha de requisição — renderizada em vermelho com botão de retry
   * (conteúdo já vem traduzido).
   */
  kind?: "welcome" | "error";
};

/** Estado do fluxo de conversa: `thinking` = aguardando a IA começar a
 * responder (chamada à API), `typing` = resposta em andamento. */
export type ChatStatus = "idle" | "thinking" | "typing";

export type WindowPosition = { x: number; y: number };

/**
 * Posição normalizada (0..1) dentro do espaço livre da viewport.
 * É a fonte da verdade persistida: ao redimensionar/zoom, a posição em pixels
 * é recalculada a partir do ratio, mantendo o chat no mesmo lugar proporcional.
 */
export type WindowRatio = { rx: number; ry: number };

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
/**
 * Margem inferior da bolha (e da janela). Aumente este valor para subir o
 * balão do canto — a janela acompanha para nunca sobrepor a bolha.
 */
export const LAUNCHER_BOTTOM_MARGIN = 100;
export const LAUNCHER_SIZE = 56;
export const LAUNCHER_GAP = 12;
export const MOBILE_BREAKPOINT = 640;

/** Espaço reservado abaixo da janela: margem inferior da bolha + bolha + gap. */
export const WINDOW_BOTTOM_SPACE =
  LAUNCHER_BOTTOM_MARGIN + LAUNCHER_SIZE + LAUNCHER_GAP;

/** Altura da janela: 560px, mas nunca além do espaço disponível na viewport. */
export function getWindowHeight(viewportHeight: number): number {
  return Math.min(WINDOW_HEIGHT, viewportHeight - WINDOW_BOTTOM_SPACE);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Posição inicial: ancorada acima da bolha, no canto inferior direiro. */
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
      viewport.height - LAUNCHER_SIZE - LAUNCHER_BOTTOM_MARGIN,
    ),
  };
}

// ---------------------------------------------------------------------------
// Posição normalizada (ratio): a fonte da verdade para redimensionar/zoom.
// A posição em pixels é sempre derivada de ratio + viewport atual, então
// mudar o tamanho da janela (ou o zoom do navegador) reposiciona o chat
// mantendo o lugar proporcional — sem clamp destrutivo.
// ---------------------------------------------------------------------------

/** Espaço livre para a janela se mover, em pixels.
 * Bate exatamente com os limites do drag (useDraggable): X até a borda da
 * viewport, Y reservando a faixa inferior da bolha. */
function getFreeSpace(viewport: Viewport): { maxX: number; maxY: number } {
  return {
    maxX: Math.max(0, viewport.width - WINDOW_WIDTH),
    maxY: Math.max(
      0,
      viewport.height - getWindowHeight(viewport.height) - WINDOW_BOTTOM_SPACE,
    ),
  };
}

/** Converte pixels atuais em ratio (0..1) dentro do espaço livre.
 * Quando não há espaço livre (viewport minúscula), mantém o ratio anterior —
 * assim, ao voltar o zoom, a janela retorna ao mesmo lugar. */
export function positionToRatio(
  position: WindowPosition,
  viewport: Viewport,
  prev?: WindowRatio,
): WindowRatio {
  const { maxX, maxY } = getFreeSpace(viewport);
  return {
    rx: maxX > 0 ? clamp(position.x / maxX, 0, 1) : (prev?.rx ?? 0),
    ry: maxY > 0 ? clamp(position.y / maxY, 0, 1) : (prev?.ry ?? 1),
  };
}

/** Deriva a posição em pixels a partir do ratio e da viewport atual. */
export function ratioToPosition(
  ratio: WindowRatio,
  viewport: Viewport,
): WindowPosition {
  const { maxX, maxY } = getFreeSpace(viewport);
  return {
    x: Math.round(ratio.rx * maxX),
    y: Math.round(ratio.ry * maxY),
  };
}

/**
 * Lê a posição salva. Formato novo: `{ v: 2, rx, ry }` (ratio).
 * Formato antigo: `{ x, y }` (pixels absolutos) — convertido para ratio
 * usando a viewport atual como aproximação.
 */
export function parseStoredRatio(
  raw: string | null,
  viewport: Viewport,
): WindowRatio | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const candidate = parsed as { rx?: unknown; ry?: unknown; x?: unknown; y?: unknown };

    // Formato novo (ratio).
    if (
      typeof candidate.rx === "number" &&
      Number.isFinite(candidate.rx) &&
      typeof candidate.ry === "number" &&
      Number.isFinite(candidate.ry)
    ) {
      return {
        rx: clamp(candidate.rx, 0, 1),
        ry: clamp(candidate.ry, 0, 1),
      };
    }

    // Formato antigo (pixels absolutos).
    if (
      typeof candidate.x === "number" &&
      Number.isFinite(candidate.x) &&
      typeof candidate.y === "number" &&
      Number.isFinite(candidate.y)
    ) {
      return positionToRatio(
        { x: candidate.x, y: candidate.y },
        viewport,
      );
    }
  } catch {
    // JSON inválido: ignora e volta pra posição default.
  }
  return null;
}
