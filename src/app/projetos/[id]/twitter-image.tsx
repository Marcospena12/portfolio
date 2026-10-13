import { ImageResponse } from "next/og";
import { OgCard } from "@/components/OgCard";
import { projects } from "@/data/projects";
import { technologies } from "@/data/technologies";

export const alt = "Projeto do portfólio de Marcos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  const title = project?.title.pt ?? "Projeto";
  const names = project
    ? technologies
        .filter((tech) => project.techIds.includes(tech.id))
        .slice(0, 5)
        .map((tech) => tech.name)
        .join(" · ")
    : "";
  const typeLabel = project?.type === "trabalho" ? "Trabalho" : "Pessoal";
  const subtitle = [typeLabel, names].filter(Boolean).join(" · ");

  return new ImageResponse(
    <OgCard eyebrow="Projeto" title={title} subtitle={subtitle} />,
    { ...size },
  );
}
