import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Galería",
  description: "Galería institucional con imágenes de actividades y propuestas de la Escuela Especial N 23.",
  alternates: {
    canonical: "/galeria",
  },
};

export default function GaleriaLayout({ children }: { children: ReactNode }) {
  return children;
}
