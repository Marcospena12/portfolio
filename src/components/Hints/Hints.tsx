"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import { useLanguage } from "@/components/LanguageProvider";
import { useIsMobile } from "@/components/ChatWidget/useIsMobile";
import { OPEN_CHAT_EVENT } from "@/components/ChatWidget/types";
import "./hints-theme.css";

type HintId = "nav" | "ciri";
type CardPosition = { top: number; left: number };

const SEEN_STORAGE_KEY = "portfolio.hints.seen.v1";
const NAV_TARGET = '[data-hint="nav"]';
const CHAT_TARGET = '[data-hint="chat"]';
const SHOW_DELAY_MS = 900;
const TARGET_TIMEOUT_MS = 3000;
const VIEWPORT_MARGIN = 16;
const TARGET_GAP = 12;

function readSeen(): Set<HintId> {
  try {
    const raw = window.localStorage.getItem(SEEN_STORAGE_KEY);
    if (!raw) return new Set();

    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return new Set();

    return new Set(
      value.filter((id): id is HintId => id === "nav" || id === "ciri"),
    );
  } catch {
    return new Set();
  }
}

function persistSeen(ids: HintId[]) {
  try {
    const current = readSeen();
    ids.forEach((id) => current.add(id));
    window.localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify([...current]));
  } catch {
    return;
  }
}

function waitForElement(selector: string, timeoutMs: number): Promise<Element | null> {
  return new Promise((resolve) => {
    const startedAt = Date.now();

    const check = () => {
      const element = document.querySelector(selector);
      if (element || Date.now() - startedAt >= timeoutMs) {
        resolve(element);
        return;
      }
      window.setTimeout(check, 100);
    };

    check();
  });
}

