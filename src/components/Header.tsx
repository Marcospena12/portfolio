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
    <header
      ref={headerRef}
      className="relative z-10 flex flex-col items-center gap-3 px-4 py-4 md:flex-row md:justify-between md:px-8 md:py-6"
    >
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

      <nav
        data-hint="nav"
        className="flex w-full flex-wrap items-center justify-center gap-1 md:w-auto md:flex-nowrap md:justify-end md:gap-2"
      >
        {menuLinks.map((link) => {
          const isActive = isActivePath(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              data-active={isActive}
              className={`rounded-full px-3 py-2 text-sm font-medium transition-colors duration-150 sm:px-5 sm:py-2.5 md:px-6 md:py-3 md:text-base ${
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
            className="absolute bottom-5 hidden h-[2px] rounded-full bg-foreground/80 transition-[left,width] duration-300 ease-out md:block"
            style={{ left: indicator.left, width: indicator.width }}
          />
        )}
      </nav>
    </header>
  );
}