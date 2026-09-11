"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { ScrambleText } from "@/components/ScrambleText";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "pt" ? "en" : "pt")}
      aria-label="Alternar idioma"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 font-mono text-xs font-semibold uppercase transition-colors hover:border-foreground/30"
    >
      <ScrambleText text={locale === "pt" ? "en" : "pt"} />
    </button>
  );
}