function dropTourParam() {
  const url = new URL(window.location.href);
  url.searchParams.delete("tour");
  window.history.replaceState(
    window.history.state,
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
}

export function Hints() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const [active, setActive] = useState<HintId | null>(null);
  const [position, setPosition] = useState<CardPosition | null>(null);
  const [ciriNext, setCiriNext] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const focusedRef = useRef<HintId | null>(null);
  const seenRef = useRef<Set<HintId>>(new Set());
  const ciriAvailableRef = useRef(false);
  const forcedRef = useRef(false);

  const rememberSeen = useCallback((ids: HintId[], persist: boolean) => {
    ids.forEach((id) => seenRef.current.add(id));
    if (ids.includes("ciri")) setCiriNext(false);
    if (persist) persistSeen(ids);
  }, []);

  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get("tour") === "1";
    forcedRef.current = forced;
    ciriAvailableRef.current = false;

    if (pathname !== "/" && !forced) return;

    let disposed = false;

    const start = async () => {
      await new Promise((resolve) => window.setTimeout(resolve, SHOW_DELAY_MS));
      if (disposed) return;

      const chatTarget = await waitForElement(CHAT_TARGET, TARGET_TIMEOUT_MS);
      if (disposed) return;

      const navTarget = isMobile ? null : document.querySelector(NAV_TARGET);
      const chatOpen = chatTarget?.getAttribute("aria-expanded") === "true";
      const candidates: HintId[] = [];

      if (navTarget) candidates.push("nav");
      if (chatTarget && !chatOpen) candidates.push("ciri");

      ciriAvailableRef.current = candidates.includes("ciri");

      const initialSeen = forced ? new Set<HintId>() : readSeen();
      seenRef.current = initialSeen;

      if (forced) dropTourParam();

      const nextCiri = candidates.includes("ciri") && !initialSeen.has("ciri");
      setCiriNext(nextCiri);

      const first = candidates.find((id) => !initialSeen.has(id));
      if (!first) return;

      rememberSeen([first], !forced);
      setActive(first);
    };

    void start();

    return () => {
      disposed = true;
      setActive(null);
      setPosition(null);
      setCiriNext(false);
    };
  }, [pathname, isMobile, rememberSeen]);

  const updatePosition = useCallback(() => {
    if (!active) return;

    const card = cardRef.current;
    if (!card) return;

    const target = document.querySelector(
      active === "nav" ? NAV_TARGET : CHAT_TARGET,
    );
    if (!(target instanceof HTMLElement)) {
      setActive(null);
      setPosition(null);
      return;
    }

    const targetRect = target.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const visible =
      targetRect.bottom > 0 &&
      targetRect.top < viewportHeight &&
      targetRect.right > 0 &&
      targetRect.left < viewportWidth;

    if (!visible) {
      setActive(null);
      setPosition(null);
      return;
    }

    const maxLeft = Math.max(
      VIEWPORT_MARGIN,
      viewportWidth - cardRect.width - VIEWPORT_MARGIN,
    );
    const maxTop = Math.max(
      VIEWPORT_MARGIN,
      viewportHeight - cardRect.height - VIEWPORT_MARGIN,
    );

    let top = 0;
    let left = 0;

    if (active === "nav") {
      top = targetRect.bottom + TARGET_GAP;
      left = targetRect.right - cardRect.width;
    } else if (isMobile) {
      top = targetRect.top - cardRect.height - TARGET_GAP;
      left = targetRect.right - cardRect.width;
    } else {
      top = targetRect.top + targetRect.height / 2 - cardRect.height / 2;
      left = targetRect.left - cardRect.width - TARGET_GAP;

      if (left < VIEWPORT_MARGIN) {
        top = targetRect.top - cardRect.height - TARGET_GAP;
        left = targetRect.right - cardRect.width;
      }
    }

    setPosition({
      top: Math.min(Math.max(top, VIEWPORT_MARGIN), maxTop),
      left: Math.min(Math.max(left, VIEWPORT_MARGIN), maxLeft),
    });
  }, [active, isMobile]);

  useEffect(() => {
    if (!active) return;

    let frame: number | null = null;

    const schedule = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        updatePosition();
      });
    };

    schedule();
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);

    const target = document.querySelector(
      active === "nav" ? NAV_TARGET : CHAT_TARGET,
    );
    const observer = new MutationObserver(schedule);
    if (target) {
      observer.observe(target, {
        attributes: true,
        attributeFilter: ["style", "class"],
      });
      target.addEventListener("transitionend", schedule);
    }

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      target?.removeEventListener("transitionend", schedule);
      observer.disconnect();
    };
  }, [active, isMobile, t, updatePosition]);

  useEffect(() => {
    if (!active) {
      focusedRef.current = null;
      return;
    }
    if (!position || focusedRef.current === active) return;

    const frame = window.requestAnimationFrame(() => {
      focusedRef.current = active;
      primaryRef.current?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [active, position]);

  const handleDismiss = useCallback(() => {
    if (!active) return;

    const ids: HintId[] =
      active === "nav" && ciriAvailableRef.current ? ["nav", "ciri"] : [active];

    rememberSeen(ids, !forcedRef.current);
    setActive(null);
    setPosition(null);
  }, [active, rememberSeen]);

  useEffect(() => {
    if (!active) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && cardRef.current?.contains(target)) return;
      handleDismiss();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleDismiss();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active, handleDismiss]);

  const handlePrimary = useCallback(() => {
    if (active === "nav") {
      const chatOpen =
        document.querySelector(CHAT_TARGET)?.getAttribute("aria-expanded") ===
        "true";

      if (ciriNext && !chatOpen) {
        rememberSeen(["ciri"], !forcedRef.current);
        setPosition(null);
        setActive("ciri");
        return;
      }

      rememberSeen(["nav"], !forcedRef.current);
      setActive(null);
      setPosition(null);
      return;
    }

    if (active === "ciri") {
      rememberSeen(["ciri"], !forcedRef.current);
      setActive(null);
      setPosition(null);
      window.setTimeout(() => {
        window.dispatchEvent(new Event(OPEN_CHAT_EVENT));
      }, 0);
    }
  }, [active, ciriNext, rememberSeen]);

  if (!active) return null;

  const content = t.hints[active];
  const primaryLabel =
    active === "ciri"
      ? t.hints.ciri.cta
      : ciriNext
        ? t.hints.nav.next
        : t.hints.dismiss;

  return (
    <div
      ref={cardRef}
      role="dialog"
      aria-labelledby="portfolio-hint-title"
      aria-describedby="portfolio-hint-description"
      data-hint-card={active}
      className="portfolio-hint-card"
      style={{
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        visibility: position ? "visible" : "hidden",
      }}
    >
      <button
        type="button"
        className="hint-close"
        onClick={handleDismiss}
        aria-label={t.hints.close}
      >
        <FaTimes aria-hidden="true" />
      </button>

      <h2 id="portfolio-hint-title" className="hint-title">
        {content.title}
      </h2>
      <p id="portfolio-hint-description" className="hint-description">
        {content.description}
      </p>

      <div className="hint-actions">
        <button
          ref={primaryRef}
          type="button"
          className="hint-primary"
          onClick={handlePrimary}
        >
          {primaryLabel}
        </button>
      </div>
    </div>
  );
}
