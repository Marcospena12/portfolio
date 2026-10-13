import type { Metadata } from "next";
import { PageHeading } from "@/components/PageHeading";
import { SobreContent } from "@/components/SobreContent";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça a trajetória de Marcos: de DevOps e infraestrutura a desenvolvimento web, automações e agentes de IA.",
  alternates: { canonical: "/sobre" },
  twitter: {
    card: "summary_large_image",
    title: "Sobre — Marcos",
    description:
      "Conheça a trajetória de Marcos: de DevOps e infraestrutura a desenvolvimento web, automações e agentes de IA.",
  },
};

export default function SobrePage() {
  return (
    <main className="flex-1 px-6 pt-16 pb-20 text-foreground">
      <PageHeading pageKey="sobre" />
      <SobreContent />
    </main>
  );
}
