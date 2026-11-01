"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

export type EmblemSpinProps = {
  src: string;
  srcDark?: string;
  alt: string;
  size?: number;
  mode?: "spin" | "sway" | "static";
  thickness?: number;
  className?: string;
};

export function EmblemSpin({
  src,
  srcDark,
  alt,
  size = 72,
  mode = "spin",
  thickness = 6,
  className = "",
}: EmblemSpinProps) {
  const totalDepth = thickness > 0 ? Math.max(thickness * 0.8, 2) : 0;
  const halfDepth = totalDepth / 2;

  // Renderiza camadas intermediárias para simular extrusão 3D
  const intermediateLayers = [];
  if (thickness > 1) {
    for (let i = 1; i < thickness; i++) {
      const z = -halfDepth + (i * totalDepth) / thickness;
      intermediateLayers.push(
        <div
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 select-none"
          style={
            {
              transform: `translateZ(${z}px)`,
              filter: "brightness(0.55)",
            } as CSSProperties
          }
        >
          <EmblemImage src={src} srcDark={srcDark} alt="" size={size} />
        </div>
      );
    }
  }

  const animationClass =
    mode === "spin"
      ? "emblem-animate-spin"
      : mode === "sway"
        ? "emblem-animate-sway"
        : "";

  const staticStyle: CSSProperties =
    mode === "static"
      ? {
          transform: "rotateY(-15deg) rotateX(8deg)",
        }
      : {};

  return (
    <div
      className={`emblem-3d-wrapper select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className={`emblem-3d-object ${animationClass}`}
        style={{ width: size, height: size, ...staticStyle }}
      >
        {/* Camadas intermediárias simulando espessura 3D */}
        {intermediateLayers}

        {/* Verso com orientação 3D contínua perfeitamente alinhada */}
        <div
          className="emblem-face emblem-face-back"
          style={{ transform: `rotateY(180deg) translateZ(${halfDepth}px) scaleX(-1)` }}
          aria-hidden="true"
        >
          <EmblemImage src={src} srcDark={srcDark} alt="" size={size} />
        </div>

        {/* Frente */}
        <div
          className="emblem-face"
          style={{ transform: `translateZ(${halfDepth}px)` }}
        >
          <EmblemImage src={src} srcDark={srcDark} alt={alt} size={size} />
        </div>
      </div>
    </div>
  );
}

function EmblemImage({
  src,
  srcDark,
  alt,
  size,
}: {
  src: string;
  srcDark?: string;
  alt: string;
  size: number;
}) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        unoptimized
        className={`h-full w-full object-contain ${srcDark ? "dark:hidden" : ""}`}
      />
      {srcDark && (
        <Image
          src={srcDark}
          alt={alt}
          width={size}
          height={size}
          unoptimized
          className="hidden h-full w-full object-contain dark:block"
        />
      )}
    </div>
  );
}
