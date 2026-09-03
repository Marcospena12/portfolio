"use client";

import { contactLinks } from "@/data/contact";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import type { IconType } from "react-icons";

const allIcons = { ...FaIcons, ...SiIcons };

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-background px-6 pt-32 pb-20 text-foreground">
      <h1 className="mb-10 text-4xl font-bold">Contato</h1>
      <div className="flex max-w-md flex-col gap-3">
        {contactLinks.map((link) => {
          const Icon = allIcons[link.icon as keyof typeof allIcons] as IconType;
          return ( <a
            
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-foreground/10 p-4 transition-colors hover:border-foreground/30"
            >
              <Icon className="text-xl" />
              <span>{link.label}</span>
            </a>
          );
        })}
      </div>
    </main>
  );
}