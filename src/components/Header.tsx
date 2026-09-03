import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MagneticLink } from "@/components/MagneticLink";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
      <Link href="/" className="text-lg font-semibold">
        Home
      </Link>
      <nav className="flex items-center gap-2">
        <MagneticLink href="/tecnologias">Tecnologias</MagneticLink>
        <MagneticLink href="/projetos">Projetos</MagneticLink>
        <MagneticLink href="/sobre">Sobre</MagneticLink>
        <MagneticLink href="/contato">Contato</MagneticLink>
        <ThemeToggle />
      </nav>
    </header>
  );
}