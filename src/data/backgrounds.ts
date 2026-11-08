export type SceneId =
  | "home"
  | "about"
  | "contact"
  | "tech"
  | "projects"
  | "courses"
  | "detail";

export type PageBackground = {
  scene: SceneId;
  src: string;
  position: string;
  mobilePosition: string;
  lightOpacity: number;
  darkOpacity: number;
  lightBloom: number;
  darkBloom: number;
};

export const backgrounds: Record<string, PageBackground> = {
  "/": {
    scene: "home",
    src: "/fundo-v2.webp",
    position: "center bottom",
    mobilePosition: "58% center",
    lightOpacity: 0.5,
    darkOpacity: 0.5,
    lightBloom: 0.2,
    darkBloom: 0.34,
  },
  "/sobre": {
    scene: "about",
    src: "/fundo-sobre.webp",
    position: "center center",
    mobilePosition: "44% center",
    lightOpacity: 0.42,
    darkOpacity: 0.46,
    lightBloom: 0.18,
    darkBloom: 0.3,
  },
  "/contato": {
    scene: "contact",
    src: "/fundo-contato.webp",
    position: "center center",
    mobilePosition: "50% center",
    lightOpacity: 0.42,
    darkOpacity: 0.46,
    lightBloom: 0.18,
    darkBloom: 0.3,
  },
  "/tecnologias": {
    scene: "tech",
    src: "/fundo-v2.webp",
    position: "center bottom",
    mobilePosition: "58% center",
    lightOpacity: 0.32,
    darkOpacity: 0.38,
    lightBloom: 0.12,
    darkBloom: 0.22,
  },
  "/projetos": {
    scene: "projects",
    src: "/fundo-v2.webp",
    position: "center bottom",
    mobilePosition: "58% center",
    lightOpacity: 0.32,
    darkOpacity: 0.38,
    lightBloom: 0.12,
    darkBloom: 0.22,
  },
  "/cursos": {
    scene: "courses",
    src: "/fundo-v2.webp",
    position: "center bottom",
    mobilePosition: "58% center",
    lightOpacity: 0.3,
    darkOpacity: 0.36,
    lightBloom: 0.12,
    darkBloom: 0.2,
  },
};

/** /projetos/[id] e /cursos/[id] */
export const detailBackground: PageBackground = {
  scene: "detail",
  src: "/fundo-v2.webp",
  position: "center bottom",
  mobilePosition: "58% center",
  lightOpacity: 0.28,
  darkOpacity: 0.34,
  lightBloom: 0.1,
  darkBloom: 0.18,
};

export function getBackground(pathname: string): PageBackground {
  return backgrounds[pathname] ?? detailBackground;
}
