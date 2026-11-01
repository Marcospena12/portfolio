"use client";

import Link from "next/link";
import { FiFolderMinus } from "react-icons/fi";
import { useLanguage } from "@/components/LanguageProvider";

export function ProjectsEmptyState() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-foreground/10 bg-foreground/[0.02] py-16 px-6 text-center text-foreground/70 backdrop-blur-sm">
      <FiFolderMinus className="mb-4 text-4xl text-foreground/40" />
      <p className="mb-5 text-base font-medium">{t.projects.emptyFilter}</p>
      <Link
        href="/projetos"
        className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-foreground/5 px-4 py-2 text-xs font-semibold text-foreground transition-all hover:bg-foreground hover:text-background"
      >
        {t.projects.clearFilter}
      </Link>
    </div>
  );
}
