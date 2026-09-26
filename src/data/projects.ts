import type { FloatingNode } from "@/components/AgentMap";

export type ProjectVisual =
  | { kind: "agent-map"; nodes: FloatingNode[] }
  | { kind: "tilt-logo"; src: string; alt: string; href?: string }
  | { kind: "glow-logos"; logos: { src: string; alt: string }[] }
  | { kind: "clock-lamp"; schedule: { on: string; off: string } }
  | { kind: "quota-meter"; rooms: { label: string; used: number; quota: number }[] }
  | { kind: "orbit-logos"; logos: { src: string; alt: string }[]; radius?: number; size?: number; duration?: number }
  | { kind: "gitlab-slack-flow"; devs?: number }
  | { kind: "rag-pipeline"; cadence: string }
  | { kind: "handoff-fanout"; monthly: string }
  | { kind: "nas-raid-stack" }
  | { kind: "pbs-layers" };

export type ProjectDetails = {
  architecture: string;
  stack: string[];
  categoriesTitle?: string;
  agentCategories?: { label: string; items: string[] }[];
  differentials: string[];
  metrics: { label: string; value: string }[];
  visual?: ProjectVisual;
};

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
    title: "Super Agente de IA para suporte",
    description:
      "Sistema multiagente hierárquico construído no n8n para automatizar o suporte via Crisp, roteando cada conversa ao especialista certo. Resolve 70% das ~700 conversas mensais de forma totalmente autônoma e HUMANIZADA.",
    techIds: ["n8n", "postgresql", "redis", "slack", "metabase"],
    type: "trabalho",
    details: {
      architecture:
        "É um sistema multiagente hierárquico: um agente orquestrador central classifica cada mensagem e a roteia para o especialista certo, ao invés de um único agente genérico tentando resolver tudo. Essa separação de responsabilidades reduz alucinação e permite prompts de sistema extremamente detalhados por domínio.",
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
        "Anti-alucinação por design: preços, links e prazos sempre vêm de fontes verificadas, nunca inventados",
        "Consciência temporal: cálculo de horário comercial em tempo real",
        "Fallback de modelo garantindo disponibilidade",
        "Memória persistente entre sessões",
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
    id: "ni-node",
    title: "Nó verificado do n8n para Notificações Inteligentes",
    description:
      "Nó oficialmente verificado pelo n8n que transforma a API da Notificações Inteligentes em blocos visuais nativos: permitindo criar, editar, buscar e gerenciar leads e integrações sem escrever código.",
    techIds: ["n8n", "typescript"],
    type: "trabalho",
    link: "https://github.com/GPMP/n8n-node-notificacoes-inteligentes/blob/main/README.md",
    details: {
      architecture:
        "O nó expõe dois recursos principais, Integrações e Leads, seguindo convenções CRUD (Criar, Ler, Atualizar, Deletar) construídas em torno de identificadores únicos. O fluxo típico de uso é: buscar/listar para descobrir o ID de um item, e então usar esse ID numa operação seguinte (editar, marcar com tag, deletar). Toda operação retorna confirmações estruturadas de sucesso ou erros detalhados (código HTTP + mensagem legível), permitindo construir lógica condicional robusta dentro do fluxo. A autenticação usa um Bearer Token gerado por organização no painel da NI, permitindo múltiplas credenciais para múltiplos negócios.",
      stack: [
        "Linguagem: TypeScript (exigência do SDK de nós do n8n)",
        "Zero dependências de runtime: requisito obrigatório para verificação",
        "Passou pelo linter automatizado oficial (@n8n/scan-community-package)",
        "Revisão manual pela equipe do n8n, com ajustes iterativos solicitados",
        "Documentação em inglês (exigência do programa de verificação)",
        "Autenticação via Bearer Token, com escopo por organização",
      ],
      agentCategories: [
        {
          label: "Integrações",
          items: [
            "Criar nova integração",
            "Listar todas as integrações",
            "Buscar integração",
            "Editar nome da integração",
            "Deletar integração",
          ],
        },
        {
          label: "Leads",
          items: [
            "Criar lead",
            "Atualizar lead",
            "Criar ou atualizar lead (deduplicando por telefone)",
            "Adicionar tags",
            "Atualizar tags",
            "Remover tags",
            "Buscar todos os leads",
            "Buscar lead por ID",
            "Deletar lead",
          ],
        },
      ],
      differentials: [
        "Selo \"Verified\" oficial do n8n: aparece na busca nativa do app e tem página própria na Biblioteca de Integrações",
        "Ideia nascida de demanda real: usuários da própria Notificações Inteligentes solicitaram essa integração",
        "Operação inteligente \"Criar ou Atualizar Lead\" que deduplica automaticamente por número de telefone",
        "Design orientado a ID permite encadear operações complexas dentro do mesmo fluxo",
        "Zero dependências de runtime: exigiu otimizar a implementação usando só os helpers HTTP nativos do n8n",
      ],
      metrics: [
        { label: "Status", value: "Verified" },
        { label: "Recursos", value: "2" },
        { label: "Operações", value: "14" },
        { label: "Dependências", value: "0" },
      ],
      visual: {
        kind: "tilt-logo",
        src: "/logos/ni-node-logo.svg",
        alt: "Logo do nó Notificações Inteligentes",
        href: "https://n8n.io/integrations/ni/",
      },
    },
  },

  {
    id: "telefonia-ip",
    title: "Infraestrutura Robusta de Telefonia IP (Asterisk + FreePBX)",
    description:
      "Infraestrutura de telefonia IP construída do zero para o coworking da GPM (dois andares, 8 salas + recepção, 10+ ramais IP), integrando o porteiro Intelbras ao FreePBX, com automação de chamadas, controle de acesso, backup de chamadas e diagnóstico completo de rede, SIP e firewall.",
    techIds: ["linux", "debian", "proxmox", "ubiquite"],
    type: "trabalho",
    details: {
      architecture:
        "O projeto nasceu junto com o próprio coworking: desde o primeiro dia, a ideia foi não depender de telefonia analógica tradicional e construir uma infraestrutura de telefonia IP escalável, integrada ao restante do ecossistema de rede da empresa. O ponto central foi transformar o porteiro Intelbras, que originalmente era um dispositivo isolado, em mais um serviço integrado à telefonia da empresa, controlado inteiramente pelo FreePBX. A arquitetura se apoia em três camadas: telefonia (Asterisk + FreePBX numa VM Debian em cluster Proxmox, com módulos independentes por andar), integração com o mundo analógico (gateway Grandstream HT813 conectando as portas analógicas do Intelbras ao mundo SIP), e rede (dois switches Unifi de 48 portas, um por andar, VLANs segmentadas, IPs estáticos, firewall ajustado e Fail2Ban/recidive configurado com exceções para os gateways).",
      stack: [
        "Servidor de telefonia: Asterisk + FreePBX (VM Debian em cluster Proxmox)",
        "Gateway analógico → IP: Grandstream HT813 (FXO/FXS)",
        "Central analógica original: Intelbras",
        "Telefones IP: Grandstream, com Enable Local Call Features desativado para os códigos chegarem ao FreePBX",
        "Rede: 2 switches Unifi de 48 portas (um por andar), VLANs, IPs estáticos, cabeamento RJ45 feito manualmente",
        "Protocolos: SIP, DTMF RFC4733/RFC2833, FXO/FXS",
        "Diagnóstico: tcpdump, PJSIP logger, iptables, nftables, comandos do Asterisk",
        "Segurança: Fail2Ban / recidive com exceções permanentes por IP",
        "Backup: chamadas armazenadas localmente em NAS e enviadas para bucket S3 no Backblaze",
      ],
      categoriesTitle: "Como funciona",
      agentCategories: [
        {
          label: "Integração com o porteiro",
          items: [
            "Porteiro Intelbras integrado como ramal SIP",
            "Chamada toca simultaneamente em múltiplos ramais",
            "Atalho de discagem automatiza o contato com o porteiro",
            "Abertura de portão via DTMF durante a chamada",
          ],
        },
        {
          label: "Controle de acesso",
          items: [
            "Permissões por ramal para comandos sensíveis",
            "Governança total sobre quem pode abrir o portão",
          ],
        },
        {
          label: "Backup e resiliência",
          items: [
            "Gravação local em NAS",
            "Replicação automática para bucket S3 (Backblaze)",
          ],
        },
        {
          label: "Diagnóstico e troubleshooting",
          items: [
            "Análise de registro SIP dos gateways",
            "Ajuste de exceções no Fail2Ban/recidive",
            "Correção de firewall que bloqueava SSH",
            "Validação ponta a ponta com tcpdump e PJSIP logger",
          ],
        },
      ],
      differentials: [
        "Projeto definido e construído do início ao fim: equipamentos, rede, switches, VLANs, cabeamento, telefones, firewall e diagnóstico",
        "Integração com o mundo analógico: o porteiro Intelbras virou um serviço controlado pelo FreePBX",
        "Automação de baixo nível: atalhos com envio programado de DTMF e liberação de código específico para abrir portão durante a chamada",
        "Governança de acesso: controle por ramal de quem pode executar comandos sensíveis",
        "Diagnóstico em baixo nível: tcpdump, PJSIP logger, iptables, nftables e Fail2Ban para resolver problemas reais de SIP, registro e firewall",
        "Backup em duas camadas: gravação local (NAS) + envio automático para nuvem (Backblaze S3)",
        "Escalabilidade pensada desde o início: arquitetura modular por andar",
        "Segurança ativa: Fail2Ban com exceções calibradas, firewall auditado",
      ],
      metrics: [
        { label: "Salas + recepção", value: "8" },
        { label: "Ramais IP ativos", value: "10+" },
        { label: "Andares", value: "2" },
        { label: "Do tempo funcionando", value: "99,9%" },
      ],
      visual: {
        kind: "glow-logos",
        logos: [
          { src: "/logos/asterisk-logo.png", alt: "Logo do Asterisk" },
          { src: "/logos/freepbx-logo.png", alt: "Logo do FreePBX" },
        ],
      },
    },
  },
  {
    id: "automacao-iot",
    title: "Ecossistema de Automação IoT (Home Assistant)",
    description:
      "Ecossistema de automação predial que integra 30 dispositivos de CLIMATIZAÇÃO, ILUMINAÇÃO e ACESSO em uma única plataforma, substituindo os aplicativos fechados por controle central, com desligamento automático e economia real de energia.",
    techIds: ["homeassistant", "proxmox", "mqtt"],
    type: "trabalho",
    details: {
      architecture:
        "O projeto nasceu de um problema concreto: no coworking, ar-condicionado e luzes ficavam ligados depois que as pessoas saíam, gerando desperdício de energia. Em vez de depender de lembretes ou trocar os equipamentos, a solução foi criar uma camada central de automação que integrasse os dispositivos que já existiam, mesmo vindo de fabricantes e gerações diferentes. O Home Assistant atua como o 'idioma comum' entre eles: unifica climatização, iluminação e acesso numa única plataforma, permitindo regras que cruzam fabricantes, algo impossível dentro dos apps nativos. A plataforma roda virtualizada no Proxmox, com snapshots e backups alinhados ao restante da infraestrutura.",
      stack: [
        "Plataforma central: Home Assistant OS, virtualizado no Proxmox",
        "Comunicação: MQTT com servidor local (sem depender de nuvem na maioria dos casos)",
        "Integração: controle local sempre que possível, nuvem do fabricante como reserva",
        "Dispositivos: 14 controladores de ar-condicionado, 15 módulos de iluminação, 1 controlador de portão",
        "Automações: rotinas por sala, horário e dia da semana",
        "Confiabilidade: reexecução de comandos e validação de disponibilidade",
      ],
      categoriesTitle: "Como funciona",
      agentCategories: [
        {
          label: "Climatização inteligente",
          items: [
            "14 ar-condicionados controlados por sala e por horário",
            "Desligamento automático fora do horário de uso",
            "Equipamentos esquecidos ligados não desperdiçam energia",
          ],
        },
        {
          label: "Iluminação por rotina",
          items: [
            "15 pontos de luz integrados à plataforma",
            "Horários distintos por sala seguem a rotina real do espaço",
            "Luzes apagam sozinhas quando não há uso",
          ],
        },
        {
          label: "Controle de acesso",
          items: [
            "Portão integrado com rotinas separadas de abrir, fechar e travar",
            "Regras por horário e dia da semana",
            "Rotinas independentes, fáceis de ajustar sem quebrar o resto",
          ],
        },
        {
          label: "Confiabilidade na execução",
          items: [
            "Reexecução de comandos em dispositivos que não confirmam seu estado",
            "Validação de disponibilidade antes de cada ação",
            "Comandos diretos no lugar de simples alternância de liga/desliga",
          ],
        },
      ],
      differentials: [
        "Unifica ecossistemas fechados: fabricantes diferentes convivendo numa única plataforma, com regras que cruzam entre eles",
        "Foco em economia de energia: desliga automaticamente o que foi esquecido ligado",
        "Reaproveitou o parque existente: nenhum equipamento precisou ser trocado",
        "Menos dependência de nuvem: controle local sempre que possível",
        "Confiável mesmo sem confirmação: estratégias para dispositivos que não respondem seu estado",
        "Virtualização consistente: snapshots e backups alinhados ao restante da infraestrutura",
        "Extensível: novos dispositivos e rotinas entram sem refatorar o que já existe",
        "Construído do início ao fim: escolha da plataforma, integração, automações e confiabilidade",
      ],
      metrics: [
        { label: "Dispositivos integrados", value: "30+" },
        { label: "Ar-condicionados", value: "14" },
        { label: "Módulos de luz", value: "15" },
        { label: "Ecossistemas unificados", value: "6+" },
      ],
      visual: {
        kind: "clock-lamp",
        schedule: { on: "07:00", off: "20:00" },
      },
    },
  },

  {
    id: "savapage",
    title: "Ecossistema de Impressão Gerenciada (SAVAPAGE)",
    description:
      "Impressão compartilhada para o coworking via SAVAPAGE open source: tudo pelo navegador, sem instalação, com uma conta por sala, créditos mensais que renovam sozinhos e gestão centralizada de limites.",
    techIds: ["proxmox", "debian", "cloudflare"],
    type: "trabalho",
    details: {
      architecture:
        "O projeto nasceu de uma necessidade operacional do coworking: oferecer impressão compartilhada entre salas com controle de uso, sem depender de instalações locais nos computadores. A escolha do SAVAPAGE, solução open source de print management, veio por aderência a esse modelo: contas por sala, cotas configuráveis, interface web e integração com o ecossistema interno. O serviço foi desenhado em três pilares: acesso sem atrito (o usuário não instala nada, recebe credenciais prontas e usa pelo navegador), modelo de créditos por sala (cota fixa mensal renovada automaticamente no início de cada mês) e gestão centralizada (ajustes de limite feitos pelo gestor do coworking). A VM roda Debian no cluster Proxmox interno e o acesso externo passa por um Cloudflare Tunnel com domínio próprio: o usuário entra por uma URL amigável, sem expor IPs ou portas.",
      stack: [
        "Aplicação: SAVAPAGE (open source, print management)",
        "Servidor: VM Debian hospedada no cluster Proxmox interno",
        "Acesso: interface web via Cloudflare Tunnel com domínio próprio",
        "Autenticação: uma conta por sala, com e-mail e senha pré-configurados",
        "Cobrança: créditos mensais renováveis por sala, ajuste manual pelo gestor",
        "Impressora: uma única física, compartilhada por todo o coworking",
      ],
      categoriesTitle: "Como funciona",
      agentCategories: [
        {
          label: "Acesso sem instalação",
          items: [
            "Cada sala tem a própria conta, com credenciais prontas",
            "Tudo pelo navegador, de qualquer computador da sala",
            "Sem drivers, agentes ou chamados de suporte",
          ],
        },
        {
          label: "Conta por sala e créditos mensais",
          items: [
            "Cota fixa de impressão que renova sozinha todo início de mês",
            "Consumo transparente e previsível por sala",
          ],
        },
        {
          label: "Quando a cota acaba",
          items: [
            "Impressão pausada até o gestor liberar mais créditos",
            "Ajuste feito na plataforma, sem intervenção técnica",
            "Controle centralizado com flexibilidade para demandas pontuais",
          ],
        },
        {
          label: "Uma impressora, todos os usuários",
          items: [
            "Fila gerenciada pelo SAVAPAGE, identificando a sala de cada impressão",
            "Créditos descontados automaticamente da conta certa",
            "Sem múltiplas impressoras nem impressão livre",
          ],
        },
      ],
      differentials: [
        "Experiência zero-atrito: nada de instalação; contas web prontas por sala",
        "Modelo de créditos com renovação automática: cota mensal por sala renova sozinha no início do mês",
        "Gestão centralizada de limites: ajustes pelo gestor do coworking, sem tocar em infra",
        "Acesso via Cloudflare Tunnel com domínio próprio: URL amigável e segura, sem expor IPs ou portas",
        "Uma impressora, muitos usuários: fila, autenticação e descontos transparentes",
        "Solução open source, adotada por aderência real ao modelo de negócio do coworking",
        "Definido e construído do início ao fim: escolha, VM, tunnel, modelo de créditos e operação",
      ],
      metrics: [
        { label: "Salas com acesso", value: "8" },
        { label: "Impressoras", value: "1" },
        { label: "Acesso via navegador", value: "100%" },
        { label: "Renovação de créditos", value: "Mensal" },
      ],
      visual: {
        kind: "quota-meter",
        rooms: [
          { label: "Recepção", used: 62, quota: 100 },
          { label: "Sala 2", used: 24, quota: 50 },
          { label: "Sala 3", used: 41, quota: 50 },
          { label: "Sala 4", used: 8, quota: 50 },
          { label: "Sala 5", used: 33, quota: 50 },
          { label: "Sala 6", used: 12, quota: 50 },
          { label: "Sala 7", used: 5, quota: 50 },
          { label: "Sala 8", used: 17, quota: 50 },
        ],
      },
    },
  },

  {
    id: "portfolio",
    title: "Este Portfólio",
    description:
      "O próprio site que você está vendo agora, construído do zero com Next.js e Tailwind.",
    techIds: ["react", "nextjs", "tailwindcss", "typescript"],
    type: "pessoal",
    details: {
      architecture:
        "Este site é o próprio projeto. Foi desenhado com uma ideia central: a vitrine precisa ser fácil de manter e fácil de navegar. Todos os projetos, tecnologias e contatos vivem em arquivos de dados centralizados (src/data/) e as páginas são geradas a partir deles, adicionar um projeto é adicionar um objeto, e o card, os badges e a página nascem sozinhos. Cada projeto tem a mesma narrativa completa: arquitetura, stack, como funciona, diferenciais, métricas e um visual próprio dirigido por dados, do mapa de agentes ao relógio de automação, do medidor de créditos do SAVAPAGE aos logos com brilho das stacks. Tudo construído com Next.js (App Router), React 19, TypeScript e Tailwind CSS v4, em temas dark/light, bilíngue, com tipografia Space Grotesk e JetBrains Mono. Em resumo: a vitrine das minhas habilidades é, ao mesmo tempo, uma prova prática de como gosto de construir: dados claros, componentes pequenos e consistência em tudo.",
      stack: [
        "Framework: Next.js (App Router) + React 19 + TypeScript",
        "Estilo: Tailwind CSS v4 com design tokens próprios (vidro, LED, aurora)",
        "Dados: padrão centralizado, projetos, tecnologias e contatos em arquivos de dados",
        "Visual: AgentMap, ClockLamp, QuotaMeter, TiltLogo, GlowLogo, ScrambleText, TechMarquee",
        "Idioma e tema: LanguageProvider (PT/EN) + ThemeProvider (dark/light)",
        "Tipografia: Space Grotesk e JetBrains Mono via next/font",
      ],
      categoriesTitle: "Como este site funciona",
      agentCategories: [
        {
          label: "Vitrine dirigida por dados",
          items: [
            "Projetos, tecnologias e contatos vivem em arquivos centralizados",
            "Adicionar um case é adicionar um objeto: card, badges e página nascem sozinhos",
            "Menos código repetido, menos chance de esquecer um lugar",
          ],
        },
        {
          label: "Cada projeto com narrativa completa",
          items: [
            "Arquitetura, stack, como funciona, diferenciais, métricas e visual",
            "Um esqueleto único, conteúdo sob medida para cada caso",
          ],
        },
        {
          label: "Visual sob medida, sem template",
          items: [
            "Componentes autorais dirigidos por dados: mapa de agentes, relógio, medidor de cotas",
            "Cada projeto tem um visual que conta a própria história",
          ],
        },
        {
          label: "Bilíngue e confortável em qualquer tema",
          items: [
            "PT/EN com troca de idioma em tempo real",
            "Dark e light, com tipografia Space Grotesk e JetBrains Mono",
          ],
        },
      ],
      differentials: [
        "Vitrine dirigida por dados: manter o site é editar arquivos; a interface nasce deles",
        "Cada projeto com narrativa completa: arquitetura, stack, como funciona, diferenciais e métricas",
        "Visual sob medida por caso: mapa de agentes, relógio de automação, medidor de cotas, avatares",
        "Bilíngue (PT/EN) com tema dark/light: leitura confortável em qualquer contexto",
        "Sem template, com design system próprio: vidro fosco, LEDs e aurora",
        "Consistência obsessiva: todas as páginas seguem o mesmo padrão, do rascunho ao detalhe",
        "E continua crescendo: cada projeto novo entra seguindo a mesma receita",
      ],
      metrics: [
        { label: "Projetos documentados", value: "10+" },
        { label: "Tecnologias no acervo", value: "25+" },
        { label: "Componentes autorais", value: "22+" },
        { label: "Páginas", value: "6" },
      ],
      visual: {
        kind: "orbit-logos",
        logos: [
          { src: "/logos/next-logo.svg", alt: "Logo do Next.js" },
          { src: "/logos/react-logo.svg", alt: "Logo do React" },
          { src: "/logos/typescript-logo.svg", alt: "Logo do TypeScript" },
          { src: "/logos/tailwind-logo.svg", alt: "Logo do Tailwind CSS" },
        ],
        radius: 130,
        size: 90,
        duration: 18,
      },
    },
  },

  {
    id: "gitlab-automations",
    title: "Automações do GitLab",
    description:
      "Cada issue aberta no GitLab dispara um ecossistema de 25 automações que cuidam do board, do review e do deploy, mantendo o time informado no Slack sem ninguém precisar cobrar.",
    techIds: ["n8n", "gitlab", "slack"],
    type: "trabalho",
    details: {
      architecture:
        "Mais do que scripts isolados, esse conjunto funciona como uma camada de automação em cima do GitLab: cada automação escuta um evento específico (webhook) e reage de forma determinística via API do GitLab e do Slack. O design parte de um princípio simples: o dev não deveria gastar atenção com o que o fluxo pode resolver sozinho. Isso inclui desde higiene de board (labels, milestones, assigns) até comunicação assíncrona do time (notificações, resumos de deploy, alertas de gargalo). O ecossistema foi construído de forma orgânica ao longo de ~1 ano, sempre em conjunto com o time de desenvolvimento: cada automação nasceu de uma dor real observada no dia a dia, não de uma ideia imposta de fora.",
      stack: [
        "Orquestração: n8n (25 automações em produção)",
        "Gatilhos: webhooks do GitLab (issues, MRs, commits, deploys, comentários e menções)",
        "Ações: requisições HTTP autenticadas na API do GitLab",
        "Notificações: Slack",
        "Padrão de fluxo: evento → regra → ação → notificação",
      ],
      categoriesTitle: "Como funciona",
      agentCategories: [
        {
          label: "Higiene de issues e labels",
          items: [
            "Comenta automaticamente quando falta label na issue",
            "Fecha issues com workflow::done ou workflow::wont-do",
            "Sincroniza labels de assign e ajusta milestones",
          ],
        },
        {
          label: "Fluxo de MR, review e deploy",
          items: [
            "Notifica review atribuído e review concluído",
            "Reassina a issue quando o pipeline falha",
            "Cria tags a partir da decisão de deploy e confirma o deploy por projeto com commit",
            "Gera resumo das mudanças publicadas",
          ],
        },
        {
          label: "Notificações e menções no Slack",
          items: [
            "Notifica menções em comentários, issues e MRs",
            "Alerta commits em projetos específicos",
            "Avisa issues de suporte paradas há mais de 3 dias",
            "Sinaliza devs com baixa carga de issues",
          ],
        },
        {
          label: "Backlog e tarefas recorrentes",
          items: [
            "Agrupa issues bugfix em épicos, criando o épico se não existir",
            "Cria tarefa mensal de análise de performance de banco",
            "Cria tarefa semanal de promoção de integrações Alpha/Beta",
          ],
        },
      ],
      differentials: [
        "Nascido do time, para o time: cada automação veio de uma dor real observada no dia a dia e foi construída em parceria com os devs, o que garantiu uso em vez de mais um script esquecido",
        "Cobertura ponta a ponta: não são scripts isolados, cobrem o ciclo inteiro de uma issue, da abertura ao deploy",
        "Manutenção viva: ~1 ano de evolução contínua, com automações ajustadas e criadas conforme o fluxo do time mudava",
        "Redução de ruído cognitivo: o dev foca em código e review, enquanto o ecossistema cuida da higiene do board e da comunicação",
      ],
      metrics: [
        { label: "Automações ativas", value: "25" },
        { label: "Tipos de evento", value: "6" },
        { label: "Devs no time", value: "~10" },
        { label: "Meses em produção", value: "12+" },
      ],
      visual: { kind: "gitlab-slack-flow", devs: 3 },
    },
  },

  {
    id: "base-conhecimento-ia",
    title: "Base de Conhecimento IA (Crawler Semanal + Vetorização para RAG)",
    description:
      "Pipeline de ingestão que varre semanalmente o site institucional e a central de ajuda, limpa e chunkifica o conteúdo com IA e vetoriza em duas bases PGVector no Supabase: a base de conhecimento que alimenta o RAG dos nossos agentes especialistas.",
    techIds: ["n8n", "cloudflare", "postgresql", "supabase"],
    type: "trabalho",
    details: {
      architecture:
        "Toda base de conhecimento começa manual. Alguém identificava uma mudança no site institucional ou na central de ajuda, reescrevia a resposta e atualizava o documento na mão. Funcionava, até deixar de escalar. O gargalo nunca foi a qualidade do conteúdo, foi a latência entre o site mudar e a base mudar junto: quanto mais o conteúdo crescia, mais tempo alguém gastava em manutenção e maior a chance de o agente responder com informação defasada. A solução foi transformar manutenção em pipeline. Um orquestrador semanal dispara a coleta, um subworkflow dedicado processa cada URL isoladamente e o resultado é persistido em duas bases vetoriais que se atualizam sozinhas. O passo que tornou isso viável foi usar a Cloudflare Browser Rendering API para rastrear as páginas renderizadas por JavaScript, sem isso, boa parte do conteúdo simplesmente não existia para o crawler. O desenho é idempotente por opção: cada URL tem seus vetores anteriores removidos pelo url_id antes da reinserção, então reexecutar o ciclo corrige em vez de duplicar. E cada página carrega o last_scan_at, o que torna a atualização da base auditável em vez de presumida.",
      stack: [
        "Orquestração: n8n, agendador semanal dispara o subworkflow de processamento por URL",
        "Rastreamento: Cloudflare Browser Rendering API (/crawl), com polling a cada 10 minutos e limite de 5.000 páginas por execução",
        "Limpeza: node de código com regex e heurísticas, seguido de LLM (GPT-5.4-nano via OpenRouter) retornando JSON estruturado",
        "Chunking: divisão hierárquica por h1/h2/h3, até 800 palavras por chunk com overlap de 100, prefixando título do artigo e seção",
        "Embeddings: text-embedding-3-small, também via OpenRouter",
        "Vetorização: duas tabelas PGVector no Supabase (base institucional e base de ajuda técnica)",
        "Consistência: remoção dos vetores anteriores por url_id antes da reinserção, com last_scan_at registrado em cada página",
      ],
      categoriesTitle: "Como funciona",
      agentCategories: [
        {
          label: "Orquestrador semanal",
          items: [
            "Agendador dispara a coleta toda semana",
            "Mapeia os sitemaps do site institucional e os links da central de ajuda",
            "Consolida as URLs descobertas em uma fila única de processamento",
          ],
        },
        {
          label: "Subworkflow por URL",
          items: [
            "Requisição de crawl ao Cloudflare com polling a cada 10 minutos",
            "Limpeza do HTML com regex e LLM, retornando título, seções e texto corrido",
            "Chunking hierárquico por h1/h2/h3 com título e seção prefixados em cada chunk",
            "Geração dos embeddings e gravação nos dois vector stores",
            "Remoção dos vetores antigos por url_id antes de reinserir",
          ],
        },
      ],
      differentials: [
        "Base que se mantém sozinha: o ciclo semanal transforma manutenção manual em pipeline, e a atualização deixa de depender de alguém lembrar de fazer",
        "Crawl de conteúdo renderizado: a Cloudflare Browser Rendering API enxerga as páginas que só existem depois do JavaScript rodar, que é justamente onde boa parte da documentação mora",
        "Limpeza em duas camadas: regex remove ruído estrutural e o LLM normaliza o texto, com saída em JSON estruturado em vez de HTML bruto",
        "Chunking alinhado à estrutura real do documento: a divisão segue h1/h2/h3 e prefixa título e seção, então cada chunk carrega o contexto de onde veio",
        "Duas bases, um só pipeline: conteúdo institucional e ajuda técnica são separados na vetorização, mas mantidos pelo mesmo crawling semanal",
        "Reexecução segura: o ciclo é idempotente, remover por url_id antes de reinserir significa que rodar de novo corrige em vez de acumular duplicata",
      ],
      metrics: [
        { label: "URLs processadas", value: "3.000+" },
        { label: "Ciclo de atualização", value: "1x/semana" },
        { label: "Bases vetoriais", value: "2" },
        { label: "Palavras por chunk", value: "800" },
      ],
      visual: {
        kind: "rag-pipeline",
        cadence: "1x/semana",
      },
    },
  },

  {
    id: "ecossistema-notificacoes",
    title: "Ecossistema de Notificações (Financeiro · Comercial · Desenvolvimento)",
    description:
      "Sistema de handoff que fecha o ciclo da Luiza: cada conversa que a IA não resolve é roteada para Financeiro, Comercial ou Desenvolvimento com template completo, resumo por IA e link da conversa no Slack, e toda conversa fechada por humano volta como análise estruturada de 4 eixos que orienta o ajuste dos prompts do agente.",
    techIds: ["n8n", "redis", "slack"],
    type: "trabalho",
    details: {
      architecture:
        "Este projeto não substitui a Luiza: ele cuida do que acontece nas bordas dela. A Luiza resolve a maior parte das conversas sozinha, mas as que dependem de decisão humana precisam chegar ao setor certo com contexto suficiente para que a pessoa assuma sem ler o histórico inteiro. E cada uma dessas conversas é, ao mesmo tempo, a fonte de dado mais valiosa do sistema: é a única hora em que fica visível onde a IA falhou. O projeto se organiza em três camadas que se alimentam. A primeira é o roteamento em tempo real, que classifica a intenção, escolhe o template certo para a janela de atendimento e entrega a conversa ao setor correspondente já com resumo gerado por IA. A segunda é um conjunto de notificações operacionais que traduz eventos internos (como uma release do produto) em mensagens estruturadas para o canal do time, sem ninguém precisar abrir o e-mail. A terceira é o loop de melhoria: toda conversa encerrada por um humano gera um relatório estruturado com o que o cliente queria resolver, onde a IA errou, o que o humano fez e qual tipo de gap foi. Esse relatório não ajusta o prompt sozinho, ele é lido por quem mantém o agente, que decide o que mudar. A partir daí a conversa volta para a Luiza como requisito de qualidade, e o ponto onde ela falhou vira tarefa de engenharia.",
      stack: [
        "Orquestração: n8n, com o roteamento isolado em subagente dedicado",
        "LLM: GPT-5.4 via OpenRouter para transformação de releases e resumos; GPT-5.4-nano para as análises de handoff",
        "Regra de handoff: template completo + flag no_follow_up no Redis + resumo por IA + envio ao Slack",
        "Escopo de cancelamento: 6 serviços mapeados, com regra de insistência antes de escalar ao Financeiro",
        "Análise pós-handoff: relatório estruturado em 4 eixos gerado a partir da conversa encerrada",
        "Releases: webhook de inbound do Postmark convertido em mrkdwn do Slack por LLM",
        "Base de conhecimento: consulta ao PGVector compartilhado com a Luiza",
      ],
      categoriesTitle: "Como funciona",
      agentCategories: [
        {
          label: "Roteamento e handoff",
          items: [
            "Cliente pede contato com Financeiro ou Comercial, ou o caso é claramente dessas naturezas",
            "Regra de redirecionamento atômico: nunca responder apenas 'vou encaminhar'",
            "Template completo enviado com link, WhatsApp e horário de atendimento",
            "Flag no_follow_up no Redis para evitar follow-up automático depois da transferência",
            "Resumo de 2 a 3 frases com o contexto da conversa, junto do link direto no Crisp",
            "Template variado por janela: dia útil dentro do horário, fora do horário e fim de semana",
          ],
        },
        {
          label: "Notificações de release",
          items: [
            "Webhook de inbound do Postmark recebe o e-mail de release da plataforma de release notes do time",
            "LLM converte o HTML em mrkdwn do Slack seguindo regras de mapeamento",
            "Nomes técnicos de projeto traduzidos para nomes amigáveis em PT-BR",
            "Categorias normalizadas em Adicionado, Alterado e Corrigido",
            "IDs padronizados e entidades HTML removidas",
            "Notificação sai estruturada no canal interno do time",
          ],
        },
        {
          label: "Análise pós-handoff",
          items: [
            "Conversa encerrada por humano dispara análise automática por LLM",
            "Eixo 1 (problema): o que o cliente queria resolver",
            "Eixo 2 (onde a IA errou): o que passou ou foi diagnosticado errado",
            "Eixo 3 (o que o humano fez): o caminho real que resolveu",
            "Eixo 4 (tipo de gap): classificação do erro, como diagnóstico ausente ou conclusão precipitada",
            "Relatório com link da conversa no Crisp, lido por quem mantém os prompts da Luiza",
          ],
        },
      ],
      differentials: [
        "Redirecionamento atômico: a regra impede que o agente responda só 'vou encaminhar'; template completo, flag de follow-up e envio ao Slack acontecem obrigatoriamente na mesma resposta, o que elimina promessa vazia para o cliente",
        "Escopo restrito com regra de insistência: o cancelamento só atua em 6 serviços mapeados e só escala para o Financeiro se o cliente continuar evasivo ou frustrado depois de uma pergunta, o que reduz alucinação em domínio sensível",
        "Contrapartida diferente por setor: Financeiro e Comercial recebem a conversa com template e resumo; Desenvolvimento recebe o post-mortem estruturado, porque é quem ajusta o prompt",
        "Release vira rotina: o e-mail deixa de ser algo que alguém precisa ler e vira mensagem estruturada no canal do time, com mapeamento de nomes e categorias normalizadas",
        "Falha convertida em dado: a conversa em que a IA errou deixa de ser histórico perdido e vira diagnóstico estruturado, versionado por eixo",
        "Templates por janela de atendimento: a mensagem enviada muda conforme o cliente esteja dentro do horário, fora dele ou em fim de semana",
      ],
      metrics: [
        { label: "Análises de handoff/mês", value: "~180" },
        { label: "Setores notificados", value: "3" },
        { label: "Serviços no escopo de cancelamento", value: "6" },
        { label: "Eixos do relatório de análise", value: "4" },
      ],
      visual: { kind: "handoff-fanout", monthly: "~180/mês" },
    },
  },

  {
    id: "armazenamento-backup-nas",
    title: "Infraestrutura de Armazenamento e Backup (Synology RS820+)",
    description:
      "NAS Synology RS820+ com 4 HDs em RAID 5 que centraliza o armazenamento do ecossistema da GPM (gravações de 20+ câmeras por 45 dias, backups locais de todas as VMs, quórum do cluster Proxmox e retenção automatizada), tudo configurado do zero a partir de um equipamento que estava parado.",
    techIds: ["synology", "proxmox", "linux"],
    type: "trabalho",
    details: {
      architecture:
        "O projeto começou com um NAS que estava parado na empresa. A ideia foi transformá-lo no centro de armazenamento e resiliência do ecossistema interno, reunindo em um único ponto três funções críticas: armazenamento massivo (gravações de câmeras), backup local de VMs (proteção contra falhas nos hosts) e quórum de cluster (evitando split-brain no Proxmox). A premissa de design foi simples: um equipamento confiável, com retenção bem definida, que não exige intervenção humana e cobre as três frentes sem competir entre si por recursos. O pool de 15 TB úteis foi dividido de forma explícita: ~11 TB dedicados ao CFTV e ~4 TB para o backup das VMs. Essa alocação só fecha porque a taxa de gravação por câmera foi calculada antes de dimensionar o storage. Toda a configuração, desde a formatação inicial do NAS, passando pela definição de políticas de retenção, até a integração com o cluster, foi feita para ser autônoma e auditável: cada frente roda em seu próprio ciclo, diário ou por evento, com políticas de retenção explícitas por frente.",
      stack: [
        "Hardware: Synology RS820+ com 4 HDs de 5 TB em RAID 5, 15 TB úteis (3 discos de dados + 1 de paridade)",
        "Armazenamento de CFTV: 20+ câmeras Intelbras distribuídas em 3 DVRs, pool dedicado de ~11 TB com retenção de 45 dias",
        "Backup de VMs: pool de ~4 TB reservado para os backups gerenciados pelo Proxmox Backup Server, detalhados no case de arquitetura de backup",
        "Cluster Proxmox: VM leve de 256 MB rodando como QDevice, o terceiro voto de quórum do cluster de dois nós",
        "Proteção: UPS atendendo o conjunto, cobrindo as três funções em caso de queda de energia",
      ],
      categoriesTitle: "Como funciona",
      agentCategories: [
        {
          label: "CFTV: gravação contínua",
          items: [
            "O NAS recebe gravações de 20+ câmeras Intelbras distribuídas em 3 DVRs, cobrindo o coworking e a empresa",
            "Pool de ~11 TB dedicado exclusivamente a esse uso",
            "Retenção de 45 dias: qualquer gravação além disso é apagada por rotina que roda na madrugada",
            "Nenhuma intervenção manual no ciclo de gravação",
            "Dimensionamento validado antes da ativação: ~1,1 Mbps de taxa por câmera",
          ],
        },
        {
          label: "Alocação e uso do pool",
          items: [
            "Todas as VMs do ecossistema têm backup diário landing neste pool",
            "Os datastores do Proxmox Backup Server são montados sobre o storage via NFS",
            "O pool de ~4 TB é reservado exclusivamente para backups, sem disputa com o CFTV",
            "O uso atual ocupa ~30 GB, com folga sobrando para o crescimento do ecossistema",
            "Restaurações do dia a dia são servidas daqui, por ser o caminho mais curto",
          ],
        },
        {
          label: "QDevice: terceiro voto de quórum",
          items: [
            "O cluster da empresa é formado por dois mini-PCs",
            "Com número par de nós, uma partição de rede faz cada lado se achar primário: é o chamado split-brain",
            "Uma VM leve de 256 MB foi criada dentro do NAS para fornecer o terceiro voto",
            "O QDevice não armazena dado: mantém apenas o estado de quórum esperado para o desempate",
            "Configuração validada e estável, provando que não é preciso muito recurso para resolver o problema",
          ],
        },
        {
          label: "Retenção e automação",
          items: [
            "Cada frente roda em seu próprio ciclo, diário ou por evento",
            "Retenção configurada por prazo, sem apagamento manual",
            "Proteção elétrica via UPS para o conjunto",
            "O NAS se mantém saudável a longo prazo sem virar fonte de manutenção",
            "Configuração documentada e auditável",
          ],
        },
      ],
      differentials: [
        "Um equipamento, três funções críticas: armazenamento massivo, backup de VMs e quórum de cluster convivendo no mesmo NAS sem competir por recursos",
        "Transformação de equipamento parado em infraestrutura central: o RS820+ estava encostado e virou peça central do ecossistema",
        "Uso do NAS como QDevice: terceiro voto de quórum com uma VM de 256 MB, resolvendo split-brain no cluster Proxmox sem precisar de um terceiro servidor",
        "Cobertura completa de CFTV: 20+ câmeras em 3 DVRs, com ~11 TB dedicados e 45 dias de histórico",
        "UPS protegendo as três funções: energia ininterrupta em um equipamento que concentra CFTV, backups e quórum",
      ],
      metrics: [
        { label: "Capacidade útil em RAID 5", value: "15 TB" },
        { label: "Câmeras Intelbras", value: "20+" },
        { label: "Retenção de gravações", value: "45 dias" },
        { label: "Backup geral dos ecossistemas", value: "VM's" },
      ],
      visual: { kind: "nas-raid-stack" },
    },
  },
  {
    id: "backup-hibrido-pbs",
    title: "Arquitetura de Backup Híbrido e Redundante (Proxmox Backup Server)",
    description:
      "Arquitetura de backup em múltiplas camadas sobre o Proxmox Backup Server, com backups incrementais e deduplicados das VMs, datastore primário em NAS, replicação off-site para Object Storage S3, ciclo de vida completo com prune, garbage collection e verificação de integridade, e backup independente do próprio PBS, com monitoramento publicado no Slack em tempo real.",
    techIds: ["proxmox", "synology", "n8n", "slack"],
    type: "trabalho",
    details: {
      architecture:
        "O projeto foi desenhado a partir de um princípio simples e frequentemente negligenciado: um backup só é confiável se você conseguir restaurá-lo, inclusive o próprio sistema de backup. Em vez de depender de um único PBS com seus datastores, a arquitetura foi pensada em camadas independentes de proteção, combinando armazenamento local em NAS, cópia externa em Object Storage S3 e um backup separado da própria VM do PBS. A estratégia separa fisicamente compute (os servidores Proxmox que executam as VMs) de backup (o armazenamento, que fica no NAS descrito no case de armazenamento e backup): a perda de um host Proxmox, um disco ou até o NAS inteiro não significa perder todas as cópias. A camada externa em S3 protege contra cenários mais graves: falha física, incidente local ou corrupção do armazenamento primário. O design cobre o ciclo de vida inteiro: captura em Snapshot Mode, deduplicação, incremental, retenção em múltiplos horizontes, replicação por PBS Sync, limpeza com Prune seguido de Garbage Collection, verificação de integridade dos chunks e uma sequência documentada de disaster recovery. Nenhuma etapa depende de script externo ou de intervenção manual.",
      stack: [
        "Virtualização: Proxmox VE com backup em modo Snapshot Mode e guest-agent nas VMs",
        "Plataforma de backup: Proxmox Backup Server, com backups incrementais, deduplicação, compressão e verificação de integridade",
        "Datastore primário: NAS Synology montado via NFS, caminho curto para as restaurações do dia a dia",
        "Datastore externo: Object Storage S3-compatible alimentado por PBS Sync Job nativo (suporte a S3 a partir do PBS 3.1)",
        "Ciclo de vida: retenção em 4 horizontes, prune, garbage collection e verificação de integridade dos chunks",
        "Monitoramento: hook de notificação do PBS disparando POST no webhook do n8n, que formata e publica no Slack",
        "Self-backup: a VM do PBS tem backup independente em volume dedicado no NAS, com o cache externo excluído",
      ],
      categoriesTitle: "Como funciona",
      agentCategories: [
        {
          label: "Captura incremental e deduplicação",
          items: [
            "Todas as VMs do ecossistema são copiadas diariamente em Snapshot Mode, sem desligar as máquinas de produção",
            "Guest-agent garante consistência da aplicação durante o snapshot",
            "Após a primeira execução os backups passam a ser incrementais, reduzindo drasticamente o volume trafegado",
            "Deduplicação e compressão nativas reduzem o espaço ocupado por blocos repetidos",
            "O uso atual de todo o conjunto é de ~30 GB, dentro do pool de ~4 TB reservado no NAS",
          ],
        },
        {
          label: "Duas camadas de armazenamento",
          items: [
            "Datastore primário em NAS Synology via NFS, usado para restaurações rápidas",
            "Datastore externo em Object Storage S3-compatible, alimentado por PBS Sync Job nativo do PBS",
            "A replicação usa o mecanismo interno do PBS: nenhum script externo no caminho",
            "A cópia off-site protege contra falha física, incidente local ou corrupção do storage primário",
            "Compute e backup ficam fisicamente separados, então perder um host não significa perder as cópias",
          ],
        },
        {
          label: "O PBS também tem backup",
          items: [
            "A VM do PBS tem backup independente, armazenado em um volume dedicado no NAS",
            "O disco usado apenas como cache do armazenamento externo foi excluído do backup de propósito",
            "Esse cache pode ser reconstruído e não precisa ocupar espaço na cópia",
            "Se a VM do PBS for perdida, basta restaurá-la e reconectar os datastores",
            "Os backups existentes voltam a ficar disponíveis sem precisar recopiar nada",
          ],
        },
        {
          label: "Ciclo de vida e monitoramento",
          items: [
            "Retenção em 4 horizontes: diário, semanal, mensal e anual",
            "Prune remove os snapshots que não fazem mais parte da política",
            "Garbage Collection libera os blocos não referenciados por nenhum backup, depois do prune",
            "Verificação confere a integridade dos chunks antes que uma restauração precise deles",
            "Hook do PBS publica no Slack via n8n, com sucesso, erro, servidor, datastore e resultado",
            "Jobs distribuídos por horário, evitando concorrência por CPU, RAM, disco e rede",
          ],
        },
      ],
      differentials: [
        "Backup do backupador: a VM do PBS tem backup próprio em volume dedicado, evitando o cenário em que o sistema responsável pelas cópias não pode ser restaurado",
        "PBS Sync nativo: a replicação off-site usa o mecanismo interno do PBS, sem depender de script externo frágil",
        "Storage local e cloud no mesmo caminho: a restauração do dia a dia vem do NAS sem depender da internet, e o S3 fica como cópia externa",
        "Verificação de integridade ativa: não basta ter o backup, é preciso garantir que ele é restaurável",
        "Ciclo de vida completo e auditável: captura, replicação, retenção, prune, garbage collection e verificação, todos automatizados",
        "Jobs distribuídos por horário: evita concorrência excessiva por CPU, RAM, disco e rede entre as etapas do ciclo",
        "Monitoramento integrado ao ecossistema: o hook do PBS publica no Slack via n8n, extensível para e-mail, WhatsApp ou abertura automática de incidente sem tocar no PBS",
        "Compute e backup separados: a perda de um host Proxmox, um disco ou do NAS inteiro não significa perder todas as cópias",
      ],
      metrics: [
        { label: "Backups das VMs do ecossistema", value: "~30 GB" },
        { label: "Datastores", value: "2" },
        { label: "Horizontes de retenção", value: "4" },
        { label: "Etapas do ciclo de vida", value: "6" },
      ],
      visual: { kind: "pbs-layers" },
    },
  },
];