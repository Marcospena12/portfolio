"use client";

import { useEffect, useState } from "react";
import { FaPrint, FaSyncAlt } from "react-icons/fa";

type Room = { label: string; used: number; quota: number };

export function QuotaMeter({ rooms }: { rooms: Room[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
  setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
}, []);

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 rounded-2xl border border-foreground/10 bg-background/40 p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="led-border flex h-11 w-11 items-center justify-center rounded-xl border border-foreground/10 bg-background/60">
            <FaPrint className="text-lg" />
          </div>
          <div>
            <h2 className="font-semibold">Cota mensal por sala</h2>
            <p className="text-xs text-foreground/50">SAVAPAGE · impressão compartilhada</p>
          </div>
        </div>
        <FaSyncAlt className="text-foreground/30" />
      </div>

      <div className="flex flex-col gap-3">
        {rooms.map((room, i) => {
          const pct = Math.min(Math.round((room.used / room.quota) * 100), 100);
          return (
            <div key={room.label} className="flex items-center gap-4">
              <span className="w-20 shrink-0 text-sm text-foreground/70">{room.label}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400/70 to-amber-500/80"
                  style={{
                    width: `${mounted ? pct : 0}%`,
                    transition: `width 900ms ease-out ${i * 90}ms`,
                  }}
                />
              </div>
              <span className="w-14 shrink-0 text-right text-xs tabular-nums text-foreground/60">
                {room.used}/{room.quota}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs text-amber-400">
          Renovação automática · todo início de mês
        </span>
        <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs text-foreground/60">
          Ajuste manual pelo gestor
        </span>
      </div>
    </div>
  );
}