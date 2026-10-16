"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "visit-notified";

// Avisa o servidor na primeira página da sessão. O sessionStorage garante uma
// notificação por aba; qualquer falha é silenciosa de propósito.
export function VisitNotifier() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      return;
    }

    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
        language: navigator.language,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
