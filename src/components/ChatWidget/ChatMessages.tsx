"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Message } from "./types";

type ChatMessagesProps = {
  messages: Message[];
  isTyping: boolean;
};

function formatTime(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** Lista de mensagens: bubbles, timestamps e indicador de "digitando...". */
export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  const { locale, t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para a última mensagem.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
      role="log"
      aria-live="polite"
    >
      {messages.map((message) => {
        const isUser = message.role === "user";
        return (
          <div
            key={message.id}
            className={`chat-msg-in flex flex-col ${isUser ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words ${
                isUser
                  ? "rounded-br-md bg-foreground text-background"
                  : "rounded-bl-md border border-foreground/10 bg-foreground/5 text-foreground"
              }`}
            >
              {/* Welcome resolve ao vivo para acompanhar a troca de idioma */}
              {message.kind === "welcome" ? t.chat.welcome : message.content}
            </div>
            <time
              dateTime={message.timestamp.toISOString()}
              className="mt-1 px-1 text-[10px] text-foreground/40"
            >
              {formatTime(message.timestamp, locale)}
            </time>
          </div>
        );
      })}

      {isTyping && (
        <div className="flex items-start" aria-label={t.chat.typing}>
          <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-foreground/10 bg-foreground/5 px-4 py-3.5">
            <span className="chat-dot h-1.5 w-1.5 rounded-full bg-foreground/60" />
            <span className="chat-dot h-1.5 w-1.5 rounded-full bg-foreground/60" />
            <span className="chat-dot h-1.5 w-1.5 rounded-full bg-foreground/60" />
          </div>
        </div>
      )}
    </div>
  );
}
