import { ImageResponse } from "next/og";
import { OgCard } from "@/components/OgCard";
import { SITE_DESCRIPTION } from "@/data/site";

export const alt = "Marcos — Portfólio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OgCard eyebrow="Portfólio" title="Marcos" subtitle={SITE_DESCRIPTION} />,
    { ...size },
  );
}
