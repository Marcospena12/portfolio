"use client";

import { PageHeading } from "@/components/PageHeading";
import { useLanguage } from "@/components/LanguageProvider";

export default function SobrePage() {
  const { t } = useLanguage();

  return (
    <main className="flex-1 px-6 pt-16 pb-20 text-foreground">
      <PageHeading pageKey="sobre" />
      <div className="mx-auto max-w-2xl space-y-4 text-foreground/80">
        {t.sobre.paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}