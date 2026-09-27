"use client";

import type { IconType } from "react-icons";
import { FaCloud, FaDatabase } from "react-icons/fa";
import { useLanguage } from "@/components/LanguageProvider";
import type { Localized } from "@/data/translations";

type Store = {
  icon: IconType;
  title: Localized;
  detail: Localized;
  stat: Localized;
  color: string;
};

const STORES: Store[] = [
  {
    icon: FaDatabase,
    title: { pt: "NAS · primário", en: "NAS · primary" },
    detail: {
      pt: "Montado via NFS, caminho curto para as restaurações",
      en: "Mounted over NFS, a short path for restores",
    },
    stat: { pt: "~30 GB em uso", en: "~30 GB in use" },
    color: "#3B82F6",
  },
  {
    icon: FaCloud,
    title: { pt: "S3 · off-site", en: "S3 · off-site" },
    detail: {
      pt: "Alimentado por PBS Sync nativo, sem script externo",
      en: "Fed by native PBS Sync, no external script",
    },
    stat: { pt: "cópia externa", en: "external copy" },
    color: "#0EA5E9",
  },
];

export function PbsLayers() {
  const { locale } = useLanguage();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-foreground/10 bg-background/40 p-6 backdrop-blur-sm sm:p-8">
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {STORES.map((store) => {
          const Icon = store.icon;
          return (
            <div
              key={store.title.pt}
              className="flex flex-col items-start gap-2 rounded-xl border border-foreground/10 bg-background/60 p-5"
            >
              <div className="flex items-center gap-2">
                <Icon className="text-base" style={{ color: store.color }} />
                <span className="text-sm font-semibold">{store.title[locale]}</span>
              </div>
              <p className="text-[11px] leading-4 text-foreground/50">
                {store.detail[locale]}
                <span className="text-foreground/70"> · {store.stat[locale]}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}