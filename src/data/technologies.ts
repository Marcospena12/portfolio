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
    summary: "Automação de fluxos de trabalho e integrações entre sistemas.\n Clique aqui pra saber mais",
    icon: "SiN8N",
    color: "#EA4B71",
  },
  {
    id: "docker",
    name: "Docker",
    summary: "Containerização de aplicações para ambientes consistentes. \n Clique aqui pra saber mais",
    icon: "SiDocker",
    color: "#2496ED",
  },
  {
    id: "react",
    name: "React",
    summary: "Construção de interfaces web modernas e reativas.\n Clique aqui pra saber mais",
    icon: "SiReact",
    color: "#61DAFB",
  },
  {
    id: "proxmox",
    name: "Proxmox",
    summary: "Virtualização de servidores e gerenciamento de VMs para ambientes de infraestrutura.",
    icon: "SiProxmox",
    color: "#E57000",
  },
  {
    id: "slack",
    name: "Slack",
    summary: "Comunicação e integração de times via automações e bots.",
    icon: "FaSlack",
    color: "#4A154B",
  },
  {
    id: "synology",
    name: "Synology",
    summary: "Armazenamento em rede (NAS) para backups e serviços locais.",
    icon: "SiSynology",
    color: "#B5B5B6",
  },
  {
    id: "homeassistant",
    name: "Home Assistant",
    summary: "Automação residencial integrando dispositivos IoT.",
    icon: "SiHomeassistant",
    color: "#18BCF2", // ⚠️ confirmar no simpleicons.org
  },
  {
    id: "typescript",
    name: "TypeScript",
    summary: "Tipagem estática para JavaScript, mais segurança no código.",
    icon: "SiTypescript",
    color: "#3178C6",
  },
  {
    id: "javascript",
    name: "JavaScript",
    summary: "Linguagem base para desenvolvimento web moderno.",
    icon: "SiJavascript",
    color: "#F7DF1E",
  },
  {
    id: "php",
    name: "PHP",
    summary: "Desenvolvimento back-end e scripts server-side.",
    icon: "SiPhp",
    color: "#777BB4",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    summary: "Banco de dados relacional para aplicações robustas.",
    icon: "SiPostgresql",
    color: "#4169E1",
  },
  {
    id: "supabase",
    name: "Supabase",
    summary: "Backend-as-a-service com banco de dados e autenticação.",
    icon: "SiSupabase",
    color: "#3ECF8E",
  },
  {
    id: "python",
    name: "Python",
    summary: "Scripts, automações e desenvolvimento de agentes de IA.",
    icon: "SiPython",
    color: "#3776AB",
  },
  {
    id: "git",
    name: "Git",
    summary: "Controle de versão para todos os projetos.",
    icon: "SiGit",
    color: "#F05032",
  },
  {
    id: "gitlab",
    name: "GitLab",
    summary: "Versionamento e CI/CD para pipelines de deploy.",
    icon: "SiGitlab",
    color: "#FC6D26",
  },
  {
    id: "redis",
    name: "Redis",
    summary: "Cache e armazenamento em memória de alta performance.",
    icon: "SiRedis",
    color: "#DC382D",
  },
  {
  id: "node",
  name: "Node.js",
  summary: "Runtime JavaScript para desenvolvimento back-end e scripts.",
  icon: "SiNodedotjs",
  color: "#339933",
},
{
  id: "metabase",
  name: "Metabase",
  summary: "Dashboards e visualização de dados para tomada de decisão.",
  icon: "SiMetabase",
  color: "#509EE3",
},
{
  id: "ubiquite",
  name: "Ubiquiti",
  summary: "Equipamentos de rede para infraestrutura doméstica e profissional.",
  icon: "SiUbiquiti",
  color: "#0559C9",
},
{
  id: "linux",
  name: "Linux",
  summary: "Sistemas operacionais para servidores e ambientes de infraestrutura.",
  icon: "SiLinux",
  color: "#FCC624",
},
{
  id: "debian",
  name: "Debian",
  summary: "Distribuição Linux para servidores e ambientes de produção.",
  icon: "SiDebian",
  color: "#A81D33",
},
{
  id: "raspberry",
  name: "Raspberry Pi",
  summary: "Computação de baixo custo para projetos de automação e IoT.",
  icon: "SiRaspberrypi",
  color: "#A22846",
},
{
  id: "ollama",
  name: "Ollama",
  summary: "Execução local de modelos de linguagem para experimentação com IA.",
  icon: "SiOllama",
  color: "#000000", 
},
{
  id: "mqtt",
  name: "MQTT",
  summary: "Protocolo de mensageria leve para dispositivos IoT.",
  icon: "SiMqtt",
  color: "#660066",
},
{
  id: "cloudflare",
  name: "Cloudflare",
  summary: "Rede de borda e segurança, com tunnel para expor serviços internos.",
  icon: "SiCloudflare",
  color: "#F38020",
},
{
  id: "nextjs",
  name: "Next.js",
  summary: "Framework React para aplicações web com renderização no servidor.",
  icon: "SiNextdotjs",
  color: "#9CA3AF",
},
{
  id: "tailwindcss",
  name: "Tailwind CSS",
  summary: "Framework de estilos utilitário para interfaces consistentes.",
  icon: "SiTailwindcss",
  color: "#06B6D4",
}
];