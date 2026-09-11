"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MagneticLink } from "@/components/MagneticLink";
import { ScrambleText } from "@/components/ScrambleText";
import { useLanguage } from "@/components/LanguageProvider";

export function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
      <Link href="/" className="text-lg font-semibold">
        Home
      </Link>
      <nav className="flex items-center gap-2">
        <MagneticLink href="/tecnologias" isActive={pathname === "/tecnologias"}>
          <ScrambleText text={t.nav.tecnologias} />
        </MagneticLink>
        <MagneticLink href="/projetos" isActive={pathname.startsWith("/projetos")}>
          <ScrambleText text={t.nav.projetos} />
        </MagneticLink>
        <MagneticLink href="/sobre" isActive={pathname === "/sobre"}>
          <ScrambleText text={t.nav.sobre} />
        </MagneticLink>
        <MagneticLink href="/contato" isActive={pathname === "/contato"}>
          <ScrambleText text={t.nav.contato} />
        </MagneticLink>
        <LanguageToggle />
        <ThemeToggle />
      </nav>
    </header>
  );
}