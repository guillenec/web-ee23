"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { getFotosGaleriaPublicas, type FotoGaleria } from "@/lib/galeria";

type Props = {
  cantidad?: number;
};

export function GaleriaPreview({ cantidad = 3 }: Props) {
  const [fotos, setFotos] = useState<FotoGaleria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getFotosGaleriaPublicas();
        setFotos(data.slice(0, cantidad));
      } catch {
        setError("No se pudieron cargar imagenes destacadas.");
      } finally {
        setLoading(false);
      }
    };

    void cargar();
  }, [cantidad]);

  if (loading) {
    return (
      <div className="grid gap-5 md:grid-cols-3">
        {Array.from({ length: cantidad }).map((_, idx) => (
          <article key={idx} className="overflow-hidden rounded-2xl border border-brand-dark/10 bg-surface p-4">
            <div className="h-44 animate-pulse rounded-xl bg-brand-dark/10" />
            <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-brand-dark/10" />
            <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-brand-dark/10" />
          </article>
        ))}
      </div>
    );
  }

  if (error) {
    return <article className="rounded-2xl border border-brand-main/25 bg-brand-main/5 p-4 text-sm text-brand-dark">{error}</article>;
  }

  if (!fotos.length) {
    return (
      <article className="rounded-2xl border border-brand-dark/15 bg-surface p-4 text-sm text-brand-dark/80">
        Aun no hay imagenes publicadas en galeria.
      </article>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {fotos.map((foto, idx) => (
        <article
          key={foto.id}
          data-reveal
          className="card-lift fade-up overflow-hidden rounded-2xl border border-brand-dark/10 bg-surface shadow-[0_8px_20px_rgba(75,56,49,0.08)]"
          style={{ animationDelay: `${0.08 * idx}s` }}
        >
          <Image src={foto.src} alt={foto.titulo} width={900} height={700} className="h-44 w-full object-cover" />
          <div className="space-y-2 p-4">
            <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">{foto.categoria}</p>
            <h3 className="text-lg font-extrabold text-brand-dark">{foto.titulo}</h3>
            <p className="text-sm text-brand-dark/80">{foto.descripcion}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
