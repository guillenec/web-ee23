"use client";

import { Timestamp, collection, deleteDoc, doc, getDocs, limit, query, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { postAdminAction } from "@/lib/admin-api";
import { uploadImageWithMeta } from "@/lib/cloudinary";
import { extractCloudinaryPublicId } from "@/lib/cloudinary-utils";
import { auth, db } from "@/lib/firebase";

type FormData = {
  titulo: string;
  slug: string;
  categoria: string;
  autor: string;
  resumen: string;
  contenido: string;
  imagenPrincipal: string;
  imagenPrincipalPublicId: string;
  galeria: string[];
  galeriaPublicIds: string[];
  fecha: string;
  estado: "publicado" | "pendiente";
};

type NovedadAdmin = {
  id: string;
  titulo: string;
  slug: string;
  categoria: string;
  autor: string;
  resumen: string;
  contenido: string;
  imagenPrincipal: string;
  imagenPrincipalPublicId: string;
  galeria: string[];
  galeriaPublicIds: string[];
  fecha: string;
  estado: "publicado" | "pendiente";
};

type TonoIa = "formal" | "moderado" | "energetico";
type ModoAplicacionIa = "mantener" | "sobrescribir";

const inicial: FormData = {
  titulo: "",
  slug: "",
  categoria: "Institucional",
  autor: "EE N 23",
  resumen: "",
  contenido: "",
  imagenPrincipal: "",
  imagenPrincipalPublicId: "",
  galeria: [],
  galeriaPublicIds: [],
  fecha: "",
  estado: "pendiente",
};

const BORRADOR_STORAGE_KEY = "ee23_admin_novedad_borrador_v2";

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
  const [tonoIa, setTonoIa] = useState<TonoIa>("moderado");
  const [modoAplicacionIa, setModoAplicacionIa] = useState<ModoAplicacionIa>("mantener");
  const [mejorandoTituloIa, setMejorandoTituloIa] = useState(false);
  const [mejorandoContenidoIa, setMejorandoContenidoIa] = useState(false);
  const [sugerenciaTituloIa, setSugerenciaTituloIa] = useState<string | null>(null);
  const [sugerenciaContenidoIa, setSugerenciaContenidoIa] = useState<string | null>(null);
  const [sugerenciaResumenIa, setSugerenciaResumenIa] = useState<string | null>(null);
  const [novedades, setNovedades] = useState<NovedadAdmin[]>([]);
  const [cargandoNovedades, setCargandoNovedades] = useState(true);
  const [editandoId, setEditandoId] = useState<string | null>(null);

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

  const cargarNovedades = async () => {
    try {
      setCargandoNovedades(true);
      const ref = collection(db, "novedades");
      const snapshot = await getDocs(query(ref, limit(200)));

      const next = snapshot.docs
        .map((item) => {
          const data = item.data() as {
            titulo?: string;
            slug?: string;
            categoria?: string;
            autor?: string;
            resumen?: string;
            contenido?: string;
            imagenPrincipal?: string;
            imagenPrincipalPublicId?: string;
            galeria?: string[];
            galeriaPublicIds?: string[];
            fecha?: Timestamp | string;
            estado?: "publicado" | "pendiente" | "borrador";
          };

          return {
            id: item.id,
            titulo: data.titulo ?? "Sin titulo",
            slug: data.slug ?? item.id,
            categoria: data.categoria ?? "General",
            autor: data.autor ?? "Equipo institucional",
            resumen: data.resumen ?? "",
            contenido: data.contenido ?? "",
            imagenPrincipal: data.imagenPrincipal ?? "",
            imagenPrincipalPublicId:
              data.imagenPrincipalPublicId ?? extractCloudinaryPublicId(data.imagenPrincipal ?? "") ?? "",
            galeria: data.galeria ?? [],
            galeriaPublicIds:
              data.galeriaPublicIds ?? (data.galeria ?? []).map((item) => extractCloudinaryPublicId(item) ?? ""),
            fecha: toIsoDate(data.fecha),
            estado: data.estado === "publicado" ? "publicado" : "pendiente",
          } satisfies NovedadAdmin;
        })
        .sort((a, b) => {
          if (!a.fecha && !b.fecha) return 0;
          if (!a.fecha) return 1;
          if (!b.fecha) return -1;
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        });

      setNovedades(next);
    } catch {
      setGuardadoError("No se pudo cargar el listado de novedades desde Firebase.");
    } finally {
      setCargandoNovedades(false);
    }
  };

  useEffect(() => {
    void cargarNovedades();
  }, []);

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
    setEditandoId(null);
    setTocado(false);
    setSlugEditadoManual(false);
    setGuardadoOk(null);
    setGuardadoError(null);
    setGaleriaInput("");
    setSugerenciaTituloIa(null);
    setSugerenciaContenidoIa(null);
    setSugerenciaResumenIa(null);
    window.localStorage.removeItem(BORRADOR_STORAGE_KEY);
  };

  const editarNovedad = (novedad: NovedadAdmin) => {
    setEditandoId(novedad.id);
    setForm({
      titulo: novedad.titulo,
      slug: novedad.slug,
      categoria: novedad.categoria,
      autor: novedad.autor,
      resumen: novedad.resumen,
      contenido: novedad.contenido,
      imagenPrincipal: novedad.imagenPrincipal,
      imagenPrincipalPublicId: novedad.imagenPrincipalPublicId,
      galeria: novedad.galeria,
      galeriaPublicIds: novedad.galeriaPublicIds,
      fecha: toDateInput(novedad.fecha),
      estado: novedad.estado,
    });
    setSlugEditadoManual(true);
    setGuardadoError(null);
    setGuardadoOk(`Editando novedad: ${novedad.titulo}`);
    setSugerenciaTituloIa(null);
    setSugerenciaContenidoIa(null);
    setSugerenciaResumenIa(null);
    toast.info("Modo edicion activado");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarNovedad = async (id: string) => {
    const confirmar = window.confirm("Se eliminara esta novedad. Esta accion no se puede deshacer.");
    if (!confirmar) return;

    try {
      setGuardadoError(null);
      setGuardadoOk(null);
      await postAdminAction("/api/admin/delete-novedad", { id });
      if (editandoId === id) {
        limpiarFormulario();
      }
      setGuardadoOk("Novedad eliminada correctamente.");
      toast.success("Novedad eliminada con exito");
      await cargarNovedades();
    } catch {
      setGuardadoError("No se pudo eliminar la novedad.");
      toast.error("No se pudo eliminar la novedad");
    }
  };

  const agregarImagenGaleria = () => {
    const value = galeriaInput.trim();
    if (!value) return;

    const maybePublicId = extractCloudinaryPublicId(value) ?? "";

    if (form.galeria.includes(value)) {
      setGaleriaInput("");
      return;
    }

    setForm((prev) => ({
      ...prev,
      galeria: [...prev.galeria, value],
      galeriaPublicIds: [...prev.galeriaPublicIds, maybePublicId],
    }));
    setGaleriaInput("");
  };

  const quitarImagenGaleria = (url: string) => {
    setForm((prev) => ({
      ...prev,
      galeria: prev.galeria.filter((item) => item !== url),
      galeriaPublicIds: prev.galeria.filter((item) => item !== url).map((item) => extractCloudinaryPublicId(item) ?? ""),
    }));
  };

  const onSubirImagenPrincipal = async (file: File | null) => {
    if (!file) return;

    try {
      setSubiendoPrincipal(true);
      setGuardadoError(null);
      const upload = await uploadImageWithMeta(file);
      setForm((prev) => ({ ...prev, imagenPrincipal: upload.url, imagenPrincipalPublicId: upload.publicId }));
      toast.success("Imagen principal subida");
    } catch {
      setGuardadoError("No se pudo subir imagen principal. Revisa variables NEXT_PUBLIC_CLOUDINARY_*.");
      toast.error("Error al subir imagen principal");
    } finally {
      setSubiendoPrincipal(false);
    }
  };

  const onSubirImagenesGaleria = async (files: FileList | null) => {
    if (!files?.length) return;

    try {
      setSubiendoGaleria(true);
      setGuardadoError(null);
      const uploads = await Promise.all(Array.from(files).map((file) => uploadImageWithMeta(file)));
      setForm((prev) => ({
        ...prev,
        galeria: Array.from(new Set([...prev.galeria, ...uploads.map((item) => item.url)])),
        galeriaPublicIds: Array.from(new Set([...prev.galeriaPublicIds, ...uploads.map((item) => item.publicId)])),
      }));
      toast.success("Imagenes de galeria subidas");
    } catch {
      setGuardadoError("No se pudieron subir imagenes de galeria. Revisa variables NEXT_PUBLIC_CLOUDINARY_*.");
      toast.error("Error al subir imagenes de galeria");
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
      toast.warning("Faltan campos obligatorios");
      return;
    }

    try {
      setGuardando(true);
      const slugFinal = form.slug.trim();

      await setDoc(doc(db, "novedades", slugFinal), {
        titulo: form.titulo.trim(),
        slug: slugFinal,
        categoria: form.categoria.trim(),
        autor: form.autor.trim(),
        resumen: form.resumen.trim(),
        contenido: form.contenido.trim(),
        imagenPrincipal: form.imagenPrincipal.trim(),
        imagenPrincipalPublicId:
          form.imagenPrincipalPublicId || extractCloudinaryPublicId(form.imagenPrincipal) || "",
        galeria: form.galeria.filter(Boolean),
        galeriaPublicIds: form.galeria.map((item) => extractCloudinaryPublicId(item) ?? ""),
        fecha: Timestamp.fromDate(new Date(`${form.fecha}T12:00:00`)),
        estado: form.estado,
        actualizadoEn: Timestamp.now(),
      });

      if (editandoId && editandoId !== slugFinal) {
        await deleteDoc(doc(db, "novedades", editandoId));
      }

      setGuardadoOk(editandoId ? "Novedad actualizada correctamente." : `Novedad guardada con ID: ${slugFinal}`);
      toast.success(editandoId ? "Novedad actualizada" : "Novedad creada con exito");
      window.localStorage.removeItem(BORRADOR_STORAGE_KEY);
      setEditandoId(slugFinal);
      await cargarNovedades();
    } catch {
      setGuardadoError("No se pudo guardar en Firebase. Revisa reglas y sesion de admin.");
      toast.error("No se pudo guardar la novedad");
    } finally {
      setGuardando(false);
    }
  };

  const solicitarIa = async (payload: {
    action: "improve_title" | "improve_content";
    tone: TonoIa;
    titulo?: string;
    categoria?: string;
    resumen?: string;
    contenido?: string;
  }): Promise<{ titulo?: string; contenido?: string; resumen?: string }> => {
    if (!auth.currentUser) {
      toast.error("Debes iniciar sesion como admin para usar IA");
      throw new Error("Sin sesion admin");
    }

    const token = await auth.currentUser.getIdToken();
    const response = await fetch("/api/admin/ai-novedad-suggest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as {
      error?: string;
      suggestion?: {
        titulo?: string;
        resumen?: string;
        contenido?: string;
      };
    };

    if (!response.ok || !result.suggestion) {
      throw new Error(result.error || "No se pudo generar sugerencia");
    }

    return result.suggestion;
  };

  const mejorarTituloConIa = async () => {
    const tituloBase = form.titulo.trim();
    if (!tituloBase) {
      toast.warning("Escribe un titulo antes de mejorarlo con IA");
      return;
    }

    try {
      setMejorandoTituloIa(true);
      setGuardadoError(null);

      const suggestion = await solicitarIa({
        action: "improve_title",
        tone: tonoIa,
        titulo: tituloBase,
      });

      const titulo = (suggestion.titulo ?? tituloBase).trim();
      if (modoAplicacionIa === "sobrescribir") {
        setForm((prev) => ({
          ...prev,
          titulo,
          slug: slugEditadoManual ? prev.slug : slugDesdeTexto(titulo),
        }));
        setSugerenciaTituloIa(null);
        toast.success("Titulo mejorado con IA");
      } else {
        setSugerenciaTituloIa(titulo);
        toast.success("Sugerencia de titulo lista para revisar");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo mejorar el titulo";
      setGuardadoError(message);
      toast.error("No se pudo mejorar el titulo con IA");
    } finally {
      setMejorandoTituloIa(false);
    }
  };

  const mejorarContenidoConIa = async () => {
    const contenidoBase = form.contenido.trim();
    if (!contenidoBase) {
      toast.warning("Escribe contenido antes de mejorarlo con IA");
      return;
    }

    try {
      setMejorandoContenidoIa(true);
      setGuardadoError(null);

      const suggestion = await solicitarIa({
        action: "improve_content",
        tone: tonoIa,
        titulo: form.titulo,
        categoria: form.categoria,
        contenido: contenidoBase,
        resumen: form.resumen,
      });

      const contenido = (suggestion.contenido ?? form.contenido).trim();
      const resumen = (suggestion.resumen ?? form.resumen).trim();

      if (modoAplicacionIa === "sobrescribir") {
        setForm((prev) => ({
          ...prev,
          contenido,
          resumen,
        }));
        setSugerenciaContenidoIa(null);
        setSugerenciaResumenIa(null);
        toast.success("Contenido mejorado y resumen actualizado con IA");
      } else {
        setSugerenciaContenidoIa(contenido);
        setSugerenciaResumenIa(resumen);
        toast.success("Sugerencia de contenido lista para revisar");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo mejorar el contenido";
      setGuardadoError(message);
      toast.error("No se pudo mejorar el contenido con IA");
    } finally {
      setMejorandoContenidoIa(false);
    }
  };

  return (
    <main className="page-enter bg-[radial-gradient(circle_at_0%_0%,#c5e4e7_0%,#f6f2ee_45%,#f6f2ee_100%)] px-5 py-10 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <section className="min-w-0 rounded-3xl border border-brand-dark/10 bg-surface p-6 shadow-[0_10px_24px_rgba(75,56,49,0.08)]">
          <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Modulo de novedades</p>
          <h1 className="mt-2 text-3xl font-black text-brand-dark">Crear y actualizar publicaciones</h1>
          <p className="mt-2 text-sm text-brand-dark/80">
            Puedes crear, editar y eliminar novedades sin usar la consola tecnica.
          </p>
          {editandoId ? (
            <p className="mt-2 text-xs font-semibold text-brand-main">Modo edicion activo: {editandoId}</p>
          ) : null}

          <div className="mt-4 rounded-xl border border-brand-main/20 bg-brand-main/5 p-4">
            <p className="text-xs font-bold tracking-[0.08em] text-brand-main uppercase">Asistente IA por campo</p>
            <p className="mt-1 text-sm text-brand-dark/75">
              Mejora titulo o contenido sin inventar datos. El resumen se actualiza automaticamente al mejorar el contenido.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-xs font-bold tracking-[0.06em] text-brand-dark/75 uppercase">Tono IA</span>
                <select
                  value={tonoIa}
                  onChange={(e) => setTonoIa((e.target.value as TonoIa) || "moderado")}
                  className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
                >
                  <option value="formal">Formal</option>
                  <option value="moderado">Moderado</option>
                  <option value="energetico">Energetico</option>
                </select>
              </label>

              <label className="block space-y-1">
                <span className="text-xs font-bold tracking-[0.06em] text-brand-dark/75 uppercase">Aplicacion IA</span>
                <select
                  value={modoAplicacionIa}
                  onChange={(e) => setModoAplicacionIa((e.target.value as ModoAplicacionIa) || "mantener")}
                  className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
                >
                  <option value="mantener">Mantener original y revisar sugerencia</option>
                  <option value="sobrescribir">Sobrescribir automaticamente</option>
                </select>
              </label>
            </div>
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setTocado(true);
            }}
          >
            <Campo
              label="Titulo"
              error={tocado ? errores.titulo : ""}
              actions={
                <button
                  type="button"
                  onClick={() => void mejorarTituloConIa()}
                  disabled={mejorandoTituloIa}
                  className="rounded-full border border-brand-main/35 bg-brand-main/8 px-3 py-1 text-[11px] font-bold text-brand-main transition hover:bg-brand-main hover:text-white disabled:opacity-65"
                >
                  {mejorandoTituloIa ? "Mejorando..." : "Mejorar con IA"}
                </button>
              }
            >
              <input
                value={form.titulo}
                onChange={(e) => {
                  actualizarTitulo(e.target.value);
                  setSugerenciaTituloIa(null);
                }}
                className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
                placeholder="Ej: Jornada institucional de inicio 2026"
              />

              {sugerenciaTituloIa && sugerenciaTituloIa !== form.titulo ? (
                <div className="mt-2 space-y-2 rounded-xl border border-brand-main/25 bg-brand-main/5 p-3">
                  <p className="text-xs font-semibold text-brand-dark/80">Sugerencia IA:</p>
                  <p className="text-sm font-semibold text-brand-dark">{sugerenciaTituloIa}</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const titulo = sugerenciaTituloIa;
                        setForm((prev) => ({
                          ...prev,
                          titulo,
                          slug: slugEditadoManual ? prev.slug : slugDesdeTexto(titulo),
                        }));
                        setSugerenciaTituloIa(null);
                      }}
                      className="rounded-full border border-brand-main/35 bg-brand-main px-3 py-1 text-[11px] font-bold text-white transition hover:bg-brand-soft"
                    >
                      Aplicar sugerencia
                    </button>
                    <button
                      type="button"
                      onClick={() => setSugerenciaTituloIa(null)}
                      className="rounded-full border border-brand-dark/20 px-3 py-1 text-[11px] font-bold text-brand-dark transition hover:bg-brand-dark hover:text-white"
                    >
                      Descartar
                    </button>
                  </div>
                </div>
              ) : null}
            </Campo>

            <Campo label="Slug" error={tocado ? errores.slug : ""}>
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
              <div className="space-y-2">
                <input
                  value={form.imagenPrincipal}
                  onChange={(e) => actualizar("imagenPrincipal", e.target.value)}
                  onBlur={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      imagenPrincipal: e.target.value,
                      imagenPrincipalPublicId:
                        extractCloudinaryPublicId(e.target.value) ?? prev.imagenPrincipalPublicId,
                    }))
                  }
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

            <Campo label="Galeria interna de la novedad">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <input
                    value={galeriaInput}
                    onChange={(e) => setGaleriaInput(e.target.value)}
                    className="min-w-0 flex-1 rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
                    placeholder="Pega URL y presiona Agregar"
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
              />
            </Campo>

            <Campo
              label="Contenido"
              error={tocado ? errores.contenido : ""}
              actions={
                <button
                  type="button"
                  onClick={() => void mejorarContenidoConIa()}
                  disabled={mejorandoContenidoIa}
                  className="rounded-full border border-brand-main/35 bg-brand-main/8 px-3 py-1 text-[11px] font-bold text-brand-main transition hover:bg-brand-main hover:text-white disabled:opacity-65"
                >
                  {mejorandoContenidoIa ? "Mejorando..." : "Mejorar con IA"}
                </button>
              }
            >
              <textarea
                value={form.contenido}
                onChange={(e) => {
                  actualizar("contenido", e.target.value);
                  setSugerenciaContenidoIa(null);
                  setSugerenciaResumenIa(null);
                }}
                className="min-h-36 w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
              />

              {sugerenciaContenidoIa && sugerenciaContenidoIa !== form.contenido ? (
                <div className="mt-2 space-y-2 rounded-xl border border-brand-main/25 bg-brand-main/5 p-3">
                  <p className="text-xs font-semibold text-brand-dark/80">Sugerencia IA para contenido:</p>
                  <p className="max-h-36 overflow-auto text-sm text-brand-dark whitespace-pre-line">{sugerenciaContenidoIa}</p>
                  {sugerenciaResumenIa ? (
                    <div className="rounded-lg border border-brand-dark/10 bg-white/80 p-2">
                      <p className="text-[11px] font-semibold text-brand-dark/70 uppercase">Resumen sugerido</p>
                      <p className="mt-1 text-xs text-brand-dark/85">{sugerenciaResumenIa}</p>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          contenido: sugerenciaContenidoIa,
                          resumen: sugerenciaResumenIa ?? prev.resumen,
                        }));
                        setSugerenciaContenidoIa(null);
                        setSugerenciaResumenIa(null);
                      }}
                      className="rounded-full border border-brand-main/35 bg-brand-main px-3 py-1 text-[11px] font-bold text-white transition hover:bg-brand-soft"
                    >
                      Aplicar sugerencia
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSugerenciaContenidoIa(null);
                        setSugerenciaResumenIa(null);
                      }}
                      className="rounded-full border border-brand-dark/20 px-3 py-1 text-[11px] font-bold text-brand-dark transition hover:bg-brand-dark hover:text-white"
                    >
                      Descartar
                    </button>
                  </div>
                </div>
              ) : null}
            </Campo>

            <Campo label="Estado">
              <select
                value={form.estado}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    estado: e.target.value === "publicado" ? "publicado" : "pendiente",
                  }))
                }
                className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
              >
                <option value="publicado">publicado</option>
                <option value="pendiente">pendiente</option>
              </select>
            </Campo>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="submit"
                className="rounded-full border border-brand-dark/20 px-5 py-2 text-sm font-bold text-brand-dark transition hover:bg-brand-dark hover:text-white"
              >
                Validar
              </button>
              <button
                type="button"
                onClick={guardarEnFirebase}
                disabled={guardando}
                className="rounded-full bg-brand-main px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-65"
              >
                {guardando ? "Guardando..." : editandoId ? "Actualizar en Firebase" : "Guardar en Firebase"}
              </button>
              <button
                type="button"
                onClick={limpiarFormulario}
                className="rounded-full border border-brand-dark/20 px-5 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
              >
                Nuevo
              </button>
            </div>
          </form>
        </section>

        <section className="min-w-0 space-y-4">
          <article className="rounded-3xl border border-brand-dark/10 bg-surface p-5 shadow-[0_10px_24px_rgba(75,56,49,0.08)]">
            <h2 className="text-xl font-black text-brand-dark">Estado de validacion</h2>
            <p className={`mt-2 text-sm ${valido ? "text-emerald-700" : "text-brand-main"}`}>
              {valido ? "Formulario listo para guardar." : "Completa los campos obligatorios."}
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

          <article className="rounded-3xl border border-brand-dark/10 bg-surface p-5 shadow-[0_10px_24px_rgba(75,56,49,0.08)]">
            <h2 className="text-xl font-black text-brand-dark">Novedades cargadas</h2>
            {cargandoNovedades ? <p className="mt-2 text-sm text-brand-dark/75">Cargando listado...</p> : null}
            {!cargandoNovedades && !novedades.length ? (
              <p className="mt-2 text-sm text-brand-dark/75">No hay novedades en Firebase.</p>
            ) : null}

            <div className="mt-4 space-y-3">
              {novedades.map((novedad) => (
                <article key={novedad.id} className="rounded-2xl border border-brand-dark/10 bg-white p-3">
                  <p className="text-sm font-bold text-brand-dark">{novedad.titulo}</p>
                  <p className="text-xs text-brand-dark/70">
                    {novedad.slug} - {novedad.estado}
                  </p>
                  <p className="mt-1 text-xs text-brand-dark/75">{novedad.resumen || "Sin resumen"}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => editarNovedad(novedad)}
                      className="rounded-full border border-brand-dark/20 px-3 py-1 text-xs font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => void eliminarNovedad(novedad.id)}
                      className="rounded-full border border-red-400/60 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-600 hover:text-white"
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="overflow-hidden rounded-3xl border border-brand-dark/10 bg-brand-dark p-5 text-white shadow-[0_10px_24px_rgba(75,56,49,0.18)]">
            <p className="text-xs font-bold tracking-[0.13em] text-brand-soft uppercase">JSON sugerido</p>
            <pre className="mt-3 max-h-[380px] overflow-auto rounded-xl bg-black/20 p-3 text-xs leading-relaxed whitespace-pre-wrap break-all">
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

function Campo({
  label,
  error,
  actions,
  children,
}: {
  label: string;
  error?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold tracking-[0.06em] text-brand-dark/75 uppercase">{label}</span>
        {actions ? <span>{actions}</span> : null}
      </span>
      {children}
      {error ? <span className="text-xs text-brand-main">{error}</span> : null}
    </label>
  );
}
