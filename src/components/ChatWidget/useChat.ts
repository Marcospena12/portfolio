"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { STORAGE_KEYS, type Message, type MessageModel } from "./types";

export interface UseChatReturn {
  messages: Message[];
  isTyping: boolean;
  /**
   * Quantidade de mensagens já presentes na hidratação (welcome + conversa
   * salva). Usado pelo badge de não-lidas para não contar histórico antigo.
   */
  loadedCount: number;
  sendMessage: (content: string) => Promise<void>;
  retryLast: (() => Promise<void>) | null;
  clearMessages: () => void;
}

/** Mesmo limite do backend: histórico além disso é descartado no servidor. */
const MAX_STORED_MESSAGES = 40;

let counter = 0;
function createId(): string {
  counter += 1;
  return `msg-${Date.now()}-${counter}`;
}

function parseMessageModel(raw: unknown): MessageModel | undefined {
  if (typeof raw !== "object" || raw === null) return undefined;
  const { label, id, provider } = raw as { label?: unknown; id?: unknown; provider?: unknown };
  if (typeof label !== "string" || label.length === 0) return undefined;
  return {
    label,
    ...(typeof id === "string" ? { id } : {}),
    ...(typeof provider === "string" ? { provider } : {}),
  };
}

/** Lê a conversa persistida; qualquer formato inválido volta `null`. */
function parseStoredMessages(raw: string | null): Message[] | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const { v, messages } = parsed as { v?: unknown; messages?: unknown };
    if (v !== 1 || !Array.isArray(messages)) return null;

    const result: Message[] = [];
    for (const item of messages) {
      if (typeof item !== "object" || item === null) continue;
      const { role, content, timestamp, model } = item as {
        role?: unknown;
        content?: unknown;
        timestamp?: unknown;
        model?: unknown;
      };
      if (role !== "user" && role !== "assistant") continue;
      if (typeof content !== "string" || content.trim().length === 0) continue;
      if (typeof timestamp !== "string") continue;
      const time = new Date(timestamp);
      if (Number.isNaN(time.getTime())) continue;

      const parsedModel = parseMessageModel(model);
      result.push({
        id: createId(),
        role,
        content,
        timestamp: time,
        ...(parsedModel ? { model: parsedModel } : {}),
      });
    }
    return result.slice(-MAX_STORED_MESSAGES);
  } catch {
    return null;
  }
}

/**
 * Gerencia o estado da conversa.
 *
 * Envia o histórico para `POST /api/chat` (agente com tools e fallback de
 * providers) e renderiza a resposta.
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

  // Quantidade inicial de mensagens (welcome + histórico salvo) e flag de
  // hidratação: a persistência só começa depois de ler o localStorage.
  const [loadedCount, setLoadedCount] = useState(1);
  const [isHydrated, setIsHydrated] = useState(false);
  const hydratedRef = useRef(false);

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

  // Restaura a conversa salva uma única vez, pós-hidratação. O welcome fica
  // de fora da persistência: o conteúdo dele acompanha o idioma.
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    const stored = parseStoredMessages(localStorage.getItem(STORAGE_KEYS.messages));
    if (stored && stored.length > 0) {
      setMessages((prev) => [...prev, ...stored]);
      setLoadedCount(1 + stored.length);
    }
    setIsHydrated(true);
  }, []);

  // Persiste as mensagens (sem welcome nem erros) a cada mudança.
  useEffect(() => {
    if (!isHydrated) return;

    const stored = messages
      .filter((message) => message.kind !== "welcome" && message.kind !== "error")
      .map((message) => ({
        role: message.role,
        content: message.content,
        timestamp: message.timestamp.toISOString(),
        ...(message.model ? { model: message.model } : {}),
      }))
      .slice(-MAX_STORED_MESSAGES);

    if (stored.length === 0) {
      localStorage.removeItem(STORAGE_KEYS.messages);
      return;
    }
    localStorage.setItem(
      STORAGE_KEYS.messages,
      JSON.stringify({ v: 1, messages: stored }),
    );
  }, [messages, isHydrated]);

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

        const data = (await res.json().catch(() => null)) as {
          message?: { content?: string };
          model?: unknown;
          error?: string;
          code?: string;
        } | null;
        if (!res.ok) {
          // Traduz localmente os erros conhecidos (i18n); senão usa o texto
          // que veio da API.
          const message =
            data?.code === "busy"
              ? t.chat.busy
              : data?.code === "no_provider"
                ? t.chat.error
                : data?.error ?? t.chat.error;
          throw new Error(message);
        }

        const content = data?.message?.content;
        if (!content) throw new Error(t.chat.error);
        const model = parseMessageModel(data?.model);

        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            role: "assistant",
            content,
            timestamp: new Date(),
            ...(model ? { model } : {}),
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
    localStorage.removeItem(STORAGE_KEYS.messages);
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
    loadedCount,
    sendMessage,
    retryLast: retryEnabled ? retryLast : null,
    clearMessages,
  };
}
