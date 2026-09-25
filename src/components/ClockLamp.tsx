"use client";

import { useEffect, useState } from "react";
import { FaLightbulb } from "react-icons/fa";

const CYCLE_MS = 20_000; // 24h = 10s reais

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function ClockLamp({ schedule }: { schedule: { on: string; off: string } }) {
  const [minutes, setMinutes] = useState(0);
  const onMin = toMinutes(schedule.on);
  const offMin = toMinutes(schedule.off);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();

    const loop = (now: number) => {
      const progress = ((now - start) % CYCLE_MS) / CYCLE_MS;
      setMinutes((progress * (24 * 60)) % (24 * 60));
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const hours = minutes / 60;
  const hourDeg = ((hours % 12) / 12) * 360;
  const minuteDeg = ((minutes % 60) / 60) * 360;
  const secondDeg = ((minutes % 60) / 60) * 360;
  const isOn = minutes >= onMin && minutes < offMin;

  const hh = String(Math.floor(hours) % 24).padStart(2, "0");
  const mm = String(Math.floor(minutes % 60)).padStart(2, "0");

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-8 rounded-2xl border border-foreground/10 bg-background/40 p-8 backdrop-blur-sm sm:flex-row sm:justify-center">
      <div className="led-border relative h-64 w-64 rounded-full border border-foreground/10 bg-background/60 backdrop-blur-sm">
        <div
          className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-700"
          style={{
            opacity: isOn ? 1 : 0,
            background: "radial-gradient(circle, rgba(251,191,36,0.16), transparent 60%)",
          }}
        />

        {Array.from({ length: 12 }, (_, i) => {
          const major = i % 3 === 0;
          return (
            <span
              key={i}
              className={`absolute left-1/2 top-1/2 rounded-full bg-foreground/70 ${
                major ? "h-3 w-1" : "h-2 w-0.5"
              }`}
              style={{
                transform: `translate(-50%,-50%) rotate(${i * 30}deg) translateY(-${
                  major ? 106 : 108
                }px)`,
              }}
            />
          );
        })}

         <div
          className="absolute bottom-1/2 left-1/2 h-20 w-1.5 -ml-[3px] rounded-full bg-foreground/90 shadow-[0_0_8px_rgba(0,0,0,0.35)]"
          style={{ transform: `rotate(${hourDeg}deg)`, transformOrigin: "50% 100%" }}
        />
        <div
          className="absolute top-1/2 left-1/2 h-10 w-1 -ml-[2px] rounded-full bg-foreground/30"
          style={{ transform: `rotate(${hourDeg}deg)`, transformOrigin: "50% 0%" }}
        />

        {/* Ponteiro de minutos */}
        <div
          className="absolute bottom-1/2 left-1/2 h-24 w-[3px] -ml-[1.5px] rounded-full bg-foreground/55"
          style={{ transform: `rotate(${minuteDeg}deg)`, transformOrigin: "50% 100%" }}
        />
        <div
          className="absolute top-1/2 left-1/2 h-8 w-[2px] -ml-[1px] rounded-full bg-foreground/25"
          style={{ transform: `rotate(${minuteDeg}deg)`, transformOrigin: "50% 0%" }}
        />

        {/* Ponteiro de segundos */}
        <div
          className={`absolute bottom-1/2 left-1/2 h-24 w-[2px] -ml-[1px] rounded-full transition-colors duration-300 ${
            isOn ? "bg-amber-400/70" : "bg-foreground/25"
          }`}
          style={{ transform: `rotate(${secondDeg}deg)`, transformOrigin: "50% 100%" }}
        />

        <div className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground ring-2 ring-background" />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-24 w-24 items-center justify-center">
          {isOn && (
            <div className="glow-breathe absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.35),transparent_65%)]" />
          )}
          <FaLightbulb
            className={`relative text-5xl transition-all duration-300 ${
              isOn
                ? "text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]"
                : "text-foreground/25"
            }`}
          />
        </div>

        <div className="text-2xl font-semibold tabular-nums">
          {hh}:{mm}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs uppercase tracking-wide ${
            isOn ? "bg-amber-400/15 text-amber-400" : "bg-foreground/10 text-foreground/60"
          }`}
        >
          {isOn ? "Luz acesa" : "Luz apagada"}
        </span>

<p className="text-xs text-foreground/40">
         Liga 07:00 e desliga 20:00

        </p>

        <p className="text-xs text-foreground/40">
          {schedule.on} → {schedule.off} · ciclo 24h/20s
        </p>

      </div>
    </div>
  );
}