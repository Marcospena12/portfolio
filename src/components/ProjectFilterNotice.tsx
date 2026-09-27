"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function ProjectFilterNotice({ tech }: { tech: string }) {
  const { t } = useLanguage();

  return (
    <p className="-mt-8 mb-10 text-center text-sm text-foreground/60">
      {t.projects.filteringBy} <span className="font-medium">{tech}</span>
    </p>
  );
}
