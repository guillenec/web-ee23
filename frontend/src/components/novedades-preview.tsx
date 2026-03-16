"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { TransitionLink } from "@/components/transition-link";
import { getNovedadesPublicadas, type Novedad } from "@/lib/novedades";

type Props = {
  cantidad?: number;
};

export function NovedadesPreview({ cantidad = 3 }: Props) {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getNovedadesPublicadas(cantidad);
        setNovedades(data);
      } catch {
        setError("No se pudieron cargar las novedades por el momento.");
      } finally {
        setLoading(false);
      }
    };

    void cargar();
  }, [cantidad]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: Math.min(cantidad, 6) }).map((_, idx) => (
          <article
            key={`sk-${idx}`}
            className="rounded-2xl border border-brand-dark/10 bg-surface p-5 shadow-[0_8px_20px_rgba(75,56,49,0.06)]"
          >
            <div className="h-40 animate-pulse rounded-xl bg-brand-dark/10" />
            <div className="mt-4 h-3 w-24 animate-pulse rounded bg-brand-dark/10" />
            <div className="mt-3 h-6 w-5/6 animate-pulse rounded bg-brand-dark/10" />
            <div className="mt-3 space-y-2">
              <div className="h-3.5 w-full animate-pulse rounded bg-brand-dark/10" />
              <div className="h-3.5 w-11/12 animate-pulse rounded bg-brand-dark/10" />
            </div>
            <div className="mt-4 h-3 w-2/3 animate-pulse rounded bg-brand-dark/10" />
          </article>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-brand-main/30 bg-brand-main/5 p-4 text-sm text-brand-dark">
        {error}
      </div>
    );
  }

  if (!novedades.length) {
    return (
      <div className="rounded-2xl border border-brand-dark/10 bg-surface p-4 text-sm text-brand-dark/80">
        Aun no hay novedades publicadas.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {novedades.map((novedad) => (
        <TransitionLink
          key={novedad.id}
          href={`/novedades/${encodeURIComponent(novedad.slug || novedad.id)}`}
          className="card-lift block rounded-2xl border border-brand-dark/10 bg-surface p-5 shadow-[0_8px_20px_rgba(75,56,49,0.06)]"
          data-reveal
        >
          {novedad.imagenPrincipal ? (
            <Image
              src={novedad.imagenPrincipal}
              alt={novedad.titulo}
              width={800}
              height={500}
              className="mb-4 h-40 w-full rounded-xl object-cover"
              style={{ viewTransitionName: `novedad-${(novedad.slug || novedad.id).replace(/[^a-zA-Z0-9_-]/g, "-")}` }}
            />
          ) : null}
          <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Novedad</p>
          <h3 className="mt-2 text-lg font-extrabold text-brand-dark">{novedad.titulo}</h3>
          <p className="mt-2 text-sm text-brand-dark/80">{novedad.resumen || "Sin resumen."}</p>
          <p className="mt-3 text-xs font-semibold text-brand-dark/70">
            {novedad.categoria} - {novedad.autor}
          </p>
          {novedad.fecha && (
            <p className="mt-1 text-xs text-brand-dark/60">
              Publicado: {new Date(novedad.fecha).toLocaleDateString("es-AR")}
            </p>
          )}
          <p className="mt-4 text-sm font-semibold text-brand-main">Leer nota completa</p>
        </TransitionLink>
      ))}
    </div>
  );
}
