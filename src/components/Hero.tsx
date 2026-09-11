"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { ScrambleText } from "@/components/ScrambleText";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="flex flex-1 flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <p className="mb-4 text-sm uppercase tracking-widest text-gray-500">
        <ScrambleText text={t.hero.role} />
      </p>
      <h1 className="text-5xl font-bold sm:text-6xl">
        <ScrambleText text={t.hero.greeting} />
      </h1>
      <p className="mt-6 max-w-xl text-lg text-gray-400">
        <ScrambleText text={t.hero.description} />
      </p>
    </section>
  );
}