"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

type OrbitLogo = { src: string; alt: string };
type OrbitLogosProps = {
  logos: OrbitLogo[];
  radius?: number;
  size?: number;
  duration?: number;
};

export function OrbitLogos({ logos, radius = 130, size = 56, duration = 18 }: OrbitLogosProps) {
  const box = radius * 2 + size;

  return (
    <div
      className="relative mx-auto"
      style={{ width: box, height: box, "--orbit-duration": `${duration}s` } as CSSProperties}
    >
      

      {/* grupo que orbita */}
      <div className="orbit-spin absolute inset-0">
        {logos.map((logo, i) => {
          const rad = ((360 / logos.length) * i * Math.PI) / 180;
          const x = radius * Math.sin(rad);
          const y = -radius * Math.cos(rad);
          return (
            <div
              key={logo.src}
              className="absolute top-1/2 left-1/2 h-0 w-0"
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              {/* centraliza o logo no ponto da órbita */}
              <div
                className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
                style={{ width: size, height: size }}
              >
                {/* contra-rotação: o logo orbita mas fica de pé */}
                <div className="orbit-counter flex h-full w-full items-center justify-center">
                  <div
                    className="absolute rounded-full bg-foreground/15 blur-md"
                    style={{ width: size, height: size }}
                  />
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={size}
                    height={size}
                    className="relative object-contain"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}