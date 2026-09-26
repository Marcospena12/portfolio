"use client";

import type { IconType } from "react-icons";
import { FaCloud, FaDatabase } from "react-icons/fa";

type Store = {
  icon: IconType;
  title: string;
  detail: string;
  stat: string;
  color: string;
};

const STORES: Store[] = [
  {
    icon: FaDatabase,
    title: "NAS · primário",
    detail: "Montado via NFS, caminho curto para as restaurações",
    stat: "~30 GB em uso",
    color: "#3B82F6",
  },
  {
    icon: FaCloud,
    title: "S3 · off-site",
    detail: "Alimentado por PBS Sync nativo, sem script externo",
    stat: "cópia externa",
    color: "#0EA5E9",
  },
];

export function PbsLayers() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-foreground/10 bg-background/40 p-6 backdrop-blur-sm sm:p-8">
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {STORES.map((store) => {
          const Icon = store.icon;
          return (
            <div
              key={store.title}
              className="flex flex-col items-start gap-2 rounded-xl border border-foreground/10 bg-background/60 p-5"
            >
              <div className="flex items-center gap-2">
                <Icon className="text-base" style={{ color: store.color }} />
                <span className="text-sm font-semibold">{store.title}</span>
              </div>
              <p className="text-[11px] leading-4 text-foreground/50">
                {store.detail}
                <span className="text-foreground/70"> · {store.stat}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}