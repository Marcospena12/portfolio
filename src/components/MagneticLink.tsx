"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type MagneticLinkProps = {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
};

export function MagneticLink({ href, isActive, children }: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPosition({ x, y });
  }

  function handleMouseLeave() {
    setPosition({ x: 0, y: 0 });
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      className={`rounded-full px-6 py-3 text-base font-medium transition-[transform,color,text-shadow] duration-150 ease-out hover:text-foreground hover:[text-shadow:0_0_12px_var(--foreground)] ${
        isActive ? "text-foreground" : "text-foreground/70"
      }`}
    >
      {children}
    </Link>
  );
}