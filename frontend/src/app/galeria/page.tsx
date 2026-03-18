"use client";

import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { postAdminAction } from "@/lib/admin-api";
import { esEmailAdmin } from "@/lib/admin-auth";
import { extractCloudinaryPublicId } from "@/lib/cloudinary-utils";
import { auth, db } from "@/lib/firebase";
import { categoriasGaleria, getFotosGaleriaPublicas, type FotoGaleria } from "@/lib/galeria";

const filtros = ["Todas", ...categoriasGaleria] as const;
type Filtro = (typeof filtros)[number];

type FotoEditForm = {
  id: string;
  titulo: string;
  categoria: FotoGaleria["categoria"];
  descripcion: string;
  src: string;
  publicId: string;
  fecha: string;
  visible: boolean;
};

export default function GaleriaPage() {
  const [filtro, setFiltro] = useState<Filtro>("Todas");
  const [fotosBase, setFotosBase] = useState<FotoGaleria[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fotoActiva, setFotoActiva] = useState<FotoGaleria | null>(null);
  const [esAdmin, setEsAdmin] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);
  const [editandoFoto, setEditandoFoto] = useState<FotoEditForm | null>(null);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getFotosGaleriaPublicas();
        setFotosBase(data);
      } catch {
        setError("No se pudo cargar la galeria en este momento.");
      }
    };

    void cargar();
  }, []);

  const fotos = useMemo(() => {
    if (filtro === "Todas") return fotosBase;
    return fotosBase.filter((foto) => foto.categoria === filtro);
  }, [filtro, fotosBase]);

  useEffect(() => {
    if (!fotoActiva) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFotoActiva(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fotoActiva]);

  useEffect(() => {
    const off = onAuthStateChanged(auth, (user) => {
      setEsAdmin(esEmailAdmin(user?.email));
    });

    return () => off();
  }, []);

  const eliminarFoto = async (foto: FotoGaleria) => {
    const confirmado = window.confirm(`Se eliminara la imagen "${foto.titulo}". Esta accion no se puede deshacer.`);
    if (!confirmado) return;

    try {
      setEliminandoId(foto.id);
      await postAdminAction("/api/admin/delete-galeria-item", { id: foto.id });
      setFotosBase((prev) => prev.filter((item) => item.id !== foto.id));
      if (fotoActiva?.id === foto.id) {
        setFotoActiva(null);
      }
      toast.success("Imagen eliminada con exito");
    } catch {
      toast.error("No se pudo eliminar la imagen");
    } finally {
      setEliminandoId(null);
    }
  };

  const abrirEdicion = (foto: FotoGaleria) => {
    setEditandoFoto({
      id: foto.id,
      titulo: foto.titulo,
      categoria: foto.categoria,
      descripcion: foto.descripcion,
      src: foto.src,
      publicId: foto.publicId ?? extractCloudinaryPublicId(foto.src) ?? "",
      fecha: toDateInput(foto.fecha),
      visible: foto.visible,
    });
  };

  const guardarEdicion = async () => {
    if (!editandoFoto) return;
    if (!editandoFoto.titulo.trim() || !editandoFoto.src.trim()) {
      toast.warning("Completa titulo e imagen");
      return;
    }

    try {
      setGuardandoEdicion(true);
      await setDoc(
        doc(db, "galeria", editandoFoto.id),
        {
          titulo: editandoFoto.titulo.trim(),
          categoria: editandoFoto.categoria,
          descripcion: editandoFoto.descripcion.trim(),
          src: editandoFoto.src.trim(),
          urlImagen: editandoFoto.src.trim(),
          publicId: editandoFoto.publicId || extractCloudinaryPublicId(editandoFoto.src) || "",
          fecha: editandoFoto.fecha
            ? Timestamp.fromDate(new Date(`${editandoFoto.fecha}T12:00:00`))
            : Timestamp.now(),
          visible: editandoFoto.visible,
          actualizadoEn: Timestamp.now(),
        },
        { merge: true },
      );

      setFotosBase((prev) =>
        prev.map((item) =>
          item.id === editandoFoto.id
            ? {
                ...item,
                titulo: editandoFoto.titulo.trim(),
                categoria: editandoFoto.categoria,
                descripcion: editandoFoto.descripcion.trim(),
                src: editandoFoto.src.trim(),
                publicId: editandoFoto.publicId || extractCloudinaryPublicId(editandoFoto.src) || "",
                fecha: editandoFoto.fecha ? new Date(`${editandoFoto.fecha}T12:00:00`).toISOString() : item.fecha,
                visible: editandoFoto.visible,
              }
            : item,
        ),
      );

      setEditandoFoto(null);
      toast.success("Imagen actualizada con exito");
    } catch {
      toast.error("No se pudo actualizar la imagen");
    } finally {
      setGuardandoEdicion(false);
    }
  };

  return (
    <main className="page-enter bg-app px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-7">
        <section data-reveal className="rounded-3xl border border-brand-dark/10 bg-surface p-6 sm:p-8">
          <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Galeria institucional</p>
          <h1 className="mt-2 text-3xl font-black text-brand-dark sm:text-4xl">
            Imagenes del trabajo pedagogico y comunitario
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-brand-dark/80 sm:text-base">
            Registro visual de propuestas de aula, actividades territoriales y actos que forman parte de
            la vida institucional de la Escuela Especial N 23.
          </p>
        </section>

        <section data-reveal className="flex flex-wrap gap-2">
          {filtros.map((opcion) => (
            <button
              key={opcion}
              type="button"
              onClick={() => setFiltro(opcion)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filtro === opcion
                  ? "bg-brand-main text-white"
                  : "border border-brand-dark/15 bg-surface text-brand-dark hover:bg-brand-dark/5"
              }`}
            >
              {opcion}
            </button>
          ))}
        </section>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {error ? (
            <article className="rounded-2xl border border-brand-main/25 bg-brand-main/5 p-4 text-sm text-brand-dark">
              {error}
            </article>
          ) : null}
          {!error && fotos.length === 0 ? (
            <article className="rounded-2xl border border-brand-dark/15 bg-surface p-4 text-sm text-brand-dark/75">
              Aun no hay imagenes publicadas en la galeria.
            </article>
          ) : null}
          {fotos.map((foto) => (
            <article
              key={foto.id}
              data-reveal
              className="card-lift relative overflow-hidden rounded-2xl border border-brand-dark/10 bg-surface shadow-[0_8px_20px_rgba(75,56,49,0.08)]"
            >
              {esAdmin ? (
                <>
                  <button
                    type="button"
                    onClick={() => abrirEdicion(foto)}
                    className="absolute top-3 right-14 z-10 rounded-full border border-brand-main/50 bg-white/90 p-2 text-brand-main transition hover:bg-brand-main hover:text-white"
                    aria-label={`Editar imagen ${foto.titulo}`}
                    title="Editar imagen"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 20h4l10-10-4-4L4 16v4z" />
                      <path d="M12 6l4 4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => void eliminarFoto(foto)}
                    disabled={eliminandoId === foto.id}
                    className="absolute top-3 right-3 z-10 rounded-full border border-red-400/70 bg-white/90 p-2 text-red-700 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label={`Eliminar imagen ${foto.titulo}`}
                    title="Eliminar imagen"
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
              <button
                type="button"
                onClick={() => setFotoActiva(foto)}
                className="block w-full cursor-zoom-in"
                aria-label={`Ampliar imagen: ${foto.titulo}`}
              >
                <Image
                  src={foto.src}
                  alt={foto.titulo}
                  width={1000}
                  height={700}
                  className="h-52 w-full object-cover"
                />
              </button>
              <div className="space-y-2 p-4">
                <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">{foto.categoria}</p>
                <h2 className="text-lg font-extrabold text-brand-dark">{foto.titulo}</h2>
                <p className="text-sm text-brand-dark/80">{foto.descripcion}</p>
              </div>
            </article>
          ))}
        </section>
      </div>

      {fotoActiva ? (
        <div
          className="lightbox-fade fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-[2px]"
          onClick={() => setFotoActiva(null)}
          role="dialog"
          aria-modal="true"
          aria-label={fotoActiva.titulo}
        >
          <div
            className="lightbox-zoom relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-[0_24px_50px_rgba(0,0,0,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setFotoActiva(null)}
              className="absolute top-3 right-3 z-10 rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white transition hover:bg-black/75"
            >
              Cerrar
            </button>
            <div className="relative h-[62vh] min-h-[280px] w-full">
              <Image src={fotoActiva.src} alt={fotoActiva.titulo} fill className="object-contain" />
            </div>
          </div>
        </div>
      ) : null}

      {editandoFoto ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setEditandoFoto(null)}>
          <div
            className="w-full max-w-xl rounded-2xl border border-brand-dark/15 bg-surface p-5 shadow-[0_20px_44px_rgba(0,0,0,0.32)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-xl font-black text-brand-dark">Editar imagen</h3>
            <div className="mt-4 grid gap-3">
              <input value={editandoFoto.titulo} onChange={(e) => setEditandoFoto((p) => (p ? { ...p, titulo: e.target.value } : p))} className="rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm" placeholder="Titulo" />
              <select value={editandoFoto.categoria} onChange={(e) => setEditandoFoto((p) => (p ? { ...p, categoria: e.target.value as FotoGaleria["categoria"] } : p))} className="rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm">
                {categoriasGaleria.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
              <input type="date" value={editandoFoto.fecha} onChange={(e) => setEditandoFoto((p) => (p ? { ...p, fecha: e.target.value } : p))} className="rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm" />
              <input
                value={editandoFoto.src}
                onChange={(e) =>
                  setEditandoFoto((p) =>
                    p
                      ? {
                          ...p,
                          src: e.target.value,
                          publicId: extractCloudinaryPublicId(e.target.value) ?? p.publicId,
                        }
                      : p,
                  )
                }
                className="rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
                placeholder="URL de imagen"
              />
              <textarea value={editandoFoto.descripcion} onChange={(e) => setEditandoFoto((p) => (p ? { ...p, descripcion: e.target.value } : p))} className="min-h-24 rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm" placeholder="Descripcion" />
              <label className="flex items-center gap-2 text-sm text-brand-dark">
                <input type="checkbox" checked={editandoFoto.visible} onChange={(e) => setEditandoFoto((p) => (p ? { ...p, visible: e.target.checked } : p))} />
                Visible en galeria
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => void guardarEdicion()} disabled={guardandoEdicion} className="rounded-full bg-brand-main px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-soft disabled:opacity-60">
                {guardandoEdicion ? "Guardando..." : "Guardar cambios"}
              </button>
              <button type="button" onClick={() => setEditandoFoto(null)} className="rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function toDateInput(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0] ?? "";
}
