"use client";

import type { IconType } from "react-icons";
import { FaBrain, FaCut, FaVectorSquare } from "react-icons/fa";
import { SiCloudflare } from "react-icons/si";
import { useLanguage } from "@/components/LanguageProvider";
import type { Localized } from "@/data/translations";

const CLOUDFLARE_COLOR = "#F38020";
const LLM_COLOR = "#10A37F";
const EMBED_COLOR = "#0EA5E9";

const TITLE: Localized = { pt: "Pipeline de ingestão", en: "Ingestion pipeline" };
const SUBTITLE: Localized = {
  pt: "Site institucional + central de ajuda",
  en: "Institutional site + help center",
};

type Props = {
  cadence: Localized;
};

type Step = { icon: IconType; label: Localized; color: string };

function Node({ icon: Icon, label, color }: { icon: IconType; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-2xl border bg-background"
        style={{ borderColor: `${color}66`, boxShadow: `0 0 24px -6px ${color}` }}
      >
        <Icon className="text-3xl" style={{ color }} />
      </div>
      <span className="text-xs font-medium" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

const STEPS: Step[] = [
  { icon: SiCloudflare, label: { pt: "Crawl", en: "Crawl" }, color: CLOUDFLARE_COLOR },
  { icon: FaBrain, label: { pt: "Limpeza", en: "Cleaning" }, color: LLM_COLOR },
  { icon: FaCut, label: { pt: "Chunking", en: "Chunking" }, color: EMBED_COLOR },
  { icon: FaVectorSquare, label: { pt: "Embeddings", en: "Embeddings" }, color: EMBED_COLOR },
];

export function KnowledgePipeline({ cadence }: Props) {
  const { locale } = useLanguage();

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 rounded-2xl border border-foreground/10 bg-background/40 p-6 backdrop-blur-sm sm:p-8">
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="led-border flex h-11 w-11 items-center justify-center rounded-xl border border-foreground/10 bg-background/60">
            <FaBrain className="text-lg" />
          </div>
          <div>
            <h2 className="font-semibold">{TITLE[locale]}</h2>
            <p className="text-xs text-foreground/50">{SUBTITLE[locale]}</p>
          </div>
        </div>
        <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs text-foreground/60">
          {cadence[locale]}
        </span>
      </div>

      <div className="flex w-full flex-wrap items-center justify-center gap-8 sm:gap-10">
        {STEPS.map((step) => (
          <Node key={step.label.pt} icon={step.icon} label={step.label[locale]} color={step.color} />
        ))}
      </div>
    </div>
  );
}