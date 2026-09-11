"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function ScrambleText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let frame = 0;
    const totalFrames = 12;

    const interval = setInterval(() => {
      let output = "";
      for (let i = 0; i < text.length; i++) {
        const progress = frame / totalFrames;
        const revealPoint = i / text.length;
        output += progress > revealPoint
          ? text[i]
          : CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setDisplay(output);
      frame++;
      if (frame > totalFrames) {
        clearInterval(interval);
        setDisplay(text);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [text]);

  return <>{display}</>;
}