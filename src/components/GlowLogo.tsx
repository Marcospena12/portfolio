"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type GlowLogoProps = {
  src: string;
  alt: string;
  size?: number;
};

export function GlowLogo({ src, alt, size = 200 }: GlowLogoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(
      `perspective(800px) rotateX(${y * -15}deg) rotateY(${x * 15}deg) scale(1.08)`
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
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center"
    >
      <div className="absolute inset-8 rounded-full bg-foreground/15 blur-2xl" />
      <div
        style={{ transform, transformStyle: "preserve-3d" }}
        className="relative transition-transform duration-200 ease-out"
      >
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="pointer-events-none object-contain"
        />
      </div>
    </div>
  );
}