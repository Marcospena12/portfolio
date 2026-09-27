"use client";

import type { IconType } from "react-icons";
import { FaCode, FaComments, FaHandHoldingUsd, FaHeadset, FaShareAlt } from "react-icons/fa";
import { useLanguage } from "@/components/LanguageProvider";
import type { Localized } from "@/data/translations";

type Sector = {
  icon: IconType;
  label: Localized;
  detail: Localized;
  color: string;
};

const TITLE: Localized = { pt: "Handoff para o time", en: "Handoff to the team" };
const SUBTITLE: Localized = {
  pt: "Conversas que a IA não resolve",
  en: "Conversations the AI cannot resolve",
};
const HANDOFF_TITLE: Localized = { pt: "Handoff humano", en: "Human handoff" };
const HANDOFF_DETAIL: Localized = {
  pt: "Template completo, resumo por IA e link da conversa enviados na mesma resposta",
  en: "Full template, AI summary and conversation link sent in the same response",
};

const SECTORS: Sector[] = [
  {
    icon: FaHandHoldingUsd,
    label: { pt: "Financeiro", en: "Finance" },
    detail: {
      pt: "Template de atendimento + resumo por IA + link no Crisp",
      en: "Support template + AI summary + link in Crisp",
    },
    color: "#F59E0B",
  },
  {
    icon: FaComments,
    label: { pt: "Comercial", en: "Sales" },
    detail: {
      pt: "Template de contato + resumo por IA + link no Crisp",
      en: "Contact template + AI summary + link in Crisp",
    },
    color: "#3B82F6",
  },
  {
    icon: FaCode,
    label: { pt: "Desenvolvimento", en: "Development" },
    detail: {
      pt: "Análise de 4 eixos + link da conversa",
      en: "4-axis analysis + conversation link",
    },
    color: "#8B5CF6",
  },
];

const LOOP: Localized[] = [
  { pt: "IA erra", en: "AI gets it wrong" },
  { pt: "Humano resolve", en: "Human resolves" },
  { pt: "Análise de 4 eixos", en: "4-axis analysis" },
  { pt: "Prompt ajustado", en: "Prompt tuned" },
];

export function HandoffFanout({ monthly }: { monthly: Localized }) {
  const { locale } = useLanguage();

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 rounded-2xl border border-foreground/10 bg-background/40 p-6 backdrop-blur-sm sm:p-8">
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="led-border flex h-11 w-11 items-center justify-center rounded-xl border border-foreground/10 bg-background/60">
            <FaShareAlt className="text-lg" />
          </div>
          <div>
            <h2 className="font-semibold">{TITLE[locale]}</h2>
            <p className="text-xs text-foreground/50">{SUBTITLE[locale]}</p>
          </div>
        </div>
        <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs text-foreground/60">
          {monthly[locale]}
        </span>
      </div>

      <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-foreground/10 bg-background/60 p-5 text-center">
        <FaHeadset className="text-2xl text-foreground/40" />
        <p className="text-sm font-semibold">{HANDOFF_TITLE[locale]}</p>
        <p className="text-xs text-foreground/50">{HANDOFF_DETAIL[locale]}</p>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        {SECTORS.map((sector) => {
          const Icon = sector.icon;
          return (
            <div
              key={sector.label.pt}
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
                {sector.label[locale]}
              </p>
              <p className="text-[10px] leading-4 text-foreground/50">
                {sector.detail[locale]}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-foreground/10 bg-background/60 p-4">
        {LOOP.map((step, i) => (
          <span key={step.pt} className="flex items-center gap-2">
            <span className="rounded-full bg-foreground/10 px-3 py-1 text-[10px] text-foreground/60">
              {step[locale]}
            </span>
            {i < LOOP.length - 1 && <span className="text-foreground/30">&rarr;</span>}
          </span>
        ))}
      </div>
    </div>
  );
}