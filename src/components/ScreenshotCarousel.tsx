"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX } from "react-icons/fi";
import { useLanguage } from "@/components/LanguageProvider";
import { projectSectionTitles } from "@/data/translations";
import type { ProjectScreenshot } from "@/data/projects";

type ScreenshotCarouselProps = {
  screenshots: ProjectScreenshot[];
};

export function ScreenshotCarousel({ screenshots }: ScreenshotCarouselProps) {
  const { locale, t } = useLanguage();
  const [active, setActive] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = screenshots.length;
  const title = projectSectionTitles.screenshots[locale];
  const currentScreenshot = screenshots[active];

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setActive((index + total) % total);
    },
    [total]
  );

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Lock body scroll and listen for keyboard events when modal is open
  useEffect(() => {
    if (!isModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(active - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(active + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, active, goTo, closeModal]);

  if (total === 0) return null;

  return (
    <section id="screenshots" className="mx-auto max-w-4xl py-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {total > 1 && (
          <span className="text-xs font-mono text-foreground/50">
            {active + 1} / {total}
          </span>
        )}
      </div>

      {/* Modern App Window Card */}
      <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02] shadow-2xl backdrop-blur-sm">
        {/* Window Title Bar */}
        <div className="flex items-center justify-between border-b border-foreground/10 bg-foreground/[0.03] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
            <span className="ml-2 text-xs font-mono text-foreground/60 hidden sm:inline">
              {currentScreenshot?.alt[locale] || title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openModal}
              title={t.projects.expandScreenshot}
              aria-label={t.projects.expandScreenshot}
              className="inline-flex items-center gap-1.5 rounded-lg border border-foreground/10 bg-foreground/[0.04] px-2.5 py-1 text-xs font-medium text-foreground/75 transition-colors hover:bg-foreground/[0.08] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
            >
              <FiMaximize2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t.projects.expandScreenshot}</span>
            </button>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={title}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              goTo(active - 1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              goTo(active + 1);
            } else if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openModal();
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
          className="group relative aspect-video w-full cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
          onClick={openModal}
        >
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
                className="object-contain p-2 sm:p-4"
              />
            </div>
          ))}

          {/* Navigation Arrows */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(active - 1);
                }}
                aria-label={t.projects.previousScreenshot}
                className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-white backdrop-blur-md opacity-80 transition-all hover:bg-black/70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(active + 1);
                }}
                aria-label={t.projects.nextScreenshot}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-white backdrop-blur-md opacity-80 transition-all hover:bg-black/70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Hover zoom cue */}
          <div className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md opacity-0 transition-opacity group-hover:opacity-100">
            {t.projects.expandScreenshot}
          </div>
        </div>

        {/* Caption bar */}
        {currentScreenshot && (
          <div className="border-t border-foreground/10 bg-foreground/[0.02] px-4 py-3">
            <p className="text-center text-sm text-foreground/75">
              {currentScreenshot.alt[locale]}
            </p>
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {total > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 overflow-x-auto py-2">
          {screenshots.map((screenshot, index) => (
            <button
              key={screenshot.src}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`${t.projects.goToScreenshot} ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
              className={`relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border transition-all ${
                index === active
                  ? "border-foreground/80 ring-2 ring-foreground/40 opacity-100"
                  : "border-foreground/10 opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={screenshot.src}
                alt={screenshot.alt[locale]}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal / Lightbox via Portal */}
      {isModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-black/92 p-4 backdrop-blur-md sm:p-6 animate-in fade-in duration-200"
            onClick={closeModal}
          >
            {/* Modal Top Bar */}
            <div
              className="flex items-center justify-between text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-mono font-medium backdrop-blur-sm">
                  {active + 1} / {total}
                </span>
                <span className="max-w-md truncate text-sm text-white/80 hidden sm:inline">
                  {currentScreenshot?.alt[locale]}
                </span>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label={t.projects.closeModal}
                className="rounded-full border border-white/20 bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Image Viewport */}
            <div
              className="relative mx-auto my-auto flex h-[75vh] w-full max-w-6xl items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {currentScreenshot && (
                <div className="relative h-full w-full">
                  <Image
                    src={currentScreenshot.src}
                    alt={currentScreenshot.alt[locale]}
                    fill
                    sizes="100vw"
                    priority
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              )}

              {/* Modal Arrows */}
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => goTo(active - 1)}
                    aria-label={t.projects.previousScreenshot}
                    className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-3 text-white backdrop-blur-md transition-all hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    <FiChevronLeft className="h-6 w-6" />
                  </button>

                  <button
                    type="button"
                    onClick={() => goTo(active + 1)}
                    aria-label={t.projects.nextScreenshot}
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-3 text-white backdrop-blur-md transition-all hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    <FiChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Footer / Caption */}
            <div
              className="flex flex-col items-center gap-3 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {currentScreenshot && (
                <p className="max-w-2xl text-sm text-white/80">
                  {currentScreenshot.alt[locale]}
                </p>
              )}

              {total > 1 && (
                <div className="flex items-center gap-1.5 py-1">
                  {screenshots.map((screenshot, index) => (
                    <button
                      key={screenshot.src}
                      type="button"
                      onClick={() => goTo(index)}
                      aria-label={`${t.projects.goToScreenshot} ${index + 1}`}
                      aria-current={index === active ? "true" : undefined}
                      className={`h-2 rounded-full transition-all ${
                        index === active
                          ? "w-8 bg-white"
                          : "w-2 bg-white/40 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
