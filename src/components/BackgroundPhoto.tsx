"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { backgrounds, detailBackground } from "@/data/backgrounds";

export function BackgroundPhoto() {
  const pathname = usePathname();
  const { src, opacity, position } = backgrounds[pathname] ?? detailBackground;

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {/* máscara: dissolve no topo (onde fica o heading) → texto sempre legível */}
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 35%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 35%)",
        }}
      >
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ "--photo-opacity": opacity } as CSSProperties}
          className={`object-cover ${position} grayscale opacity-(--photo-opacity) mix-blend-multiply dark:opacity-[0.12] dark:mix-blend-screen`}
        />
      </div>
    </div>
  );
}