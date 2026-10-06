"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Message } from "./types";

export interface UseChatReturn {
  messages: Message[];
  isTyping: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

let counter = 0;
function createId(): string {
  counter += 1;
  return `msg-${Date.now()}-${counter}`;
}

/**
 * Gerencia o estado da conversa.
 *
 * Hoje é um MOCK (resposta genérica após ~1s). Para integrar com o backend/IA
 * depois, basta trocar o corpo de `sendMessage` pelo fetch — a assinatura e
 * todo o UI permanecem iguais.
 */
export function useChat(): UseChatReturn {
  const { t } = useLanguage();
  const [isTyping, setIsTyping] = useState(false);

  // Mensagem de boas-vindas: `kind: "welcome"` faz o conteúdo ser resolvido
  // na renderização, então ela acompanha a troca de idioma (pt/en).
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: t.chat.welcome,
      kind: "welcome",
      timestamp: new Date(),
    },
  ]);

  // Guarda o timeout para limpar no unmount (evita setState após unmount).
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const userMessage: Message = {
        id: createId(),
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // ---------------------------------------------------------------
      // TODO: substituir por chamada real de IA/backend, ex.:
      //
      //   const res = await fetch("/api/chat", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ messages: [...messages, userMessage] }),
      //   });
      //   const data = await res.json();
      //   setMessages((prev) => [...prev, { id: createId(), role: "assistant", ... }]);
      //
      // Enquanto isso: mock com "digitando..." e resposta genérica.
      // ---------------------------------------------------------------
      setIsTyping(true);
      await new Promise<void>((resolve) => {
        timeoutRef.current = setTimeout(() => {
          const reply: Message = {
            id: createId(),
            role: "assistant",
            content: t.chat.mockReply,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, reply]);
          setIsTyping(false);
          timeoutRef.current = null;
          resolve();
        }, 1000);
      });
    },
    [t.chat.mockReply],
  );

  const clearMessages = useCallback(() => {
    // Volta ao estado inicial: apenas a mensagem de boas-vindas.
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: t.chat.welcome,
        kind: "welcome",
        timestamp: new Date(),
      },
    ]);
    setIsTyping(false);
  }, [t.chat.welcome]);

  return { messages, isTyping, sendMessage, clearMessages };
}
