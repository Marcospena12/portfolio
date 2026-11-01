"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FiGrid, FiBriefcase, FiUser } from "react-icons/fi";
import { useLanguage } from "@/components/LanguageProvider";

type FilterType = "all" | "trabalho" | "pessoal";

type ProjectFilterTabsProps = {
  activeType?: FilterType;
  counts: {
    all: number;
    trabalho: number;
    pessoal: number;
  };
  currentTech?: string;
};

export function ProjectFilterTabs({
  activeType = "all",
  counts,
  currentTech,
}: ProjectFilterTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const handleSelect = (type: FilterType) => {
    const params = new URLSearchParams(searchParams.toString());

    if (type === "all") {
      params.delete("type");
    } else {
      params.set("type", type);
    }

    if (currentTech) {
      params.set("tech", currentTech);
    }

    const query = params.toString();
    router.replace(`/projetos${query ? `?${query}` : ""}`, { scroll: false });
  };

  const tabs: { key: FilterType; label: string; icon: typeof FiGrid; count: number }[] = [
    {
      key: "all",
      label: t.projects.tabs.all,
      icon: FiGrid,
      count: counts.all,
    },
    {
      key: "trabalho",
      label: t.projects.tabs.trabalho,
      icon: FiBriefcase,
      count: counts.trabalho,
    },
    {
      key: "pessoal",
      label: t.projects.tabs.pessoal,
      icon: FiUser,
      count: counts.pessoal,
    },
  ];

  return (
    <div className="flex justify-center mb-8">
      <div
        role="tablist"
        aria-label="Filtro de tipos de projeto"
        className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/[0.03] p-1.5 backdrop-blur-md transition-colors"
      >
        {tabs.map((tab) => {
          const isActive = activeType === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelect(tab.key)}
              className={`group flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
                isActive
                  ? "bg-foreground text-background shadow-sm"
                  : "text-foreground/70 hover:text-foreground hover:bg-foreground/[0.05]"
              }`}
            >
              <Icon className="text-sm shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span>{tab.label}</span>
              <span
                className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] sm:text-xs font-semibold tabular-nums leading-none ${
                  isActive
                    ? "bg-background/20 text-background"
                    : "bg-foreground/10 text-foreground/60 group-hover:text-foreground/80"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
