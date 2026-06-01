import type { Metadata } from "next";

import { NovedadesPreview } from "@/components/novedades-preview";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Novedades",
  description: "Novedades institucionales y actividades de la Escuela Especial N 23.",
  alternates: {
    canonical: "/novedades",
  },
};

export default function NovedadesPage() {
  return (
    <main className="page-enter min-h-[60vh] bg-app px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div data-reveal suppressHydrationWarning className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Comunidad EE23</p>
            <h1 className="text-3xl font-black text-brand-dark">Novedades institucionales</h1>
          </div>
          <p className="text-sm text-brand-dark/75">Selecciona una tarjeta para ver la nota completa.</p>
        </div>
        <NovedadesPreview cantidad={12} headingLevel="h2" />
      </div>
    </main>
  );
}
