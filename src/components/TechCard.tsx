"use client";

import * as SiIcons from "react-icons/si";
import { useState } from "react";
import Link from "next/link";
import type { Technology } from "@/data/technologies";
import type { IconType } from "react-icons";

export function TechCard({ tech }: { tech: Technology }) {
  const [hovered, setHovered] = useState(false);
  const Icon = SiIcons[tech.icon as keyof typeof SiIcons] as IconType;

  return (
    <Link
      href={`/projetos?tech=${tech.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex h-40 flex-col items-center justify-center rounded-xl border border-foreground/10 p-4 text-center transition-colors hover:border-foreground/30"
    >
      {!hovered && (
        <>
          <Icon className="mb-2 text-4xl" style={{ color: tech.color }} />
          <span className="text-sm font-medium">{tech.name}</span>
        </>
      )}
      {hovered && (
        <p className="text-sm text-foreground/70">{tech.summary}</p>
      )}
    </Link>
  );
}