export type Project = {
  id: string;
  title: string;
  description: string;
  techIds: string[];
  type: "trabalho" | "pessoal";
  link?: string;
};

export const projects: Project[] = [
  {
    id: "automacao-relatorios",
    title: "Automação de relatórios",
    description:
      "Fluxo automatizado que coleta dados de múltiplas fontes e gera relatórios periódicos sem intervenção manual.",
    techIds: ["n8n"],
    type: "trabalho",
  },
  {
    id: "portfolio",
    title: "Este portfólio",
    description:
      "O próprio site que você está vendo agora, construído do zero com Next.js e Tailwind.",
    techIds: ["react"],
    type: "pessoal",
    link: "https://github.com/seu-usuario/portfolio",
  },
  {
    id: "ambiente-conteinerizado",
    title: "Ambiente conteinerizado de desenvolvimento",
    description:
      "Configuração de containers para padronizar ambientes de desenvolvimento entre a equipe.",
    techIds: ["docker"],
    type: "trabalho",
  },
];