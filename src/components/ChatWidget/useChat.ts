"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Message } from "./types";

export interface UseChatReturn {
  messages: Message[];
  isTyping: boolean;
  sendMessage: (content: string) => Promise<void>;
  retryLast: (() => Promise<void>) | null;
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
 * Envia o histórico para `POST /api/chat` (Gemini) e renderiza a resposta.
 * Em caso de falha, cria uma mensagem `kind: "error"` com botão de retry.
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

  // Guarda o AbortController da requisição ativa (limpa no unmount).
  const abortRef = useRef<AbortController | null>(null);
  // Timeout da requisição: o backend faz retry + fallback de modelo e pode
  // demorar; sem isso o indicador "Pensando..." ficaria travado.
  const requestTimeoutMs = 60_000;
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  // Última mensagem do usuário — usada pelo retry quando a resposta falha.
  const lastUserMessageRef = useRef<string | null>(null);
  // Histórico mais recente, para não depender do closure do setState.
  const messagesRef = useRef<Message[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const requestReply = useCallback(
    async (history: Message[]) => {
      const controller = new AbortController();
      abortRef.current = controller;
      setIsTyping(true);

      // Garante que a bolha "Pensando..." desliga mesmo se a API demorar.
      let timedOut = false;
      const timeout = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, requestTimeoutMs);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history
              .filter((m) => m.kind !== "welcome" && m.kind !== "error")
              .map((m) => ({ role: m.role, content: m.content })),
          }),
          signal: controller.signal,
        });

        const data: unknown = await res.json().catch(() => null);
        if (!res.ok) {
          const payload = data as { error?: string; code?: string } | null;
          // Traduz localmente os erros conhecidos (i18n); senão usa o texto
          // que veio da API.
          const message =
            payload?.code === "busy"
              ? t.chat.busy
              : payload?.code === "no_provider"
                ? t.chat.error
                : payload?.error ?? t.chat.error;
          throw new Error(message);
        }

        const content = (data as { message?: { content?: string } })?.message
          ?.content;
        if (!content) throw new Error(t.chat.error);

        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            role: "assistant",
            content,
            timestamp: new Date(),
          },
        ]);
      } catch (error) {
        // Abort por unmount: silencioso. Abort por timeout: mostra o erro.
        if (controller.signal.aborted && !timedOut) return;
        console.error("[chat] falha na requisição:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            role: "assistant",
            content:
              timedOut
                ? t.chat.error
                : error instanceof Error && error.message !== "Failed to fetch"
                  ? error.message
                  : t.chat.error,
            kind: "error",
            timestamp: new Date(),
          },
        ]);
      } finally {
        clearTimeout(timeout);
        if (abortRef.current === controller) abortRef.current = null;
        setIsTyping(false);
      }
    },
    [t.chat.error, t.chat.busy],
  );

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
      lastUserMessageRef.current = trimmed;
      // Remove bolhas de erro antigas junto com o envio da nova mensagem.
      setMessages((prev) => {
        const next = [...prev.filter((m) => m.kind !== "error"), userMessage];
        messagesRef.current = next;
        return next;
      });

      const history = messagesRef.current.filter((m) => m.kind !== "error");
      await requestReply(history);
    },
    [requestReply],
  );

  const retryLast = useCallback(async () => {
    if (isTyping || !lastUserMessageRef.current) return;

    // A última msg do usuário já está no histórico (o erro vem depois dela):
    // basta remover a mensagem de erro e reenviar o mesmo histórico.
    const history = messagesRef.current.filter((m) => m.kind !== "error");
    setMessages(history);
    messagesRef.current = history;
    await requestReply(history);
  }, [isTyping, requestReply]);

  // Habilita o retry só quando a última mensagem visível é um erro.
  const lastMessage = messages[messages.length - 1];
  const retryEnabled =
    lastMessage?.kind === "error" && lastUserMessageRef.current !== null;

  const clearMessages = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    lastUserMessageRef.current = null;
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

  return {
    messages,
    isTyping,
    sendMessage,
    retryLast: retryEnabled ? retryLast : null,
    clearMessages,
  };
}
