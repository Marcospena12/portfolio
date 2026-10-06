"use client";

import { useState } from "react";
import Image from "next/image";
import { CHAT_AVATAR_ALT, CHAT_AVATAR_SRC } from "./config";

type ChatAvatarProps = {
  /** Tamanho em px (padrão 40, usado no header). */
  size?: number;
};

/**
 * Avatar do chat (header e indicador "pensando...").
 * Usa a imagem de `public/chat/avatar.png` (definida em ./config.ts);
 * se ela ainda não existir, mostra as iniciais como fallback.
 */
export function ChatAvatar({ size = 40 }: ChatAvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = CHAT_AVATAR_SRC && !failed;

  if (showImage) {
    return (
      <Image
        src={CHAT_AVATAR_SRC}
        alt={CHAT_AVATAR_ALT}
        width={size}
        height={size}
        onError={() => setFailed(true)}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  // Fallback: iniciais do nome enquanto a imagem não é definida.
  return (
    <div
      aria-label={CHAT_AVATAR_ALT}
      className="flex shrink-0 items-center justify-center rounded-full bg-amber-500 font-semibold text-black dark:bg-sky-400"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.35) }}
    >
      {CHAT_AVATAR_ALT.trim().slice(0, 2).toUpperCase()}
    </div>
  );
}
