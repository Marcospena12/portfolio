import Hero from "@/components/Hero";
import { TechMarquee } from "@/components/TechMarquee";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <TechMarquee />
    </main>
  );
}