"use client";

import { FeaturedProjects } from "@/components/FeaturedProjects";
import { useLanguage } from "@/components/LanguageProvider";
import { ScrambleText } from "@/components/ScrambleText";
import type { FeaturedProjectSummary } from "@/data/featured";

type HeroProps = {
  featured: FeaturedProjectSummary[];
};

export default function Hero({ featured }: HeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative flex flex-1 items-center px-6 py-12 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, var(--background) 0%, transparent 76%)",
        }}
      />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <p className="mb-4 text-sm uppercase tracking-widest text-foreground/50">
          <ScrambleText text={t.hero.role} />
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          <ScrambleText text={t.hero.greeting} />
        </h1>
        <p className="mt-5 max-w-xl text-base text-foreground/65 sm:mt-6 sm:text-lg">
          <ScrambleText text={t.hero.description} />
        </p>

        <FeaturedProjects items={featured} />
      </div>
    </section>
  );
}
