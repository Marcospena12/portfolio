"use client";

import Link from "next/link";
import { FiX } from "react-icons/fi";
import { useLanguage } from "@/components/LanguageProvider";

type ProjectFilterNoticeProps = {
  tech: string;
  type?: string;
};

export function ProjectFilterNotice({ tech, type }: ProjectFilterNoticeProps) {
  const { t } = useLanguage();
  const clearHref = type ? `/projetos?type=${type}` : "/projetos";

  return (
    <div className="-mt-4 mb-8 flex items-center justify-center gap-2 text-sm text-foreground/70">
      <span>
        {t.projects.filteringBy} <span className="font-semibold text-foreground">{tech}</span>
      </span>
      <Link
        href={clearHref}
        title={t.projects.clearFilter}
        className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2 py-0.5 text-xs text-foreground/80 transition-colors hover:bg-foreground/20 hover:text-foreground"
      >
        <FiX className="text-xs" />
        <span>{t.projects.clearFilter}</span>
      </Link>
    </div>
  );
}
