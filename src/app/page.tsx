import Hero from "@/components/Hero";
import { TechMarquee } from "@/components/TechMarquee";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <TechMarquee />
    </main>
  );
}