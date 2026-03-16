"use client";

import { Timestamp, doc, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import { db } from "@/lib/firebase";

type FormData = {
  titulo: string;
  slug: string;
  categoria: string;
  autor: string;
  resumen: string;
  contenido: string;
  imagenPrincipal: string;
  galeria: string[];
  fecha: string;
  estado: "publicado" | "borrador";
};

const inicial: FormData = {
  titulo: "",
  slug: "",
  categoria: "Institucional",
  autor: "EE N 23",
  resumen: "",
  contenido: "",
  imagenPrincipal: "",
  galeria: [],
  fecha: "",
  estado: "publicado",
};

const BORRADOR_STORAGE_KEY = "ee23_admin_novedad_borrador_v1";
const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function AdminNovedadesPage() {
  const [form, setForm] = useState<FormData>(inicial);
  const [tocado, setTocado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [guardadoOk, setGuardadoOk] = useState<string | null>(null);
  const [guardadoError, setGuardadoError] = useState<string | null>(null);
  const [slugEditadoManual, setSlugEditadoManual] = useState(false);
  const [galeriaInput, setGaleriaInput] = useState("");
  const [subiendoPrincipal, setSubiendoPrincipal] = useState(false);
  const [subiendoGaleria, setSubiendoGaleria] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(BORRADOR_STORAGE_KEY);
    if (!raw) return;

    try {
      const data = JSON.parse(raw) as {
        form?: FormData;
        slugEditadoManual?: boolean;
      };

      if (data.form) {
        setForm({
          ...inicial,
          ...data.form,
          galeria: Array.isArray(data.form.galeria) ? data.form.galeria : [],
        });
      }

      if (typeof data.slugEditadoManual === "boolean") {
        setSlugEditadoManual(data.slugEditadoManual);
      }
    } catch {
      window.localStorage.removeItem(BORRADOR_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(BORRADOR_STORAGE_KEY, JSON.stringify({ form, slugEditadoManual }));
  }, [form, slugEditadoManual]);

  const errores = useMemo(() => {
    const next: Record<string, string> = {};

    if (!form.titulo.trim()) next.titulo = "El titulo es obligatorio.";
    if (!form.slug.trim()) next.slug = "El slug es obligatorio.";
    if (!/^[a-z0-9-]+$/.test(form.slug.trim())) {
      next.slug = "Usa solo minusculas, numeros y guiones.";
    }
    if (!form.resumen.trim()) next.resumen = "El resumen es obligatorio.";
    if (!form.contenido.trim()) next.contenido = "El contenido es obligatorio.";
    if (!form.fecha) next.fecha = "Completa la fecha de publicacion.";
    if (!form.imagenPrincipal.trim()) {
      next.imagenPrincipal = "La URL de imagen principal es obligatoria.";
    }

    return next;
  }, [form]);

  const valido = Object.keys(errores).length === 0;

  const payload = useMemo(() => {
    return {
      ...form,
      titulo: form.titulo.trim(),
      slug: form.slug.trim(),
      resumen: form.resumen.trim(),
      contenido: form.contenido.trim(),
      categoria: form.categoria.trim(),
      autor: form.autor.trim(),
      imagenPrincipal: form.imagenPrincipal.trim(),
      galeria: form.galeria.filter(Boolean),
      fecha: form.fecha,
    };
  }, [form]);

  const actualizar = (campo: keyof FormData, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const actualizarTitulo = (valor: string) => {
    setForm((prev) => {
      const next: FormData = { ...prev, titulo: valor };

      if (!slugEditadoManual) {
        next.slug = slugDesdeTexto(valor);
      }

      return next;
    });
  };

  const actualizarSlug = (valor: string) => {
    setSlugEditadoManual(true);
    actualizar("slug", slugDesdeTexto(valor));
  };

  const limpiarFormulario = () => {
    setForm(inicial);
    setTocado(false);
    setSlugEditadoManual(false);
    setGuardadoOk(null);
    setGuardadoError(null);
    setGaleriaInput("");
    window.localStorage.removeItem(BORRADOR_STORAGE_KEY);
  };

  const agregarImagenGaleria = () => {
    const value = galeriaInput.trim();
    if (!value) return;

    setForm((prev) => ({
      ...prev,
      galeria: Array.from(new Set([...prev.galeria, value])),
    }));
    setGaleriaInput("");
  };

  const quitarImagenGaleria = (url: string) => {
    setForm((prev) => ({
      ...prev,
      galeria: prev.galeria.filter((item) => item !== url),
    }));
  };

  const subirArchivoACloudinary = async (file: File): Promise<string> => {
    if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
      throw new Error("Faltan variables de Cloudinary");
    }

    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", cloudinaryUploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
      method: "POST",
      body,
    });

    if (!response.ok) {
      throw new Error("Cloudinary rechazo la carga");
    }

    const result = (await response.json()) as { secure_url?: string };
    if (!result.secure_url) {
      throw new Error("Cloudinary no devolvio URL de imagen");
    }

    return result.secure_url;
  };

  const onSubirImagenPrincipal = async (file: File | null) => {
    if (!file) return;

    try {
      setSubiendoPrincipal(true);
      setGuardadoError(null);
      const url = await subirArchivoACloudinary(file);
      setForm((prev) => ({ ...prev, imagenPrincipal: url }));
    } catch {
      setGuardadoError(
        "No se pudo subir imagen principal. Revisa Cloudinary y variables NEXT_PUBLIC_CLOUDINARY_*.",
      );
    } finally {
      setSubiendoPrincipal(false);
    }
  };

  const onSubirImagenesGaleria = async (files: FileList | null) => {
    if (!files?.length) return;

    try {
      setSubiendoGaleria(true);
      setGuardadoError(null);
      const urls = await Promise.all(Array.from(files).map((file) => subirArchivoACloudinary(file)));
      setForm((prev) => ({
        ...prev,
        galeria: Array.from(new Set([...prev.galeria, ...urls])),
      }));
    } catch {
      setGuardadoError(
        "No se pudieron subir imagenes de galeria. Revisa Cloudinary y variables NEXT_PUBLIC_CLOUDINARY_*.",
      );
    } finally {
      setSubiendoGaleria(false);
    }
  };

  const guardarEnFirebase = async () => {
    setTocado(true);
    setGuardadoOk(null);
    setGuardadoError(null);

    if (!valido) {
      setGuardadoError("Completa los campos obligatorios antes de guardar.");
      return;
    }

    try {
      setGuardando(true);

      const fechaDoc = Timestamp.fromDate(new Date(`${form.fecha}T12:00:00`));

      await setDoc(doc(db, "novedades", form.slug.trim()), {
        titulo: form.titulo.trim(),
        slug: form.slug.trim(),
        categoria: form.categoria.trim(),
        autor: form.autor.trim(),
        resumen: form.resumen.trim(),
        contenido: form.contenido.trim(),
        imagenPrincipal: form.imagenPrincipal.trim(),
        galeria: form.galeria.filter(Boolean),
        fecha: fechaDoc,
        estado: form.estado,
        actualizadoEn: Timestamp.now(),
      });

      setGuardadoOk(`Novedad guardada en Firebase con ID: ${form.slug.trim()}`);
      window.localStorage.removeItem(BORRADOR_STORAGE_KEY);
    } catch {
      setGuardadoError("No se pudo guardar en Firebase. Revisa reglas, sesion y variables de entorno.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="page-enter bg-[radial-gradient(circle_at_0%_0%,#c5e4e7_0%,#f6f2ee_45%,#f6f2ee_100%)] px-5 py-10 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section
          data-reveal
          className="min-w-0 rounded-3xl border border-brand-dark/10 bg-surface p-6 shadow-[0_10px_24px_rgba(75,56,49,0.08)]"
        >
          <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Panel minimo</p>
          <h1 className="mt-2 text-3xl font-black text-brand-dark">Carga de novedades</h1>
          <p className="mt-2 text-sm text-brand-dark/80">
            Formulario guiado para docentes y equipo institucional. Completa los campos y guarda directo
            en Firebase sin abrir la consola tecnica.
          </p>
          <p className="mt-2 text-xs text-brand-dark/70">
            Este borrador se guarda automaticamente en el navegador para no perder datos al recargar.
          </p>

          <div className="mt-4 rounded-xl border border-brand-dark/12 bg-white/70 p-4 text-sm text-brand-dark/80">
            <p className="font-semibold">Pasos sugeridos:</p>
            <ol className="mt-2 space-y-1">
              <li>1) Escribe titulo y revisa slug.</li>
              <li>2) Completa resumen, contenido e imagen principal.</li>
              <li>3) Agrega imagenes de galeria (URLs o subida local).</li>
              <li>4) Elige fecha y estado.</li>
              <li>5) Presiona Guardar en Firebase.</li>
            </ol>
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setTocado(true);
            }}
          >
            <Campo label="Titulo" error={tocado ? errores.titulo : ""}>
              <input
                value={form.titulo}
                onChange={(e) => actualizarTitulo(e.target.value)}
                className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
                placeholder="Ej: Jornada institucional de inicio 2026"
              />
            </Campo>

            <Campo label="Slug (ej: acto-25-de-mayo-2026)" error={tocado ? errores.slug : ""}>
              <input
                value={form.slug}
                onChange={(e) => actualizarSlug(e.target.value)}
                className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
                placeholder="se-genera-automatico-desde-el-titulo"
              />
            </Campo>

            <div className="grid gap-3 sm:grid-cols-2">
              <Campo label="Categoria">
                <input
                  value={form.categoria}
                  onChange={(e) => actualizar("categoria", e.target.value)}
                  className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
                  placeholder="Institucional"
                />
              </Campo>
              <Campo label="Autor">
                <input
                  value={form.autor}
                  onChange={(e) => actualizar("autor", e.target.value)}
                  className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
                  placeholder="Equipo directivo"
                />
              </Campo>
            </div>

            <Campo label="Fecha de publicacion" error={tocado ? errores.fecha : ""}>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => actualizar("fecha", e.target.value)}
                className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
              />
            </Campo>

            <Campo label="Imagen principal (URL)" error={tocado ? errores.imagenPrincipal : ""}>
              <div className="space-y-2">
                <input
                  value={form.imagenPrincipal}
                  onChange={(e) => actualizar("imagenPrincipal", e.target.value)}
                  className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
                  placeholder="https://res.cloudinary.com/..."
                />
                <label className="inline-block cursor-pointer rounded-full border border-brand-dark/20 px-3 py-1.5 text-xs font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white">
                  {subiendoPrincipal ? "Subiendo..." : "Subir desde equipo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={subiendoPrincipal}
                    onChange={(e) => {
                      void onSubirImagenPrincipal(e.target.files?.[0] ?? null);
                      e.currentTarget.value = "";
                    }}
                  />
                </label>
              </div>
            </Campo>

            <Campo label="Galeria de imagenes (opcional)">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <input
                    value={galeriaInput}
                    onChange={(e) => setGaleriaInput(e.target.value)}
                    className="min-w-0 flex-1 rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
                    placeholder="Pega URL de imagen y presiona Agregar"
                  />
                  <button
                    type="button"
                    onClick={agregarImagenGaleria}
                    className="rounded-full border border-brand-dark/20 px-4 py-2 text-xs font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
                  >
                    Agregar
                  </button>
                  <label className="cursor-pointer rounded-full border border-brand-main/35 bg-brand-main/8 px-4 py-2 text-xs font-semibold text-brand-main transition hover:bg-brand-main hover:text-white">
                    {subiendoGaleria ? "Subiendo..." : "Subir varias"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      disabled={subiendoGaleria}
                      onChange={(e) => {
                        void onSubirImagenesGaleria(e.target.files);
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>

                {form.galeria.length ? (
                  <ul className="space-y-2 rounded-xl border border-brand-dark/10 bg-white/70 p-3 text-xs text-brand-dark/75">
                    {form.galeria.map((url) => (
                      <li key={url} className="flex items-start justify-between gap-2">
                        <span className="break-all">{url}</span>
                        <button
                          type="button"
                          onClick={() => quitarImagenGaleria(url)}
                          className="rounded-full border border-brand-dark/20 px-2 py-0.5 font-semibold transition hover:bg-brand-dark hover:text-white"
                        >
                          Quitar
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-brand-dark/65">Sin imagenes de galeria cargadas aun.</p>
                )}
              </div>
            </Campo>

            <Campo label="Resumen" error={tocado ? errores.resumen : ""}>
              <textarea
                value={form.resumen}
                onChange={(e) => actualizar("resumen", e.target.value)}
                className="min-h-20 w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
                placeholder="Resumen breve para mostrar en cards de novedades"
              />
            </Campo>

            <Campo label="Contenido" error={tocado ? errores.contenido : ""}>
              <textarea
                value={form.contenido}
                onChange={(e) => actualizar("contenido", e.target.value)}
                className="min-h-36 w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
                placeholder="Texto completo de la novedad"
              />
            </Campo>

            <Campo label="Estado">
              <select
                value={form.estado}
                onChange={(e) => atualizarEstado(e.target.value, setForm)}
                className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
              >
                <option value="publicado">publicado</option>
                <option value="borrador">borrador</option>
              </select>
            </Campo>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="submit"
                className="rounded-full border border-brand-dark/20 px-5 py-2 text-sm font-bold text-brand-dark transition hover:bg-brand-dark hover:text-white"
              >
                Validar novedad
              </button>
              <button
                type="button"
                onClick={guardarEnFirebase}
                disabled={guardando}
                className="rounded-full bg-brand-main px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-65"
              >
                {guardando ? "Guardando..." : "Guardar en Firebase"}
              </button>
              <button
                type="button"
                onClick={limpiarFormulario}
                className="rounded-full border border-brand-dark/20 px-5 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
              >
                Limpiar
              </button>
            </div>
          </form>
        </section>

        <section data-reveal className="min-w-0 space-y-4">
          <article className="min-w-0 rounded-3xl border border-brand-dark/10 bg-surface p-5 shadow-[0_10px_24px_rgba(75,56,49,0.08)]">
            <h2 className="text-xl font-black text-brand-dark">Estado de validacion</h2>
            <p className={`mt-2 text-sm ${valido ? "text-emerald-700" : "text-brand-main"}`}>
              {valido
                ? "Formulario listo para cargar en Firebase."
                : "Completa los campos obligatorios para evitar fallas en el front."}
            </p>
            {!valido && tocado ? (
              <ul className="mt-3 space-y-1 text-sm text-brand-dark/80">
                {Object.values(errores).map((err) => (
                  <li key={err}>- {err}</li>
                ))}
              </ul>
            ) : null}
            {guardadoOk ? <p className="mt-3 text-sm text-emerald-700">{guardadoOk}</p> : null}
            {guardadoError ? <p className="mt-3 text-sm text-brand-main">{guardadoError}</p> : null}
          </article>

          <article className="min-w-0 overflow-hidden rounded-3xl border border-brand-dark/10 bg-brand-dark p-5 text-white shadow-[0_10px_24px_rgba(75,56,49,0.18)]">
            <p className="text-xs font-bold tracking-[0.13em] text-brand-soft uppercase">JSON sugerido</p>
            <pre className="mt-3 max-h-[520px] overflow-auto rounded-xl bg-black/20 p-3 text-xs leading-relaxed whitespace-pre-wrap break-all">
{JSON.stringify(payload, null, 2)}
            </pre>
          </article>
        </section>
      </div>
    </main>
  );
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

function Campo({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-bold tracking-[0.06em] text-brand-dark/75 uppercase">{label}</span>
      {children}
      {error ? <span className="text-xs text-brand-main">{error}</span> : null}
    </label>
  );
}

function atualizarEstado(value: string, setForm: Dispatch<SetStateAction<FormData>>) {
  setForm((prev) => ({ ...prev, estado: value === "borrador" ? "borrador" : "publicado" }));
}
