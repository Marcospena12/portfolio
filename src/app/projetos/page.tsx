import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { PageHeading } from "@/components/PageHeading";

type PageProps = {
  searchParams: Promise<{ tech?: string }>;
};

export default async function ProjetosPage({ searchParams }: PageProps) {
  const { tech } = await searchParams;

  const filteredProjects = tech
    ? projects.filter((project) => project.techIds.includes(tech))
    : projects;

  return (
    <main className="min-h-screen bg-background px-6 pt-32 pb-20 text-foreground">
      <PageHeading eyebrow="Portfólio" title="Projetos" />
      {tech && (
        <p className="-mt-8 mb-10 text-center text-sm text-foreground/60">
          Filtrando por: <span className="font-medium">{tech}</span>
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  );
}