import Hero from "@/components/Hero";
import { TechMarquee } from "@/components/TechMarquee";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <TechMarquee />
    </main>
  );
}