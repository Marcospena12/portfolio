import type { Localized } from "@/data/translations";

export type Course = {
  id: string; // slug da URL
  title: Localized;
  provider: string; // ex: "NVIDIA"
  summary: Localized; // 1 a 2 frases, usado no card
  description: Localized; // texto da página de detalhe
  topics: Localized[]; // "O que foi abordado"
  tags?: string[]; // chips simples, ex: "Deep Learning"
  workloadHours?: number;
  completedAt?: string; // "AAAA-MM"
  status: "concluido" | "em-andamento";
  color?: string; // hex do brilho do card (padrão "#888888")
  emblem: {
    src: string;
    srcDark?: string;
    alt: string;
    mode?: "spin" | "sway" | "static";
  };
  certificate?: {
    pdf?: string;
    verifyUrl?: string;
    code?: string;
  }; // pdf ex: "/certificados/arquivo.pdf"
  link?: string; // página oficial do curso
};

export const courses: Course[] = [
  {
    id: "nvidia-ai-infrastructure-operations-fundamentals",
    title: {
      pt: "AI Infrastructure and Operations Fundamentals",
      en: "AI Infrastructure and Operations Fundamentals",
    },
    provider: "NVIDIA · Coursera",
    summary: {
      pt: "Formação oficial da NVIDIA sobre a infraestrutura e as operações que sustentam cargas de IA em escala, do hardware acelerado a clusters, redes e MLOps.",
      en: "Official NVIDIA training on the infrastructure and operations behind AI workloads at scale, from accelerated hardware to clusters, networking, and MLOps.",
    },
    description: {
      pt: "Desenvolvido e ministrado oficialmente pela NVIDIA, o curso AI Infrastructure and Operations Fundamentals oferece uma visão técnica aprofundada da arquitetura de hardware, do ecossistema de software e das operações necessárias para sustentar aplicações de Inteligência Artificial em larga escala. A formação percorre desde os conceitos fundamentais de Machine Learning, Deep Learning e IA Generativa até as exigências técnicas de implantação em data centers on-premise, cloud, híbridos e multi-cloud.\n\nAo longo do curso, são exploradas as diferenças arquiteturais entre CPUs, GPUs e DPUs, o design de clusters de IA multi-sistema, as escolhas de armazenamento e redes de alta velocidade (como InfiniBand) e as práticas de AI Operations (MLOps) que garantem eficiência energética, monitoramento, orquestração e entrega contínua.",
      en: "Officially designed and taught by NVIDIA, AI Infrastructure and Operations Fundamentals provides an in-depth technical view of the hardware architecture, software ecosystem, and operations required to sustain Artificial Intelligence applications at scale. The course covers everything from the fundamentals of Machine Learning, Deep Learning, and Generative AI to the technical requirements for deploying in on-premise, cloud, hybrid, and multi-cloud data centers.\n\nThroughout the course, it explores the architectural differences between CPUs, GPUs, and DPUs, the design of multi-system AI clusters, storage and high-speed networking choices (such as InfiniBand), and AI Operations (MLOps) practices that ensure energy efficiency, monitoring, orchestration, and continuous delivery.",
    },
    topics: [
      {
        pt: "Fundamentos de IA, Machine Learning, Deep Learning e LLMs, com foco em aplicações práticas e nas oportunidades da IA generativa",
        en: "Foundations of AI, Machine Learning, Deep Learning, and LLMs, focusing on practical applications and the opportunities created by generative AI",
      },
      {
        pt: "Arquitetura de hardware: diferenças entre CPUs, GPUs e DPUs e como o paralelismo do ecossistema NVIDIA acelera cargas de IA",
        en: "Hardware architecture: differences between CPUs, GPUs, and DPUs and how parallelism across the NVIDIA ecosystem accelerates AI workloads",
      },
      {
        pt: "Design de clusters de IA multi-sistema, com considerações de armazenamento, redes de alta velocidade (InfiniBand) e eficiência energética",
        en: "Multi-system AI cluster design, including storage, high-speed networking (InfiniBand), and energy-efficiency considerations",
      },
      {
        pt: "AI Operations (MLOps): gerenciamento de infraestrutura, monitoramento e orquestração de clusters",
        en: "AI Operations (MLOps): infrastructure management, monitoring, and cluster orchestration",
      },
      {
        pt: "Agendamento de jobs, automação e entrega contínua com ferramentas de MLOps",
        en: "Job scheduling, automation, and continuous delivery with MLOps tooling",
      },
    ],
    tags: ["AI Infrastructure", "MLOps", "LLMs", "GPU Computing", "InfiniBand"],
    workloadHours: 7,
    completedAt: "2024-08",
    status: "concluido",
    color: "#76B900",
    emblem: {
      src: "/logos/cursos/nvidia-logo.png",
      alt: "NVIDIA Logo",
      mode: "spin",
    },
    certificate: {
      verifyUrl: "https://coursera.org/verify/90ATW6OGR34V",
      code: "90ATW6OGR34V",
    },
    link: "https://www.coursera.org/learn/ai-infrastructure-operations-fundamentals",
  },
];
