"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { translations } from "@/data/translations";

type PageHeadingProps = {
  pageKey: keyof typeof translations.pt.pages;
};

export function PageHeading({ pageKey }: PageHeadingProps) {
  const { t } = useLanguage();
  const { eyebrow, title } = t.pages[pageKey];

  return (
    <div className="flex flex-col items-center gap-3 pb-12 text-center">
      <span className="text-xs font-semibold tracking-[0.2em] text-foreground uppercase opacity-70">
        {eyebrow}
      </span>
      <h1 className="text-4xl font-bold">{title}</h1>
      <div className="mt-1 h-[3px] w-12 rounded-full bg-foreground/30" />
    </div>
  );
}