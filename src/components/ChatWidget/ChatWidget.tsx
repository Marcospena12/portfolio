"use client";

import { useCallback, useEffect, useState } from "react";
import { ChatLauncher } from "./ChatLauncher";
import { ChatWindow } from "./ChatWindow";
import { useChat } from "./useChat";
import { useDraggable } from "./useDraggable";
import { useIsMobile } from "./useIsMobile";
import {
  WINDOW_BOTTOM_SPACE,
  WINDOW_WIDTH,
  STORAGE_KEYS,
  getDefaultWindowPosition,
  getLauncherPosition,
  getWindowHeight,
  parseStoredRatio,
  positionToRatio,
  ratioToPosition,
  type Viewport,
  type WindowPosition,
  type WindowRatio,
} from "./types";
import "./chat-widget.css";

/**
 * Orquestrador do widget de chat.
 * Responsável por: aberto/fechado (persistido), posição da janela (persistida
 * pelo useDraggable), mobile, badge de não-lidas, Esc e scroll-lock.
 *
 * A posição é mantida como RATIO (0..1 dentro do espaço livre da viewport):
 * ao redimensionar a janela ou mudar o zoom do navegador, os pixels são
 * derivados do ratio + viewport atual — o chat se reposiciona sozinho e
 * mantém o lugar proporcional (sem clamp destrutivo).
 *
 * A conversa em si vive em `useChat` — único ponto de troca para o backend/IA.
 */
export function ChatWidget() {
  const isMobile = useIsMobile();

  // Abertura e posição iniciam "vazias" para bater com o SSR (anti-flash de
  // hidratação); um único efeito lê o localStorage e aplica tudo junto.
  const [open, setOpen] = useState(false);
  const [ratio, setRatio] = useState<WindowRatio | null>(null);
  const [viewport, setViewport] = useState<Viewport | null>(null);

  const { messages, isTyping, sendMessage, retryLast } = useChat();

  // Quantidade de mensagens vistas por último com a janela aberta
  // (atualizada nos handlers de abrir/fechar — fonte do badge de não-lidas).
  const [lastSeen, setLastSeen] = useState(0);

  // Restaura abertura + posição (uma única vez, pós-hidratação).
  useEffect(() => {
    const current: Viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const stored = parseStoredRatio(
      localStorage.getItem(STORAGE_KEYS.position),
      current,
    );
    const restored =
      stored ?? positionToRatio(getDefaultWindowPosition(current), current);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViewport(current);
    setRatio(restored);
    setOpen(localStorage.getItem(STORAGE_KEYS.open) === "true");
  }, []);

  // Persiste aberto/fechado (após a hidratação).
  useEffect(() => {
    if (ratio === null) return;
    localStorage.setItem(STORAGE_KEYS.open, String(open));
  }, [open, ratio]);

  const handlePositionChange = useCallback(
    (next: WindowPosition) => {
      if (!viewport) return;
      // Pixels do drag viram ratio (com fallback à posição anterior quando não
      // há espaço livre — assim o lugar é preservado ao voltar o zoom).
      setRatio((prev) => positionToRatio(next, viewport, prev ?? undefined));
    },
    [viewport],
  );

  const handleCommit = useCallback(
    (next: WindowPosition) => {
      if (!viewport) return;
      // Persiste só no pointerup (fim do arraste), não a cada frame.
      const saved = positionToRatio(next, viewport);
      localStorage.setItem(
        STORAGE_KEYS.position,
        JSON.stringify({ v: 2, rx: saved.rx, ry: saved.ry }),
      );
    },
    [viewport],
  );

  const { isDragging, handleRef } = useDraggable({
    position: (viewport && ratio ? ratioToPosition(ratio, viewport) : null) ?? {
      x: 0,
      y: 0,
    },
    onPositionChange: handlePositionChange,
    onCommit: handleCommit,
    bounds: {
      width: WINDOW_WIDTH,
      height:
        isMobile && viewport
          ? viewport.height
          : getWindowHeight(viewport?.height ?? 0) + WINDOW_BOTTOM_SPACE,
    },
    viewport: viewport ?? { width: 0, height: 0 },
    disabled: isMobile || !open,
  });

  // Em redimensionamentos/zoom da viewport, atualiza as dimensões — a
  // posição em pixels é recalculada na renderização a partir do ratio.
  // Ativo mesmo com a janela fechada, para a bolha derivada nunca sair da tela.
  useEffect(() => {
    if (isMobile) return;
    function syncViewport() {
      const current: Viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      setViewport((prev) =>
        prev && prev.width === current.width && prev.height === current.height
          ? prev
          : current,
      );
    }
    // Sincroniza ao anexar (cobram trocas mobile→desktop sem novo resize).
    syncViewport();
    // visualViewport cobre zoom por pinça/touch e mudanças da UI do navegador
    // que não disparam o resize normal da window.
    window.addEventListener("resize", syncViewport);
    window.visualViewport?.addEventListener("resize", syncViewport);
    return () => {
      window.removeEventListener("resize", syncViewport);
      window.visualViewport?.removeEventListener("resize", syncViewport);
    };
  }, [isMobile]);

  // Badge derivado no render: mensagens do assistente que chegaram com a
  // janela fechada desde a última vez que foi vista (boas-vindas não conta).
  const unreadCount =
    open || messages.length <= lastSeen
      ? 0
      : messages
          .slice(lastSeen)
          .filter(
            (message) =>
              message.role === "assistant" &&
              message.kind !== "welcome" &&
              message.kind !== "error",
          )
          .length;

  // Abre/marca como visto ao abrir; fecha marcando tudo como visto.
  const handleToggle = useCallback(() => {
    if (!open) setLastSeen(messages.length);
    setOpen((prev) => !prev);
  }, [open, messages.length]);

  const handleClose = useCallback(() => {
    setLastSeen(messages.length);
    setOpen(false);
  }, [messages.length]);

  // Esc fecha a janela (mesmo caminho do botão: marca como visto).
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  // Bloqueia o scroll da página quando aberto em mobile.
  useEffect(() => {
    if (!open || !isMobile) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, isMobile]);

  // Ainda não hidratou: não renderiza (evita flash da posição default).
  if (ratio === null || viewport === null) return null;

  // Posição em pixels: sempre derivada do ratio + viewport atual.
  const position = ratioToPosition(ratio, viewport);

  // Launcher acompanha a janela no desktop; no mobile fica fixo no canto.
  const launcherPosition = isMobile ? null : getLauncherPosition(position, viewport);

  return (
    <>
      <ChatLauncher
        open={open}
        onToggle={handleToggle}
        position={launcherPosition}
        unreadCount={unreadCount}
        isDragging={isDragging}
      />
      <ChatWindow
        open={open}
        messages={messages}
        isTyping={isTyping}
        position={position}
        isDragging={isDragging}
        isMobile={isMobile}
        handleRef={handleRef}
        onSend={sendMessage}
        onRetry={retryLast}
        onMinimize={handleClose}
        onClose={handleClose}
      />
    </>
  );
}
