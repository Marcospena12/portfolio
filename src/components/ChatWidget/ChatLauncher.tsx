"use client";

import { FaTimes } from "react-icons/fa";
import { useLanguage } from "@/components/LanguageProvider";
import { LAUNCHER_SIZE, WINDOW_MARGIN, type WindowPosition } from "./types";

type ChatLauncherProps = {
  open: boolean;
  onToggle: () => void;
  /** Posição derivada da janela (desktop); null = canto fixo (mobile). */
  position: WindowPosition | null;
  /** Mensagens não lidas com a janela fechada. */
  unreadCount: number;
  /** Durante o drag a bolha segue a janela sem transição (sem atraso). */
  isDragging?: boolean;
};

/** Bolha flutuante no canto inferior direito — alterna chat/X. */
export function ChatLauncher({
  open,
  onToggle,
  position,
  unreadCount,
  isDragging = false,
}: ChatLauncherProps) {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={open ? t.chat.close : t.chat.open}
      aria-expanded={open}
      aria-haspopup="dialog"
      className="group fixed z-50 flex items-center justify-center rounded-full bg-amber-500 text-black shadow-lg duration-200 ease-out hover:scale-105 active:scale-95 dark:bg-sky-400"
      style={{
        // Posição: canto fixo no mobile, derivada da janela no desktop.
        ...(position
          ? { left: position.x, top: position.y, width: LAUNCHER_SIZE, height: LAUNCHER_SIZE }
          : { right: WINDOW_MARGIN, bottom: WINDOW_MARGIN, width: LAUNCHER_SIZE, height: LAUNCHER_SIZE }),
        // Suaviza o movimento quando a janela é arrastada; sem transição
        // durante o próprio drag para a bolha seguir 1:1.
        transition: isDragging
          ? "transform 200ms ease-out, opacity 200ms ease-out"
          : "transform 200ms ease-out, opacity 200ms ease-out, left 200ms ease-out, top 200ms ease-out",
      }}
    >
      {open ? (
        <FaTimes className="text-lg transition-transform duration-200 group-hover:rotate-90" />
      ) : (
        <ChatIcon />
      )}

      {!open && unreadCount > 0 && (
        <span
          className="chat-badge-pop absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white"
          aria-label={`${unreadCount} ${t.chat.unread}`}
        >
          {unreadCount}
        </span>
      )}
    </button>
  );
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
