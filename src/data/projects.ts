import type { FloatingNode } from "@/components/AgentMap";
import type { Localized } from "@/data/translations";

export type ProjectVisual =
  | { kind: "agent-map"; nodes: FloatingNode[] }
  | { kind: "tilt-logo"; src: string; alt: Localized; href?: string }
  | { kind: "glow-logos"; logos: { src: string; alt: Localized }[] }
  | { kind: "clock-lamp"; schedule: { on: string; off: string } }
  | { kind: "quota-meter"; rooms: { label: Localized; used: number; quota: number }[] }
  | { kind: "orbit-logos"; logos: { src: string; alt: Localized }[]; radius?: number; size?: number; duration?: number }
  | { kind: "gitlab-slack-flow"; devs?: number }
  | { kind: "rag-pipeline"; cadence: Localized }
  | { kind: "handoff-fanout"; monthly: Localized }
  | { kind: "nas-raid-stack" }
  | { kind: "pbs-layers" };

export type ProjectDetails = {
  architecture: Localized;
  stack: Localized[];
  categoriesTitle?: Localized;
  agentCategories?: { label: Localized; items: Localized[] }[];
  differentials: Localized[];
  metrics: { label: Localized; value: Localized }[];
  visual?: ProjectVisual;
};

export type Project = {
  id: string;
  title: Localized;
  description: Localized;
  techIds: string[];
  type: "trabalho" | "pessoal";
  link?: string;
  details?: ProjectDetails;
};

