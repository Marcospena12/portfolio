# Projetos do Marcos (curadoria do portfólio)

## 1. luiza — Super Agente de IA para Suporte (n8n)
- Sistema multiagente hierárquico no n8n para automatizar suporte via Crisp, roteando cada conversa ao especialista certo.
- Resolve 70% das ~700 conversas mensais de forma autônoma e humanizada. São 10 subagentes, 6 dashboards no Metabase.
- Arquitetura: um orquestrador central classifica e roteia pro especialista (em vez de um agente genérico), reduzindo alucinação.
- Stack: n8n (nodes LangChain, agentes agentTool), LLM GPT-5.4 via OpenRouter com fallback em GPT-5.4-nano, memória em PostgreSQL (Supabase, últimas 10 mensagens), RAG em 2 vector stores PGVector (base institucional + base de ajuda técnica), Redis (Dragonfly) para flags, canal Crisp, Slack para alertas, parser JSON como output.
- Diferenciais: anti-alucinação por design (preços/links/prazos vêm de fontes verificadas), consciência temporal de horário comercial, fallback de modelo, memória persistente entre sessões.
- Categorias de suporte: WhatsApp QR Code, WABA, base geral, integrações, comercial/financeiro, cancelamentos, handoff humano, contexto histórico e sugestões de melhoria.

## 2. ni-node — Nó verificado do n8n para Notificações Inteligentes
- Nó oficialmente "Verified" do n8n que transforma a API da Notificações Inteligentes em blocos visuais nativos.
- Recursos: Integrações e Leads (CRUD), com operação inteligente "Criar ou Atualizar Lead" que deduplica por telefone.
- Stack: TypeScript (SDK de nós do n8n), zero dependências de runtime (exigência da verificação), linter oficial @n8n/scan-community-package, docs em inglês, autenticação Bearer Token por organização.
- Métricas: Verified, 2 recursos, 14 operações, 0 dependências.
- Diferencial: design orientado a ID permite encadear operações complexas no mesmo fluxo.

## 3. telefonia-ip — Infraestrutura de Telefonia IP (Asterisk + FreePBX)
- Telefonia IP do zero para o coworking da GPM: 2 andares, 8 salas + recepção, 10+ ramais IP.
- Transformou o porteiro Intelbras num serviço integrado ao FreePBX: ramal SIP, chamada toca em vários ramais, abertura de portão via DTMF, permissões por ramal.
- Arquitetura em 3 camadas: telefonia (Asterisk + FreePBX em VM Debian no cluster Proxmox, módulos por andar), integração analógica (gateway Grandstream HT813 FXO/FXS), rede (2 switches Unifi 48 portas, VLANs, IPs estáticos, Fail2Ban/recidive).
- Protocolos: SIP, DTMF RFC4733/RFC2833. Diagnóstico: tcpdump, PJSIP logger, iptables/nftables, CLI do Asterisk.
- Backup em 2 camadas: gravação local em NAS + envio automático para S3 (Backblaze). Uptime 99,9%.

## 4. automacao-iot — Ecossistema de Automação IoT (Home Assistant)
- Automação predial integrando 30+ dispositivos de climatização, iluminação e acesso numa única plataforma.
- Home Assistant como "idioma comum" entre fabricantes diferentes (regras que cruzam ecossistemas), virtualizado no Proxmox.
- Stack: Home Assistant OS no Proxmox, MQTT com servidor local (menos dependência de nuvem), 14 ar-condicionados, 15 módulos de iluminação, 1 controlador de portão.
- Diferenciais: desligamento automático de equipamentos esquecidos (economia de energia), reaproveitou o parque existente sem trocar equipamentos, reexecução de comandos em dispositivos que não confirmam estado.
- Métricas: 30+ dispositivos integrados, 6+ ecossistemas unificados.

## 5. savapage — Ecossistema de Impressão Gerenciada
- Impressão compartilhada pro coworking via SAVAPAGE open source: tudo pelo navegador, sem instalação.
- Modelo: uma conta por sala, créditos mensais que renovam sozinhos, gestão centralizada pelo gestor do coworking.
- Arquitetura: 3 pilares — acesso sem atrito (web, sem drivers), créditos por sala (cota mensal automática), gestão central (ajustes sem tocar em infra).
- Stack: SAVAPAGE em VM Debian no Proxmox, acesso via Cloudflare Tunnel com domínio próprio (sem expor IP/porta), 1 impressora física compartilhada.
- Métricas: 8 salas, 1 impressora, 100% acesso via navegador, renovação mensal.

