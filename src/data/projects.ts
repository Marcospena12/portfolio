import type { FloatingNode } from "@/components/AgentMap";

export type ProjectDetails = {
  architecture: string;
  stack: string[];
  agentCategories: { label: string; items: string[] }[];
  differentials: string[];
  metrics: { label: string; value: string }[];
   visual?: ProjectVisual;
};

export type ProjectVisual =
  | { kind: "agent-map"; nodes: FloatingNode[] }   // o diagrama da Luiza
  | { kind: "image"; src: string; alt: string };    // uma imagem do projeto


export type Project = {
  id: string;
  title: string;
  description: string;
  techIds: string[];
  type: "trabalho" | "pessoal";
  link?: string;
  details?: ProjectDetails;
};

export const projects: Project[] = [
  {
    id: "luiza",
    title: "Luiza - Super Agente de IA para suporte",
    description:
      "Sistema multiagente hierárquico construído no n8n para automatizar o suporte via Crisp, roteando cada conversa ao especialista certo. Resolve 70% das ~700 conversas mensais de forma totalmente autônoma e HUMANIZADA.",
    techIds: ["n8n", "postgresql", "redis", "slack", "metabase"],
    type: "trabalho",
    details: {
      architecture:
        "A Luiza é um sistema multiagente hierárquico: um agente orquestrador central classifica cada mensagem e a roteia para o especialista certo, ao invés de um único agente genérico tentando resolver tudo. Essa separação de responsabilidades reduz alucinação e permite prompts de sistema extremamente detalhados por domínio.",
      stack: [
        "Orquestração: n8n (nodes LangChain), agentes do tipo agentTool",
        "LLM principal: GPT-5.4 via OpenRouter, com fallback em GPT-5.4-nano",
        "Memória: PostgreSQL (Supabase), histórico das últimas 10 mensagens",
        "RAG: 2 vector stores em PGVector (base institucional + base de ajuda técnica)",
        "Cache/estado: Redis (Dragonfly) para flags de follow-up",
        "Canal: Crisp Chat via HTTP requests autenticados",
        "Integração interna: Slack para alertas aos times comercial/financeiro",
        "Output: parser JSON garantindo resposta sempre estruturada",
      ],
      agentCategories: [
        {
          label: "Suporte técnico",
          items: [
            "Suporte WhatsApp QR Code",
            "Suporte WABA (WhatsApp Oficial)",
            "Base de conhecimento geral",
            "Especialista em integrações",
          ],
        },
        {
          label: "Comercial",
          items: ["Roteamento comercial e financeiro", "Gestão de cancelamentos"],
        },
        {
          label: "Atendimento humano",
          items: ["Handoff humano", "Encerramento de conversa"],
        },
        {
          label: "Memória e contexto",
          items: [
            "Recuperação de contexto histórico",
            "Coleta de sugestões de melhoria",
          ],
        },
      ],
      differentials: [
        "Anti-alucinação por design — preços, links e prazos sempre vêm de fontes verificadas, nunca inventados",
        "Consciência temporal — cálculo de horário comercial em tempo real",
        "Fallback de modelo garantindo disponibilidade",
        "Notificações proativas ao time via Slack com resumos gerados por IA",
        "Memória persistente entre sessões",
        "Ciclo de melhoria contínua — análise pós-conversa de handoffs humanos para ajustar prompts",
        "6 dashboards no Metabase acompanhando resolução diária, semanal e mensal",
      ],
      metrics: [
        { label: "Resolução autônoma", value: "70%" },
        { label: "Conversas/mês", value: "~700" },
        { label: "Subagentes", value: "10" },
        { label: "Dashboards", value: "6" },
      ],
       visual: {
        kind: "agent-map",
        nodes: [
          { id: "feature", label: "Agent - Sugestões de Melhorias", color: "#3b82f6", top: "15%", left: "60%" },
          { id: "triage", label: "Agent - Trata Assuntos de Negócios", color: "#f59e0b", top: "28%", left: "79%" },
          { id: "primary-ch", label: "Agent - Especialista em WhatsApp Official", color: "#10b981", top: "50%", left: "85%" },
          { id: "legacy-ch", label: "Agent - Especialista em WhatsApp QRCode", color: "#34d399", top: "70%", left: "85%" },
          { id: "escalation", label: "Agent - Especialista em Human Handoff", color: "#f43f5e", top: "84%", left: "56%" },
          { id: "wrapup", label: "Agent - Finalizador de Conversas", color: "#64748b", top: "84%", left: "30%" },
          { id: "context", label: "Agent - Busca Contextos de Conversas antigas", color: "#8b5cf6", top: "60%", left: "20%" },
          { id: "billing", label: "Agent - Especialista em Assinaturas", color: "#ec4899", top: "32%", left: "24%" },
          { id: "ecosystem", label: "Agent - Especialista em Integrações", color: "#d946ef", top: "16%", left: "34%" },
        ],
      },
    },
  },
  
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