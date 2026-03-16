import type { Metadata } from "next";
import { Lato, Source_Sans_3 } from "next/font/google";

import { ScrollReveal } from "@/components/scroll-reveal";

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

export const metadata: Metadata = {
  title: "Escuela Especial N 23",
  description:
    "Sitio institucional de la Escuela Especial N 23 de Ingeniero Jacobacci.",
  icons: {
    icon: "/assets/logos/logo1.png",
    shortcut: "/assets/logos/logo1.png",
    apple: "/assets/logos/logo1.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${lato.variable} ${sourceSans.variable} antialiased`}>
        <ScrollReveal />
        {children}
      </body>
    </html>
  );
}
