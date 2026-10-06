"use client";

import { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useLanguage } from "@/components/LanguageProvider";

type ChatInputProps = {
  onSend: (content: string) => void | Promise<void>;
  /** Desabilita o envio enquanto o bot está "digitando". */
  disabled?: boolean;
};

const MAX_ROWS = 4;
const ROW_HEIGHT_PX = 24; // lineHeight aproximado do textarea

/** Input de texto: Enter envia, Shift+Enter quebra linha, auto-resize até 4 linhas. */
export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const { t } = useLanguage();
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize: cresce com o conteúdo até MAX_ROWS linhas.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const maxHeight = MAX_ROWS * ROW_HEIGHT_PX;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [value]);

  // Foco no input assim que a janela abre.
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    void onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter envia; Shift+Enter quebra linha.
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  return (
    <form
      className="flex items-end gap-2 border-t border-foreground/10 p-3"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t.chat.placeholder}
        aria-label={t.chat.placeholder}
        className="max-h-24 min-h-[44px] flex-1 resize-none rounded-xl border border-foreground/10 bg-foreground/5 px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-foreground/30"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label={t.chat.send}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-black transition-all duration-200 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-40 dark:bg-sky-400"
      >
        <FaPaperPlane className="text-sm" />
      </button>
    </form>
  );
}
