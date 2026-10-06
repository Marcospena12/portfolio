import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { BackgroundAurora } from "@/components/BackgroundAurora";
import { BackgroundPhoto } from "@/components/BackgroundPhoto";
import { ChatWidget } from "@/components/ChatWidget";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Marcos — Portfólio",
  description:
    "Portfólio de Marcos — desenvolvimento, automações e tecnologia.",

  metadataBase: new URL("https://marcos-pena.vercel.app"),

  openGraph: {
    title: "Marcos — Portfólio",
    description:
      "Portfólio de Marcos — desenvolvimento, automações e tecnologia.",
    url: "https://marcos-pena.vercel.app/",
    siteName: "Marcos — Portfólio",
    locale: "pt_BR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Marcos — Portfólio",
    description:
      "Portfólio de Marcos — desenvolvimento, automações e tecnologia.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ThemeProvider>
          <LanguageProvider>
             <div className="relative flex min-h-dvh flex-col">
              <BackgroundPhoto />
              <BackgroundAurora />
              <Header />
              <div className="relative z-10 flex flex-1 flex-col">{children}</div>
            </div>
            <ChatWidget />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}