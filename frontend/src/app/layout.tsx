import type { Metadata } from "next";
import { Lato, Source_Sans_3 } from "next/font/google";
import Script from "next/script";

import { ScrollReveal } from "@/components/scroll-reveal";
import { AppToaster } from "@/components/app-toaster";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeToggle } from "@/components/theme-toggle";

import "./globals.css";

const lato = Lato({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://escuela-especial-23.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Escuela Especial N 23 | Ingeniero Jacobacci",
    template: "%s | Escuela Especial N 23",
  },
  description:
    "Sitio institucional de la Escuela Especial N 23 de Ingeniero Jacobacci: novedades, galería, contacto y acompañamiento territorial en Región Sur.",
  keywords: [
    "Escuela Especial N 23",
    "Ingeniero Jacobacci",
    "educación especial",
    "Río Negro",
    "Región Sur",
    "novedades escolares",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Escuela Especial N 23 | Ingeniero Jacobacci",
    description:
      "Información institucional, novedades y canales de contacto de la Escuela Especial N 23.",
    url: siteUrl,
    siteName: "Escuela Especial N 23",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/assets/images/hero-frente.jpg",
        width: 1200,
        height: 630,
        alt: "Escuela Especial N 23 en Ingeniero Jacobacci",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Escuela Especial N 23 | Ingeniero Jacobacci",
    description:
      "Información institucional, novedades y canales de contacto de la Escuela Especial N 23.",
    images: ["/assets/images/hero-frente.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/icon.png", sizes: "512x512" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${lato.variable} ${sourceSans.variable} antialiased`}>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var key='ee23_theme';var s=localStorage.getItem(key);var t=(s==='dark'||s==='light')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;}catch(e){}})();`}
        </Script>
        <ScrollReveal />
        <AppToaster />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
        <ThemeToggle />
      </body>
    </html>
  );
}