## 6. portfolio — Este Portfólio
- O próprio site que está sendo visitado: Next.js (App Router), React 19, TypeScript, Tailwind CSS v4.
- Vitrine 100% dirigida por dados: projetos, tecnologias e contatos vivem em src/data/ e as páginas nascem deles; adicionar um case é adicionar um objeto.
- Cada projeto tem narrativa completa (arquitetura, stack, como funciona, diferenciais, métricas) e um visual próprio dirigido por dados (mapa de agentes, relógio de automação, medidor de cotas, logos em órbita).
- Componentes autorais: AgentMap, ClockLamp, QuotaMeter, TiltLogo, GlowLogo, ScrambleText, TechMarquee.
- Bilíngue PT/EN, temas dark/light, tipografia Space Grotesk + JetBrains Mono.
- Métricas: 10+ projetos documentados, 25+ tecnologias, 22+ componentes autorais, 6 páginas.

## 7. gitlab-automations — Automações do GitLab
- Ecossistema de 25 automações: cada issue aberta dispara automações que cuidam de board, review e deploy, avisando o time no Slack.
- Padrão: evento (webhook) → regra → ação (API) → notificação. Higiene de issues/labels, fluxo de MR/deploy (reassign em pipeline falho, tags por decisão de deploy, resumo das mudanças), menções e alertas no Slack, backlog (épicos de bugfix, tarefas recorrentes mensais/semanais).
- Stack: n8n, webhooks do GitLab (6 tipos), requisições HTTP autenticadas, Slack.
- Diferenciais: nascido de dores reais do time de ~10 devs, 12+ meses em produção, cobertura ponta a ponta da issue.

## 8. base-conhecimento-ia — Base de Conhecimento IA (crawler + RAG)
- Pipeline semanal que varre site institucional + central de ajuda, limpa e chunkifica com IA e vetoriza em 2 bases PGVector no Supabase — alimenta o RAG dos agentes especialistas.
- Crawl de conteúdo renderizado por JS via Cloudflare Browser Rendering API (/crawl, polling 10 min, até 5.000 páginas por execução).
- Limpeza em 2 camadas: regex remove ruído + LLM (GPT-5.4-nano via OpenRouter) normaliza em JSON estruturado.
- Chunking hierárquico por h1/h2/h3, até 800 palavras com overlap de 100, prefixando título e seção. Embeddings text-embedding-3-small via OpenRouter.
- Design idempotente: remove vetores anteriores por url_id antes de reinserir; last_scan_at em cada página.
- Métricas: 3.000+ URLs processadas, ciclo 1x/semana, 2 bases, 800 palavras/chunk.

## 9. ecossistema-notificacoes — Notificações (Financeiro · Comercial · Desenvolvimento)
- Sistema de handoff que fecha o ciclo da Super Agente: cada conversa que a IA não resolve vira template completo + resumo por IA + link da conversa no Slack pro setor certo.
- Redirecionamento atômico: nunca responder só "vou encaminhar" — template, flag no_follow_up no Redis e envio ao Slack na mesma resposta.
- Templates por janela de atendimento (dentro/fora do horário, fim de semana). Escopo de cancelamento restrito a 6 serviços com regra de insistência antes de escalar ao Financeiro.
- Loop de melhoria: conversa encerrada por humano → análise em 4 eixos (problema, onde a IA errou, o que o humano fez, tipo de gap) → lida por quem ajusta os prompts do agente.
- Releases: webhook do Postmark convertido em mrkdwn do Slack por LLM (nomes técnicos → amigáveis em PT-BR).
- Métricas: ~180 análises de handoff/mês, 3 setores, 6 serviços no escopo, 4 eixos.

## 10. armazenamento-backup-nas — Infra de Armazenamento e Backup (Synology RS820+)
- NAS Synology RS820+ com 4 HDs de 5 TB em RAID 5 (15 TB úteis), partindo de um equipamento parado na empresa.
- 3 funções críticas num só ponto: CFTV (20+ câmeras Intelbras em 3 DVRs, pool ~11 TB, retenção 45 dias com rotina noturna), backup local de VMs (pool ~4 TB via Proxmox Backup Server, NFS), e QDevice de quórum (VM de 256 MB, terceiro voto contra split-brain no cluster Proxmox de 2 nós).
- Dimensionamento validado antes da ativação (~1,1 Mbps/câmera), UPS protegendo o conjunto, retenção automatizada e auditável.

## 11. backup-hibrido-pbs — Arquitetura de Backup Híbrido (Proxmox Backup Server)
- Backup em camadas: datastore primário em NAS Synology via NFS + cópia off-site em Object Storage S3 via PBS Sync nativo + backup independente da própria VM do PBS.
- Princípio: "um backup só é confiável se você conseguir restaurá-lo, inclusive o próprio sistema de backup".
- Ciclo de vida completo: Snapshot Mode com guest-agent, incremental, deduplicação, retenção em 4 horizontes (diário/semanal/mensal/anual), prune, garbage collection, verificação de integridade dos chunks.
- Monitoramento: hook do PBS publica no Slack via n8n (sucesso, erro, servidor, datastore, resultado), jobs distribuídos por horário.
- Compute e backup fisicamente separados: perder um host, um disco ou o NAS inteiro não significa perder as cópias.