"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function CoursesEmptyState() {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] py-20 text-center text-foreground/60">
      <p className="text-base">{t.cursos.emptyState}</p>
    </div>
  );
}