export const projects: Project[] = [
  {
    id: "luiza",
    title: { pt: "Super Agente de IA para Suporte", en: "AI Super Agent for Support" },
    description: {
      pt: "Sistema multiagente hierárquico construído no n8n para automatizar o suporte via Crisp, roteando cada conversa ao especialista certo. Resolve 70% das ~700 conversas mensais de forma totalmente autônoma e HUMANIZADA.",
      en: "Hierarchical multi-agent system built on n8n to automate support via Crisp, routing each conversation to the right specialist. Resolves 70% of the ~700 monthly conversations fully autonomously, in a human way.",
    },
    techIds: ["n8n", "javascript", "postgresql", "redis", "slack", "metabase"],
    type: "trabalho",
    details: {
      architecture: {
        pt: "É um sistema multiagente hierárquico: um agente orquestrador central classifica cada mensagem e a roteia para o especialista certo, ao invés de um único agente genérico tentando resolver tudo. Essa separação de responsabilidades reduz alucinação e permite prompts de sistema extremamente detalhados por domínio.",
        en: "This is a hierarchical multi-agent system: a central orchestrator agent classifies each message and routes it to the right specialist, instead of a single generic agent trying to handle everything. That separation of responsibilities reduces hallucination and allows for extremely detailed system prompts per domain.",
      },
      stack: [
        {
          pt: "Orquestração: n8n (nodes LangChain), agentes do tipo agentTool",
          en: "Orchestration: n8n (LangChain nodes), agentTool-type agents",
        },
        {
          pt: "LLM principal: GPT-5.4 via OpenRouter, com fallback em GPT-5.4-nano",
          en: "Primary LLM: GPT-5.4 via OpenRouter, falling back to GPT-5.4-nano",
        },
        {
          pt: "Memória: PostgreSQL (Supabase), histórico das últimas 10 mensagens",
          en: "Memory: PostgreSQL (Supabase), history of the last 10 messages",
        },
        {
          pt: "RAG: 2 vector stores em PGVector (base institucional + base de ajuda técnica)",
          en: "RAG: 2 vector stores in PGVector (institutional knowledge base + technical help base)",
        },
        {
          pt: "Cache/estado: Redis (Dragonfly) para flags de follow-up",
          en: "Cache/state: Redis (Dragonfly) for follow-up flags",
        },
        {
          pt: "Canal: Crisp Chat via HTTP requests autenticados",
          en: "Channel: Crisp Chat over authenticated HTTP requests",
        },
        {
          pt: "Integração interna: Slack para alertas aos times comercial/financeiro",
          en: "Internal integration: Slack for alerts to the commercial/finance teams",
        },
        {
          pt: "Output: parser JSON garantindo resposta sempre estruturada",
          en: "Output: JSON parser guaranteeing a consistently structured response",
        },
      ],
      agentCategories: [
        {
          label: { pt: "Suporte técnico", en: "Technical support" },
          items: [
            { pt: "Suporte WhatsApp QR Code", en: "WhatsApp QR Code support" },
            { pt: "Suporte WABA (WhatsApp Oficial)", en: "WABA support (official WhatsApp)" },
            { pt: "Base de conhecimento geral", en: "General knowledge base" },
            { pt: "Especialista em integrações", en: "Integrations specialist" },
          ],
        },
        {
          label: { pt: "Comercial", en: "Commercial" },
          items: [
            { pt: "Roteamento comercial e financeiro", en: "Commercial and financial routing" },
            { pt: "Gestão de cancelamentos", en: "Cancellation handling" },
          ],
        },
        {
          label: { pt: "Atendimento humano", en: "Human support" },
          items: [
            { pt: "Handoff humano", en: "Human handoff" },
            { pt: "Encerramento de conversa", en: "Conversation closing" },
          ],
        },
        {
          label: { pt: "Memória e contexto", en: "Memory and context" },
          items: [
            { pt: "Recuperação de contexto histórico", en: "Historical context retrieval" },
            { pt: "Coleta de sugestões de melhoria", en: "Collecting improvement suggestions" },
          ],
        },
      ],
      differentials: [
        {
          pt: "Anti-alucinação por design: preços, links e prazos sempre vêm de fontes verificadas, nunca inventados",
          en: "Anti-hallucination by design: prices, links and deadlines always come from verified sources, never invented",
        },
        {
          pt: "Consciência temporal: cálculo de horário comercial em tempo real",
          en: "Time awareness: real-time business hours calculation",
        },
        {
          pt: "Fallback de modelo garantindo disponibilidade",
          en: "Model fallback guaranteeing availability",
        },
        {
          pt: "Memória persistente entre sessões",
          en: "Persistent memory across sessions",
        },
        {
          pt: "6 dashboards no Metabase acompanhando resolução diária, semanal e mensal",
          en: "6 Metabase dashboards tracking daily, weekly and monthly resolution",
        },
      ],
      metrics: [
        { label: { pt: "Resolução autônoma", en: "Autonomous resolution" }, value: { pt: "70%", en: "70%" } },
        { label: { pt: "Conversas/mês", en: "Conversations/month" }, value: { pt: "~700", en: "~700" } },
        { label: { pt: "Subagentes", en: "Subagents" }, value: { pt: "10", en: "10" } },
        { label: { pt: "Dashboards", en: "Dashboards" }, value: { pt: "6", en: "6" } },
      ],
      visual: {
        kind: "agent-map",
        nodes: [
          { id: "feature", label: { pt: "Agent - Sugestões de Melhorias", en: "Agent - Improvement Suggestions" }, color: "#3b82f6", top: "15%", left: "60%" },
          { id: "triage", label: { pt: "Agent - Trata Assuntos de Negócios", en: "Agent - Handles Business Matters" }, color: "#f59e0b", top: "28%", left: "79%" },
          { id: "primary-ch", label: { pt: "Agent - Especialista em WhatsApp Official", en: "Agent - WhatsApp Official Specialist" }, color: "#10b981", top: "50%", left: "85%" },
          { id: "legacy-ch", label: { pt: "Agent - Especialista em WhatsApp QRCode", en: "Agent - WhatsApp QR Code Specialist" }, color: "#34d399", top: "70%", left: "85%" },
          { id: "escalation", label: { pt: "Agent - Especialista em Human Handoff", en: "Agent - Human Handoff Specialist" }, color: "#f43f5e", top: "84%", left: "56%" },
          { id: "wrapup", label: { pt: "Agent - Finalizador de Conversas", en: "Agent - Conversation Finalizer" }, color: "#64748b", top: "84%", left: "30%" },
          { id: "context", label: { pt: "Agent - Busca Contextos de Conversas antigas", en: "Agent - Retrieves Past Conversation Context" }, color: "#8b5cf6", top: "60%", left: "20%" },
          { id: "billing", label: { pt: "Agent - Especialista em Assinaturas", en: "Agent - Subscriptions Specialist" }, color: "#ec4899", top: "32%", left: "24%" },
          { id: "ecosystem", label: { pt: "Agent - Especialista em Integrações", en: "Agent - Integrations Specialist" }, color: "#d946ef", top: "16%", left: "34%" },
        ],
      },
    },
  },

  {
    id: "ni-node",
    title: {
      pt: "Nó verificado do n8n para Notificações Inteligentes",
      en: "Verified n8n Node for Notificações Inteligentes",
    },
    description: {
      pt: "Nó oficialmente verificado pelo n8n que transforma a API da Notificações Inteligentes em blocos visuais nativos: permitindo criar, editar, buscar e gerenciar leads e integrações sem escrever código.",
      en: "Officially verified n8n node that turns the Notificações Inteligentes API into native visual blocks: letting you create, edit, search and manage leads and integrations without writing code.",
    },
    techIds: ["n8n", "typescript", "git"],
    type: "trabalho",
    link: "https://github.com/GPMP/n8n-node-notificacoes-inteligentes/blob/main/README.md",
    details: {
      architecture: {
        pt: "O nó expõe dois recursos principais, Integrações e Leads, seguindo convenções CRUD (Criar, Ler, Atualizar, Deletar) construídas em torno de identificadores únicos. O fluxo típico de uso é: buscar/listar para descobrir o ID de um item, e então usar esse ID numa operação seguinte (editar, marcar com tag, deletar). Toda operação retorna confirmações estruturadas de sucesso ou erros detalhados (código HTTP + mensagem legível), permitindo construir lógica condicional robusta dentro do fluxo. A autenticação usa um Bearer Token gerado por organização no painel da NI, permitindo múltiplas credenciais para múltiplos negócios.",
        en: "The node exposes two main resources, Integrations and Leads, following CRUD conventions (Create, Read, Update, Delete) built around unique identifiers. The typical usage flow is: search/list to discover an item's ID, then use that ID in a follow-up operation (edit, tag, delete). Every operation returns structured success confirmations or detailed errors (HTTP code + readable message), which makes it possible to build robust conditional logic inside the workflow. Authentication uses a Bearer Token generated per organization in the NI dashboard, allowing multiple credentials for multiple businesses.",
      },
      stack: [
        { pt: "Linguagem: TypeScript (exigência do SDK de nós do n8n)", en: "Language: TypeScript (a requirement of the n8n node SDK)" },
        { pt: "Zero dependências de runtime: requisito obrigatório para verificação", en: "Zero runtime dependencies: a mandatory requirement for verification" },
        { pt: "Passou pelo linter automatizado oficial (@n8n/scan-community-package)", en: "Passed the official automated linter (@n8n/scan-community-package)" },
        { pt: "Revisão manual pela equipe do n8n, com ajustes iterativos solicitados", en: "Manual review by the n8n team, with iterative changes requested" },
        { pt: "Documentação em inglês (exigência do programa de verificação)", en: "Documentation in English (a requirement of the verification program)" },
        { pt: "Autenticação via Bearer Token, com escopo por organização", en: "Authentication via Bearer Token, scoped per organization" },
      ],
      agentCategories: [
        {
          label: { pt: "Integrações", en: "Integrations" },
          items: [
            { pt: "Criar nova integração", en: "Create a new integration" },
            { pt: "Listar todas as integrações", en: "List all integrations" },
            { pt: "Buscar integração", en: "Search an integration" },
            { pt: "Editar nome da integração", en: "Edit the integration name" },
            { pt: "Deletar integração", en: "Delete an integration" },
          ],
        },
        {
          label: { pt: "Leads", en: "Leads" },
          items: [
            { pt: "Criar lead", en: "Create lead" },
            { pt: "Atualizar lead", en: "Update lead" },
            { pt: "Criar ou atualizar lead (deduplicando por telefone)", en: "Create or update lead (deduplicating by phone number)" },
            { pt: "Adicionar tags", en: "Add tags" },
            { pt: "Atualizar tags", en: "Update tags" },
            { pt: "Remover tags", en: "Remove tags" },
            { pt: "Buscar todos os leads", en: "Search all leads" },
            { pt: "Buscar lead por ID", en: "Search lead by ID" },
            { pt: "Deletar lead", en: "Delete lead" },
          ],
        },
      ],
      differentials: [
        {
          pt: "Selo \"Verified\" oficial do n8n: aparece na busca nativa do app e tem página própria na Biblioteca de Integrações",
          en: "Official n8n \"Verified\" badge: it shows up in the app's native search and has its own page in the Integration Library",
        },
        {
          pt: "Ideia nascida de demanda real: usuários da própria Notificações Inteligentes solicitaram essa integração",
          en: "An idea born from real demand: Notificações Inteligentes users themselves requested this integration",
        },
        {
          pt: "Operação inteligente \"Criar ou Atualizar Lead\" que deduplica automaticamente por número de telefone",
          en: "Smart \"Create or Update Lead\" operation that automatically deduplicates by phone number",
        },
        {
          pt: "Design orientado a ID permite encadear operações complexas dentro do mesmo fluxo",
          en: "ID-oriented design allows chaining complex operations within the same workflow",
        },
        {
          pt: "Zero dependências de runtime: exigiu otimizar a implementação usando só os helpers HTTP nativos do n8n",
          en: "Zero runtime dependencies: this required optimizing the implementation using only n8n's native HTTP helpers",
        },
      ],
      metrics: [
        { label: { pt: "Status", en: "Status" }, value: { pt: "Verified", en: "Verified" } },
        { label: { pt: "Recursos", en: "Resources" }, value: { pt: "2", en: "2" } },
        { label: { pt: "Operações", en: "Operations" }, value: { pt: "14", en: "14" } },
        { label: { pt: "Dependências", en: "Dependencies" }, value: { pt: "0", en: "0" } },
      ],
      visual: {
        kind: "tilt-logo",
        src: "/logos/ni-node-logo.svg",
        alt: { pt: "Logo do nó Notificações Inteligentes", en: "Notificações Inteligentes node logo" },
        href: "https://n8n.io/integrations/ni/",
      },
    },
  },

  {
    id: "telefonia-ip",
    title: {
      pt: "Infraestrutura Robusta de Telefonia IP (Asterisk + FreePBX)",
      en: "Robust IP Telephony Infrastructure (Asterisk + FreePBX)",
    },
    description: {
      pt: "Infraestrutura de telefonia IP construída do zero para o coworking da GPM (dois andares, 8 salas + recepção, 10+ ramais IP), integrando o porteiro Intelbras ao FreePBX, com automação de chamadas, controle de acesso, backup de chamadas e diagnóstico completo de rede, SIP e firewall.",
      en: "IP telephony infrastructure built from scratch for the GPM coworking space (two floors, 8 rooms plus reception, 10+ IP extensions), integrating the Intelbras intercom into FreePBX, with call automation, access control, call recording backup and full network, SIP and firewall diagnostics.",
    },
    techIds: ["linux", "debian", "proxmox", "ubiquite"],
    type: "trabalho",
    details: {
      architecture: {
        pt: "O projeto nasceu junto com o próprio coworking: desde o primeiro dia, a ideia foi não depender de telefonia analógica tradicional e construir uma infraestrutura de telefonia IP escalável, integrada ao restante do ecossistema de rede da empresa. O ponto central foi transformar o porteiro Intelbras, que originalmente era um dispositivo isolado, em mais um serviço integrado à telefonia da empresa, controlado inteiramente pelo FreePBX. A arquitetura se apoia em três camadas: telefonia (Asterisk + FreePBX numa VM Debian em cluster Proxmox, com módulos independentes por andar), integração com o mundo analógico (gateway Grandstream HT813 conectando as portas analógicas do Intelbras ao mundo SIP), e rede (dois switches Unifi de 48 portas, um por andar, VLANs segmentadas, IPs estáticos, firewall ajustado e Fail2Ban/recidive configurado com exceções para os gateways).",
        en: "The project was born alongside the coworking space itself: from day one, the idea was to avoid depending on traditional analog telephony and to build scalable IP telephony infrastructure integrated with the rest of the company's network ecosystem. The central point was turning the Intelbras intercom, originally an isolated device, into just another service integrated into the company's telephony and fully controlled by FreePBX. The architecture rests on three layers: telephony (Asterisk + FreePBX on a Debian VM in a Proxmox cluster, with independent modules per floor), integration with the analog world (a Grandstream HT813 gateway bridging the Intelbras analog ports into SIP), and networking (two 48-port Unifi switches, one per floor, segmented VLANs, static IPs, a tuned firewall, and Fail2Ban/recidive configured with exceptions for the gateways).",
      },
      stack: [
        { pt: "Servidor de telefonia: Asterisk + FreePBX (VM Debian em cluster Proxmox)", en: "Telephony server: Asterisk + FreePBX (Debian VM in a Proxmox cluster)" },
        { pt: "Gateway analógico → IP: Grandstream HT813 (FXO/FXS)", en: "Analog → IP gateway: Grandstream HT813 (FXO/FXS)" },
        { pt: "Central analógica original: Intelbras", en: "Original analog PBX: Intelbras" },
        { pt: "Telefones IP: Grandstream, com Enable Local Call Features desativado para os códigos chegarem ao FreePBX", en: "IP phones: Grandstream, with Enable Local Call Features disabled so codes reach FreePBX" },
        { pt: "Rede: 2 switches Unifi de 48 portas (um por andar), VLANs, IPs estáticos, cabeamento RJ45 feito manualmente", en: "Network: 2 48-port Unifi switches (one per floor), VLANs, static IPs, hand-done RJ45 cabling" },
        { pt: "Protocolos: SIP, DTMF RFC4733/RFC2833, FXO/FXS", en: "Protocols: SIP, DTMF RFC4733/RFC2833, FXO/FXS" },
        { pt: "Diagnóstico: tcpdump, PJSIP logger, iptables, nftables, comandos do Asterisk", en: "Diagnostics: tcpdump, PJSIP logger, iptables, nftables, Asterisk CLI commands" },
        { pt: "Segurança: Fail2Ban / recidive com exceções permanentes por IP", en: "Security: Fail2Ban / recidive with permanent per-IP exceptions" },
        { pt: "Backup: chamadas armazenadas localmente em NAS e enviadas para bucket S3 no Backblaze", en: "Backup: calls stored locally on the NAS and shipped to an S3 bucket on Backblaze" },
      ],
      categoriesTitle: { pt: "Como funciona", en: "How it works" },
      agentCategories: [
        {
          label: { pt: "Integração com o porteiro", en: "Intercom integration" },
          items: [
            { pt: "Porteiro Intelbras integrado como ramal SIP", en: "Intelbras intercom integrated as a SIP extension" },
            { pt: "Chamada toca simultaneamente em múltiplos ramais", en: "Calls ring simultaneously on multiple extensions" },
            { pt: "Atalho de discagem automatiza o contato com o porteiro", en: "A dial shortcut automates contacting the intercom" },
            { pt: "Abertura de portão via DTMF durante a chamada", en: "Gate opening via DTMF during the call" },
          ],
        },
        {
          label: { pt: "Controle de acesso", en: "Access control" },
          items: [
            { pt: "Permissões por ramal para comandos sensíveis", en: "Per-extension permissions for sensitive commands" },
            { pt: "Governança total sobre quem pode abrir o portão", en: "Full governance over who can open the gate" },
          ],
        },
        {
          label: { pt: "Backup e resiliência", en: "Backup and resilience" },
          items: [
            { pt: "Gravação local em NAS", en: "Local recording on the NAS" },
            { pt: "Replicação automática para bucket S3 (Backblaze)", en: "Automatic replication to an S3 bucket (Backblaze)" },
          ],
        },
        {
          label: { pt: "Diagnóstico e troubleshooting", en: "Diagnostics and troubleshooting" },
          items: [
            { pt: "Análise de registro SIP dos gateways", en: "SIP registration log analysis for the gateways" },
            { pt: "Ajuste de exceções no Fail2Ban/recidive", en: "Tuning Fail2Ban/recidive exceptions" },
            { pt: "Correção de firewall que bloqueava SSH", en: "Fixing a firewall rule that was blocking SSH" },
            { pt: "Validação ponta a ponta com tcpdump e PJSIP logger", en: "End-to-end validation with tcpdump and the PJSIP logger" },
          ],
        },
      ],
      differentials: [
        {
          pt: "Projeto definido e construído do início ao fim: equipamentos, rede, switches, VLANs, cabeamento, telefones, firewall e diagnóstico",
          en: "Scoped and built end to end: equipment, network, switches, VLANs, cabling, phones, firewall and diagnostics",
        },
        {
          pt: "Integração com o mundo analógico: o porteiro Intelbras virou um serviço controlado pelo FreePBX",
          en: "Integration with the analog world: the Intelbras intercom became a service controlled by FreePBX",
        },
        {
          pt: "Automação de baixo nível: atalhos com envio programado de DTMF e liberação de código específico para abrir portão durante a chamada",
          en: "Low-level automation: shortcuts with scheduled DTMF sending and release of a specific code to open the gate during a call",
        },
        {
          pt: "Governança de acesso: controle por ramal de quem pode executar comandos sensíveis",
          en: "Access governance: per-extension control over who can run sensitive commands",
        },
        {
          pt: "Diagnóstico em baixo nível: tcpdump, PJSIP logger, iptables, nftables e Fail2Ban para resolver problemas reais de SIP, registro e firewall",
          en: "Low-level diagnostics: tcpdump, PJSIP logger, iptables, nftables and Fail2Ban to solve real SIP, registration and firewall problems",
        },
        {
          pt: "Backup em duas camadas: gravação local (NAS) + envio automático para nuvem (Backblaze S3)",
          en: "Two-layer backup: local recording (NAS) + automatic upload to the cloud (Backblaze S3)",
        },
        {
          pt: "Escalabilidade pensada desde o início: arquitetura modular por andar",
          en: "Scalability designed in from the start: a modular architecture per floor",
        },
        {
          pt: "Segurança ativa: Fail2Ban com exceções calibradas, firewall auditado",
          en: "Active security: Fail2Ban with calibrated exceptions, audited firewall",
        },
      ],
      metrics: [
        { label: { pt: "Salas + recepção", en: "Rooms + reception" }, value: { pt: "8", en: "8" } },
        { label: { pt: "Ramais IP ativos", en: "Active IP extensions" }, value: { pt: "10+", en: "10+" } },
        { label: { pt: "Andares", en: "Floors" }, value: { pt: "2", en: "2" } },
        { label: { pt: "Do tempo funcionando", en: "Uptime" }, value: { pt: "99,9%", en: "99.9%" } },
      ],
      visual: {
        kind: "glow-logos",
        logos: [
          { src: "/logos/asterisk-logo.png", alt: { pt: "Logo do Asterisk", en: "Asterisk logo" } },
          { src: "/logos/freepbx-logo.png", alt: { pt: "Logo do FreePBX", en: "FreePBX logo" } },
        ],
      },
    },
  },
  {
    id: "automacao-iot",
    title: {
      pt: "Ecossistema de Automação IoT (Home Assistant)",
      en: "IoT Automation Ecosystem (Home Assistant)",
    },
    description: {
      pt: "Ecossistema de automação predial que integra 30 dispositivos de CLIMATIZAÇÃO, ILUMINAÇÃO e ACESSO em uma única plataforma, substituindo os aplicativos fechados por controle central, com desligamento automático e economia real de energia.",
      en: "Building automation ecosystem that brings 30 CLIMATIZATION, LIGHTING and ACCESS devices into a single platform, replacing closed vendor apps with central control, automatic shutoff and real energy savings.",
    },
    techIds: ["homeassistant", "proxmox", "mqtt"],
    type: "trabalho",
    details: {
      architecture: {
        pt: "O projeto nasceu de um problema concreto: no coworking, ar-condicionado e luzes ficavam ligados depois que as pessoas saíam, gerando desperdício de energia. Em vez de depender de lembretes ou trocar os equipamentos, a solução foi criar uma camada central de automação que integrasse os dispositivos que já existiam, mesmo vindo de fabricantes e gerações diferentes. O Home Assistant atua como o 'idioma comum' entre eles: unifica climatização, iluminação e acesso numa única plataforma, permitindo regras que cruzam fabricantes, algo impossível dentro dos apps nativos. A plataforma roda virtualizada no Proxmox, com snapshots e backups alinhados ao restante da infraestrutura.",
        en: "The project started from a concrete problem: in the coworking space, air conditioning and lights stayed on after people left, wasting energy. Rather than relying on reminders or replacing equipment, the solution was to build a central automation layer that integrated the devices already on site, even coming from different vendors and generations. Home Assistant acts as the common language between them: it unifies climate, lighting and access in one platform, enabling rules that cross vendor boundaries, something impossible inside the native apps. The platform runs virtualized on Proxmox, with snapshots and backups aligned with the rest of the infrastructure.",
      },
      stack: [
        { pt: "Plataforma central: Home Assistant OS, virtualizado no Proxmox", en: "Central platform: Home Assistant OS, virtualized on Proxmox" },
        { pt: "Comunicação: MQTT com servidor local (sem depender de nuvem na maioria dos casos)", en: "Communication: MQTT with a local server (no cloud dependency in most cases)" },
        { pt: "Integração: controle local sempre que possível, nuvem do fabricante como reserva", en: "Integration: local control whenever possible, vendor cloud as a fallback" },
        { pt: "Dispositivos: 14 controladores de ar-condicionado, 15 módulos de iluminação, 1 controlador de portão", en: "Devices: 14 air conditioning controllers, 15 lighting modules, 1 gate controller" },
        { pt: "Automações: rotinas por sala, horário e dia da semana", en: "Automations: routines per room, time of day and weekday" },
        { pt: "Confiabilidade: reexecução de comandos e validação de disponibilidade", en: "Reliability: command re-execution and availability validation" },
      ],
      categoriesTitle: { pt: "Como funciona", en: "How it works" },
      agentCategories: [
        {
          label: { pt: "Climatização inteligente", en: "Smart climate control" },
          items: [
            { pt: "14 ar-condicionados controlados por sala e por horário", en: "14 air conditioners controlled per room and per time" },
            { pt: "Desligamento automático fora do horário de uso", en: "Automatic shutoff outside usage hours" },
            { pt: "Equipamentos esquecidos ligados não desperdiçam energia", en: "Equipment left on by accident no longer wastes energy" },
          ],
        },
        {
          label: { pt: "Iluminação por rotina", en: "Routine-based lighting" },
          items: [
            { pt: "15 pontos de luz integrados à plataforma", en: "15 light points integrated into the platform" },
            { pt: "Horários distintos por sala seguem a rotina real do espaço", en: "Per-room schedules follow the space's actual routine" },
            { pt: "Luzes apagam sozinhas quando não há uso", en: "Lights turn themselves off when unused" },
          ],
        },
        {
          label: { pt: "Controle de acesso", en: "Access control" },
          items: [
            { pt: "Portão integrado com rotinas separadas de abrir, fechar e travar", en: "Gate integrated with separate routines to open, close and lock" },
            { pt: "Regras por horário e dia da semana", en: "Rules per time of day and weekday" },
            { pt: "Rotinas independentes, fáceis de ajustar sem quebrar o resto", en: "Independent routines, easy to adjust without breaking the rest" },
          ],
        },
        {
          label: { pt: "Confiabilidade na execução", en: "Execution reliability" },
          items: [
            { pt: "Reexecução de comandos em dispositivos que não confirmam seu estado", en: "Command re-execution on devices that do not confirm their state" },
            { pt: "Validação de disponibilidade antes de cada ação", en: "Availability validation before each action" },
            { pt: "Comandos diretos no lugar de simples alternância de liga/desliga", en: "Direct commands instead of a simple on/off toggle" },
          ],
        },
      ],
      differentials: [
        {
          pt: "Unifica ecossistemas fechados: fabricantes diferentes convivendo numa única plataforma, com regras que cruzam entre eles",
          en: "Unifies closed ecosystems: different vendors coexisting on a single platform, with rules that cross between them",
        },
        {
          pt: "Foco em economia de energia: desliga automaticamente o que foi esquecido ligado",
          en: "Focused on energy savings: automatically shuts off whatever was left running",
        },
        {
          pt: "Reaproveitou o parque existente: nenhum equipamento precisou ser trocado",
          en: "Reused the existing fleet: no equipment had to be replaced",
        },
        {
          pt: "Menos dependência de nuvem: controle local sempre que possível",
          en: "Less cloud dependency: local control whenever possible",
        },
        {
          pt: "Confiável mesmo sem confirmação: estratégias para dispositivos que não respondem seu estado",
          en: "Reliable even without confirmation: strategies for devices that do not report their state",
        },
        {
          pt: "Virtualização consistente: snapshots e backups alinhados ao restante da infraestrutura",
          en: "Consistent virtualization: snapshots and backups aligned with the rest of the infrastructure",
        },
        {
          pt: "Extensível: novos dispositivos e rotinas entram sem refatorar o que já existe",
          en: "Extensible: new devices and routines go in without refactoring what already exists",
        },
        {
          pt: "Construído do início ao fim: escolha da plataforma, integração, automações e confiabilidade",
          en: "Built end to end: platform choice, integration, automations and reliability",
        },
      ],
      metrics: [
        { label: { pt: "Dispositivos integrados", en: "Integrated devices" }, value: { pt: "30+", en: "30+" } },
        { label: { pt: "Ar-condicionados", en: "Air conditioners" }, value: { pt: "14", en: "14" } },
        { label: { pt: "Módulos de luz", en: "Light modules" }, value: { pt: "15", en: "15" } },
        { label: { pt: "Ecossistemas unificados", en: "Unified ecosystems" }, value: { pt: "6+", en: "6+" } },
      ],
      visual: {
        kind: "clock-lamp",
        schedule: { on: "07:00", off: "20:00" },
      },
    },
  },

  {
    id: "savapage",
    title: {
      pt: "Ecossistema de Impressão Gerenciada (SAVAPAGE)",
      en: "Managed Printing Ecosystem (SAVAPAGE)",
    },
    description: {
      pt: "Impressão compartilhada para o coworking via SAVAPAGE open source: tudo pelo navegador, sem instalação, com uma conta por sala, créditos mensais que renovam sozinhos e gestão centralizada de limites.",
      en: "Shared printing for the coworking space using open source SAVAPAGE: everything through the browser, no installation, one account per room, monthly credits that renew on their own, and centralized quota management.",
    },
    techIds: ["proxmox", "debian", "cloudflare"],
    type: "trabalho",
    details: {
      architecture: {
        pt: "O projeto nasceu de uma necessidade operacional do coworking: oferecer impressão compartilhada entre salas com controle de uso, sem depender de instalações locais nos computadores. A escolha do SAVAPAGE, solução open source de print management, veio por aderência a esse modelo: contas por sala, cotas configuráveis, interface web e integração com o ecossistema interno. O serviço foi desenhado em três pilares: acesso sem atrito (o usuário não instala nada, recebe credenciais prontas e usa pelo navegador), modelo de créditos por sala (cota fixa mensal renovada automaticamente no início de cada mês) e gestão centralizada (ajustes de limite feitos pelo gestor do coworking). A VM roda Debian no cluster Proxmox interno e o acesso externo passa por um Cloudflare Tunnel com domínio próprio: o usuário entra por uma URL amigável, sem expor IPs ou portas.",
        en: "The project started from an operational need of the coworking space: offer shared printing across rooms with usage control, without relying on local installs on the computers. SAVAPAGE, an open source print management solution, was chosen for how well it fit that model: per-room accounts, configurable quotas, a web interface and integration with the internal ecosystem. The service was designed around three pillars: frictionless access (the user installs nothing, receives ready-made credentials and uses the browser), a per-room credit model (a fixed monthly quota renewed automatically at the start of each month) and centralized management (quota adjustments made by the coworking manager). The VM runs Debian on the internal Proxmox cluster, and external access goes through a Cloudflare Tunnel on a custom domain: users reach it through a friendly URL, with no exposed IPs or ports.",
      },
      stack: [
        { pt: "Aplicação: SAVAPAGE (open source, print management)", en: "Application: SAVAPAGE (open source, print management)" },
        { pt: "Servidor: VM Debian hospedada no cluster Proxmox interno", en: "Server: Debian VM hosted on the internal Proxmox cluster" },
        { pt: "Acesso: interface web via Cloudflare Tunnel com domínio próprio", en: "Access: web interface over a Cloudflare Tunnel with a custom domain" },
        { pt: "Autenticação: uma conta por sala, com e-mail e senha pré-configurados", en: "Authentication: one account per room, with pre-configured email and password" },
        { pt: "Cobrança: créditos mensais renováveis por sala, ajuste manual pelo gestor", en: "Billing: renewable monthly credits per room, manually adjusted by the manager" },
        { pt: "Impressora: uma única física, compartilhada por todo o coworking", en: "Printer: a single physical unit, shared by the whole coworking space" },
      ],
      categoriesTitle: { pt: "Como funciona", en: "How it works" },
      agentCategories: [
        {
          label: { pt: "Acesso sem instalação", en: "Access with no installation" },
          items: [
            { pt: "Cada sala tem a própria conta, com credenciais prontas", en: "Each room has its own account, with credentials ready to go" },
            { pt: "Tudo pelo navegador, de qualquer computador da sala", en: "Everything through the browser, from any computer in the room" },
            { pt: "Sem drivers, agentes ou chamados de suporte", en: "No drivers, agents or support tickets" },
          ],
        },
        {
          label: { pt: "Conta por sala e créditos mensais", en: "Per-room accounts and monthly credits" },
          items: [
            { pt: "Cota fixa de impressão que renova sozinha todo início de mês", en: "A fixed print quota that renews itself at the start of every month" },
            { pt: "Consumo transparente e previsível por sala", en: "Transparent and predictable usage per room" },
          ],
        },
        {
          label: { pt: "Quando a cota acaba", en: "When the quota runs out" },
          items: [
            { pt: "Impressão pausada até o gestor liberar mais créditos", en: "Printing pauses until the manager releases more credits" },
            { pt: "Ajuste feito na plataforma, sem intervenção técnica", en: "The adjustment is made on the platform, with no technical intervention" },
            { pt: "Controle centralizado com flexibilidade para demandas pontuais", en: "Centralized control with the flexibility to handle one-off needs" },
          ],
        },
        {
          label: { pt: "Uma impressora, todos os usuários", en: "One printer, all users" },
          items: [
            { pt: "Fila gerenciada pelo SAVAPAGE, identificando a sala de cada impressão", en: "Queue managed by SAVAPAGE, identifying the room behind each print job" },
            { pt: "Créditos descontados automaticamente da conta certa", en: "Credits deducted automatically from the right account" },
            { pt: "Sem múltiplas impressoras nem impressão livre", en: "No multiple printers and no unmanaged printing" },
          ],
        },
      ],
      differentials: [
        {
          pt: "Experiência zero-atrito: nada de instalação; contas web prontas por sala",
          en: "Zero-friction experience: nothing to install; ready-made web accounts per room",
        },
        {
          pt: "Modelo de créditos com renovação automática: cota mensal por sala renova sozinha no início do mês",
          en: "Credit model with automatic renewal: the per-room monthly quota renews itself at the start of the month",
        },
        {
          pt: "Gestão centralizada de limites: ajustes pelo gestor do coworking, sem tocar em infra",
          en: "Centralized quota management: adjustments by the coworking manager, without touching infrastructure",
        },
        {
          pt: "Acesso via Cloudflare Tunnel com domínio próprio: URL amigável e segura, sem expor IPs ou portas",
          en: "Access via Cloudflare Tunnel on a custom domain: a friendly and secure URL, with no exposed IPs or ports",
        },
        {
          pt: "Uma impressora, muitos usuários: fila, autenticação e descontos transparentes",
          en: "One printer, many users: transparent queueing, authentication and deductions",
        },
        {
          pt: "Solução open source, adotada por aderência real ao modelo de negócio do coworking",
          en: "Open source solution, adopted for genuine fit with the coworking business model",
        },
        {
          pt: "Definido e construído do início ao fim: escolha, VM, tunnel, modelo de créditos e operação",
          en: "Scoped and built end to end: choice, VM, tunnel, credit model and operation",
        },
      ],
      metrics: [
        { label: { pt: "Salas com acesso", en: "Rooms with access" }, value: { pt: "8", en: "8" } },
        { label: { pt: "Impressoras", en: "Printers" }, value: { pt: "1", en: "1" } },
        { label: { pt: "Acesso via navegador", en: "Browser-based access" }, value: { pt: "100%", en: "100%" } },
        { label: { pt: "Renovação de créditos", en: "Credit renewal" }, value: { pt: "Mensal", en: "Monthly" } },
      ],
      visual: {
        kind: "quota-meter",
        rooms: [
          { label: { pt: "Recepção", en: "Reception" }, used: 62, quota: 100 },
          { label: { pt: "Sala 2", en: "Room 2" }, used: 24, quota: 50 },
          { label: { pt: "Sala 3", en: "Room 3" }, used: 41, quota: 50 },
          { label: { pt: "Sala 4", en: "Room 4" }, used: 8, quota: 50 },
          { label: { pt: "Sala 5", en: "Room 5" }, used: 33, quota: 50 },
          { label: { pt: "Sala 6", en: "Room 6" }, used: 12, quota: 50 },
          { label: { pt: "Sala 7", en: "Room 7" }, used: 5, quota: 50 },
          { label: { pt: "Sala 8", en: "Room 8" }, used: 17, quota: 50 },
        ],
      },
    },
  },

  {
    id: "portfolio",
    title: { pt: "Este Portfólio", en: "This Portfolio" },
    description: {
      pt: "O próprio site que você está vendo agora, construído do zero com Next.js e Tailwind.",
      en: "The very site you are looking at right now, built from scratch with Next.js and Tailwind.",
    },
    techIds: ["react", "nextjs", "tailwindcss", "typescript", "git"],
    type: "pessoal",
    details: {
      architecture: {
        pt: "Este site é o próprio projeto. Foi desenhado com uma ideia central: a vitrine precisa ser fácil de manter e fácil de navegar. Todos os projetos, tecnologias e contatos vivem em arquivos de dados centralizados (src/data/) e as páginas são geradas a partir deles, adicionar um projeto é adicionar um objeto, e o card, os badges e a página nascem sozinhos. Cada projeto tem a mesma narrativa completa: arquitetura, stack, como funciona, diferenciais, métricas e um visual próprio dirigido por dados, do mapa de agentes ao relógio de automação, do medidor de créditos do SAVAPAGE aos logos com brilho das stacks. Tudo construído com Next.js (App Router), React 19, TypeScript e Tailwind CSS v4, em temas dark/light, bilíngue, com tipografia Space Grotesk e JetBrains Mono. Em resumo: a vitrine das minhas habilidades é, ao mesmo tempo, uma prova prática de como gosto de construir: dados claros, componentes pequenos e consistência em tudo.",
        en: "This site is the project itself. It was designed around one central idea: the showcase has to be easy to maintain and easy to navigate. Every project, technology and contact lives in centralized data files (src/data/), and the pages are generated from them. Adding a project means adding an object, and the card, the badges and the page build themselves. Each project carries the same complete narrative: architecture, stack, how it works, differentiators, metrics and a custom data-driven visual, from the agent map to the automation clock, from the SAVAPAGE credit meter to the glowing stack logos. Everything built with Next.js (App Router), React 19, TypeScript and Tailwind CSS v4, in dark/light themes, bilingual, with Space Grotesk and JetBrains Mono typography. In short: the showcase of my skills is also a practical proof of how I like to build, with clear data, small components and consistency throughout.",
      },
      stack: [
        { pt: "Framework: Next.js (App Router) + React 19 + TypeScript", en: "Framework: Next.js (App Router) + React 19 + TypeScript" },
        { pt: "Estilo: Tailwind CSS v4 com design tokens próprios (vidro, LED, aurora)", en: "Styling: Tailwind CSS v4 with custom design tokens (glass, LED, aurora)" },
        { pt: "Dados: padrão centralizado, projetos, tecnologias e contatos em arquivos de dados", en: "Data: centralized pattern, with projects, technologies and contacts in data files" },
        { pt: "Visual: AgentMap, ClockLamp, QuotaMeter, TiltLogo, GlowLogo, ScrambleText, TechMarquee", en: "Visuals: AgentMap, ClockLamp, QuotaMeter, TiltLogo, GlowLogo, ScrambleText, TechMarquee" },
        { pt: "Idioma e tema: LanguageProvider (PT/EN) + ThemeProvider (dark/light)", en: "Language and theme: LanguageProvider (PT/EN) + ThemeProvider (dark/light)" },
        { pt: "Tipografia: Space Grotesk e JetBrains Mono via next/font", en: "Typography: Space Grotesk and JetBrains Mono via next/font" },
      ],
      categoriesTitle: { pt: "Como este site funciona", en: "How this site works" },
      agentCategories: [
        {
          label: { pt: "Vitrine dirigida por dados", en: "Data-driven showcase" },
          items: [
            { pt: "Projetos, tecnologias e contatos vivem em arquivos centralizados", en: "Projects, technologies and contacts live in centralized files" },
            { pt: "Adicionar um case é adicionar um objeto: card, badges e página nascem sozinhos", en: "Adding a case means adding an object: the card, badges and page build themselves" },
            { pt: "Menos código repetido, menos chance de esquecer um lugar", en: "Less repeated code, less chance of forgetting a spot" },
          ],
        },
        {
          label: { pt: "Cada projeto com narrativa completa", en: "Every project with a full narrative" },
          items: [
            { pt: "Arquitetura, stack, como funciona, diferenciais, métricas e visual", en: "Architecture, stack, how it works, differentiators, metrics and a visual" },
            { pt: "Um esqueleto único, conteúdo sob medida para cada caso", en: "A single skeleton, with content tailored to each case" },
          ],
        },
        {
          label: { pt: "Visual sob medida, sem template", en: "Bespoke visuals, no template" },
          items: [
            { pt: "Componentes autorais dirigidos por dados: mapa de agentes, relógio, medidor de cotas", en: "Author components driven by data: agent map, clock, quota meter" },
            { pt: "Cada projeto tem um visual que conta a própria história", en: "Every project has a visual that tells its own story" },
          ],
        },
        {
          label: { pt: "Bilíngue e confortável em qualquer tema", en: "Bilingual and comfortable in any theme" },
          items: [
            { pt: "PT/EN com troca de idioma em tempo real", en: "PT/EN with real-time language switching" },
            { pt: "Dark e light, com tipografia Space Grotesk e JetBrains Mono", en: "Dark and light, with Space Grotesk and JetBrains Mono typography" },
          ],
        },
      ],
      differentials: [
        {
          pt: "Vitrine dirigida por dados: manter o site é editar arquivos; a interface nasce deles",
          en: "Data-driven showcase: maintaining the site means editing files; the interface is born from them",
        },
        {
          pt: "Cada projeto com narrativa completa: arquitetura, stack, como funciona, diferenciais e métricas",
          en: "Every project with a full narrative: architecture, stack, how it works, differentiators and metrics",
        },
        {
          pt: "Visual sob medida por caso: mapa de agentes, relógio de automação, medidor de cotas, avatares",
          en: "Bespoke visual per case: agent map, automation clock, quota meter, avatars",
        },
        {
          pt: "Bilíngue (PT/EN) com tema dark/light: leitura confortável em qualquer contexto",
          en: "Bilingual (PT/EN) with dark/light themes: comfortable reading in any context",
        },
        {
          pt: "Sem template, com design system próprio: vidro fosco, LEDs e aurora",
          en: "No template, with a custom design system: frosted glass, LEDs and aurora",
        },
        {
          pt: "Consistência obsessiva: todas as páginas seguem o mesmo padrão, do rascunho ao detalhe",
          en: "Obsessive consistency: every page follows the same pattern, from index to detail",
        },
        {
          pt: "E continua crescendo: cada projeto novo entra seguindo a mesma receita",
          en: "And it keeps growing: every new project enters following the same recipe",
        },
      ],
      metrics: [
        { label: { pt: "Projetos documentados", en: "Documented projects" }, value: { pt: "10+", en: "10+" } },
        { label: { pt: "Tecnologias no acervo", en: "Technologies in the collection" }, value: { pt: "25+", en: "25+" } },
        { label: { pt: "Componentes autorais", en: "Author components" }, value: { pt: "22+", en: "22+" } },
        { label: { pt: "Páginas", en: "Pages" }, value: { pt: "6", en: "6" } },
      ],
      visual: {
        kind: "orbit-logos",
        logos: [
          { src: "/logos/next-logo.svg", alt: { pt: "Logo do Next.js", en: "Next.js logo" } },
          { src: "/logos/react-logo.svg", alt: { pt: "Logo do React", en: "React logo" } },
          { src: "/logos/typescript-logo.svg", alt: { pt: "Logo do TypeScript", en: "TypeScript logo" } },
          { src: "/logos/tailwind-logo.svg", alt: { pt: "Logo do Tailwind CSS", en: "Tailwind CSS logo" } },
        ],
        radius: 130,
        size: 90,
        duration: 18,
      },
    },
  },

  {
    id: "gitlab-automations",
    title: { pt: "Automações do GitLab", en: "GitLab Automations" },
    description: {
      pt: "Cada issue aberta no GitLab dispara um ecossistema de 25 automações que cuidam do board, do review e do deploy, mantendo o time informado no Slack sem ninguém precisar cobrar.",
      en: "Every issue opened on GitLab triggers an ecosystem of 25 automations that take care of the board, review and deploy, keeping the team informed on Slack with nobody having to chase anyone.",
    },
    techIds: ["n8n", "gitlab", "slack", "javascript"],
    type: "trabalho",
    details: {
      architecture: {
        pt: "Mais do que scripts isolados, esse conjunto funciona como uma camada de automação em cima do GitLab: cada automação escuta um evento específico (webhook) e reage de forma determinística via API do GitLab e do Slack. O design parte de um princípio simples: o dev não deveria gastar atenção com o que o fluxo pode resolver sozinho. Isso inclui desde higiene de board (labels, milestones, assigns) até comunicação assíncrona do time (notificações, resumos de deploy, alertas de gargalo). O ecossistema foi construído de forma orgânica ao longo de ~1 ano, sempre em conjunto com o time de desenvolvimento: cada automação nasceu de uma dor real observada no dia a dia, não de uma ideia imposta de fora.",
        en: "More than a set of isolated scripts, this collection works as an automation layer on top of GitLab: each automation listens for a specific event (a webhook) and reacts deterministically through the GitLab and Slack APIs. The design starts from a simple principle: a developer should not spend attention on what the workflow can resolve on its own. That covers everything from board hygiene (labels, milestones, assignees) to asynchronous team communication (notifications, deploy summaries, bottleneck alerts). The ecosystem grew organically over roughly one year, always together with the development team: every automation came from a real pain observed day to day, not from an idea imposed from outside.",
      },
      stack: [
        { pt: "Orquestração: n8n (25 automações em produção)", en: "Orchestration: n8n (25 automations in production)" },
        { pt: "Gatilhos: webhooks do GitLab (issues, MRs, commits, deploys, comentários e menções)", en: "Triggers: GitLab webhooks (issues, MRs, commits, deploys, comments and mentions)" },
        { pt: "Ações: requisições HTTP autenticadas na API do GitLab", en: "Actions: authenticated HTTP requests against the GitLab API" },
        { pt: "Notificações: Slack", en: "Notifications: Slack" },
        { pt: "Padrão de fluxo: evento → regra → ação → notificação", en: "Flow pattern: event → rule → action → notification" },
      ],
      categoriesTitle: { pt: "Como funciona", en: "How it works" },
      agentCategories: [
        {
          label: { pt: "Higiene de issues e labels", en: "Issue and label hygiene" },
          items: [
            { pt: "Comenta automaticamente quando falta label na issue", en: "Comments automatically when an issue is missing a label" },
            { pt: "Fecha issues com workflow::done ou workflow::wont-do", en: "Closes issues with workflow::done or workflow::wont-do" },
            { pt: "Sincroniza labels de assign e ajusta milestones", en: "Syncs assign labels and adjusts milestones" },
          ],
        },
        {
          label: { pt: "Fluxo de MR, review e deploy", en: "MR, review and deploy flow" },
          items: [
            { pt: "Notifica review atribuído e review concluído", en: "Notifies assigned review and completed review" },
            { pt: "Reassina a issue quando o pipeline falha", en: "Re-assigns the issue when the pipeline fails" },
            { pt: "Cria tags a partir da decisão de deploy e confirma o deploy por projeto com commit", en: "Creates tags from the deploy decision and confirms the deploy per project with the commit" },
            { pt: "Gera resumo das mudanças publicadas", en: "Generates a summary of the changes released" },
          ],
        },
        {
          label: { pt: "Notificações e menções no Slack", en: "Notifications and mentions on Slack" },
          items: [
            { pt: "Notifica menções em comentários, issues e MRs", en: "Notifies mentions in comments, issues and MRs" },
            { pt: "Alerta commits em projetos específicos", en: "Alerts on commits in specific projects" },
            { pt: "Avisa issues de suporte paradas há mais de 3 dias", en: "Flags support issues stalled for more than 3 days" },
            { pt: "Sinaliza devs com baixa carga de issues", en: "Flags developers with a low issue load" },
          ],
        },
        {
          label: { pt: "Backlog e tarefas recorrentes", en: "Backlog and recurring tasks" },
          items: [
            { pt: "Agrupa issues bugfix em épicos, criando o épico se não existir", en: "Groups bugfix issues into epics, creating the epic if it does not exist" },
            { pt: "Cria tarefa mensal de análise de performance de banco", en: "Creates the monthly database performance analysis task" },
            { pt: "Cria tarefa semanal de promoção de integrações Alpha/Beta", en: "Creates the weekly Alpha/Beta integration promotion task" },
          ],
        },
      ],
      differentials: [
        {
          pt: "Nascido do time, para o time: cada automação veio de uma dor real observada no dia a dia e foi construída em parceria com os devs, o que garantiu uso em vez de mais um script esquecido",
          en: "Born from the team, for the team: every automation came from a real pain observed day to day and was built in partnership with the developers, which guaranteed actual usage instead of one more forgotten script",
        },
        {
          pt: "Cobertura ponta a ponta: não são scripts isolados, cobrem o ciclo inteiro de uma issue, da abertura ao deploy",
          en: "End-to-end coverage: not isolated scripts, it covers the whole issue cycle, from opening to deploy",
        },
        {
          pt: "Manutenção viva: ~1 ano de evolução contínua, com automações ajustadas e criadas conforme o fluxo do time mudava",
          en: "Living maintenance: roughly a year of continuous evolution, with automations adjusted and created as the team's flow changed",
        },
        {
          pt: "Redução de ruído cognitivo: o dev foca em código e review, enquanto o ecossistema cuida da higiene do board e da comunicação",
          en: "Less cognitive noise: the developer focuses on code and review while the ecosystem handles board hygiene and communication",
        },
      ],
      metrics: [
        { label: { pt: "Automações ativas", en: "Active automations" }, value: { pt: "25", en: "25" } },
        { label: { pt: "Tipos de evento", en: "Event types" }, value: { pt: "6", en: "6" } },
        { label: { pt: "Devs no time", en: "Developers on the team" }, value: { pt: "~10", en: "~10" } },
        { label: { pt: "Meses em produção", en: "Months in production" }, value: { pt: "12+", en: "12+" } },
      ],
      visual: { kind: "gitlab-slack-flow", devs: 3 },
    },
  },

  {
    id: "base-conhecimento-ia",
    title: {
      pt: "Base de Conhecimento IA (Crawler Semanal + Vetorização para RAG)",
      en: "AI Knowledge Base (Weekly Crawler + Vectorization for RAG)",
    },
    description: {
      pt: "Pipeline de ingestão que varre semanalmente o site institucional e a central de ajuda, limpa e chunkifica o conteúdo com IA e vetoriza em duas bases PGVector no Supabase: a base de conhecimento que alimenta o RAG dos nossos agentes especialistas.",
      en: "Ingestion pipeline that crawls the institutional site and the help center weekly, cleans and chunks the content with AI, and vectorizes it into two PGVector databases on Supabase: the knowledge base that feeds the RAG behind our specialist agents.",
    },
    techIds: ["n8n", "javascript", "cloudflare", "postgresql", "supabase"],
    type: "trabalho",
    details: {
      architecture: {
        pt: "Toda base de conhecimento começa manual. Alguém identificava uma mudança no site institucional ou na central de ajuda, reescrevia a resposta e atualizava o documento na mão. Funcionava, até deixar de escalar. O gargalo nunca foi a qualidade do conteúdo, foi a latência entre o site mudar e a base mudar junto: quanto mais o conteúdo crescia, mais tempo alguém gastava em manutenção e maior a chance de o agente responder com informação defasada. A solução foi transformar manutenção em pipeline. Um orquestrador semanal dispara a coleta, um subworkflow dedicado processa cada URL isoladamente e o resultado é persistido em duas bases vetoriais que se atualizam sozinhas. O passo que tornou isso viável foi usar a Cloudflare Browser Rendering API para rastrear as páginas renderizadas por JavaScript, sem isso, boa parte do conteúdo simplesmente não existia para o crawler. O desenho é idempotente por opção: cada URL tem seus vetores anteriores removidos pelo url_id antes da reinserção, então reexecutar o ciclo corrige em vez de duplicar. E cada página carrega o last_scan_at, o que torna a atualização da base auditável em vez de presumida.",
        en: "Every knowledge base starts out manual. Someone would spot a change on the institutional site or in the help center, rewrite the answer and update the document by hand. It worked, until it stopped scaling. The bottleneck was never content quality, it was the latency between the site changing and the knowledge base changing with it: the more the content grew, the more time someone spent on maintenance and the likelier the agent was to answer with outdated information. The solution was to turn maintenance into a pipeline. A weekly orchestrator triggers the collection, a dedicated subworkflow processes each URL in isolation, and the result is persisted into two vector databases that update themselves. The step that made it viable was using the Cloudflare Browser Rendering API to crawl pages rendered by JavaScript, without which a good chunk of the content simply did not exist for the crawler. The design is idempotent by design: each URL has its previous vectors removed by url_id before reinsertion, so re-running the cycle corrects instead of duplicating. And every page carries a last_scan_at, which makes knowledge base updates auditable rather than assumed.",
      },
      stack: [
        { pt: "Orquestração: n8n, agendador semanal dispara o subworkflow de processamento por URL", en: "Orchestration: n8n, a weekly scheduler triggers the per-URL processing subworkflow" },
        { pt: "Rastreamento: Cloudflare Browser Rendering API (/crawl), com polling a cada 10 minutos e limite de 5.000 páginas por execução", en: "Crawling: Cloudflare Browser Rendering API (/crawl), polling every 10 minutes with a limit of 5,000 pages per run" },
        { pt: "Limpeza: node de código com regex e heurísticas, seguido de LLM (GPT-5.4-nano via OpenRouter) retornando JSON estruturado", en: "Cleaning: a code node with regex and heuristics, followed by an LLM (GPT-5.4-nano via OpenRouter) returning structured JSON" },
        { pt: "Chunking: divisão hierárquica por h1/h2/h3, até 800 palavras por chunk com overlap de 100, prefixando título do artigo e seção", en: "Chunking: hierarchical split by h1/h2/h3, up to 800 words per chunk with 100 overlap, prefixing the article title and section" },
        { pt: "Embeddings: text-embedding-3-small, também via OpenRouter", en: "Embeddings: text-embedding-3-small, also via OpenRouter" },
        { pt: "Vetorização: duas tabelas PGVector no Supabase (base institucional e base de ajuda técnica)", en: "Vectorization: two PGVector tables on Supabase (institutional base and technical help base)" },
        { pt: "Consistência: remoção dos vetores anteriores por url_id antes da reinserção, com last_scan_at registrado em cada página", en: "Consistency: removal of previous vectors by url_id before reinsertion, with last_scan_at recorded on every page" },
      ],
      categoriesTitle: { pt: "Como funciona", en: "How it works" },
      agentCategories: [
        {
          label: { pt: "Orquestrador semanal", en: "Weekly orchestrator" },
          items: [
            { pt: "Agendador dispara a coleta toda semana", en: "The scheduler triggers collection every week" },
            { pt: "Mapeia os sitemaps do site institucional e os links da central de ajuda", en: "Maps the institutional site sitemaps and the help center links" },
            { pt: "Consolida as URLs descobertas em uma fila única de processamento", en: "Consolidates discovered URLs into a single processing queue" },
          ],
        },
        {
          label: { pt: "Subworkflow por URL", en: "Per-URL subworkflow" },
          items: [
            { pt: "Requisição de crawl ao Cloudflare com polling a cada 10 minutos", en: "Crawl request to Cloudflare with polling every 10 minutes" },
            { pt: "Limpeza do HTML com regex e LLM, retornando título, seções e texto corrido", en: "HTML cleaning with regex and an LLM, returning title, sections and running text" },
            { pt: "Chunking hierárquico por h1/h2/h3 com título e seção prefixados em cada chunk", en: "Hierarchical chunking by h1/h2/h3 with title and section prefixed into each chunk" },
            { pt: "Geração dos embeddings e gravação nos dois vector stores", en: "Embedding generation and writes to both vector stores" },
            { pt: "Remoção dos vetores antigos por url_id antes de reinserir", en: "Removal of old vectors by url_id before reinserting" },
          ],
        },
      ],
      differentials: [
        {
          pt: "Base que se mantém sozinha: o ciclo semanal transforma manutenção manual em pipeline, e a atualização deixa de depender de alguém lembrar de fazer",
          en: "A knowledge base that maintains itself: the weekly cycle turns manual maintenance into a pipeline, and updates stop depending on someone remembering to do them",
        },
        {
          pt: "Crawl de conteúdo renderizado: a Cloudflare Browser Rendering API enxerga as páginas que só existem depois do JavaScript rodar, que é justamente onde boa parte da documentação mora",
          en: "Crawling rendered content: the Cloudflare Browser Rendering API sees the pages that only exist after JavaScript runs, which is exactly where much of the documentation lives",
        },
        {
          pt: "Limpeza em duas camadas: regex remove ruído estrutural e o LLM normaliza o texto, com saída em JSON estruturado em vez de HTML bruto",
          en: "Two-layer cleaning: regex strips structural noise and the LLM normalizes the text, with structured JSON output instead of raw HTML",
        },
        {
          pt: "Chunking alinhado à estrutura real do documento: a divisão segue h1/h2/h3 e prefixa título e seção, então cada chunk carrega o contexto de onde veio",
          en: "Chunking aligned to the document's real structure: the split follows h1/h2/h3 and prefixes title and section, so each chunk carries the context it came from",
        },
        {
          pt: "Duas bases, um só pipeline: conteúdo institucional e ajuda técnica são separados na vetorização, mas mantidos pelo mesmo crawling semanal",
          en: "Two databases, one pipeline: institutional content and technical help are separated at vectorization but maintained by the same weekly crawl",
        },
        {
          pt: "Reexecução segura: o ciclo é idempotente, remover por url_id antes de reinserir significa que rodar de novo corrige em vez de acumular duplicata",
          en: "Safe re-execution: the cycle is idempotent, and removing by url_id before reinserting means running it again corrects instead of piling up duplicates",
        },
      ],
      metrics: [
        { label: { pt: "URLs processadas", en: "URLs processed" }, value: { pt: "3.000+", en: "3,000+" } },
        { label: { pt: "Ciclo de atualização", en: "Update cycle" }, value: { pt: "1x/semana", en: "1x/week" } },
        { label: { pt: "Bases vetoriais", en: "Vector databases" }, value: { pt: "2", en: "2" } },
        { label: { pt: "Palavras por chunk", en: "Words per chunk" }, value: { pt: "800", en: "800" } },
      ],
      visual: {
        kind: "rag-pipeline",
        cadence: { pt: "1x/semana", en: "1x/week" },
      },
    },
  },

  {
    id: "ecossistema-notificacoes",
    title: {
      pt: "Ecossistema de Notificações (Financeiro · Comercial · Desenvolvimento)",
      en: "Notifications Ecosystem (Finance · Sales · Development)",
    },
    description: {
      pt: "Sistema de handoff que fecha o ciclo da Luiza: cada conversa que a IA não resolve é roteada para Financeiro, Comercial ou Desenvolvimento com template completo, resumo por IA e link da conversa no Slack, e toda conversa fechada por humano volta como análise estruturada de 4 eixos que orienta o ajuste dos prompts do agente.",
      en: "Handoff system that closes the loop on Luiza: every conversation the AI cannot resolve is routed to Finance, Sales or Development with a full template, an AI summary and a link to the conversation on Slack, and every conversation closed by a human comes back as a structured 4-axis analysis that guides the tuning of the agent's prompts.",
    },
    techIds: ["n8n", "javascript", "redis", "slack"],
    type: "trabalho",
    details: {
      architecture: {
        pt: "Este projeto não substitui a Luiza: ele cuida do que acontece nas bordas dela. A Luiza resolve a maior parte das conversas sozinha, mas as que dependem de decisão humana precisam chegar ao setor certo com contexto suficiente para que a pessoa assuma sem ler o histórico inteiro. E cada uma dessas conversas é, ao mesmo tempo, a fonte de dado mais valiosa do sistema: é a única hora em que fica visível onde a IA falhou. O projeto se organiza em três camadas que se alimentam. A primeira é o roteamento em tempo real, que classifica a intenção, escolhe o template certo para a janela de atendimento e entrega a conversa ao setor correspondente já com resumo gerado por IA. A segunda é um conjunto de notificações operacionais que traduz eventos internos (como uma release do produto) em mensagens estruturadas para o canal do time, sem ninguém precisar abrir o e-mail. A terceira é o loop de melhoria: toda conversa encerrada por um humano gera um relatório estruturado com o que o cliente queria resolver, onde a IA errou, o que o humano fez e qual tipo de gap foi. Esse relatório não ajusta o prompt sozinho, ele é lido por quem mantém o agente, que decide o que mudar. A partir daí a conversa volta para a Luiza como requisito de qualidade, e o ponto onde ela falhou vira tarefa de engenharia.",
        en: "This project does not replace Luiza: it handles what happens at her edges. Luiza resolves most conversations on her own, but the ones that depend on a human decision need to reach the right team with enough context for that person to take over without reading the whole history. And each of those conversations is, at the same time, the most valuable data source in the system: it is the only moment when it becomes visible where the AI failed. The project organizes into three layers that feed each other. The first is real-time routing, which classifies intent, picks the right template for the support window, and hands the conversation to the matching team already carrying an AI-generated summary. The second is a set of operational notifications that translate internal events (such as a product release) into structured messages for the team's channel, so nobody has to open an email. The third is the improvement loop: every conversation closed by a human produces a structured report covering what the customer wanted to resolve, where the AI went wrong, what the human did, and what kind of gap it was. That report does not tune the prompt by itself, it is read by whoever maintains the agent, who decides what to change. From there the conversation returns to Luiza as a quality requirement, and the point where she failed becomes an engineering task.",
      },
      stack: [
        { pt: "Orquestração: n8n, com o roteamento isolado em subagente dedicado", en: "Orchestration: n8n, with routing isolated in a dedicated subagent" },
        { pt: "LLM: GPT-5.4 via OpenRouter para transformação de releases e resumos; GPT-5.4-nano para as análises de handoff", en: "LLM: GPT-5.4 via OpenRouter for release transformation and summaries; GPT-5.4-nano for handoff analyses" },
        { pt: "Regra de handoff: template completo + flag no_follow_up no Redis + resumo por IA + envio ao Slack", en: "Handoff rule: full template + no_follow_up flag in Redis + AI summary + Slack delivery" },
        { pt: "Escopo de cancelamento: 6 serviços mapeados, com regra de insistência antes de escalar ao Financeiro", en: "Cancellation scope: 6 mapped services, with an insistence rule before escalating to Finance" },
        { pt: "Análise pós-handoff: relatório estruturado em 4 eixos gerado a partir da conversa encerrada", en: "Post-handoff analysis: a structured 4-axis report generated from the closed conversation" },
        { pt: "Releases: webhook de inbound do Postmark convertido em mrkdwn do Slack por LLM", en: "Releases: a Postmark inbound webhook converted to Slack mrkdwn by an LLM" },
        { pt: "Base de conhecimento: consulta ao PGVector compartilhado com a Luiza", en: "Knowledge base: queries the PGVector shared with Luiza" },
      ],
      categoriesTitle: { pt: "Como funciona", en: "How it works" },
      agentCategories: [
        {
          label: { pt: "Roteamento e handoff", en: "Routing and handoff" },
          items: [
            { pt: "Cliente pede contato com Financeiro ou Comercial, ou o caso é claramente dessas naturezas", en: "The customer asks for Finance or Sales, or the case is clearly one of those" },
            { pt: "Regra de redirecionamento atômico: nunca responder apenas 'vou encaminhar'", en: "Atomic redirect rule: never reply with just 'I will forward this'" },
            { pt: "Template completo enviado com link, WhatsApp e horário de atendimento", en: "A full template sent with the link, WhatsApp number and support hours" },
            { pt: "Flag no_follow_up no Redis para evitar follow-up automático depois da transferência", en: "A no_follow_up flag in Redis to prevent automatic follow-up after the transfer" },
            { pt: "Resumo de 2 a 3 frases com o contexto da conversa, junto do link direto no Crisp", en: "A 2 to 3 sentence summary with the conversation context, alongside the direct Crisp link" },
            { pt: "Template variado por janela: dia útil dentro do horário, fora do horário e fim de semana", en: "Template varies by window: weekday in hours, out of hours and weekend" },
          ],
        },
        {
          label: { pt: "Notificações de release", en: "Release notifications" },
          items: [
            { pt: "Webhook de inbound do Postmark recebe o e-mail de release da plataforma de release notes do time", en: "A Postmark inbound webhook receives the release email from the team's release notes platform" },
            { pt: "LLM converte o HTML em mrkdwn do Slack seguindo regras de mapeamento", en: "An LLM converts the HTML into Slack mrkdwn following mapping rules" },
            { pt: "Nomes técnicos de projeto traduzidos para nomes amigáveis em PT-BR", en: "Technical project names translated into friendly PT-BR names" },
            { pt: "Categorias normalizadas em Adicionado, Alterado e Corrigido", en: "Categories normalized into Added, Changed and Fixed" },
            { pt: "IDs padronizados e entidades HTML removidas", en: "Standardized IDs and HTML entities stripped" },
            { pt: "Notificação sai estruturada no canal interno do time", en: "The notification reaches the team's internal channel in structured form" },
          ],
        },
        {
          label: { pt: "Análise pós-handoff", en: "Post-handoff analysis" },
          items: [
            { pt: "Conversa encerrada por humano dispara análise automática por LLM", en: "A conversation closed by a human triggers automatic LLM analysis" },
            { pt: "Eixo 1 (problema): o que o cliente queria resolver", en: "Axis 1 (problem): what the customer wanted to resolve" },
            { pt: "Eixo 2 (onde a IA errou): o que passou ou foi diagnosticado errado", en: "Axis 2 (where the AI went wrong): what slipped by or was misdiagnosed" },
            { pt: "Eixo 3 (o que o humano fez): o caminho real que resolveu", en: "Axis 3 (what the human did): the actual path that solved it" },
            { pt: "Eixo 4 (tipo de gap): classificação do erro, como diagnóstico ausente ou conclusão precipitada", en: "Axis 4 (gap type): error classification, such as missing diagnosis or premature conclusion" },
            { pt: "Relatório com link da conversa no Crisp, lido por quem mantém os prompts da Luiza", en: "A report with the Crisp conversation link, read by whoever maintains Luiza's prompts" },
          ],
        },
      ],
      differentials: [
        {
          pt: "Redirecionamento atômico: a regra impede que o agente responda só 'vou encaminhar'; template completo, flag de follow-up e envio ao Slack acontecem obrigatoriamente na mesma resposta, o que elimina promessa vazia para o cliente",
          en: "Atomic redirect: the rule prevents the agent from replying with just 'I will forward this'; the full template, the follow-up flag and the Slack delivery all happen in the same response, which eliminates empty promises to the customer",
        },
        {
          pt: "Escopo restrito com regra de insistência: o cancelamento só atua em 6 serviços mapeados e só escala para o Financeiro se o cliente continuar evasivo ou frustrado depois de uma pergunta, o que reduz alucinação em domínio sensível",
          en: "Restricted scope with an insistence rule: cancellation only acts on 6 mapped services and only escalates to Finance if the customer stays evasive or frustrated after a question, which reduces hallucination in a sensitive domain",
        },
        {
          pt: "Contrapartida diferente por setor: Financeiro e Comercial recebem a conversa com template e resumo; Desenvolvimento recebe o post-mortem estruturado, porque é quem ajusta o prompt",
          en: "A different payoff per team: Finance and Sales receive the conversation with template and summary; Development receives the structured post-mortem, because they are the ones tuning the prompt",
        },
        {
          pt: "Release vira rotina: o e-mail deixa de ser algo que alguém precisa ler e vira mensagem estruturada no canal do time, com mapeamento de nomes e categorias normalizadas",
          en: "Release becomes routine: the email stops being something someone has to read and becomes a structured message in the team's channel, with name mapping and normalized categories",
        },
        {
          pt: "Falha convertida em dado: a conversa em que a IA errou deixa de ser histórico perdido e vira diagnóstico estruturado, versionado por eixo",
          en: "Failure turned into data: the conversation where the AI went wrong stops being lost history and becomes a structured diagnosis, versioned per axis",
        },
        {
          pt: "Templates por janela de atendimento: a mensagem enviada muda conforme o cliente esteja dentro do horário, fora dele ou em fim de semana",
          en: "Templates per support window: the message sent changes depending on whether the customer is in hours, out of hours or on a weekend",
        },
      ],
      metrics: [
        { label: { pt: "Análises de handoff/mês", en: "Handoff analyses/month" }, value: { pt: "~180", en: "~180" } },
        { label: { pt: "Setores notificados", en: "Teams notified" }, value: { pt: "3", en: "3" } },
        { label: { pt: "Serviços no escopo de cancelamento", en: "Services in cancellation scope" }, value: { pt: "6", en: "6" } },
        { label: { pt: "Eixos do relatório de análise", en: "Report analysis axes" }, value: { pt: "4", en: "4" } },
      ],
      visual: { kind: "handoff-fanout", monthly: { pt: "~180/mês", en: "~180/month" } },
    },
  },

  {
    id: "armazenamento-backup-nas",
    title: {
      pt: "Infraestrutura de Armazenamento e Backup (Synology RS820+)",
      en: "Storage and Backup Infrastructure (Synology RS820+)",
    },
    description: {
      pt: "NAS Synology RS820+ com 4 HDs em RAID 5 que centraliza o armazenamento do ecossistema da GPM (gravações de 20+ câmeras por 45 dias, backups locais de todas as VMs, quórum do cluster Proxmox e retenção automatizada), tudo configurado do zero a partir de um equipamento que estava parado.",
      en: "A Synology RS820+ NAS with 4 HDDs in RAID 5 that centralizes storage for the GPM ecosystem (recordings from 20+ cameras for 45 days, local backups of every VM, Proxmox cluster quorum and automated retention), all configured from scratch starting from a machine that was sitting idle.",
    },
    techIds: ["synology", "proxmox", "linux"],
    type: "trabalho",
    details: {
      architecture: {
        pt: "O projeto começou com um NAS que estava parado na empresa. A ideia foi transformá-lo no centro de armazenamento e resiliência do ecossistema interno, reunindo em um único ponto três funções críticas: armazenamento massivo (gravações de câmeras), backup local de VMs (proteção contra falhas nos hosts) e quórum de cluster (evitando split-brain no Proxmox). A premissa de design foi simples: um equipamento confiável, com retenção bem definida, que não exige intervenção humana e cobre as três frentes sem competir entre si por recursos. O pool de 15 TB úteis foi dividido de forma explícita: ~11 TB dedicados ao CFTV e ~4 TB para o backup das VMs. Essa alocação só fecha porque a taxa de gravação por câmera foi calculada antes de dimensionar o storage. Toda a configuração, desde a formatação inicial do NAS, passando pela definição de políticas de retenção, até a integração com o cluster, foi feita para ser autônoma e auditável: cada frente roda em seu próprio ciclo, diário ou por evento, com políticas de retenção explícitas por frente.",
        en: "The project started with a NAS that was sitting idle at the company. The idea was to turn it into the storage and resilience hub of the internal ecosystem, bringing together at a single point three critical functions: bulk storage (camera recordings), local VM backup (protection against host failures) and cluster quorum (preventing split-brain on Proxmox). The design premise was simple: a reliable machine, with well-defined retention, that requires no human intervention and covers all three fronts without competing for resources. The 15 TB usable pool was split explicitly: ~11 TB dedicated to CFTV and ~4 TB for VM backups. That allocation only adds up because the per-camera recording rate was calculated before sizing the storage. The whole configuration, from the initial NAS formatting through retention policy definition to cluster integration, was built to be autonomous and auditable: each front runs on its own cycle, daily or event-driven, with explicit retention policies per front.",
      },
      stack: [
        { pt: "Hardware: Synology RS820+ com 4 HDs de 5 TB em RAID 5, 15 TB úteis (3 discos de dados + 1 de paridade)", en: "Hardware: Synology RS820+ with four 5 TB HDDs in RAID 5, 15 TB usable (3 data disks + 1 parity)" },
        { pt: "Armazenamento de CFTV: 20+ câmeras Intelbras distribuídas em 3 DVRs, pool dedicado de ~11 TB com retenção de 45 dias", en: "CFTV storage: 20+ Intelbras cameras spread across 3 DVRs, a dedicated ~11 TB pool with 45-day retention" },
        { pt: "Backup de VMs: pool de ~4 TB reservado para os backups gerenciados pelo Proxmox Backup Server, detalhados no case de arquitetura de backup", en: "VM backup: a ~4 TB pool reserved for the backups managed by Proxmox Backup Server, detailed in the backup architecture case" },
        { pt: "Cluster Proxmox: VM leve de 256 MB rodando como QDevice, o terceiro voto de quórum do cluster de dois nós", en: "Proxmox cluster: a lightweight 256 MB VM running as QDevice, the third quorum vote of the two-node cluster" },
        { pt: "Proteção: UPS atendendo o conjunto, cobrindo as três funções em caso de queda de energia", en: "Protection: a UPS serving the whole setup, covering all three functions in case of a power outage" },
      ],
      categoriesTitle: { pt: "Como funciona", en: "How it works" },
      agentCategories: [
        {
          label: { pt: "CFTV: gravação contínua", en: "CFTV: continuous recording" },
          items: [
            { pt: "O NAS recebe gravações de 20+ câmeras Intelbras distribuídas em 3 DVRs, cobrindo o coworking e a empresa", en: "The NAS receives recordings from 20+ Intelbras cameras spread across 3 DVRs, covering the coworking space and the company" },
            { pt: "Pool de ~11 TB dedicado exclusivamente a esse uso", en: "A ~11 TB pool dedicated exclusively to this use" },
            { pt: "Retenção de 45 dias: qualquer gravação além disso é apagada por rotina que roda na madrugada", en: "45-day retention: anything older is deleted by a routine that runs overnight" },
            { pt: "Nenhuma intervenção manual no ciclo de gravação", en: "No manual intervention in the recording cycle" },
            { pt: "Dimensionamento validado antes da ativação: ~1,1 Mbps de taxa por câmera", en: "Sizing validated before go-live: ~1.1 Mbps per camera" },
          ],
        },
        {
          label: { pt: "Alocação e uso do pool", en: "Pool allocation and usage" },
          items: [
            { pt: "Todas as VMs do ecossistema têm backup diário landing neste pool", en: "Every VM in the ecosystem has a daily backup landing on this pool" },
            { pt: "Os datastores do Proxmox Backup Server são montados sobre o storage via NFS", en: "The Proxmox Backup Server datastores are mounted over the storage via NFS" },
            { pt: "O pool de ~4 TB é reservado exclusivamente para backups, sem disputa com o CFTV", en: "The ~4 TB pool is reserved exclusively for backups, with no contention against CFTV" },
            { pt: "O uso atual ocupa ~30 GB, com folga sobrando para o crescimento do ecossistema", en: "Current usage sits at ~30 GB, leaving plenty of headroom for ecosystem growth" },
            { pt: "Restaurações do dia a dia são servidas daqui, por ser o caminho mais curto", en: "Day-to-day restores are served from here, being the shortest path" },
          ],
        },
        {
          label: { pt: "QDevice: terceiro voto de quórum", en: "QDevice: the third quorum vote" },
          items: [
            { pt: "O cluster da empresa é formado por dois mini-PCs", en: "The company's cluster is made up of two mini PCs" },
            { pt: "Com número par de nós, uma partição de rede faz cada lado se achar primário: é o chamado split-brain", en: "With an even number of nodes, a network partition makes each side think it is primary: this is called split-brain" },
            { pt: "Uma VM leve de 256 MB foi criada dentro do NAS para fornecer o terceiro voto", en: "A lightweight 256 MB VM was created inside the NAS to provide the third vote" },
            { pt: "O QDevice não armazena dado: mantém apenas o estado de quórum esperado para o desempate", en: "The QDevice stores no data: it only holds the expected quorum state used to break the tie" },
            { pt: "Configuração validada e estável, provando que não é preciso muito recurso para resolver o problema", en: "Validated and stable configuration, proving it does not take much resource to solve the problem" },
          ],
        },
        {
          label: { pt: "Retenção e automação", en: "Retention and automation" },
          items: [
            { pt: "Cada frente roda em seu próprio ciclo, diário ou por evento", en: "Each front runs on its own cycle, daily or event-driven" },
            { pt: "Retenção configurada por prazo, sem apagamento manual", en: "Retention configured by time period, with no manual deletion" },
            { pt: "Proteção elétrica via UPS para o conjunto", en: "Power protection via UPS for the whole setup" },
            { pt: "O NAS se mantém saudável a longo prazo sem virar fonte de manutenção", en: "The NAS stays healthy long term without becoming a maintenance burden" },
            { pt: "Configuração documentada e auditável", en: "Documented and auditable configuration" },
          ],
        },
      ],
      differentials: [
        {
          pt: "Um equipamento, três funções críticas: armazenamento massivo, backup de VMs e quórum de cluster convivendo no mesmo NAS sem competir por recursos",
          en: "One machine, three critical functions: bulk storage, VM backup and cluster quorum coexisting on the same NAS without competing for resources",
        },
        {
          pt: "Transformação de equipamento parado em infraestrutura central: o RS820+ estava encostado e virou peça central do ecossistema",
          en: "Turning idle equipment into central infrastructure: the RS820+ was gathering dust and became a core piece of the ecosystem",
        },
        {
          pt: "Uso do NAS como QDevice: terceiro voto de quórum com uma VM de 256 MB, resolvendo split-brain no cluster Proxmox sem precisar de um terceiro servidor",
          en: "Using the NAS as a QDevice: a third quorum vote with a 256 MB VM, solving split-brain on the Proxmox cluster without needing a third server",
        },
        {
          pt: "Cobertura completa de CFTV: 20+ câmeras em 3 DVRs, com ~11 TB dedicados e 45 dias de histórico",
          en: "Full CFTV coverage: 20+ cameras across 3 DVRs, with ~11 TB dedicated and 45 days of history",
        },
        {
          pt: "UPS protegendo as três funções: energia ininterrupta em um equipamento que concentra CFTV, backups e quórum",
          en: "A UPS protecting all three functions: uninterrupted power for a machine that concentrates CFTV, backups and quorum",
        },
      ],
      metrics: [
        { label: { pt: "Capacidade útil em RAID 5", en: "Usable capacity in RAID 5" }, value: { pt: "15 TB", en: "15 TB" } },
        { label: { pt: "Câmeras Intelbras", en: "Intelbras cameras" }, value: { pt: "20+", en: "20+" } },
        { label: { pt: "Retenção de gravações", en: "Recording retention" }, value: { pt: "45 dias", en: "45 days" } },
        { label: { pt: "Backup geral dos ecossistemas", en: "General ecosystem backup" }, value: { pt: "VM's", en: "VMs" } },
      ],
      visual: { kind: "nas-raid-stack" },
    },
  },
  {
    id: "backup-hibrido-pbs",
    title: {
      pt: "Arquitetura de Backup Híbrido e Redundante (Proxmox Backup Server)",
      en: "Hybrid and Redundant Backup Architecture (Proxmox Backup Server)",
    },
    description: {
      pt: "Arquitetura de backup em múltiplas camadas sobre o Proxmox Backup Server, com backups incrementais e deduplicados das VMs, datastore primário em NAS, replicação off-site para Object Storage S3, ciclo de vida completo com prune, garbage collection e verificação de integridade, e backup independente do próprio PBS, com monitoramento publicado no Slack em tempo real.",
      en: "A multi-layer backup architecture on top of Proxmox Backup Server, with incremental deduplicated VM backups, a primary NAS datastore, off-site replication to S3 Object Storage, a full lifecycle with prune, garbage collection and integrity verification, plus an independent backup of the PBS itself, with monitoring published to Slack in real time.",
    },
    techIds: ["proxmox", "synology", "n8n", "javascript", "slack"],
    type: "trabalho",
    details: {
      architecture: {
        pt: "O projeto foi desenhado a partir de um princípio simples e frequentemente negligenciado: um backup só é confiável se você conseguir restaurá-lo, inclusive o próprio sistema de backup. Em vez de depender de um único PBS com seus datastores, a arquitetura foi pensada em camadas independentes de proteção, combinando armazenamento local em NAS, cópia externa em Object Storage S3 e um backup separado da própria VM do PBS. A estratégia separa fisicamente compute (os servidores Proxmox que executam as VMs) de backup (o armazenamento, que fica no NAS descrito no case de armazenamento e backup): a perda de um host Proxmox, um disco ou até o NAS inteiro não significa perder todas as cópias. A camada externa em S3 protege contra cenários mais graves: falha física, incidente local ou corrupção do armazenamento primário. O design cobre o ciclo de vida inteiro: captura em Snapshot Mode, deduplicação, incremental, retenção em múltiplos horizontes, replicação por PBS Sync, limpeza com Prune seguido de Garbage Collection, verificação de integridade dos chunks e uma sequência documentada de disaster recovery. Nenhuma etapa depende de script externo ou de intervenção manual.",
        en: "The project was designed around a simple and often neglected principle: a backup is only trustworthy if you can restore it, including the backup system itself. Instead of relying on a single PBS with its datastores, the architecture was built in independent layers of protection, combining local NAS storage, an off-site copy in S3 Object Storage, and a separate backup of the PBS VM itself. The strategy physically separates compute (the Proxmox servers running the VMs) from backup (the storage on the NAS described in the storage and backup case): losing a Proxmox host, a disk, or even the entire NAS does not mean losing every copy. The external S3 layer protects against more severe scenarios, such as physical failure, a local incident, or corruption of the primary storage. The design covers the entire lifecycle: capture in Snapshot Mode, deduplication, incrementals, retention across multiple horizons, replication via PBS Sync, cleanup with Prune followed by Garbage Collection, chunk integrity verification, and a documented disaster recovery sequence. No step relies on an external script or manual intervention.",
      },
      stack: [
        { pt: "Virtualização: Proxmox VE com backup em modo Snapshot Mode e guest-agent nas VMs", en: "Virtualization: Proxmox VE with backup in Snapshot Mode and guest-agent in the VMs" },
        { pt: "Plataforma de backup: Proxmox Backup Server, com backups incrementais, deduplicação, compressão e verificação de integridade", en: "Backup platform: Proxmox Backup Server, with incremental backups, deduplication, compression and integrity verification" },
        { pt: "Datastore primário: NAS Synology montado via NFS, caminho curto para as restaurações do dia a dia", en: "Primary datastore: Synology NAS mounted over NFS, a short path for day-to-day restores" },
        { pt: "Datastore externo: Object Storage S3-compatible alimentado por PBS Sync Job nativo (suporte a S3 a partir do PBS 3.1)", en: "External datastore: S3-compatible Object Storage fed by a native PBS Sync Job (S3 support from PBS 3.1)" },
        { pt: "Ciclo de vida: retenção em 4 horizontes, prune, garbage collection e verificação de integridade dos chunks", en: "Lifecycle: retention across 4 horizons, prune, garbage collection and chunk integrity verification" },
        { pt: "Monitoramento: hook de notificação do PBS disparando POST no webhook do n8n, que formata e publica no Slack", en: "Monitoring: a PBS notification hook firing a POST to the n8n webhook, which formats and publishes to Slack" },
        { pt: "Self-backup: a VM do PBS tem backup independente em volume dedicado no NAS, com o cache externo excluído", en: "Self-backup: the PBS VM has an independent backup on a dedicated NAS volume, with the external cache excluded" },
      ],
      categoriesTitle: { pt: "Como funciona", en: "How it works" },
      agentCategories: [
        {
          label: { pt: "Captura incremental e deduplicação", en: "Incremental capture and deduplication" },
          items: [
            { pt: "Todas as VMs do ecossistema são copiadas diariamente em Snapshot Mode, sem desligar as máquinas de produção", en: "Every VM in the ecosystem is copied daily in Snapshot Mode, without shutting down production machines" },
            { pt: "Guest-agent garante consistência da aplicação durante o snapshot", en: "The guest-agent guarantees application consistency during the snapshot" },
            { pt: "Após a primeira execução os backups passam a ser incrementais, reduzindo drasticamente o volume trafegado", en: "After the first run the backups become incremental, drastically reducing transferred volume" },
            { pt: "Deduplicação e compressão nativas reduzem o espaço ocupado por blocos repetidos", en: "Native deduplication and compression reduce the space taken by repeated blocks" },
            { pt: "O uso atual de todo o conjunto é de ~30 GB, dentro do pool de ~4 TB reservado no NAS", en: "Current usage across the whole set is ~30 GB, within the ~4 TB pool reserved on the NAS" },
          ],
        },
        {
          label: { pt: "Duas camadas de armazenamento", en: "Two storage layers" },
          items: [
            { pt: "Datastore primário em NAS Synology via NFS, usado para restaurações rápidas", en: "Primary datastore on a Synology NAS over NFS, used for fast restores" },
            { pt: "Datastore externo em Object Storage S3-compatible, alimentado por PBS Sync Job nativo do PBS", en: "External datastore in S3-compatible Object Storage, fed by PBS's native Sync Job" },
            { pt: "A replicação usa o mecanismo interno do PBS: nenhum script externo no caminho", en: "Replication uses PBS's internal mechanism: no external script in the path" },
            { pt: "A cópia off-site protege contra falha física, incidente local ou corrupção do storage primário", en: "The off-site copy protects against physical failure, a local incident or corruption of the primary storage" },
            { pt: "Compute e backup ficam fisicamente separados, então perder um host não significa perder as cópias", en: "Compute and backup are physically separated, so losing a host does not mean losing the copies" },
          ],
        },
        {
          label: { pt: "O PBS também tem backup", en: "The PBS is backed up too" },
          items: [
            { pt: "A VM do PBS tem backup independente, armazenado em um volume dedicado no NAS", en: "The PBS VM has an independent backup, stored on a dedicated NAS volume" },
            { pt: "O disco usado apenas como cache do armazenamento externo foi excluído do backup de propósito", en: "The disk used only as external storage cache was deliberately excluded from the backup" },
            { pt: "Esse cache pode ser reconstruído e não precisa ocupar espaço na cópia", en: "That cache can be rebuilt and does not need to take up space in the copy" },
            { pt: "Se a VM do PBS for perdida, basta restaurá-la e reconectar os datastores", en: "If the PBS VM is lost, it just needs to be restored and the datastores reconnected" },
            { pt: "Os backups existentes voltam a ficar disponíveis sem precisar recopiar nada", en: "The existing backups become available again with nothing to recopy" },
          ],
        },
        {
          label: { pt: "Ciclo de vida e monitoramento", en: "Lifecycle and monitoring" },
          items: [
            { pt: "Retenção em 4 horizontes: diário, semanal, mensal e anual", en: "Retention across 4 horizons: daily, weekly, monthly and yearly" },
            { pt: "Prune remove os snapshots que não fazem mais parte da política", en: "Prune removes the snapshots that are no longer part of the policy" },
            { pt: "Garbage Collection libera os blocos não referenciados por nenhum backup, depois do prune", en: "Garbage Collection frees blocks not referenced by any backup, after the prune" },
            { pt: "Verificação confere a integridade dos chunks antes que uma restauração precise deles", en: "Verification checks chunk integrity before a restore needs them" },
            { pt: "Hook do PBS publica no Slack via n8n, com sucesso, erro, servidor, datastore e resultado", en: "A PBS hook publishes to Slack via n8n, with success, error, server, datastore and result" },
            { pt: "Jobs distribuídos por horário, evitando concorrência por CPU, RAM, disco e rede", en: "Jobs spread across the clock, avoiding contention over CPU, RAM, disk and network" },
          ],
        },
      ],
      differentials: [
        {
          pt: "Backup do backupador: a VM do PBS tem backup próprio em volume dedicado, evitando o cenário em que o sistema responsável pelas cópias não pode ser restaurado",
          en: "Backup of the backup system: the PBS VM has its own backup on a dedicated volume, avoiding the scenario where the system responsible for the copies cannot be restored",
        },
        {
          pt: "PBS Sync nativo: a replicação off-site usa o mecanismo interno do PBS, sem depender de script externo frágil",
          en: "Native PBS Sync: off-site replication uses PBS's internal mechanism, with no fragile external script",
        },
        {
          pt: "Storage local e cloud no mesmo caminho: a restauração do dia a dia vem do NAS sem depender da internet, e o S3 fica como cópia externa",
          en: "Local and cloud storage in the same path: day-to-day restores come from the NAS without depending on the internet, and S3 stays as the off-site copy",
        },
        {
          pt: "Verificação de integridade ativa: não basta ter o backup, é preciso garantir que ele é restaurável",
          en: "Active integrity verification: having the backup is not enough, you have to guarantee it is restorable",
        },
        {
          pt: "Ciclo de vida completo e auditável: captura, replicação, retenção, prune, garbage collection e verificação, todos automatizados",
          en: "Complete and auditable lifecycle: capture, replication, retention, prune, garbage collection and verification, all automated",
        },
        {
          pt: "Jobs distribuídos por horário: evita concorrência excessiva por CPU, RAM, disco e rede entre as etapas do ciclo",
          en: "Jobs spread across the clock: avoids excessive contention over CPU, RAM, disk and network between lifecycle stages",
        },
        {
          pt: "Monitoramento integrado ao ecossistema: o hook do PBS publica no Slack via n8n, extensível para e-mail, WhatsApp ou abertura automática de incidente sem tocar no PBS",
          en: "Monitoring integrated into the ecosystem: the PBS hook publishes to Slack via n8n, extensible to email, WhatsApp or automatic incident creation without touching PBS",
        },
        {
          pt: "Compute e backup separados: a perda de um host Proxmox, um disco ou do NAS inteiro não significa perder todas as cópias",
          en: "Compute and backup separated: losing a Proxmox host, a disk or the entire NAS does not mean losing every copy",
        },
      ],
      metrics: [
        { label: { pt: "Backups das VMs do ecossistema", en: "VM backups across the ecosystem" }, value: { pt: "~30 GB", en: "~30 GB" } },
        { label: { pt: "Datastores", en: "Datastores" }, value: { pt: "2", en: "2" } },
        { label: { pt: "Horizontes de retenção", en: "Retention horizons" }, value: { pt: "4", en: "4" } },
        { label: { pt: "Etapas do ciclo de vida", en: "Lifecycle stages" }, value: { pt: "6", en: "6" } },
      ],
      visual: { kind: "pbs-layers" },
    },
  },
];
