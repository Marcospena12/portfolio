"use client";

import { useState } from "react";
import Image from "next/image";
import { CHAT_AVATAR_ALT, CHAT_AVATAR_SRC } from "./config";

/**
 * Avatar do header do chat.
 * Usa a imagem de `public/chat/avatar.png` (definida em ./config.ts);
 * se ela ainda não existir, mostra as iniciais como fallback.
 */
export function ChatAvatar() {
  const [failed, setFailed] = useState(false);
  const showImage = CHAT_AVATAR_SRC && !failed;

  if (showImage) {
    return (
      <Image
        src={CHAT_AVATAR_SRC}
        alt={CHAT_AVATAR_ALT}
        width={40}
        height={40}
        onError={() => setFailed(true)}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    );
  }

  // Fallback: iniciais do nome enquanto a imagem não é definida.
  return (
    <div
      aria-label={CHAT_AVATAR_ALT}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-semibold text-black dark:bg-sky-400"
    >
      {CHAT_AVATAR_ALT.trim().slice(0, 2).toUpperCase()}
    </div>
  );
}
