import { technologies } from "@/data/technologies";
import { TechCard } from "@/components/TechCard";

export default function TecnologiasPage() {
  return (
    <main className="min-h-screen bg-background px-6 pt-32 pb-20 text-foreground">
      <h1 className="mb-10 text-4xl font-bold">Tecnologias</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {technologies.map((tech) => (
          <TechCard key={tech.id} tech={tech} />
        ))}
      </div>
    </main>
  );
}