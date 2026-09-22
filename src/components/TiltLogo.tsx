"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type TiltLogoProps = {
  src: string;
  alt: string;
};

export function TiltLogo({ src, alt }: TiltLogoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateX = y * -20;
    const rotateY = x * 20;
    setTransform(
      `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
    );
  }

  function handleMouseLeave() {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)");
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transformStyle: "preserve-3d" }}
      className="led-border mx-auto flex h-48 w-48 items-center justify-center rounded-2xl border border-foreground/10 bg-background/60 p-8 backdrop-blur-sm transition-transform duration-200 ease-out"
    >
      <Image src={src} alt={alt} width={140} height={140} className="pointer-events-none" />
    </div>
  );
}