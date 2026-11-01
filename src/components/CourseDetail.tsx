"use client";

import Link from "next/link";
import type { Course } from "@/data/courses";
import { useLanguage } from "@/components/LanguageProvider";
import { EmblemSpin } from "@/components/EmblemSpin";

function formatCompletionDate(dateStr: string, locale: "pt" | "en"): string {
  const [yearStr, monthStr] = dateStr.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  if (isNaN(year) || isNaN(month)) return dateStr;

  const date = new Date(year, month - 1, 1);
  const formatter = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
    month: "long",
    year: "numeric",
  });
  const formatted = formatter.format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function CourseDetail({ course }: { course: Course }) {
  const { locale, t } = useLanguage();

  const isCompleted = course.status === "concluido";
  const statusLabel = isCompleted
    ? t.cursos.statusCompleted
    : t.cursos.statusInProgress;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <Link
          href="/cursos"
          className="inline-flex items-center gap-2 text-sm text-foreground/60 transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">&larr;</span>
          {t.cursos.backToCourses}
        </Link>
      </div>

      <header className="mb-12 flex flex-col-reverse items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex-1">
          <span className="text-xs font-semibold tracking-widest text-foreground/60 uppercase">
            {course.provider}
          </span>
          <h1 className="gradient-text mt-2 text-3xl font-bold sm:text-4xl">
            {course.title[locale]}
          </h1>
          <p className="mt-3 text-base text-foreground/70 sm:text-lg">
            {course.summary[locale]}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium ${
                isCompleted
                  ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isCompleted ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {statusLabel}
            </span>

            {course.workloadHours && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 py-1 font-medium text-foreground/80">
                <svg
                  className="h-3.5 w-3.5 text-foreground/50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>
                  {course.workloadHours} {t.cursos.hoursSuffix}
                </span>
              </span>
            )}

            {course.completedAt && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 py-1 font-medium text-foreground/80">
                <svg
                  className="h-3.5 w-3.5 text-foreground/50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>
                  {t.cursos.completion}: {formatCompletionDate(course.completedAt, locale)}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 self-center sm:self-auto">
          <EmblemSpin
            src={course.emblem.src}
            srcDark={course.emblem.srcDark}
            alt={course.emblem.alt}
            mode={course.emblem.mode ?? "spin"}
            size={112}
          />
        </div>
      </header>

      {course.certificate && (
        <div className="mb-12 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 backdrop-blur-sm">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">{t.cursos.certificate}</h2>
              <p className="text-sm text-foreground/70">
                {t.cursos.certificateAvailable}
              </p>
              {course.certificate.code && (
                <p className="mt-1 font-mono text-sm text-foreground/60">
                  {t.cursos.verificationCode}:{" "}
                  <span className="text-foreground/80">
                    {course.certificate.code}
                  </span>
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {course.certificate.pdf && (
                <a
                  href={course.certificate.pdf}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="led-border inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-transform duration-200 hover:scale-105"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {t.cursos.downloadCertificate}
                </a>
              )}
              {course.certificate.verifyUrl && (
                <a
                  href={course.certificate.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:border-foreground/50 hover:text-foreground"
                >
                  {t.cursos.verifyCredential} &rarr;
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-12">
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            {t.cursos.aboutCourse}
          </h2>
          <p className="leading-relaxed whitespace-pre-line text-foreground/70">
            {course.description[locale]}
          </p>
        </section>

        {course.topics && course.topics.length > 0 && (
          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              {t.cursos.topicsCovered}
            </h2>
            <ul className="space-y-3">
              {course.topics.map((topic, i) => (
                <li key={i} className="flex items-start gap-3 text-foreground/70">
                  <span className="mt-1 text-sm text-foreground/40">•</span>
                  <span>{topic[locale]}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {course.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-foreground/10 bg-foreground/[0.04] px-3 py-1 text-xs font-medium text-foreground/80"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {course.link && (
          <div className="pt-6 border-t border-foreground/10">
            <a
              href={course.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 underline underline-offset-4 transition-colors hover:text-foreground"
            >
              {t.cursos.viewOfficialCourse} &rarr;
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
