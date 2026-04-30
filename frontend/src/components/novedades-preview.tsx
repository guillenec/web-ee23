"use client";

import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { TransitionLink } from "@/components/transition-link";
import { postAdminAction } from "@/lib/admin-api";
import { esEmailAdmin } from "@/lib/admin-auth";
import { auth } from "@/lib/firebase";
import { getNovedadesPublicadas, type Novedad } from "@/lib/novedades";

type Props = {
  cantidad?: number;
  headingLevel?: "h2" | "h3";
};

export function NovedadesPreview({ cantidad = 3, headingLevel = "h3" }: Props) {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [esAdmin, setEsAdmin] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);
  const [actualizandoId, setActualizandoId] = useState<string | null>(null);
  const HeadingTag = headingLevel;

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

  useEffect(() => {
    const off = onAuthStateChanged(auth, (user) => {
      setEsAdmin(esEmailAdmin(user?.email));
    });

    return () => off();
  }, []);

  const eliminarNovedad = async (novedad: Novedad) => {
    const confirmado = window.confirm(`Se eliminara la novedad "${novedad.titulo}". Esta accion no se puede deshacer.`);
    if (!confirmado) return;

    try {
      setEliminandoId(novedad.id);
      await postAdminAction("/api/admin/delete-novedad", { id: novedad.id });
      setNovedades((prev) => prev.filter((item) => item.id !== novedad.id));
      toast.success("Novedad eliminada");
    } catch {
      toast.error("No se pudo eliminar la novedad");
    } finally {
      setEliminandoId(null);
    }
  };

  const pasarAPendiente = async (novedad: Novedad) => {
    try {
      setActualizandoId(novedad.id);
      await postAdminAction("/api/admin/update-novedad-estado", { id: novedad.id, estado: "pendiente" });
      setNovedades((prev) => prev.filter((item) => item.id !== novedad.id));
      toast.success("Novedad pasada a pendiente");
    } catch {
      toast.error("No se pudo actualizar el estado");
    } finally {
      setActualizandoId(null);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: Math.min(cantidad, 3) }).map((_, idx) => (
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
      {novedades.map((novedad, idx) => (
        <article
          key={novedad.id}
          className="surface-hover card-lift group relative overflow-hidden rounded-2xl border border-brand-dark/10 bg-surface p-5 shadow-[0_8px_20px_rgba(75,56,49,0.06)]"
        >
          {esAdmin ? (
            <div className="absolute top-3 right-3 z-10 flex gap-2">
              <button
                type="button"
                onClick={() => void pasarAPendiente(novedad)}
                disabled={actualizandoId === novedad.id || eliminandoId === novedad.id}
                className="rounded-full border border-amber-400/70 bg-white/90 px-3 py-1 text-[11px] font-semibold text-amber-800 transition hover:bg-amber-500 hover:text-white disabled:opacity-60"
              >
                {actualizandoId === novedad.id ? "Moviendo..." : "Pendiente"}
              </button>
              <button
                type="button"
                onClick={() => void eliminarNovedad(novedad)}
                disabled={actualizandoId === novedad.id || eliminandoId === novedad.id}
                className="rounded-full border border-red-400/70 bg-white/90 px-3 py-1 text-[11px] font-semibold text-red-700 transition hover:bg-red-600 hover:text-white disabled:opacity-60"
              >
                {eliminandoId === novedad.id ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          ) : null}
          <TransitionLink
            href={`/novedades/${encodeURIComponent(novedad.slug || novedad.id)}`}
            className="block"
            useViewTransition
          >
            {novedad.imagenPrincipal ? (
              <Image
                src={novedad.imagenPrincipal}
                alt={novedad.titulo}
                width={800}
                height={500}
                priority={idx < 2}
                loading={idx < 2 ? "eager" : "lazy"}
                quality={62}
                sizes="(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 331px"
                className="mb-4 h-40 w-full rounded-xl object-cover"
                style={{ viewTransitionName: `novedad-${(novedad.slug || novedad.id).replace(/[^a-zA-Z0-9_-]/g, "-")}` }}
              />
            ) : null}
            <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">
              {novedad.categoria || "Novedad"}
            </p>
            <HeadingTag className="mt-2 text-lg font-extrabold text-brand-dark">{novedad.titulo}</HeadingTag>
            <p className="mt-2 text-sm text-brand-dark/80">{novedad.resumen || "Sin resumen."}</p>
            <p className="mt-3 text-xs font-semibold text-brand-dark/75">
              {novedad.categoria} - {novedad.autor}
            </p>
            {novedad.fecha && (
              <p className="mt-1 text-xs text-brand-dark/75">
                Publicado: {new Date(novedad.fecha).toLocaleDateString("es-AR")}
              </p>
            )}
            <p className="link-sweep mt-4 inline-block text-sm font-semibold text-brand-main">Leer nota completa</p>
          </TransitionLink>
        </article>
      ))}
    </div>
  );
}
