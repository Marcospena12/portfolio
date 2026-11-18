"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FiX } from "react-icons/fi";
import { useLanguage } from "@/components/LanguageProvider";
import { projectTags, type ProjectTagId } from "@/data/projects";

export type ProjectTagFilterProps = {
  counts: Record<ProjectTagId, number>;
  activeTags: ProjectTagId[];
  currentType?: string;
  currentTech?: string;
};

export function ProjectTagFilter({
  counts,
  activeTags,
  currentType,
  currentTech,
}: ProjectTagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, locale } = useLanguage();

  const buildHref = (next: ProjectTagId[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next.length > 0) {
      params.set("tags", next.join(","));
    } else {
      params.delete("tags");
    }

    if (currentType) {
      params.set("type", currentType);
    }
    if (currentTech) {
      params.set("tech", currentTech);
    }

    const query = params.toString();
    return `/projetos${query ? `?${query}` : ""}`;
  };

  const toggle = (id: ProjectTagId) => {
    const next = activeTags.includes(id)
      ? activeTags.filter((tag) => tag !== id)
      : [...activeTags, id];
    router.replace(buildHref(next), { scroll: false });
  };

  const clear = () => {
    router.replace(buildHref([]), { scroll: false });
  };

  if (projectTags.length === 0) return null;

  return (
    <div className="mb-8 flex flex-col items-center gap-2.5">
      <div
        role="group"
        aria-label={t.projects.tagGroupLabel}
        className="flex flex-wrap items-center justify-center gap-1.5"
      >
        {projectTags.map((tag) => {
          const isActive = activeTags.includes(tag.id);
          const count = counts[tag.id] ?? 0;

          return (
            <button
              key={tag.id}
              type="button"
              aria-pressed={isActive}
              title={tag.description[locale]}
              onClick={() => toggle(tag.id)}
              disabled={count === 0 && !isActive}
              className={`group flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-40 ${
                isActive
                  ? "border-transparent bg-foreground text-background shadow-sm"
                  : "border-foreground/10 bg-foreground/[0.03] text-foreground/70 backdrop-blur-md hover:border-foreground/20 hover:text-foreground hover:bg-foreground/[0.06]"
              }`}
            >
              <span>{tag.label[locale]}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold tabular-nums leading-none ${
                  isActive
                    ? "bg-background/20 text-background"
                    : "bg-foreground/10 text-foreground/60 group-hover:text-foreground/80"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {activeTags.length > 0 && (
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2.5 py-1 text-xs text-foreground/70 transition-colors hover:bg-foreground/20 hover:text-foreground"
        >
          <FiX className="text-xs" />
          <span>{t.projects.clearTags}</span>
          <span className="ml-0.5 font-semibold tabular-nums">{activeTags.length}</span>
        </button>
      )}
    </div>
  );
}
