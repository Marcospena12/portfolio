"use client";

import type { IconType } from "react-icons";
import { FaBalanceScale, FaBatteryFull, FaClock, FaHdd, FaVideo } from "react-icons/fa";
import { SiSynology } from "react-icons/si";

type Row = {
  icon: IconType;
  label: string;
  detail: string;
  chip: string;
  color: string;
};

const ROWS: Row[] = [
  {
    icon: FaVideo,
    label: "CFTV",
    detail: "20+ câmeras Intelbras em 3 DVRs",
    chip: "45 dias",
    color: "#F59E0B",
  },
  {
    icon: FaHdd,
    label: "Backups de VM",
    detail: "Pool reservado do ecossistema · via NFS",
    chip: "~30 GB em uso",
    color: "#3B82F6",
  },
];

const SLOTS = ["dados", "dados", "dados", "paridade"];

export function NasRaidStack() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 rounded-2xl border border-foreground/10 bg-background/40 p-6 backdrop-blur-sm sm:p-8">
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="led-border flex h-11 w-11 items-center justify-center rounded-xl border border-foreground/10 bg-background/60">
            <SiSynology className="text-xl" />
          </div>
          <div>
            <h2 className="font-semibold">Synology RS820+</h2>
            <p className="text-xs text-foreground/50">4 × 5 TB · RAID 5</p>
          </div>
        </div>
        <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs text-foreground/60">
          15 TB úteis
        </span>
      </div>

      <div className="grid w-full grid-cols-4 gap-3">
        {SLOTS.map((slot) => {
          const isParity = slot === "paridade";
          return (
            <div
              key={slot}
              className={`flex h-16 flex-col items-center justify-center gap-1 rounded-xl border bg-background/60 ${
                isParity ? "border-dashed border-foreground/25" : "border-foreground/10"
              }`}
            >
              <FaHdd className={`text-lg ${isParity ? "text-foreground/30" : "text-foreground/70"}`} />
              <span
                className={`text-[9px] uppercase tracking-wider ${
                  isParity ? "text-foreground/35" : "text-foreground/55"
                }`}
              >
                {slot}
              </span>
            </div>
          );
        })}
      </div>
      <p className="-mt-2 text-center text-[11px] text-foreground/45">
        3 discos de dados + 1 de paridade · ~13,6 TiB
      </p>

      <div className="flex w-full flex-col gap-1.5">
        <div className="flex w-full gap-1">
          <div className="rounded-lg bg-foreground/70" style={{ flex: 11 }} />
          <div className="rounded-lg bg-foreground/25" style={{ flex: 4 }} />
        </div>
        <div className="flex w-full justify-between text-[10px] text-foreground/50">
          <span>CFTV · ~11 TB</span>
          <span>Backups · ~4 TB</span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3">
        {ROWS.map((row) => {
          const Icon = row.icon;
          return (
            <div
              key={row.label}
              className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-foreground/10 bg-background/60 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Icon className="text-sm" style={{ color: row.color }} />
                <div>
                  <p className="text-xs font-semibold">{row.label}</p>
                  <p className="text-[10px] text-foreground/50">{row.detail}</p>
                </div>
              </div>
              <span className="rounded-full bg-foreground/10 px-3 py-1 text-[10px] text-foreground/60">
                {row.chip}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-foreground/10 bg-background/60 p-4 text-center">
        <FaBalanceScale className="text-xl" style={{ color: "#8B5CF6" }} />
        <p className="text-xs font-semibold">QDevice — 3º voto de quórum</p>
        <p className="text-[10px] text-foreground/50">
          VM de 256 MB no cluster Proxmox de 2 nós, impedindo split-brain
        </p>
        <span className="rounded-full bg-foreground/10 px-3 py-1 text-[10px] text-foreground/60">
          resolve partição de rede
        </span>
      </div>

      <div className="flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-foreground/10 pt-4 text-[10px] text-foreground/50">
        <span className="flex items-center gap-1.5">
          <FaBatteryFull className="text-foreground/40" /> UPS
        </span>
        <span className="flex items-center gap-1.5">
          <FaClock className="text-foreground/40" /> prune automático
        </span>
      </div>
    </div>
  );
}