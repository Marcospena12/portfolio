"use client";

import { useEffect, useState } from "react";

const RADIUS = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScrollHint() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(percent, 100));
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="relative h-14 w-14">
        <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
          <circle cx="28" cy="28" r={RADIUS} fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground/10" />
          <circle
            cx="28"
            cy="28"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className="text-foreground transition-[stroke-dashoffset] duration-150"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
  <span className="text-xs font-semibold text-foreground">
    {Math.round(progress)}%
  </span>
</div>
      </div>
    </div>
  );
}