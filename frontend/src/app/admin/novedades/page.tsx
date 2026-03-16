"use client";

import { useMemo, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

type FormData = {
  titulo: string;
  slug: string;
  categoria: string;
  autor: string;
  resumen: string;
  contenido: string;
  imagenPrincipal: string;
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
  fecha: "",
  estado: "publicado",
};

export default function AdminNovedadesPage() {
  const [form, setForm] = useState<FormData>(inicial);
  const [tocado, setTocado] = useState(false);

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
      fecha: form.fecha,
    };
  }, [form]);

  const actualizar = (campo: keyof FormData, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
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
            Este formulario valida datos editoriales para evitar errores al cargar en Firebase Console.
          </p>

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
                onChange={(e) => actualizar("titulo", e.target.value)}
                className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
              />
            </Campo>

            <Campo label="Slug (ej: acto-25-de-mayo-2026)" error={tocado ? errores.slug : ""}>
              <input
                value={form.slug}
                onChange={(e) => actualizar("slug", e.target.value)}
                className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
              />
            </Campo>

            <div className="grid gap-3 sm:grid-cols-2">
              <Campo label="Categoria">
                <input
                  value={form.categoria}
                  onChange={(e) => actualizar("categoria", e.target.value)}
                  className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
                />
              </Campo>
              <Campo label="Autor">
                <input
                  value={form.autor}
                  onChange={(e) => actualizar("autor", e.target.value)}
                  className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
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
              <input
                value={form.imagenPrincipal}
                onChange={(e) => actualizar("imagenPrincipal", e.target.value)}
                className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
              />
            </Campo>

            <Campo label="Resumen" error={tocado ? errores.resumen : ""}>
              <textarea
                value={form.resumen}
                onChange={(e) => actualizar("resumen", e.target.value)}
                className="min-h-20 w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
              />
            </Campo>

            <Campo label="Contenido" error={tocado ? errores.contenido : ""}>
              <textarea
                value={form.contenido}
                onChange={(e) => actualizar("contenido", e.target.value)}
                className="min-h-36 w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
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

            <button
              type="submit"
              className="rounded-full bg-brand-main px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-soft"
            >
              Validar novedad
            </button>
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
