"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { ChatAvatar } from "./ChatAvatar";
import { ChatMarkdown } from "./ChatMarkdown";
import type { Message } from "./types";

type ChatMessagesProps = {
  messages: Message[];
  isTyping: boolean;
  onRetry: (() => Promise<void>) | null;
};

function formatTime(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** Lista de mensagens: bubbles, timestamps, erro com retry e "pensando...". */
export function ChatMessages({ messages, isTyping, onRetry }: ChatMessagesProps) {
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
        const isError = message.kind === "error";
        return (
          <div
            key={message.id}
            className={`chat-msg-in flex flex-col ${isUser ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words ${
                isUser
                  ? "rounded-br-md bg-foreground text-background"
                  : isError
                    ? "rounded-bl-md border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                    : "rounded-bl-md border border-foreground/10 bg-foreground/5 text-foreground"
              }`}
            >
              {/* Welcome resolve ao vivo para acompanhar a troca de idioma.
                  Só a resposta da IA passa pelo markdown; user, welcome e
                  erro ficam texto puro. */}
              {message.kind === "welcome" ? (
                t.chat.welcome
              ) : isUser || isError ? (
                message.content
              ) : (
                <ChatMarkdown text={message.content} />
              )}
              {isError && onRetry && (
                <button
                  type="button"
                  onClick={() => void onRetry()}
                  className="mt-2 block w-full rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-500/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:text-red-400"
                >
                  {t.chat.retry}
                </button>
              )}
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
        <div
          className="chat-msg-in flex items-start gap-2"
          aria-label={t.chat.thinking}
        >
          <ChatAvatar size={28} />
          <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-foreground/10 bg-foreground/5 px-3.5 py-2.5">
            <span className="text-sm text-foreground/60">{t.chat.thinking}</span>
            <span className="flex items-end gap-1 pb-0.5" aria-hidden="true">
              <span className="chat-dot h-1.5 w-1.5 rounded-full bg-foreground/60" />
              <span className="chat-dot h-1.5 w-1.5 rounded-full bg-foreground/60" />
              <span className="chat-dot h-1.5 w-1.5 rounded-full bg-foreground/60" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
