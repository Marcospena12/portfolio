"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type TiltLogoProps = {
  src: string;
  alt: string;
  href?: string;
};

export function TiltLogo({ src, alt, href }: TiltLogoProps) {
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

  const card = (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transformStyle: "preserve-3d" }}
      className="led-border mx-auto flex h-80 w-80 items-center justify-center rounded-2xl border border-foreground/10 bg-background/60 p-12 backdrop-blur-sm transition-transform duration-200 ease-out"
    >
      <Image src={src} alt={alt} width={220} height={220} className="pointer-events-none" />
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="mx-auto block w-fit">
        {card}
      </a>
    );
  }

  return card;
}