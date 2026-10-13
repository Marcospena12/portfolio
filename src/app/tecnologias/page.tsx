import { technologies } from "@/data/technologies";
import { TechCard } from "@/components/TechCard";
import { PageHeading } from "@/components/PageHeading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tecnologias",
  description:
    "Tecnologias que o Marcos usa: n8n, TypeScript, React, Next.js, Docker, Proxmox, PostgreSQL e mais.",
  alternates: { canonical: "/tecnologias" },
  twitter: {
    card: "summary_large_image",
    title: "Tecnologias — Marcos",
    description:
      "Tecnologias que o Marcos usa: n8n, TypeScript, React, Next.js, Docker, Proxmox, PostgreSQL e mais.",
  },
};

export default function TecnologiasPage() {
  return (
    <main className="flex-1 px-6 pt-16 pb-20 text-foreground">
      <PageHeading pageKey="tecnologias" />
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {technologies.map((tech) => (
          <TechCard key={tech.id} tech={tech} />
        ))}
      </div>
    </main>
  );
}