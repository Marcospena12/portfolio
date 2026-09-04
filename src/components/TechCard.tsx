import * as SiIcons from "react-icons/si";
import Link from "next/link";
import type { Technology } from "@/data/technologies";
import type { IconType } from "react-icons";
import type { CSSProperties } from "react";

export function TechCard({ tech }: { tech: Technology }) {
  const Icon = SiIcons[tech.icon as keyof typeof SiIcons] as IconType;

  return (
    <Link
      href={`/projetos?tech=${tech.id}`}
      style={{ "--glow": tech.color } as CSSProperties}
      className="group relative flex h-40 flex-col items-center justify-center overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4 text-center backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-[var(--glow)] hover:shadow-[0_12px_28px_-10px_var(--glow)]"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-300 group-hover:opacity-15">
        <Icon className="text-4xl" style={{ color: tech.color }} />
        <span className="text-sm font-medium">{tech.name}</span>
      </div>

      <p className="relative whitespace-pre-line text-sm text-foreground/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
  {tech.summary}
</p>
    </Link>
  );
}