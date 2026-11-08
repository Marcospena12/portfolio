"use client";

import { useEffect, type RefObject } from "react";

type PointerState = {
  px: number;
  py: number;
  cx: number;
  cy: number;
};

function viewportCenter(): PointerState {
  return {
    px: 0,
    py: 0,
    cx: window.innerWidth / 2,
    cy: window.innerHeight / 2,
  };
}

export function useScenePointer<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let attached = false;
    let target = viewportCenter();
    let current = { ...target };

    const apply = () => {
      root.style.setProperty("--scene-px", current.px.toFixed(4));
      root.style.setProperty("--scene-py", current.py.toFixed(4));
      root.style.setProperty("--scene-cursor-x", `${current.cx.toFixed(1)}px`);
      root.style.setProperty("--scene-cursor-y", `${current.cy.toFixed(1)}px`);
    };

    const tick = () => {
      const ease = 0.085;
      current.px += (target.px - current.px) * ease;
      current.py += (target.py - current.py) * ease;
      current.cx += (target.cx - current.cx) * ease;
      current.cy += (target.cy - current.cy) * ease;
      apply();

      const settled =
        Math.abs(target.px - current.px) < 0.0005 &&
        Math.abs(target.py - current.py) < 0.0005 &&
        Math.abs(target.cx - current.cx) < 0.5 &&
        Math.abs(target.cy - current.cy) < 0.5;

      if (settled) {
        raf = 0;
        return;
      }

      raf = window.requestAnimationFrame(tick);
    };

    const ensureLoop = () => {
      if (!raf) raf = window.requestAnimationFrame(tick);
    };

    const moveTarget = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      target = {
        px: (event.clientX / window.innerWidth) * 2 - 1,
        py: (event.clientY / window.innerHeight) * 2 - 1,
        cx: event.clientX,
        cy: event.clientY,
      };
      ensureLoop();
    };

    const resetTarget = () => {
      target = viewportCenter();
      ensureLoop();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(raf);
        raf = 0;
        return;
      }
      ensureLoop();
    };

    const attach = () => {
      if (attached) return;
      attached = true;
      target = viewportCenter();
      current = { ...target };
      apply();
      root.dataset.sceneInteractive = "true";
      window.addEventListener("pointermove", moveTarget, { passive: true });
      document.documentElement.addEventListener("pointerleave", resetTarget);
      document.addEventListener("visibilitychange", handleVisibility);
    };

    const detach = () => {
      if (!attached) return;
      attached = false;
      window.cancelAnimationFrame(raf);
      raf = 0;
      delete root.dataset.sceneInteractive;
      window.removeEventListener("pointermove", moveTarget);
      document.documentElement.removeEventListener("pointerleave", resetTarget);
      document.removeEventListener("visibilitychange", handleVisibility);
      root.style.removeProperty("--scene-px");
      root.style.removeProperty("--scene-py");
      root.style.removeProperty("--scene-cursor-x");
      root.style.removeProperty("--scene-cursor-y");
    };

    const sync = () => {
      if (finePointer.matches && !reducedMotion.matches) attach();
      else detach();
    };

    sync();
    finePointer.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);

    return () => {
      detach();
      finePointer.removeEventListener("change", sync);
      reducedMotion.removeEventListener("change", sync);
    };
  }, [ref]);
}
