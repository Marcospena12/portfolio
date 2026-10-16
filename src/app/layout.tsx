import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { BackgroundAurora } from "@/components/BackgroundAurora";
import { BackgroundPhoto } from "@/components/BackgroundPhoto";
import { ChatWidget } from "@/components/ChatWidget";
import { VisitNotifier } from "@/components/VisitNotifier";
import {
  SITE_DESCRIPTION,
  SITE_KNOWS_ABOUT,
  SITE_NAME,
  SITE_SOCIALS,
  SITE_URL,
} from "@/data/site";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Template: páginas filhas definem só a parte específica ("Projetos — Marcos").
  title: { default: SITE_NAME, template: "%s — Marcos" },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },

  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "pt_BR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

// Dados estruturados (JSON-LD): descrevem "quem é o Marcos" para buscadores e
// IAs. O replace de "<" evita XSS ao injetar via dangerouslySetInnerHTML.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Marcos",
  jobTitle: "Desenvolvedor",
  url: SITE_URL,
  sameAs: SITE_SOCIALS,
  knowsAbout: SITE_KNOWS_ABOUT,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <ThemeProvider>
          <LanguageProvider>
             <div className="relative flex min-h-dvh flex-col">
              <BackgroundPhoto />
              <BackgroundAurora />
              <Header />
              <div className="relative z-10 flex flex-1 flex-col">{children}</div>
            </div>
            <ChatWidget />
            <VisitNotifier />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}