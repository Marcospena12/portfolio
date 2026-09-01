export type Technology = {
  id: string;
  name: string;
  summary: string;
  icon: string;
  color: string;
};

export const technologies: Technology[] = [
  {
    id: "n8n",
    name: "n8n",
    summary: "Automação de fluxos de trabalho e integrações entre sistemas.",
    icon: "SiN8N",
    color: "#EA4B71",
  },
  {
    id: "docker",
    name: "Docker",
    summary: "Containerização de aplicações para ambientes consistentes.",
    icon: "SiDocker",
    color: "#2496ED",
  },
  {
    id: "react",
    name: "React",
    summary: "Construção de interfaces web modernas e reativas.",
    icon: "SiReact",
    color: "#61DAFB",
  },
];