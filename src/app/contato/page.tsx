import type { Metadata } from "next";
import { PageHeading } from "@/components/PageHeading";
import { ContatoLinks } from "@/components/ContatoLinks";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com Marcos por e-mail, GitHub ou LinkedIn.",
  alternates: { canonical: "/contato" },
  twitter: {
    card: "summary_large_image",
    title: "Contato — Marcos",
    description: "Fale com Marcos por e-mail, GitHub ou LinkedIn.",
  },
};

export default function ContatoPage() {
  return (
    <main className="flex-1 px-6 pt-16 pb-20 text-foreground">
      <PageHeading pageKey="contato" />
      <ContatoLinks />
    </main>
  );
}
