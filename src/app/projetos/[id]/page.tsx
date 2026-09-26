import { projects } from "@/data/projects";
import { notFound } from "next/navigation";
import { AgentMap } from "@/components/AgentMap";
import { MetricCard } from "@/components/MetricCard";
import { ScrollHint } from "@/components/ScrollHint";
import { TiltLogo } from "@/components/TiltLogo";
import { GlowLogo } from "@/components/GlowLogo";
import { ClockLamp } from "@/components/ClockLamp";
import { QuotaMeter } from "@/components/QuotaMeter";
import { OrbitLogos } from "@/components/OrbitLogos";
import { GitlabSlackFlow } from "@/components/GitlabSlackFlow";
import { KnowledgePipeline } from "@/components/KnowledgePipeline";
import { HandoffFanout } from "@/components/HandoffFanout";
import { NasRaidStack } from "@/components/NasRaidStack";
import { PbsLayers } from "@/components/PbsLayers";


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
    <main className="flex-1 px-6 pt-16 pb-20 text-foreground">
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
          {details.visual?.kind === "agent-map" && (
            <AgentMap nodes={details.visual.nodes} />
          )}

          {details.visual?.kind === "tilt-logo" && (
            <div className="mx-auto max-w-3xl py-16">
              <TiltLogo
                src={details.visual.src}
                alt={details.visual.alt}
                href={details.visual.href}
              />
            </div>
          )}

          {details.visual?.kind === "orbit-logos" && (
            <div className="mx-auto max-w-3xl py-16">
              <OrbitLogos
                logos={details.visual.logos}
                radius={details.visual.radius}
                size={details.visual.size}
                duration={details.visual.duration}
              />
            </div>
          )}

          {details.visual?.kind === "quota-meter" && (
            <div className="mx-auto max-w-3xl py-16">
              <QuotaMeter rooms={details.visual.rooms} />
            </div>
          )}

          {details.visual?.kind === "clock-lamp" && (
            <div className="mx-auto max-w-3xl py-16">
              <ClockLamp schedule={details.visual.schedule} />
            </div>
          )}

          {details.visual?.kind === "glow-logos" && (
            <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-20 py-16">
              {details.visual.logos.map((logo) => (
                <GlowLogo key={logo.src} src={logo.src} alt={logo.alt} size={320} />
                
              ))}
            </div>
          )}
          {details.visual?.kind === "gitlab-slack-flow" && (
            <div className="mx-auto max-w-3xl py-16">
              <GitlabSlackFlow devs={details.visual.devs} />
            </div>
          )}
           {details.visual?.kind === "rag-pipeline" && (
            <div className="mx-auto max-w-3xl py-16">
              <KnowledgePipeline cadence={details.visual.cadence} />
            </div>
          )}

          {details.visual?.kind === "handoff-fanout" && (
            <div className="mx-auto max-w-3xl py-16">
              <HandoffFanout monthly={details.visual.monthly} />
            </div>
          )}

          {details.visual?.kind === "nas-raid-stack" && (
            <div className="mx-auto max-w-3xl py-16">
              <NasRaidStack />
            </div>
          )}

          {details.visual?.kind === "pbs-layers" && (
            <div className="mx-auto max-w-3xl py-16">
              <PbsLayers />
            </div>
          )}

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

            {details.agentCategories && (
              <section id="subagentes">
                <h2 className="mb-6 text-2xl font-semibold">
                  {details.categoriesTitle ?? "Subagentes especializados"}
                </h2>
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
            )}

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