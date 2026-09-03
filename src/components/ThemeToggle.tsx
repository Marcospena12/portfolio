"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-16" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Alternar tema"
      className={`relative flex h-9 w-16 items-center rounded-full border border-foreground/10 p-1 transition-colors duration-300 ${
        isDark ? "bg-foreground/10" : "bg-amber-100"
      }`}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full bg-background text-sm shadow-md transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isDark ? "translate-x-0" : "translate-x-7"
        }`}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}