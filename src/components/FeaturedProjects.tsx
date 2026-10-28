"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import { useLanguage } from "@/components/LanguageProvider";
import type { FeaturedProjectSummary } from "@/data/featured";

const allIcons = { ...SiIcons, ...FaIcons };

export function FeaturedProjects({ items }: { items: FeaturedProjectSummary[] }) {
  const { locale, t } = useLanguage();
  const copy = t.hero.featured;

  return (
    <section aria-labelledby="home-featured-title" className="mt-9 w-full max-w-xl">
      <div className="mb-4 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/45">
          {copy.eyebrow}
        </p>
        <h2
          id="home-featured-title"
          className="mt-2 text-lg font-semibold text-foreground/90"
        >
          {copy.title}
        </h2>
      </div>

      <ul className="flex flex-col gap-2">
        {items.map((item, index) => {
          const scopeLabel = copy.scopes[item.scope];
          const title = item.title[locale];
          const glow = item.techs[0]?.color ?? "#888888";

          return (
            <li key={item.id}>
              <Link
                href={`/projetos/${item.id}`}
                aria-label={`${scopeLabel}: ${title}`}
                style={{ "--glow": glow } as CSSProperties}
                className="group flex items-center gap-2.5 rounded-xl border border-foreground/10 bg-foreground/[0.025] px-4 py-2.5 text-left text-foreground backdrop-blur-sm transition-[transform,border-color,background-color,box-shadow] duration-300 hover:border-[var(--glow)] hover:bg-foreground/[0.045] hover:shadow-[0_12px_28px_-20px_var(--glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none"
              >
                <span
                  aria-hidden="true"
                  className="w-5 shrink-0 font-mono text-[11px] tabular-nums text-foreground/30"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1 sm:flex-none">
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: glow }}
                    />
                    {scopeLabel}
                  </span>
                  <span className="mt-0.5 block truncate text-sm font-semibold leading-tight text-foreground/90">
                    {title}
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className="mx-1 hidden h-px min-w-6 flex-1 border-t border-dotted border-foreground/15 sm:block"
                />

                <span
                  aria-hidden="true"
                  className="hidden shrink-0 items-center gap-1.5 sm:flex"
                >
                  {item.techs.map((tech) => {
                    const Icon = allIcons[
                      tech.icon as keyof typeof allIcons
                    ] as IconType | undefined;
                    if (!Icon) return null;
                    return (
                      <Icon
                        key={tech.id}
                        style={{ color: tech.color }}
                        className="text-base"
                      />
                    );
                  })}
                </span>

                {item.metric && (
                  <span className="hidden shrink-0 text-right sm:block">
                    <span className="block font-mono text-sm font-semibold leading-tight text-foreground/90">
                      {item.metric.value[locale]}
                    </span>
                    <span className="mt-0.5 block max-w-[7rem] text-[9px] uppercase leading-tight tracking-wide text-foreground/40">
                      {item.metric.label[locale]}
                    </span>
                  </span>
                )}

                <span
                  aria-hidden="true"
                  className="shrink-0 pl-1 text-sm text-foreground/30 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-foreground/60 motion-reduce:transition-none"
                >
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        href="/projetos"
        className="group mx-auto mt-4 flex w-fit items-center gap-2 text-sm font-medium text-foreground/60 underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {copy.viewAll}
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
        >
          →
        </span>
      </Link>
    </section>
  );
}
