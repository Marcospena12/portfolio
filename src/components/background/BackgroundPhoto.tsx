"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import type { PageBackground } from "@/data/backgrounds";

type PhotoLayer = {
  id: number;
  scene: PageBackground;
};

function layerKey(scene: PageBackground): string {
  return `${scene.scene}|${scene.src}|${scene.position}|${scene.mobilePosition}`;
}

export function BackgroundPhoto({ scene }: { scene: PageBackground }) {
  const [layers, setLayers] = useState<PhotoLayer[]>(() => [{ id: 0, scene }]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLayers((prev) => {
      const last = prev[prev.length - 1];
      if (layerKey(last.scene) === layerKey(scene)) return prev;
      return [...prev.slice(-1), { id: last.id + 1, scene }];
    });
  }, [scene]);

  useEffect(() => {
    if (layers.length < 2) return;
    const timeout = window.setTimeout(() => {
      setLayers((prev) => prev.slice(-1));
    }, 900);
    return () => window.clearTimeout(timeout);
  }, [layers]);

  return (
    <>
      <div className="scene-photo-layer">
        {layers.map((layer, index) => {
          const isCurrent = index === layers.length - 1;
          return (
            <div
              key={layer.id}
              className={`scene-photo-frame ${isCurrent ? "is-current" : "is-leaving"}`}
            >
              <Image
                src={layer.scene.src}
                alt=""
                fill
                sizes="100vw"
                draggable={false}
                loading="eager"
                fetchPriority={isCurrent ? "high" : "auto"}
                className="scene-photo-img"
                style={
                  {
                    "--scene-pos": layer.scene.position,
                    "--scene-pos-mobile": layer.scene.mobilePosition,
                  } as CSSProperties
                }
              />
            </div>
          );
        })}
      </div>

      <div className="scene-bloom-layer">
        {layers.map((layer, index) => {
          const isCurrent = index === layers.length - 1;
          return (
            <div
              key={layer.id}
              className={`scene-bloom-frame ${isCurrent ? "is-current" : "is-leaving"}`}
            >
              <Image
                src={layer.scene.src}
                alt=""
                fill
                sizes="100vw"
                draggable={false}
                loading="lazy"
                fetchPriority="low"
                className="scene-bloom-img"
                style={
                  {
                    "--scene-pos": layer.scene.position,
                    "--scene-pos-mobile": layer.scene.mobilePosition,
                  } as CSSProperties
                }
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
