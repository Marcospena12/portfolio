import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFilterNotice } from "@/components/ProjectFilterNotice";
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
  searchParams: Promise<{ tech?: string }>;
};

export default async function ProjetosPage({ searchParams }: PageProps) {
  const { tech } = await searchParams;

  const filteredProjects = tech
    ? projects.filter((project) => project.techIds.includes(tech))
    : projects;

  return (
    <main className="flex-1 px-6 pt-16 pb-20 text-foreground">
      <PageHeading pageKey="projetos" />
      {tech && <ProjectFilterNotice tech={tech} />}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  );
}