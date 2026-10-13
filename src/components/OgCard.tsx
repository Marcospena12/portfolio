import { SITE_URL } from "@/data/site";

/**
 * Layout compartilhado dos cards Open Graph / Twitter (site e projeto).
 *
 * Usa apenas estilos inline e flexbox — é o que o satori (motor por trás do
 * `ImageResponse` do next/og) suporta. Nada de grid nem classes CSS.
 */
export function OgCard({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  const host = new URL(SITE_URL).host;

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        backgroundImage:
          "linear-gradient(135deg, #0a0a12 0%, #12101c 55%, #1b0f1e 100%)",
        color: "#f5f5f7",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "9999px",
            background: "#f472b6",
          }}
        />
        <span
          style={{
            fontSize: "26px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#a1a1aa",
          }}
        >
          {eyebrow}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div
          style={{
            fontSize: "66px",
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: "1040px",
          }}
        >
          {title}
        </div>
        <div
          style={{ fontSize: "30px", color: "#a1a1aa", maxWidth: "960px" }}
        >
          {subtitle}
        </div>
      </div>

      <div style={{ display: "flex", fontSize: "26px", color: "#71717a" }}>
        {host}
      </div>
    </div>
  );
}
