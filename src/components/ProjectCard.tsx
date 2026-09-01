"use client";

import { useRouter } from "next/navigation";
import type { Project } from "@/data/projects";
import { technologies } from "@/data/technologies";
import * as SiIcons from "react-icons/si";
import type { IconType } from "react-icons";

export function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const projectTechs = technologies.filter((tech) =>
    project.techIds.includes(tech.id)
  );

  return (
    <div
      onClick={() => router.push(`/projetos/${project.id}`)}
      className="relative flex cursor-pointer flex-col rounded-xl border border-foreground/10 p-6 transition-colors hover:border-foreground/30"
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