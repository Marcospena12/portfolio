import Hero from "@/components/Hero";
import { TechMarquee } from "@/components/TechMarquee";
import { getFeaturedProjectSummaries } from "@/data/featured";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  const featured = getFeaturedProjectSummaries();

  return (
    <main className="flex flex-1 flex-col">
      <Hero featured={featured} />
      <TechMarquee />
    </main>
  );
}