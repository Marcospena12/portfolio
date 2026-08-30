import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
      <span className="text-sm font-semibold">Marcos</span>
      <ThemeToggle />
    </header>
  );
}