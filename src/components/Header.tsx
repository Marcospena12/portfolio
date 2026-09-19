"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ScrambleText } from "@/components/ScrambleText";
import { useLanguage } from "@/components/LanguageProvider";

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const headerRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const menuLinks = [
    { href: "/tecnologias", label: t.nav.tecnologias },
    { href: "/projetos", label: t.nav.projetos },
    { href: "/sobre", label: t.nav.sobre },
    { href: "/contato", label: t.nav.contato },
  ];

  useEffect(() => {
    function measure() {
      const header = headerRef.current;
      if (!header) return;

      const active = header.querySelector<HTMLAnchorElement>("[data-active='true']");
      if (!active) return;

      const headerRect = header.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();

      setIndicator({
        left: activeRect.left - headerRect.left,
        width: activeRect.width,
      });
    }

    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [pathname]);

  return (
    <header ref={headerRef} className="relative z-10 flex items-center justify-between px-8 py-6">
      <Link
        href="/"
        data-active={isActivePath(pathname, "/")}
        className={`text-lg font-semibold transition-colors ${
          isActivePath(pathname, "/")
            ? "text-foreground"
            : "text-foreground/70 hover:text-foreground"
        }`}
      >
        Home
      </Link>

      <nav className="flex items-center gap-2">
        {menuLinks.map((link) => {
          const isActive = isActivePath(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              data-active={isActive}
              className={`rounded-full px-6 py-3 text-base font-medium transition-colors duration-150 ${
                isActive ? "text-foreground" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              <ScrambleText text={link.label} />
            </Link>
          );
        })}
        <LanguageToggle />
        <ThemeToggle />
        {indicator && (
          <span
            aria-hidden="true"
            className="absolute bottom-5 h-[2px] rounded-full bg-foreground/80 transition-[left,width] duration-300 ease-out"
            style={{ left: indicator.left, width: indicator.width }}
          />
        )}
      </nav>
    </header>
  );
}