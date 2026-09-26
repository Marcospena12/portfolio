"use client";

import type { IconType } from "react-icons";
import { FaCode, FaComments, FaHandHoldingUsd, FaHeadset, FaShareAlt } from "react-icons/fa";

type Sector = {
  icon: IconType;
  label: string;
  detail: string;
  color: string;
};

const SECTORS: Sector[] = [
  {
    icon: FaHandHoldingUsd,
    label: "Financeiro",
    detail: "Template de atendimento + resumo por IA + link no Crisp",
    color: "#F59E0B",
  },
  {
    icon: FaComments,
    label: "Comercial",
    detail: "Template de contato + resumo por IA + link no Crisp",
    color: "#3B82F6",
  },
  {
    icon: FaCode,
    label: "Desenvolvimento",
    detail: "Análise de 4 eixos + link da conversa",
    color: "#8B5CF6",
  },
];

const LOOP = ["IA erra", "Humano resolve", "Análise de 4 eixos", "Prompt ajustado"];

export function HandoffFanout({ monthly }: { monthly: string }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 rounded-2xl border border-foreground/10 bg-background/40 p-6 backdrop-blur-sm sm:p-8">
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="led-border flex h-11 w-11 items-center justify-center rounded-xl border border-foreground/10 bg-background/60">
            <FaShareAlt className="text-lg" />
          </div>
          <div>
            <h2 className="font-semibold">Handoff para o time</h2>
            <p className="text-xs text-foreground/50">Conversas que a IA não resolve</p>
          </div>
        </div>
        <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs text-foreground/60">
          {monthly}
        </span>
      </div>

      <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-foreground/10 bg-background/60 p-5 text-center">
        <FaHeadset className="text-2xl text-foreground/40" />
        <p className="text-sm font-semibold">Handoff humano</p>
        <p className="text-xs text-foreground/50">
          Template completo, resumo por IA e link da conversa enviados na mesma resposta
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        {SECTORS.map((sector) => {
          const Icon = sector.icon;
          return (
            <div
              key={sector.label}
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-foreground/10 bg-background/60 p-5 text-center"
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl border"
                style={{
                  borderColor: `${sector.color}66`,
                  boxShadow: `0 0 18px -6px ${sector.color}`,
                }}
              >
                <Icon className="text-2xl" style={{ color: sector.color }} />
              </div>
              <p className="text-xs font-semibold" style={{ color: sector.color }}>
                {sector.label}
              </p>
              <p className="text-[10px] leading-4 text-foreground/50">{sector.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-foreground/10 bg-background/60 p-4">
        {LOOP.map((step, i) => (
          <span key={step} className="flex items-center gap-2">
            <span className="rounded-full bg-foreground/10 px-3 py-1 text-[10px] text-foreground/60">
              {step}
            </span>
            {i < LOOP.length - 1 && <span className="text-foreground/30">&rarr;</span>}
          </span>
        ))}
      </div>
    </div>
  );
}