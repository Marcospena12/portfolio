"use client";

import { useLanguage } from "@/components/LanguageProvider";

/** Conteúdo da página Sobre (client: depende do idioma). */
export function SobreContent() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-2xl space-y-4 text-foreground/80">
      {t.sobre.paragraphs.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
}
