export type PageBackground = {
  src: string;
  opacity: number;
  position: string;
};

export const backgrounds: Record<string, PageBackground> = {
  "/":            { src: "/fundo-v2.webp", opacity: 0.56, position: "object-bottom" },
  "/sobre":       { src: "/fundo-sobre.webp",    opacity: 0.40, position: "object-center" },
  "/contato":     { src: "/fundo-contato.webp",  opacity: 0.40, position: "object-center" },
  "/tecnologias": { src: "/fundo-v2.webp", opacity: 0.25, position: "object-bottom" },
  "/projetos":    { src: "/fundo-v2.webp", opacity: 0.25, position: "object-bottom" },
};

/** /projetos/[id] */
export const detailBackground: PageBackground = {
  src: "/fundo-v2.webp",
  opacity: 0.20,
  position: "object-bottom",
};