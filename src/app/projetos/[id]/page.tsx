import { projects } from "@/data/projects";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background px-6 pt-32 pb-20 text-foreground">
      <h1 className="mb-4 text-4xl font-bold">{project.title}</h1>
      <p className="max-w-2xl text-foreground/70">{project.description}</p>
    </main>
  );
}