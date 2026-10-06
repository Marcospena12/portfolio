"use client";

import { useCallback, useEffect, useState } from "react";
import { ChatLauncher } from "./ChatLauncher";
import { ChatWindow } from "./ChatWindow";
import { useChat } from "./useChat";
import { useDraggable } from "./useDraggable";
import { useIsMobile } from "./useIsMobile";
import {
  WINDOW_WIDTH,
  STORAGE_KEYS,
  clampPosition,
  getDefaultWindowPosition,
  getLauncherPosition,
  getWindowHeight,
  parseStoredPosition,
  type Viewport,
  type WindowPosition,
} from "./types";
import "./chat-widget.css";

/**
 * Orquestrador do widget de chat.
 * Responsável por: aberto/fechado (persistido), posição da janela (persistida
 * pelo useDraggable), mobile, badge de não-lidas, Esc e scroll-lock.
 *
 * A conversa em si vive em `useChat` — único ponto de troca para o backend/IA.
 */
export function ChatWidget() {
  const isMobile = useIsMobile();

  // Abertura e posição iniciam "vazias" para bater com o SSR (anti-flash de
  // hidratação); um único efeito lê o localStorage e aplica tudo junto.
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<WindowPosition | null>(null);
  const [viewport, setViewport] = useState<Viewport | null>(null);

  const { messages, isTyping, sendMessage } = useChat();

  // Quantidade de mensagens vistas por último com a janela aberta
  // (atualizada nos handlers de abrir/fechar — fonte do badge de não-lidas).
  const [lastSeen, setLastSeen] = useState(0);

  // Restaura abertura + posição (uma única vez, pós-hidratação).
  useEffect(() => {
    const current: Viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const saved = parseStoredPosition(localStorage.getItem(STORAGE_KEYS.position));
    const restored = saved
      ? clampPosition(saved, current)
      : getDefaultWindowPosition(current);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViewport(current);
    setPosition(restored);
    setOpen(localStorage.getItem(STORAGE_KEYS.open) === "true");
  }, []);

  // Persiste aberto/fechado (após a hidratação).
  useEffect(() => {
    if (position === null) return;
    localStorage.setItem(STORAGE_KEYS.open, String(open));
  }, [open, position]);

  const handlePositionChange = useCallback((next: WindowPosition) => {
    setPosition(next);
  }, []);

  const handleCommit = useCallback((next: WindowPosition) => {
    // Persiste só no pointerup (fim do arraste), não a cada frame.
    localStorage.setItem(STORAGE_KEYS.position, JSON.stringify(next));
  }, []);

  const { isDragging, handleRef } = useDraggable({
    position: position ?? { x: 0, y: 0 },
    onPositionChange: handlePositionChange,
    onCommit: handleCommit,
    bounds: {
      width: WINDOW_WIDTH,
      height: isMobile && viewport ? viewport.height : getWindowHeight(viewport?.height ?? 0),
    },
    viewport: viewport ?? { width: 0, height: 0 },
    disabled: isMobile || !open,
  });

  // Em redimensionamentos da viewport, realoca a janela para dentro dos
  // limites — ativo mesmo com a janela fechada, para a bolha derivada
  // nunca sair da tela.
  useEffect(() => {
    if (isMobile) return;
    function onResize() {
      const current: Viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      setViewport(current);
      setPosition((prev) => (prev ? clampPosition(prev, current) : prev));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMobile]);

  // Badge derivado no render: mensagens do assistente que chegaram com a
  // janela fechada desde a última vez que foi vista (boas-vindas não conta).
  const unreadCount =
    open || messages.length <= lastSeen
      ? 0
      : messages
          .slice(lastSeen)
          .filter((message) => message.role === "assistant" && message.kind !== "welcome")
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
  if (position === null || viewport === null) return null;

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
        onMinimize={handleClose}
        onClose={handleClose}
      />
    </>
  );
}
