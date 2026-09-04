import { PageHeading } from "@/components/PageHeading";

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-background px-6 pt-32 pb-20 text-foreground">
      <PageHeading eyebrow="Quem sou eu" title="Sobre" />
      <div className="mx-auto max-w-2xl space-y-4 text-foreground/80">
        <p>Escreva aqui um pouco sobre sua trajetória.</p>
        <p>Segundo parágrafo, sobre o que te motiva hoje em dia.</p>
        <p>Terceiro parágrafo, algo mais pessoal se quiser.</p>
      </div>
    </main>
  );
}