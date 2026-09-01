import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
      <Link href="/" className="text-sm font-semibold">
        Marcos
      </Link>
      <nav className="flex items-center gap-6">
        <Link href="/tecnologias" className="text-sm text-foreground/70 hover:text-foreground">
          Tecnologias
        </Link>
        <Link href="/projetos" className="text-sm text-foreground/70 hover:text-foreground">
          Projetos
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}