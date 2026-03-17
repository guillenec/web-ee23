"use client";

import Image from "next/image";
import { Timestamp, collection, deleteDoc, doc, getDocs, limit, query, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { categoriasGaleria, type CategoriaGaleria } from "@/lib/galeria";
import { db } from "@/lib/firebase";

type FotoAdmin = {
  id: string;
  titulo: string;
  categoria: CategoriaGaleria;
  descripcion: string;
  src: string;
  fecha: string;
  visible: boolean;
};

type FormData = {
  titulo: string;
  categoria: CategoriaGaleria;
  descripcion: string;
  src: string;
  fecha: string;
  visible: boolean;
};

const inicial: FormData = {
  titulo: "",
  categoria: "Territorio",
  descripcion: "",
  src: "",
  fecha: "",
  visible: true,
};

export default function AdminGaleriaPage() {
  const [form, setForm] = useState<FormData>(inicial);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [fotos, setFotos] = useState<FotoAdmin[]>([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const errores = useMemo(() => {
    const next: Record<string, string> = {};
    if (!form.titulo.trim()) next.titulo = "El titulo es obligatorio.";
    if (!form.src.trim()) next.src = "La imagen es obligatoria (URL o subida).";
    if (!form.fecha) next.fecha = "La fecha es obligatoria.";
    return next;
  }, [form]);

  const valido = Object.keys(errores).length === 0;

  const cargarGaleria = async () => {
    try {
      setCargandoLista(true);
      const ref = collection(db, "galeria");
      const snapshot = await getDocs(query(ref, limit(200)));

      const next = snapshot.docs
        .map((item) => {
          const data = item.data() as {
            titulo?: string;
            categoria?: string;
            descripcion?: string;
            src?: string;
            urlImagen?: string;
            usImagen?: string;
            fecha?: Timestamp | string;
            visible?: boolean;
          };

          return {
            id: item.id,
            titulo: data.titulo ?? "Sin titulo",
            categoria: toCategoria(data.categoria),
            descripcion: data.descripcion ?? "",
            src: data.src ?? data.urlImagen ?? data.usImagen ?? "",
            fecha: toIsoDate(data.fecha),
            visible: data.visible ?? true,
          } satisfies FotoAdmin;
        })
        .sort((a, b) => {
          if (!a.fecha && !b.fecha) return 0;
          if (!a.fecha) return 1;
          if (!b.fecha) return -1;
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        });

      setFotos(next);
    } catch {
      setError("No se pudo cargar la galeria desde Firebase.");
    } finally {
      setCargandoLista(false);
    }
  };

  useEffect(() => {
    void cargarGaleria();
  }, []);

  const limpiar = () => {
    setForm(inicial);
    setEditandoId(null);
  };

  const editar = (foto: FotoAdmin) => {
    setEditandoId(foto.id);
    setForm({
      titulo: foto.titulo,
      categoria: foto.categoria,
      descripcion: foto.descripcion,
      src: foto.src,
      fecha: foto.fecha ? toDateInput(foto.fecha) : "",
      visible: foto.visible,
    });
    setError(null);
    setOk(`Editando: ${foto.titulo}`);
    toast.info("Modo edicion activado");
  };

  const guardar = async () => {
    setError(null);
    setOk(null);
    if (!valido) {
      setError("Completa los campos obligatorios antes de guardar.");
      toast.warning("Faltan campos obligatorios");
      return;
    }

    try {
      setGuardando(true);
      const id = editandoId ?? `${slugDesdeTexto(form.titulo)}-${Date.now().toString(36)}`;

      await setDoc(doc(db, "galeria", id), {
        titulo: form.titulo.trim(),
        categoria: form.categoria,
        descripcion: form.descripcion.trim(),
        src: form.src.trim(),
        urlImagen: form.src.trim(),
        fecha: Timestamp.fromDate(new Date(`${form.fecha}T12:00:00`)),
        visible: form.visible,
        actualizadoEn: Timestamp.now(),
      });

      setOk(editandoId ? "Imagen actualizada correctamente." : "Imagen cargada correctamente.");
      toast.success(editandoId ? "Imagen actualizada" : "Imagen cargada con exito");
      limpiar();
      await cargarGaleria();
    } catch {
      setError("No se pudo guardar la imagen en Firebase.");
      toast.error("No se pudo guardar en Firebase");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id: string) => {
    const confirmado = window.confirm("Se eliminara esta imagen de la galeria. Esta accion no se puede deshacer.");
    if (!confirmado) return;

    try {
      setError(null);
      setOk(null);
      await deleteDoc(doc(db, "galeria", id));
      if (editandoId === id) {
        limpiar();
      }
      setOk("Imagen eliminada correctamente.");
      toast.success("Imagen eliminada con exito");
      await cargarGaleria();
    } catch {
      setError("No se pudo eliminar la imagen.");
      toast.error("No se pudo eliminar la imagen");
    }
  };

  const toggleVisible = async (foto: FotoAdmin) => {
    try {
      setError(null);
      setOk(null);
      await setDoc(
        doc(db, "galeria", foto.id),
        {
          titulo: foto.titulo,
          categoria: foto.categoria,
          descripcion: foto.descripcion,
          src: foto.src,
          urlImagen: foto.src,
          fecha: foto.fecha ? Timestamp.fromDate(new Date(foto.fecha)) : Timestamp.now(),
          visible: !foto.visible,
          actualizadoEn: Timestamp.now(),
        },
        { merge: true },
      );
      setOk(!foto.visible ? "Imagen publicada en galeria." : "Imagen ocultada de la galeria.");
      toast.success(!foto.visible ? "Imagen publicada" : "Imagen ocultada");
      await cargarGaleria();
    } catch {
      setError("No se pudo actualizar visibilidad.");
      toast.error("No se pudo actualizar visibilidad");
    }
  };

  const subirDesdeEquipo = async (file: File | null) => {
    if (!file) return;
    try {
      setSubiendo(true);
      setError(null);
      const url = await uploadImageToCloudinary(file);
      setForm((prev) => ({ ...prev, src: url }));
      toast.success("Imagen subida desde equipo");
    } catch {
      setError("No se pudo subir la imagen. Revisa variables NEXT_PUBLIC_CLOUDINARY_*.");
      toast.error("Error al subir imagen a Cloudinary");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <main className="page-enter bg-[radial-gradient(circle_at_0%_0%,#c5e4e7_0%,#f6f2ee_45%,#f6f2ee_100%)] px-5 py-10 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <section className="rounded-3xl border border-brand-dark/10 bg-surface p-6 shadow-[0_10px_24px_rgba(75,56,49,0.08)]">
          <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Modulo de galeria</p>
          <h1 className="mt-2 text-3xl font-black text-brand-dark">Cargar y editar imagenes</h1>

          <div className="mt-5 space-y-4">
            <label className="block space-y-1">
              <span className="text-xs font-bold tracking-[0.06em] text-brand-dark/75 uppercase">Titulo</span>
              <input
                value={form.titulo}
                onChange={(e) => setForm((prev) => ({ ...prev, titulo: e.target.value }))}
                className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
              />
              {errores.titulo ? <span className="text-xs text-brand-main">{errores.titulo}</span> : null}
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-xs font-bold tracking-[0.06em] text-brand-dark/75 uppercase">Categoria</span>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm((prev) => ({ ...prev, categoria: toCategoria(e.target.value) }))}
                  className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
                >
                  {categoriasGaleria.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1">
                <span className="text-xs font-bold tracking-[0.06em] text-brand-dark/75 uppercase">Fecha</span>
                <input
                  type="date"
                  value={form.fecha}
                  onChange={(e) => setForm((prev) => ({ ...prev, fecha: e.target.value }))}
                  className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
                />
                {errores.fecha ? <span className="text-xs text-brand-main">{errores.fecha}</span> : null}
              </label>
            </div>

            <label className="block space-y-1">
              <span className="text-xs font-bold tracking-[0.06em] text-brand-dark/75 uppercase">Descripcion</span>
              <textarea
                value={form.descripcion}
                onChange={(e) => setForm((prev) => ({ ...prev, descripcion: e.target.value }))}
                className="min-h-24 w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-bold tracking-[0.06em] text-brand-dark/75 uppercase">Imagen (URL)</span>
              <input
                value={form.src}
                onChange={(e) => setForm((prev) => ({ ...prev, src: e.target.value }))}
                className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
                placeholder="https://res.cloudinary.com/..."
              />
              {errores.src ? <span className="text-xs text-brand-main">{errores.src}</span> : null}
              <label className="inline-block cursor-pointer rounded-full border border-brand-dark/20 px-3 py-1.5 text-xs font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white">
                {subiendo ? "Subiendo..." : "Subir desde equipo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={subiendo}
                  onChange={(e) => {
                    void subirDesdeEquipo(e.target.files?.[0] ?? null);
                    e.currentTarget.value = "";
                  }}
                />
              </label>
            </label>

            <label className="flex items-center gap-2 text-sm text-brand-dark/85">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={(e) => setForm((prev) => ({ ...prev, visible: e.target.checked }))}
              />
              Visible en galeria publica
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={guardar}
                disabled={guardando}
                className="rounded-full bg-brand-main px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-soft disabled:opacity-65"
              >
                {guardando ? "Guardando..." : editandoId ? "Actualizar imagen" : "Guardar imagen"}
              </button>
              <button
                type="button"
                onClick={limpiar}
                className="rounded-full border border-brand-dark/20 px-5 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
              >
                Limpiar
              </button>
            </div>

            {ok ? <p className="text-sm text-emerald-700">{ok}</p> : null}
            {error ? <p className="text-sm text-brand-main">{error}</p> : null}
          </div>
        </section>

        <section className="rounded-3xl border border-brand-dark/10 bg-surface p-6 shadow-[0_10px_24px_rgba(75,56,49,0.08)]">
          <h2 className="text-2xl font-black text-brand-dark">Imagenes cargadas</h2>
          {cargandoLista ? <p className="mt-3 text-sm text-brand-dark/75">Cargando galeria...</p> : null}
          {!cargandoLista && !fotos.length ? (
            <p className="mt-3 text-sm text-brand-dark/75">No hay imagenes en Firebase.</p>
          ) : null}

          <div className="mt-4 space-y-3">
            {fotos.map((foto) => (
              <article key={foto.id} className="rounded-2xl border border-brand-dark/10 bg-white p-3">
                <div className="flex gap-3">
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-brand-dark/10">
                    {foto.src ? (
                      <Image src={foto.src} alt={foto.titulo} fill className="object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-xs text-brand-dark/60">Sin imagen</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-brand-dark">{foto.titulo}</p>
                    <p className="text-xs text-brand-dark/75">
                      {foto.categoria} - {foto.visible ? "Visible" : "Oculta"}
                    </p>
                    <p className="line-clamp-2 text-xs text-brand-dark/70">{foto.descripcion || "Sin descripcion"}</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => editar(foto)}
                    className="rounded-full border border-brand-dark/20 px-3 py-1 text-xs font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => void toggleVisible(foto)}
                    className="rounded-full border border-brand-main/35 px-3 py-1 text-xs font-semibold text-brand-main transition hover:bg-brand-main hover:text-white"
                  >
                    {foto.visible ? "Ocultar" : "Publicar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void eliminar(foto.id)}
                    className="rounded-full border border-red-400/60 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-600 hover:text-white"
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function toIsoDate(value: Timestamp | string | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.toDate().toISOString();
}

function toDateInput(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0] ?? "";
}

function toCategoria(value: string | undefined): CategoriaGaleria {
  const normalizado = (value ?? "").trim().toLowerCase();
  if (normalizado === "aulas") return "Aulas";
  if (normalizado === "territorio") return "Territorio";
  if (normalizado === "actos") return "Actos";
  return "Territorio";
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
