"use client";

import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { Timestamp, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { TransitionLink } from "@/components/transition-link";
import { postAdminAction } from "@/lib/admin-api";
import { esEmailAdmin } from "@/lib/admin-auth";
import { extractCloudinaryPublicId } from "@/lib/cloudinary-utils";
import { auth, db } from "@/lib/firebase";
import { getNovedadesPublicadas, type Novedad } from "@/lib/novedades";
import { extractYouTubeVideoId } from "@/lib/youtube";

type Props = {
  cantidad?: number;
};

type NovedadEditForm = {
  idOriginal: string;
  titulo: string;
  slug: string;
  categoria: string;
  autor: string;
  resumen: string;
  contenido: string;
  imagenPrincipal: string;
  videoUrl: string;
  youtubeVideoId: string;
  imagenPrincipalPublicId: string;
  galeria: string[];
  galeriaPublicIds: string[];
  fecha: string;
  estado: "publicado" | "pendiente";
};

export function NovedadesPreview({ cantidad = 3 }: Props) {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [esAdmin, setEsAdmin] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);
  const [editando, setEditando] = useState<NovedadEditForm | null>(null);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

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
      toast.success("Novedad eliminada con exito");
      toast.info("Si tenia video en YouTube, borralo manualmente en YouTube Studio.");
    } catch {
      toast.error("No se pudo eliminar la novedad");
    } finally {
      setEliminandoId(null);
    }
  };

  const abrirEdicion = (novedad: Novedad) => {
    setEditando({
      idOriginal: novedad.id,
      titulo: novedad.titulo,
      slug: novedad.slug || novedad.id,
      categoria: novedad.categoria,
      autor: novedad.autor,
      resumen: novedad.resumen,
      contenido: novedad.contenido,
      imagenPrincipal: novedad.imagenPrincipal,
      videoUrl: novedad.videoUrl ?? "",
      youtubeVideoId: novedad.youtubeVideoId ?? extractYouTubeVideoId(novedad.videoUrl ?? "") ?? "",
      imagenPrincipalPublicId: novedad.imagenPrincipalPublicId ?? extractCloudinaryPublicId(novedad.imagenPrincipal) ?? "",
      galeria: novedad.galeria,
      galeriaPublicIds: novedad.galeriaPublicIds ?? novedad.galeria.map((item) => extractCloudinaryPublicId(item) ?? ""),
      fecha: toDateInput(novedad.fecha),
      estado: novedad.estado,
    });
  };

  const guardarEdicion = async () => {
    if (!editando) return;

    const slugFinal = slugDesdeTexto(editando.slug || editando.titulo);
    if (!slugFinal || !editando.titulo.trim() || !editando.resumen.trim() || !editando.contenido.trim()) {
      toast.warning("Completa titulo, slug, resumen y contenido");
      return;
    }

    try {
      setGuardandoEdicion(true);
      await setDoc(doc(db, "novedades", slugFinal), {
        titulo: editando.titulo.trim(),
        slug: slugFinal,
        categoria: editando.categoria.trim(),
        autor: editando.autor.trim(),
        resumen: editando.resumen.trim(),
        contenido: editando.contenido.trim(),
        imagenPrincipal: editando.imagenPrincipal.trim(),
        videoUrl: editando.videoUrl.trim(),
        youtubeVideoId: editando.youtubeVideoId.trim() || extractYouTubeVideoId(editando.videoUrl.trim()) || "",
        imagenPrincipalPublicId:
          editando.imagenPrincipalPublicId || extractCloudinaryPublicId(editando.imagenPrincipal) || "",
        galeria: editando.galeria,
        galeriaPublicIds: editando.galeriaPublicIds,
        fecha: editando.fecha
          ? Timestamp.fromDate(new Date(`${editando.fecha}T12:00:00`))
          : Timestamp.now(),
        estado: editando.estado,
        actualizadoEn: Timestamp.now(),
      });

      if (editando.idOriginal !== slugFinal) {
        await deleteDoc(doc(db, "novedades", editando.idOriginal));
      }

      setNovedades((prev) => {
        if (editando.estado !== "publicado") {
          return prev.filter((item) => item.id !== editando.idOriginal);
        }

        return prev.map((item) =>
          item.id === editando.idOriginal
            ? {
                ...item,
                id: slugFinal,
                slug: slugFinal,
                titulo: editando.titulo.trim(),
                categoria: editando.categoria.trim(),
                autor: editando.autor.trim(),
                resumen: editando.resumen.trim(),
                contenido: editando.contenido.trim(),
                imagenPrincipal: editando.imagenPrincipal.trim(),
                videoUrl: editando.videoUrl.trim(),
                youtubeVideoId: editando.youtubeVideoId.trim() || extractYouTubeVideoId(editando.videoUrl.trim()) || "",
                imagenPrincipalPublicId:
                  editando.imagenPrincipalPublicId || extractCloudinaryPublicId(editando.imagenPrincipal) || "",
                galeria: editando.galeria,
                galeriaPublicIds: editando.galeriaPublicIds,
                fecha: editando.fecha ? new Date(`${editando.fecha}T12:00:00`).toISOString() : item.fecha,
                estado: editando.estado,
              }
            : item,
        );
      });

      setEditando(null);
      toast.success("Novedad actualizada con exito");
    } catch {
      toast.error("No se pudo actualizar la novedad");
    } finally {
      setGuardandoEdicion(false);
    }
  };

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
      {novedades.map((novedad, idx) => (
        <article
          key={novedad.id}
          className="card-lift fade-up relative rounded-2xl border border-brand-dark/10 bg-surface p-5 shadow-[0_8px_20px_rgba(75,56,49,0.06)]"
          data-reveal
          style={{ animationDelay: `${0.08 * idx}s` }}
        >
          {esAdmin ? (
            <>
              <button
                type="button"
                onClick={() => abrirEdicion(novedad)}
                className="absolute top-3 right-14 z-10 rounded-full border border-brand-main/50 bg-white/90 p-2 text-brand-main transition hover:bg-brand-main hover:text-white"
                aria-label={`Editar novedad ${novedad.titulo}`}
                title="Editar novedad"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 20h4l10-10-4-4L4 16v4z" />
                  <path d="M12 6l4 4" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => void eliminarNovedad(novedad)}
                disabled={eliminandoId === novedad.id}
                className="absolute top-3 right-3 z-10 rounded-full border border-red-400/70 bg-white/90 p-2 text-red-700 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={`Eliminar novedad ${novedad.titulo}`}
                title="Eliminar novedad"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
              </button>
            </>
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
                priority={idx === 0}
                loading={idx === 0 ? "eager" : "lazy"}
                className="mb-4 h-40 w-full rounded-xl object-cover"
                style={{ viewTransitionName: `novedad-${(novedad.slug || novedad.id).replace(/[^a-zA-Z0-9_-]/g, "-")}` }}
              />
            ) : null}
            <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">
              {novedad.categoria || "Novedad"}
            </p>
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
        </article>
      ))}

      {editando ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setEditando(null)}>
          <div
            className="w-full max-w-2xl rounded-2xl border border-brand-dark/15 bg-surface p-5 shadow-[0_20px_44px_rgba(0,0,0,0.32)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-xl font-black text-brand-dark">Editar novedad</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input value={editando.titulo} onChange={(e) => setEditando((p) => (p ? { ...p, titulo: e.target.value } : p))} className="rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm" placeholder="Titulo" />
              <input value={editando.slug} onChange={(e) => setEditando((p) => (p ? { ...p, slug: e.target.value } : p))} className="rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm" placeholder="Slug" />
              <input value={editando.categoria} onChange={(e) => setEditando((p) => (p ? { ...p, categoria: e.target.value } : p))} className="rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm" placeholder="Categoria" />
              <input value={editando.autor} onChange={(e) => setEditando((p) => (p ? { ...p, autor: e.target.value } : p))} className="rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm" placeholder="Autor" />
              <input type="date" value={editando.fecha} onChange={(e) => setEditando((p) => (p ? { ...p, fecha: e.target.value } : p))} className="rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm" />
              <select
                value={editando.estado}
                onChange={(e) =>
                  setEditando((p) => (p ? { ...p, estado: e.target.value === "publicado" ? "publicado" : "pendiente" } : p))
                }
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                  editando.estado === "publicado"
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                    : "border-amber-300 bg-amber-50 text-amber-800"
                }`}
              >
                <option value="publicado">Publicado</option>
                <option value="pendiente">Pendiente</option>
              </select>
              <input
                value={editando.imagenPrincipal}
                onChange={(e) =>
                  setEditando((p) =>
                    p
                      ? {
                          ...p,
                          imagenPrincipal: e.target.value,
                          imagenPrincipalPublicId:
                            extractCloudinaryPublicId(e.target.value) ?? p.imagenPrincipalPublicId,
                        }
                      : p,
                  )
                }
                className="rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
                placeholder="Imagen URL"
              />
              <input
                value={editando.videoUrl}
                onChange={(e) =>
                  setEditando((p) =>
                    p
                      ? {
                          ...p,
                          videoUrl: e.target.value,
                          youtubeVideoId: extractYouTubeVideoId(e.target.value) ?? p.youtubeVideoId,
                        }
                      : p,
                  )
                }
                className="rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm sm:col-span-2"
                placeholder="Video YouTube (opcional)"
              />
            </div>
            <textarea value={editando.resumen} onChange={(e) => setEditando((p) => (p ? { ...p, resumen: e.target.value } : p))} className="mt-3 min-h-20 w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm" placeholder="Resumen" />
            <textarea value={editando.contenido} onChange={(e) => setEditando((p) => (p ? { ...p, contenido: e.target.value } : p))} className="mt-3 min-h-28 w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm" placeholder="Contenido" />
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => void guardarEdicion()} disabled={guardandoEdicion} className="rounded-full bg-brand-main px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-soft disabled:opacity-60">
                {guardandoEdicion ? "Guardando..." : "Guardar cambios"}
              </button>
              <button type="button" onClick={() => setEditando(null)} className="rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function toDateInput(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0] ?? "";
}

function slugDesdeTexto(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
