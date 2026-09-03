import Hero from "@/components/Hero";
import { TechMarquee } from "@/components/TechMarquee";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <div className="flex items-center justify-center gap-4 pb-6">
  <div className="h-px w-10 bg-foreground/20" />
  <span className="text-xs tracking-[0.2em] text-foreground/50 uppercase">
    Eu conheço um pouco disso
  </span>
  <div className="h-px w-10 bg-foreground/20" />
</div>
      <TechMarquee />
    </main>
  );
}