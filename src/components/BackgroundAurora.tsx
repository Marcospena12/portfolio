"use client";

import { usePathname } from "next/navigation";

export function BackgroundAurora() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <span
        className="aurora-blob"
        style={{
          background: "radial-gradient(circle, var(--aurora-1), transparent 70%)",
          width: "60%",
          height: "60%",
          top: "-10%",
          left: "-5%",
          animation: "aurora-drift 24s ease-in-out infinite",
        }}
      />
      <span
        className="aurora-blob"
        style={{
          background: "radial-gradient(circle, var(--aurora-2), transparent 70%)",
          width: "50%",
          height: "50%",
          bottom: "-15%",
          right: "-10%",
          animation: "aurora-drift 32s ease-in-out infinite",
          animationDelay: "-8s",
        }}
      />
      <span
        className="aurora-blob"
        style={{
          background: "radial-gradient(circle, var(--aurora-3), transparent 70%)",
          width: "35%",
          height: "35%",
          top: "30%",
          left: "40%",
          animation: "aurora-drift 40s ease-in-out infinite",
          animationDelay: "-16s",
        }}
      />
    </div>
  );
}