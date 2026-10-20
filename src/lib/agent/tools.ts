import { tool } from "ai";
import { z } from "zod";
import { translations } from "@/data/translations";
import {projects} from "@/data/projects";
import { technologies } from "@/data/technologies";
import { contactLinks } from "@/data/contact";

const lang = z.enum(["pt", "en"]);

export const getBio = tool({
  description:
    "Retorna a biografia do Marcos (história, formação, interesses técnicos e foco de carreira).",
  inputSchema: z.object({ lang }),
  execute: async ({ lang }) => {
    return {
      paragraphs: translations[lang].sobre.paragraphs,
    };
  },
});

export const listProjects = tool({
  description: "Retorna os projetos do Marcos",
  inputSchema: z.object({ lang }),
  execute: async ({ lang }) => {
    return {
      projects: projects.map((p) => {
        return {
          id: p.id,
          title: p.title[lang],        // título no idioma do visitante
          description: p.description[lang],  // descrição no idioma do visitante
          type: p.type,
          techIds: p.techIds,
        };
      }),
    };
  },
});


export const getProject = tool({
  description: "Retorna o case completo de um projeto específico (arquitetura, stack, diferenciais e métricas) a partir do id. Use os ids retornados por listProjects.",
  inputSchema: z.object({
    id: z.string().describe("id do projeto, como retornado por listProjects"),
    lang,
  }),
  execute: async ({ id, lang }) => {
    const project = projects.find((p) => p.id === id);

    if (!project) {
      return { found: false };
    }

    return {
      found: true,
      project: {
        id: project.id,
        title: project.title[lang],
        description: project.description[lang],
        type: project.type,
        techIds: project.techIds,
        link: project.link,
        architecture: project.details?.architecture[lang],
        stack: project.details?.stack.map((s)=> s[lang]),           
        differentials: project.details?.differentials.map((s)=>s[lang]),
        metrics: project.details?.metrics.map((m) => ({
  label: m.label[lang],
  value: m.value[lang],
})),           // cada item vira { label: ..., value: ... } no idioma
        agentCategories: project.details?.agentCategories?.map((m) => ({
          label: m.label[lang],
          items: m.items.map((i) => i[lang]),
        })),           // cada item vira { label, items } no idioma
      },
    };
  },
});

export const listTechnologies = tool({ description: "Lista as tecnologias que o Marcos usa e domina, com um resumo de cada. Use quando perguntarem sobre stack, ferramentas ou tecnologias.",
  inputSchema: z.object({}),
  execute: async () => {
    return {
      technologies: technologies.map((t) => ({ id: t.id, name: t.name, summary: t.summary.split("\n")[0] })),
    };
  },})
  
  export const getContact = tool({
  description: "Lista os contatos disponíveis pra conseguir falar com o Marcos. Apresente cada item como link markdown com rótulo: [label](href).",
  inputSchema: z.object({}),
  execute: async () => {
    return {
      links: contactLinks.map((l) => ({id: l.id, label: l.label, href: l.href})),
    };
  },
});

export const tools = {
  getBio,
  listProjects,
  getProject,
  listTechnologies,
  getContact,
};