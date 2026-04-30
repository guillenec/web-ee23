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

type NovedadEditForm = {
  id: string;
  titulo: string;
  slug: string;
  categoria: string;
  autor: string;
  resumen: string;
  contenido: string;
  imagenPrincipal: string;
  videoUrl: string;
  fecha: string;
  estado: "publicado" | "pendiente";
};

export function NovedadesPreview({ cantidad = 3, headingLevel = "h3" }: Props) {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [esAdmin, setEsAdmin] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);
  const [actualizandoId, setActualizandoId] = useState<string | null>(null);
  const [editando, setEditando] = useState<NovedadEditForm | null>(null);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
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

  const abrirEdicion = (novedad: Novedad) => {
    setEditando({
      id: novedad.id,
      titulo: novedad.titulo,
      slug: novedad.slug,
      categoria: novedad.categoria,
      autor: novedad.autor,
      resumen: novedad.resumen,
      contenido: novedad.contenido,
      imagenPrincipal: novedad.imagenPrincipal,
      videoUrl: novedad.videoUrl ?? "",
      fecha: toDateInput(novedad.fecha),
      estado: novedad.estado,
    });
  };

  const guardarEdicion = async () => {
    if (!editando) return;

    const payload = {
      id: editando.id,
      titulo: editando.titulo.trim(),
      slug: editando.slug.trim().toLowerCase(),
      categoria: editando.categoria.trim(),
      autor: editando.autor.trim(),
      resumen: editando.resumen.trim(),
      contenido: editando.contenido.trim(),
      imagenPrincipal: editando.imagenPrincipal.trim(),
      videoUrl: editando.videoUrl.trim(),
      fecha: editando.fecha,
      estado: editando.estado,
    };

    if (!payload.titulo || !payload.slug || !payload.resumen || !payload.contenido || !payload.imagenPrincipal) {
      toast.warning("Completa titulo, slug, resumen, contenido e imagen principal");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(payload.slug)) {
      toast.warning("El slug solo puede tener minusculas, numeros y guiones");
      return;
    }

    try {
      setGuardandoEdicion(true);
      await postAdminAction("/api/admin/update-novedad", payload);
      setNovedades((prev) =>
        prev.map((item) =>
          item.id === payload.id
            ? {
                ...item,
                titulo: payload.titulo,
                slug: payload.slug,
                categoria: payload.categoria,
                autor: payload.autor,
                resumen: payload.resumen,
                contenido: payload.contenido,
                imagenPrincipal: payload.imagenPrincipal,
                videoUrl: payload.videoUrl,
                fecha: payload.fecha ? new Date(`${payload.fecha}T12:00:00`).toISOString() : item.fecha,
                estado: payload.estado,
              }
            : item,
        ),
      );
      setEditando(null);
      toast.success("Novedad actualizada");
    } catch {
      toast.error("No se pudo actualizar la novedad");
    } finally {
      setGuardandoEdicion(false);
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
    <>
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
                onClick={() => abrirEdicion(novedad)}
                disabled={actualizandoId === novedad.id || eliminandoId === novedad.id}
                className="rounded-full border border-brand-main/60 bg-white/90 px-3 py-1 text-[11px] font-semibold text-brand-main transition hover:bg-brand-main hover:text-white disabled:opacity-60"
              >
                Editar
              </button>
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
      {editando ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setEditando(null)}>
        <div
          className="w-full max-w-3xl rounded-2xl border border-brand-dark/15 bg-surface p-5 shadow-[0_20px_44px_rgba(0,0,0,0.32)]"
          onClick={(event) => event.stopPropagation()}
        >
          <h3 className="text-xl font-black text-brand-dark">Editar novedad</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input value={editando.titulo} onChange={(e) => setEditando((p) => (p ? { ...p, titulo: e.target.value } : p))} className="rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm sm:col-span-2" placeholder="Titulo" />
            <input value={editando.slug} onChange={(e) => setEditando((p) => (p ? { ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") } : p))} className="rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm" placeholder="slug" />
            <input value={editando.fecha} onChange={(e) => setEditando((p) => (p ? { ...p, fecha: e.target.value } : p))} type="date" className="rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm" />
            <input value={editando.categoria} onChange={(e) => setEditando((p) => (p ? { ...p, categoria: e.target.value } : p))} className="rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm" placeholder="Categoria" />
            <input value={editando.autor} onChange={(e) => setEditando((p) => (p ? { ...p, autor: e.target.value } : p))} className="rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm" placeholder="Autor" />
            <select value={editando.estado} onChange={(e) => setEditando((p) => (p ? { ...p, estado: e.target.value as "publicado" | "pendiente" } : p))} className="rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm sm:col-span-2">
              <option value="publicado">Publicado</option>
              <option value="pendiente">Pendiente</option>
            </select>
            <input value={editando.imagenPrincipal} onChange={(e) => setEditando((p) => (p ? { ...p, imagenPrincipal: e.target.value } : p))} className="rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm sm:col-span-2" placeholder="URL imagen principal" />
            <input value={editando.videoUrl} onChange={(e) => setEditando((p) => (p ? { ...p, videoUrl: e.target.value } : p))} className="rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm sm:col-span-2" placeholder="URL video YouTube (opcional)" />
            <textarea value={editando.resumen} onChange={(e) => setEditando((p) => (p ? { ...p, resumen: e.target.value } : p))} className="min-h-20 rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm sm:col-span-2" placeholder="Resumen" />
            <textarea value={editando.contenido} onChange={(e) => setEditando((p) => (p ? { ...p, contenido: e.target.value } : p))} className="min-h-44 rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm sm:col-span-2" placeholder="Contenido" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => setEditando(null)} className="rounded-full border border-brand-dark/25 px-4 py-2 text-xs font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white">
              Cancelar
            </button>
            <button type="button" onClick={() => void guardarEdicion()} disabled={guardandoEdicion} className="rounded-full border border-brand-main/40 bg-brand-main px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-soft disabled:opacity-60">
              {guardandoEdicion ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
        </div>
      ) : null}
    </>
  );
}

function toDateInput(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}
