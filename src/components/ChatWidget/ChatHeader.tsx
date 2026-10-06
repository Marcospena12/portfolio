"use client";

import { type RefObject } from "react";
import { FaMinus, FaTimes } from "react-icons/fa";
import { useLanguage } from "@/components/LanguageProvider";
import { ChatAvatar } from "./ChatAvatar";

type ChatHeaderProps = {
  /** Alça de arraste (só o header move a janela). */
  handleRef: RefObject<HTMLElement | null>;
  onMinimize: () => void;
  onClose: () => void;
  /** Em mobile (tela cheia) o drag fica desabilitado. */
  draggable: boolean;
};

/** Header com avatar, status e botões — também é a alça de arraste. */
export function ChatHeader({ handleRef, onMinimize, onClose, draggable }: ChatHeaderProps) {
  const { t } = useLanguage();

  return (
    <header
      ref={handleRef as RefObject<HTMLDivElement>}
      className={`flex shrink-0 items-center gap-3 border-b border-foreground/10 px-4 py-3 select-none ${
        draggable ? "cursor-grab touch-none active:cursor-grabbing" : ""
      }`}
      data-chat-drag-handle
    >
      {/* Avatar do chat — imagem definida em ChatWidget/config.ts */}
      <ChatAvatar />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{t.chat.title}</p>
        <p className="flex items-center gap-1.5 text-xs text-foreground/60">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          {t.chat.status}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onMinimize}
          aria-label={t.chat.minimize}
          className="rounded-lg p-2 text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          <FaMinus className="text-xs" />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.chat.close}
          className="rounded-lg p-2 text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          <FaTimes className="text-sm" />
        </button>
      </div>
    </header>
  );
}
