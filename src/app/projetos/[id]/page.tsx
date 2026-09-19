import { projects } from "@/data/projects";
import { notFound } from "next/navigation";
import { AgentMap } from "@/components/AgentMap";
import { MetricCard } from "@/components/MetricCard";
import { ScrollHint } from "@/components/ScrollHint";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const { details } = project;

  return (
    <main className="min-h-screen bg-background px-6 pt-16 pb-20 text-foreground">
      {details && <ScrollHint />}
      <div className="mx-auto max-w-3xl">
       <h1 className="gradient-text mb-4 text-4xl font-bold">{project.title}</h1>
        <p className="mb-10 text-foreground/70">{project.description}</p>

        {details && (
          <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {details.metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} size="lg" />
            ))}
          </div>
        )}
      </div>

      {details && (
        <>
          <AgentMap
            nodes={[
              { id: "feature", label: "Agent - Sugestões de Melhorias", color: "#3b82f6", top: "15%", left: "60%" },
              { id: "triage", label: "Agent - Trata Assuntos de Negócios", color: "#f59e0b", top: "28%", left: "79%" },
              { id: "primary-ch", label: "Agent - Especialista em WhatsApp Official", color: "#10b981", top: "50%", left: "85%" },
              { id: "legacy-ch", label: "Agent - Especialista em WhatsApp QRCode", color: "#34d399", top: "70%", left: "85%" },
              { id: "escalation", label: "Agent - Especialista em Human Handoff", color: "#f43f5e", top: "84%", left: "56%" },
              { id: "wrapup", label: "Agent - Finalizador de Conversas", color: "#64748b", top: "84%", left: "30%" },
              { id: "context", label: "Agent - Busca Contextos de Conversas antigas", color: "#8b5cf6", top: "60%", left: "20%" },
              { id: "billing", label: "Agent - Especialista em Assinaturas", color: "#ec4899", top: "32%", left: "24%" },
              { id: "ecosystem", label: "Agent - Especialista em Integrações", color: "#d946ef", top: "16%", left: "34%" },
            ]}
          />

          <div className="mx-auto max-w-3xl space-y-20 pt-20">
            <section id="arquitetura">
              <h2 className="mb-4 text-2xl font-semibold">Arquitetura</h2>
              <p className="text-foreground/70">{details.architecture}</p>
            </section>

            <section id="stack">
              <h2 className="mb-4 text-2xl font-semibold">Stack técnico</h2>
              <ul className="space-y-2">
                {details.stack.map((item, i) => (
                  <li key={i} className="text-foreground/70">
                    • {item}
                  </li>
                ))}
              </ul>
            </section>

            <section id="subagentes">
              <h2 className="mb-6 text-2xl font-semibold">Subagentes especializados</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {details.agentCategories.map((cat) => (
                  <div key={cat.label} className="rounded-xl border border-foreground/10 p-5">
                    <h3 className="mb-3 font-semibold">{cat.label}</h3>
                    <ul className="space-y-1">
                      {cat.items.map((item, i) => (
                        <li key={i} className="text-sm text-foreground/70">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section id="diferenciais">
              <h2 className="mb-4 text-2xl font-semibold">Diferenciais</h2>
              <ul className="space-y-2">
                {details.differentials.map((item, i) => (
                  <li key={i} className="text-foreground/70">
                    • {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </main>
  );
}