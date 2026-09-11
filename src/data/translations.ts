export const translations = {
  pt: {
    nav: {
      tecnologias: "Tecnologias",
      projetos: "Projetos",
      sobre: "Sobre",
      contato: "Contato",
    },
    hero: {
      role: "Desenvolvedor",
      greeting: "Olá, eu sou o Marcos",
      description:
        "Construo soluções e automações, unindo experiência em DevOps com desenvolvimento web moderno.",
    },
    marquee: {
      label: "Eu sei um pouco disso",
    },
    pages: {
      tecnologias: { eyebrow: "Explore", title: "Tecnologias" },
      projetos: { eyebrow: "Portfólio", title: "Projetos" },
      sobre: { eyebrow: "Quem sou eu", title: "Sobre" },
      contato: { eyebrow: "Vamos conversar", title: "Contato" },
    },
    sobre: {
      paragraphs: [ "Nasci em 2001, mas minha história com computadores começou bem antes de eu escolher isso como profissão. Desde 2007, tenho contato praticamente diário com computadores. Montar PC'S virou quase um hobby anual, e entre 2008 e 2012 passei boa parte do tempo em fóruns de tecnologia, absorvendo tudo que podia sobre o assunto.",
        "Estudei em escola pública e em 2023/2024, entrei na faculdade de Sistemas de Informação na PUC Minas, decisão natural depois de tantos anos de curiosidade acumulada.",
        "Tenho bastante interesse por infraestrutura e experimentação técnica: já mexi com dispositivos IoT, redes, virtualização com Proxmox e VMs, e armazenamento em nuvem e local (incluindo NAS). Mas o que mais me motiva é ir além de só operar esse ecossistema é desenvolver scripts, jobs e pequenas automações que conversam diretamente com essas tecnologias, otimizando processos e reduzindo trabalho manual. É nesse cruzamento entre infraestrutura complexa e desenvolvimento de software que sinto que consigo agregar mais valor.",
        "Hoje, meu foco é aproveitar esses primeiros anos de carreira ao máximo: trabalhar, estagiar, errar, aprender rápido, e me consolidar de verdade num mercado que sei que está bem concorrido. Não tenho pressa de saber tudo, tenho pressa de continuar evoluindo.",
      ],
    }
  },
  en: {
    nav: {
      tecnologias: "Technologies",
      projetos: "Projects",
      sobre: "About",
      contato: "Contact",
    },
    hero: {
      role: "Developer",
      greeting: "Hi, I'm Marcos",
      description:
        "I build solutions and automations, combining DevOps experience with modern web development.",
    },
    marquee: {
      label: "I know a little about that",
    },
    pages: {
      tecnologias: { eyebrow: "Explore", title: "Technologies" },
      projetos: { eyebrow: "Portfolio", title: "Projects" },
      sobre: { eyebrow: "Who I am", title: "About" },
      contato: { eyebrow: "Let's talk", title: "Contact" },
    },
    sobre: {
      paragraphs: [ "I was born in 2001, but my story with computers started long before I chose it as a career. I've had daily contact with machines since 2007. Building computers became almost an annual hobby, and between 2008 and 2012 I spent a good chunk of my time on tech forums, soaking up everything I could on the subject.",
    "I studied at a public school and, in 2023/2024, started a degree in Information Systems at PUC Minas, a natural step after so many years of accumulated curiosity.",
    "I have a strong interest in infrastructure and hands-on experimentation: I've worked with IoT devices, networking, virtualization with Proxmox and VMs, and cloud and local storage (including NAS). But what drives me most is going beyond just operating that ecosystem. I enjoy building scripts, jobs, and small automations that talk directly to these technologies, streamlining processes and cutting down manual work. It's at this intersection of complex infrastructure and software development that I feel I add the most value.",
    "Right now, my focus is making the most of these early career years: working, interning, making mistakes, learning fast, and truly establishing myself in a market I know is quite competitive. I'm not in a hurry to know everything. I'm in a hurry to keep growing."],
    }
  },
};

export type Locale = keyof typeof translations;