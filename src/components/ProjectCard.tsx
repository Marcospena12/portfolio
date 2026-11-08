"use client";

import Link from "next/link";
import type { Project } from "@/data/projects";
import { technologies } from "@/data/technologies";
import type { CSSProperties } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { techIcons } from "@/components/tech-icons";

export function ProjectCard({ project }: { project: Project }) {
  const { locale, t } = useLanguage();
  const projectTechs = technologies.filter((tech) =>
    project.techIds.includes(tech.id)
  );
  const glowColor = projectTechs[0]?.color ?? "#888888";
  const title = project.title[locale];

  return (
    <article
      style={{ "--glow": glowColor } as CSSProperties}
      className="relative flex flex-col rounded-xl border border-foreground/10 bg-foreground/[0.02] p-6 backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-[var(--glow)] hover:shadow-[0_16px_32px_-12px_var(--glow)]"
    >
      <Link
        href={`/projetos/${project.id}`}
        aria-label={`${title} — ${t.projects.typeLabels[project.type]}`}
        className="absolute inset-0 z-10 rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      />

      <div className="pointer-events-none absolute top-4 right-4 z-20 flex gap-2">
        {projectTechs.map((tech) => {
          const Icon = techIcons[tech.icon];
          if (!Icon) return null;
          return (
            <Icon key={tech.id} style={{ color: tech.color }} className="text-lg" />
          );
        })}
      </div>

      <span className="mb-3 w-fit rounded-full bg-foreground/10 px-3 py-1 text-xs uppercase tracking-wide text-foreground/70">
        {t.projects.typeLabels[project.type]}
      </span>
      <h2 className="mb-2 pr-16 text-xl font-semibold">{title}</h2>
      <p className="mb-4 text-sm text-foreground/70">{project.description[locale]}</p>

      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-20 mt-auto w-fit text-sm font-medium underline underline-offset-4"
        >
          {t.projects.viewProject}
        </a>
      )}
    </article>
  );
}
