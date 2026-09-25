import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { BackgroundAurora } from "@/components/BackgroundAurora";
import { BackgroundPhoto } from "@/components/BackgroundPhoto";

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
  description: "Portfólio de desenvolvimento e automações",
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
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}