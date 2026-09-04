import { technologies } from "@/data/technologies";
import { TechCard } from "@/components/TechCard";
import { PageHeading } from "@/components/PageHeading";

export default function TecnologiasPage() {
  return (
    <main className="min-h-screen bg-background px-6 pt-32 pb-20 text-foreground">
      <PageHeading eyebrow="Explore" title="Tecnologias" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {technologies.map((tech) => (
          <TechCard key={tech.id} tech={tech} />
        ))}
      </div>
    </main>
  );
}