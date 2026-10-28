import { projects } from "@/data/projects";
import { technologies, type Technology } from "@/data/technologies";
import type { Localized } from "@/data/translations";

export type FeaturedScope = "software" | "ai" | "infra";

export type FeaturedProjectSummary = {
  id: string;
  scope: FeaturedScope;
  title: Localized;
  metric?: { label: Localized; value: Localized };
  techs: Pick<Technology, "id" | "name" | "icon" | "color">[];
};

export const featuredProjects: { id: string; scope: FeaturedScope }[] = [
  { id: "ni-node", scope: "software" },
  { id: "super-agente", scope: "ai" },
  { id: "armazenamento-backup-nas", scope: "infra" },
];

const FEATURED_TECH_COUNT = 3;

export function getFeaturedProjectSummaries(): FeaturedProjectSummary[] {
  return featuredProjects.flatMap(({ id, scope }) => {
    const project = projects.find((item) => item.id === id);
    if (!project) return [];

    const techs = technologies
      .filter((tech) => project.techIds.includes(tech.id))
      .slice(0, FEATURED_TECH_COUNT)
      .map(({ id: techId, name, icon, color }) => ({
        id: techId,
        name,
        icon,
        color,
      }));

    return [
      {
        id: project.id,
        scope,
        title: project.shortTitle ?? project.title,
        metric: project.details?.metrics[0],
        techs,
      },
    ];
  });
}
