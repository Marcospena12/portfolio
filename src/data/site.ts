// Configuração central do site: fonte única para canonical, sitemap, robots,
// Open Graph e JSON-LD. Trocar de domínio = mudar só aqui.
import { contactLinks } from "@/data/contact";

export const SITE_URL = "https://marcos-pena.vercel.app";
export const SITE_NAME = "Marcos — Portfólio";
export const SITE_DESCRIPTION =
  "Portfólio de Marcos — desenvolvimento, automações e tecnologia.";

/** Perfis externos do Marcos (usados no JSON-LD `sameAs`). */
export const SITE_SOCIALS = contactLinks
  .filter((link) => link.href.startsWith("http"))
  .map((link) => link.href);

/** Áreas de conhecimento para o schema Person (dados estruturados). */
export const SITE_KNOWS_ABOUT = [
  "DevOps",
  "Infraestrutura",
  "Automação",
  "Inteligência Artificial",
  "n8n",
  "Docker",
  "Proxmox",
  "Next.js",
];
