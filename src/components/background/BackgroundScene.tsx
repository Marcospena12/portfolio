"use client";

import { useRef, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { getBackground } from "@/data/backgrounds";
import { BackgroundAtmosphere } from "./BackgroundAtmosphere";
import { BackgroundLights } from "./BackgroundLights";
import { BackgroundPhoto } from "./BackgroundPhoto";
import { useScenePointer } from "./useScenePointer";

export function BackgroundScene() {
  const pathname = usePathname();
  const scene = getBackground(pathname);
  const rootRef = useRef<HTMLDivElement>(null);

  useScenePointer(rootRef);

  return (
    <div
      ref={rootRef}
      data-scene={scene.scene}
      className="scene pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      style={
        {
          "--scene-photo-opacity-light": scene.lightOpacity,
          "--scene-photo-opacity-dark": scene.darkOpacity,
          "--scene-bloom-opacity-light": scene.lightBloom,
          "--scene-bloom-opacity-dark": scene.darkBloom,
        } as CSSProperties
      }
    >
      <div className="scene-base" />
      <BackgroundPhoto scene={scene} />
      <BackgroundLights />
      <BackgroundAtmosphere />
    </div>
  );
}
