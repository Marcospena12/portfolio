"use client";

import type { IconType } from "react-icons";
import { FaBrain, FaCut, FaVectorSquare } from "react-icons/fa";
import { SiCloudflare } from "react-icons/si";

const CLOUDFLARE_COLOR = "#F38020";
const LLM_COLOR = "#10A37F";
const EMBED_COLOR = "#0EA5E9";

type Props = {
  cadence: string;
};

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

export function KnowledgePipeline({ cadence }: Props) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 rounded-2xl border border-foreground/10 bg-background/40 p-6 backdrop-blur-sm sm:p-8">
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="led-border flex h-11 w-11 items-center justify-center rounded-xl border border-foreground/10 bg-background/60">
            <FaBrain className="text-lg" />
          </div>
          <div>
            <h2 className="font-semibold">Pipeline de ingestão</h2>
            <p className="text-xs text-foreground/50">Site institucional + central de ajuda</p>
          </div>
        </div>
        <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs text-foreground/60">
          {cadence}
        </span>
      </div>

      <div className="flex w-full flex-wrap items-center justify-center gap-8 sm:gap-10">
        <Node icon={SiCloudflare} label="Crawl" color={CLOUDFLARE_COLOR} />
        <Node icon={FaBrain} label="Limpeza" color={LLM_COLOR} />
        <Node icon={FaCut} label="Chunking" color={EMBED_COLOR} />
        <Node icon={FaVectorSquare} label="Embeddings" color={EMBED_COLOR} />
      </div>
    </div>
  );
}