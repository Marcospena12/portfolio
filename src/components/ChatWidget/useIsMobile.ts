"use client";

import { useEffect, useState } from "react";
import { MOBILE_BREAKPOINT } from "./types";

/**
 * Media query de mobile (< 640px). Inicia `false` no servidor para não
 * divergir da hidratação; corrige no primeiro efeito.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(query.matches);

    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
