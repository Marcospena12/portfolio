"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";
import { projectSectionTitles } from "@/data/translations";
import type { ProjectScreenshot } from "@/data/projects";

type ScreenshotCarouselProps = {
  screenshots: ProjectScreenshot[];
};

export function ScreenshotCarousel({ screenshots }: ScreenshotCarouselProps) {
  const { locale, t } = useLanguage();
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const total = screenshots.length;
  const title = projectSectionTitles.screenshots[locale];

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setActive((index + total) % total);
    },
    [total]
  );

  if (total === 0) return null;

  return (
    <section id="screenshots" className="mx-auto max-w-4xl py-16">
      <h2 className="mb-6 text-2xl font-semibold">{title}</h2>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={title}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(active - 1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            goTo(active + 1);
          }
        }}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;
          const delta = event.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(delta) > 40) {
            goTo(active + (delta < 0 ? 1 : -1));
          }
          touchStartX.current = null;
        }}
        className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.03] outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
      >
        <div className="relative aspect-video w-full">
          {screenshots.map((screenshot, index) => (
            <div
              key={screenshot.src}
              aria-hidden={index !== active}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <Image
                src={screenshot.src}
                alt={screenshot.alt[locale]}
                fill
                sizes="(max-width: 896px) 100vw, 896px"
                priority={index === 0}
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label={t.projects.previousScreenshot}
              className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label={t.projects.nextScreenshot}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pt-12 pb-4">
              <span
                aria-live="polite"
                className="rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
              >
                {active + 1} / {total}
              </span>

              <div className="pointer-events-auto flex flex-wrap justify-end gap-1.5">
                {screenshots.map((screenshot, index) => (
                  <button
                    key={screenshot.src}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`${t.projects.goToScreenshot} ${index + 1}`}
                    aria-current={index === active ? "true" : undefined}
                    className={`h-2 rounded-full transition-all ${
                      index === active
                        ? "w-6 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
