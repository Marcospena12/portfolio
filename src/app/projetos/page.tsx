import { projects, projectTags, type ProjectTagId } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFilterNotice } from "@/components/ProjectFilterNotice";
import { ProjectFilterTabs } from "@/components/ProjectFilterTabs";
import { ProjectTagFilter } from "@/components/ProjectTagFilter";
import { ProjectsEmptyState } from "@/components/ProjectsEmptyState";
import { PageHeading } from "@/components/PageHeading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Projetos de Marcos: automações, agentes de IA, infraestrutura e desenvolvimento web.",
  alternates: { canonical: "/projetos" },
  twitter: {
    card: "summary_large_image",
    title: "Projetos — Marcos",
    description:
      "Projetos de Marcos: automações, agentes de IA, infraestrutura e desenvolvimento web.",
  },
};

type PageProps = {
  searchParams: Promise<{ tech?: string; type?: string; tags?: string }>;
};

export default async function ProjetosPage({ searchParams }: PageProps) {
  const { tech, type, tags } = await searchParams;

  const activeType = type === "trabalho" || type === "pessoal" ? type : "all";

  const validTagIds = new Set<ProjectTagId>(
    projectTags.map((tag) => tag.id)
  );
  const activeTags: ProjectTagId[] = (tags ?? "")
    .split(",")
    .map((raw) => raw.trim())
    .filter((raw): raw is ProjectTagId => validTagIds.has(raw as ProjectTagId));
  const uniqueActiveTags = Array.from(new Set(activeTags));

  const techFilteredProjects = tech
    ? projects.filter((project) => project.techIds.includes(tech))
    : projects;

  const counts = {
    all: techFilteredProjects.length,
    trabalho: techFilteredProjects.filter((p) => p.type === "trabalho").length,
    pessoal: techFilteredProjects.filter((p) => p.type === "pessoal").length,
  };

  const typeFilteredProjects =
    activeType === "all"
      ? techFilteredProjects
      : techFilteredProjects.filter((project) => project.type === activeType);

  const tagCounts = projectTags.reduce(
    (acc, tag) => {
      acc[tag.id] = typeFilteredProjects.filter((project) =>
        project.tags.includes(tag.id)
      ).length;
      return acc;
    },
    {} as Record<ProjectTagId, number>
  );

  const filteredProjects =
    uniqueActiveTags.length === 0
      ? typeFilteredProjects
      : typeFilteredProjects.filter((project) =>
          uniqueActiveTags.some((tag) => project.tags.includes(tag))
        );

  return (
    <main className="flex-1 px-6 pt-16 pb-20 text-foreground">
      <PageHeading pageKey="projetos" />

      <ProjectFilterTabs
        activeType={activeType}
        counts={counts}
        currentTech={tech}
      />

      <ProjectTagFilter
        counts={tagCounts}
        activeTags={uniqueActiveTags}
        currentType={activeType === "all" ? undefined : activeType}
        currentTech={tech}
      />

      {tech && <ProjectFilterNotice tech={tech} type={type} />}

      {filteredProjects.length === 0 ? (
        <div className="mx-auto max-w-xl">
          <ProjectsEmptyState />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </main>
  );
}
