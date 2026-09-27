"use client";

import { useLanguage } from "@/components/LanguageProvider";
import type { Localized } from "@/data/translations";

export function T({ value }: { value: Localized }) {
  const { locale } = useLanguage();
  return <>{value[locale]}</>;
}
