"use client";

import { type RefObject } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { useLanguage } from "@/components/LanguageProvider";
import {
  WINDOW_BOTTOM_SPACE,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  type Message,
} from "./types";

type ChatWindowProps = {
  open: boolean;
  messages: Message[];
  isTyping: boolean;
  position: { x: number; y: number };
  isDragging: boolean;
  isMobile: boolean;
  handleRef: RefObject<HTMLElement | null>;
  onSend: (content: string) => void | Promise<void>;
  onRetry: (() => Promise<void>) | null;
  onMinimize: () => void;
  onClose: () => void;
};

/** Janela de chat: animação scale+fade, arrastável pelo header. */
export function ChatWindow({
  open,
  messages,
  isTyping,
  position,
  isDragging,
  isMobile,
  handleRef,
  onSend,
  onRetry,
  onMinimize,
  onClose,
}: ChatWindowProps) {
  const { t } = useLanguage();
  if (!open) return null;

  // Mobile: tela cheia, sem posição/drag.
  const style: React.CSSProperties = isMobile
    ? { inset: 0 }
    : {
        left: position.x,
        top: position.y,
        width: WINDOW_WIDTH,
        // Bate com getWindowHeight(): 560px ou o espaço que sobra na viewport,
        // sempre deixando a faixa inferior para a bolha.
        height: `min(${WINDOW_HEIGHT}px, calc(100dvh - ${WINDOW_BOTTOM_SPACE}px))`,
        // Sem transição durante o drag para o movimento seguir o ponteiro 1:1.
        transition: isDragging ? "none" : "left 200ms ease-out, top 200ms ease-out",
      };

  return (
    <div
      role="dialog"
      aria-label={t.chat.title}
      aria-modal="false"
      className={`fixed z-50 flex flex-col overflow-hidden rounded-[20px] border border-foreground/10 bg-background shadow-xl ${
        isMobile
          ? "chat-window-mobile-in rounded-none"
          : "chat-window-in"
      }`}
      style={style}
    >
      <ChatHeader handleRef={handleRef} onMinimize={onMinimize} onClose={onClose} draggable={!isMobile} />
      <ChatMessages messages={messages} isTyping={isTyping} onRetry={onRetry} />
      <ChatInput onSend={onSend} disabled={isTyping} />
    </div>
  );
}
