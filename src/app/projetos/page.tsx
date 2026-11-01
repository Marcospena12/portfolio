import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFilterNotice } from "@/components/ProjectFilterNotice";
import { ProjectFilterTabs } from "@/components/ProjectFilterTabs";
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
  searchParams: Promise<{ tech?: string; type?: string }>;
};

export default async function ProjetosPage({ searchParams }: PageProps) {
  const { tech, type } = await searchParams;

  const activeType = type === "trabalho" || type === "pessoal" ? type : "all";

  const techFilteredProjects = tech
    ? projects.filter((project) => project.techIds.includes(tech))
    : projects;

  const counts = {
    all: techFilteredProjects.length,
    trabalho: techFilteredProjects.filter((p) => p.type === "trabalho").length,
    pessoal: techFilteredProjects.filter((p) => p.type === "pessoal").length,
  };

  const filteredProjects =
    activeType === "all"
      ? techFilteredProjects
      : techFilteredProjects.filter((project) => project.type === activeType);

  return (
    <main className="flex-1 px-6 pt-16 pb-20 text-foreground">
      <PageHeading pageKey="projetos" />

      <ProjectFilterTabs
        activeType={activeType}
        counts={counts}
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
