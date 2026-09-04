"use client";

import { useRouter } from "next/navigation";
import type { Project } from "@/data/projects";
import { technologies } from "@/data/technologies";
import * as SiIcons from "react-icons/si";
import type { IconType } from "react-icons";
import type { CSSProperties } from "react";

export function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const projectTechs = technologies.filter((tech) =>
    project.techIds.includes(tech.id)
  );
  const glowColor = projectTechs[0]?.color ?? "#888888";

  return (
    <div
      onClick={() => router.push(`/projetos/${project.id}`)}
      style={{ "--glow": glowColor } as CSSProperties}
      className="relative flex cursor-pointer flex-col rounded-xl border border-foreground/10 bg-foreground/[0.02] p-6 backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-[var(--glow)] hover:shadow-[0_16px_32px_-12px_var(--glow)]"
    >
      <div className="absolute top-4 right-4 flex gap-2">
        {projectTechs.map((tech) => {
          const Icon = SiIcons[tech.icon as keyof typeof SiIcons] as IconType;
          return (
            <Icon key={tech.id} style={{ color: tech.color }} className="text-lg" />
          );
        })}
      </div>

      <span className="mb-3 w-fit rounded-full bg-foreground/10 px-3 py-1 text-xs uppercase tracking-wide text-foreground/70">
        {project.type}
      </span>
      <h2 className="mb-2 pr-16 text-xl font-semibold">{project.title}</h2>
      <p className="mb-4 text-sm text-foreground/70">{project.description}</p>

      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-auto w-fit text-sm font-medium underline underline-offset-4"
        >
          Ver projeto →
        </a>
      )}
    </div>
  );
}