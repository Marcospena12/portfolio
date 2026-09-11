"use client";

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { technologies } from "@/data/technologies";
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";
import type { IconType } from "react-icons";
import { useLanguage } from "@/components/LanguageProvider";
import { ScrambleText } from "@/components/ScrambleText";

const allIcons = { ...SiIcons, ...FaIcons };

function TechItem({ tech }: { tech: (typeof technologies)[number] }) {
  const Icon = allIcons[tech.icon as keyof typeof allIcons] as IconType;
  return (
    <div className="flex items-center gap-2 whitespace-nowrap text-base font-medium text-foreground/70">
      <Icon style={{ color: tech.color }} className="text-3xl" />
      {tech.name}
    </div>
  );
}

const PIXELS_PER_SECOND = 60;

export function TechMarquee() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLAnchorElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [repeats, setRepeats] = useState(2);
  const [duration, setDuration] = useState(20);

  useEffect(() => {
    function calculate() {
      const containerWidth = containerRef.current?.offsetWidth ?? 0;
      const setWidth = measureRef.current?.offsetWidth ?? 0;
      if (setWidth === 0) return;

      const needed = Math.ceil((containerWidth * 2) / setWidth) + 1;
      const finalRepeats = Math.max(needed, 2);
      const trackHalfWidth = setWidth * finalRepeats;

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRepeats(finalRepeats);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDuration(trackHalfWidth / PIXELS_PER_SECOND);
    }

    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, []);

  const oneSet = Array(repeats).fill(technologies).flat();
  const items = [...oneSet, ...oneSet];

  return (
    <div>
      <p className="pb-4 text-center text-xs tracking-[0.2em] text-foreground/50 uppercase">
      <ScrambleText text={t.marquee.label} />
     </p>

      <Link
        href="/tecnologias"
        ref={containerRef}
        className="group relative block cursor-pointer overflow-hidden border-b border-foreground/10 py-10"
      >
        <div
          ref={measureRef}
          className="pointer-events-none absolute top-0 left-0 flex -translate-y-full gap-16 opacity-0"
          aria-hidden="true"
        >
          {technologies.map((tech) => (
            <TechItem key={tech.id} tech={tech} />
          ))}
        </div>

        <div
          style={{ animationDuration: `${duration}s` }}
          className="flex w-max animate-[scroll-marquee_linear_infinite] gap-16 group-hover:[animation-play-state:paused]"
        >
          {items.map((tech, i) => (
            <TechItem key={`${tech.id}-${i}`} tech={tech} />
          ))}
        </div>
      </Link>
    </div>
  );
}