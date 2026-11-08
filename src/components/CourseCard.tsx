"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import type { Course } from "@/data/courses";
import { useLanguage } from "@/components/LanguageProvider";
import { EmblemSpin } from "@/components/EmblemSpin";

export function CourseCard({ course }: { course: Course }) {
  const { locale, t } = useLanguage();

  const glowColor = course.color ?? "#888888";
  const title = course.title[locale];

  const isCompleted = course.status === "concluido";
  const statusLabel = isCompleted
    ? t.cursos.statusCompleted
    : t.cursos.statusInProgress;

  return (
    <article
      style={{ "--glow": glowColor } as CSSProperties}
      className="relative flex flex-col rounded-xl border border-foreground/10 bg-foreground/[0.02] p-6 backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-[var(--glow)] hover:shadow-[0_16px_32px_-12px_var(--glow)]"
    >
      <Link
        href={`/cursos/${course.id}`}
        aria-label={title}
        className="absolute inset-0 z-10 rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      />

      <div className="pointer-events-none absolute top-4 right-4 z-20">
        <EmblemSpin
          src={course.emblem.src}
          srcDark={course.emblem.srcDark}
          alt={course.emblem.alt}
          mode={course.emblem.mode ?? "spin"}
          size={72}
        />
      </div>

      <span className="text-[11px] font-semibold tracking-wider text-foreground/60 uppercase">
        {course.provider}
      </span>

      <h2 className="mt-1 mb-2 pr-20 text-xl font-semibold leading-snug">
        {title}
      </h2>

      <p className="mb-6 line-clamp-3 text-sm text-foreground/70">
        {course.summary[locale]}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-foreground/5 pt-2 text-xs">
        <span
          className={`rounded-full px-2.5 py-0.5 font-medium ${
            isCompleted
              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
          }`}
        >
          {statusLabel}
        </span>

        {course.workloadHours && (
          <span className="rounded-full bg-foreground/5 px-2.5 py-0.5 text-foreground/70">
            {course.workloadHours}
            {t.cursos.hoursSuffix}
          </span>
        )}

        {course.certificate && (
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-foreground/60">
            <svg
              className="h-3.5 w-3.5 text-foreground/60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
            </svg>
            {t.cursos.certificateAvailable}
          </span>
        )}
      </div>
    </article>
  );
}
