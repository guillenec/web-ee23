"use client";

import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { postAdminAction } from "@/lib/admin-api";
import { auth } from "@/lib/firebase";

type NovedadAdmin = {
  id: string;
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

type DeleteNovedadResponse = {
  youtubeDeleteWarning?: string;
};

const PAGE_SIZE = 6;

export default function AdminNovedadesVerPage() {
  const [novedades, setNovedades] = useState<NovedadAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [actualizandoId, setActualizandoId] = useState<string | null>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);
  const [pendientesPage, setPendientesPage] = useState(1);
  const [publicadasPage, setPublicadasPage] = useState(1);

  const pendientes = useMemo(() => novedades.filter((item) => item.estado === "pendiente"), [novedades]);
  const publicadas = useMemo(() => novedades.filter((item) => item.estado === "publicado"), [novedades]);
  const pendientesTotalPages = useMemo(() => Math.max(1, Math.ceil(pendientes.length / PAGE_SIZE)), [pendientes.length]);
  const publicadasTotalPages = useMemo(() => Math.max(1, Math.ceil(publicadas.length / PAGE_SIZE)), [publicadas.length]);
  const pendientesItems = useMemo(() => {
    const start = (pendientesPage - 1) * PAGE_SIZE;
    return pendientes.slice(start, start + PAGE_SIZE);
  }, [pendientes, pendientesPage]);
  const publicadasItems = useMemo(() => {
    const start = (publicadasPage - 1) * PAGE_SIZE;
    return publicadas.slice(start, start + PAGE_SIZE);
  }, [publicadas, publicadasPage]);

  const cargarNovedades = async () => {
    try {
      setCargando(true);
      setErrorCarga(null);

      const result = await getAdminJson<{ items?: NovedadAdmin[] }>("/api/admin/list-novedades");
      const next = Array.isArray(result.items) ? result.items : [];
      setNovedades(next);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo cargar el listado";
      setErrorCarga(message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const off = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setCargando(false);
        return;
      }
      void cargarNovedades();
    });

    return () => off();
  }, []);

  useEffect(() => {
    if (pendientesPage > pendientesTotalPages) {
      setPendientesPage(pendientesTotalPages);
    }
  }, [pendientesPage, pendientesTotalPages]);

  useEffect(() => {
    if (publicadasPage > publicadasTotalPages) {
      setPublicadasPage(publicadasTotalPages);
    }
  }, [publicadasPage, publicadasTotalPages]);

  const cambiarEstado = async (id: string, estado: "pendiente" | "publicado") => {
    try {
      setActualizandoId(id);
      await postAdminAction("/api/admin/update-novedad-estado", { id, estado });
      toast.success(estado === "publicado" ? "Novedad publicada" : "Novedad pasada a pendiente");
      await cargarNovedades();
    } catch {
      toast.error("No se pudo actualizar el estado");
    } finally {
      setActualizandoId(null);
    }
  };

  const eliminarNovedad = async (id: string) => {
    const confirmar = window.confirm("Se eliminara esta novedad. Esta accion no se puede deshacer.");
    if (!confirmar) return;

    try {
      setEliminandoId(id);
      const result = await postAdminAction<DeleteNovedadResponse>("/api/admin/delete-novedad", { id });
      toast.success("Novedad eliminada");
      if (result.youtubeDeleteWarning) {
        toast.warning("La novedad se elimino, pero el video no pudo borrarse automaticamente en YouTube.");
      }
      await cargarNovedades();
    } catch {
      toast.error("No se pudo eliminar la novedad");
    } finally {
      setEliminandoId(null);
    }
  };

  return (
    <main className="admin-shell page-enter px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="admin-hero rounded-3xl p-6 sm:p-8">
          <p className="admin-kicker">Modulo de novedades</p>
          <h1 className="mt-2 text-3xl leading-tight font-black text-brand-dark sm:text-5xl">Ver y gestionar estados</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-brand-dark/80 sm:text-base">
            Aqui ves todas las novedades del proyecto. Puedes pasar pendientes a publicadas o devolver publicadas a pendiente.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void cargarNovedades()}
              className="admin-secondary-btn px-4 py-1.5 text-xs"
            >
              Reintentar carga
            </button>
            <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
              Pendientes: {pendientes.length}
            </span>
            <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              Publicadas: {publicadas.length}
            </span>
          </div>

          {cargando ? <p className="mt-4 text-sm text-brand-dark/75">Cargando listado...</p> : null}
          {errorCarga ? <p className="mt-4 text-sm text-brand-main">{errorCarga}</p> : null}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="admin-panel rounded-3xl border-amber-200/80 bg-amber-50/60 p-5">
            <h2 className="text-xl font-black text-amber-900">Pendientes</h2>
            <p className="mt-1 text-sm text-amber-900/80">Publicaciones en espera de revision final.</p>

            <div className="mt-4 space-y-3">
              {!cargando && !pendientes.length ? (
                <p className="rounded-xl border border-amber-200 bg-white/70 p-3 text-sm text-amber-900/80">
                  No hay novedades pendientes.
                </p>
              ) : null}

              {pendientesItems.map((novedad) => (
                <NovedadCard
                  key={novedad.id}
                  novedad={novedad}
                  onDelete={eliminarNovedad}
                  onPrimaryAction={() => void cambiarEstado(novedad.id, "publicado")}
                  primaryLabel={actualizandoId === novedad.id ? "Publicando..." : "Pasar a publicada"}
                  deleting={eliminandoId === novedad.id}
                  disabled={actualizandoId === novedad.id || eliminandoId === novedad.id}
                />
              ))}
            </div>

            {pendientes.length > PAGE_SIZE ? (
              <PaginationControls
                page={pendientesPage}
                totalPages={pendientesTotalPages}
                onPrev={() => setPendientesPage((prev) => Math.max(1, prev - 1))}
                onNext={() => setPendientesPage((prev) => Math.min(pendientesTotalPages, prev + 1))}
              />
            ) : null}
          </article>

          <article className="admin-panel rounded-3xl border-emerald-200/80 bg-emerald-50/60 p-5">
            <h2 className="text-xl font-black text-emerald-900">Publicadas</h2>
            <p className="mt-1 text-sm text-emerald-900/80">Contenido visible para visitantes de la web.</p>

            <div className="mt-4 space-y-3">
              {!cargando && !publicadas.length ? (
                <p className="rounded-xl border border-emerald-200 bg-white/70 p-3 text-sm text-emerald-900/80">
                  No hay novedades publicadas.
                </p>
              ) : null}

              {publicadasItems.map((novedad) => (
                <NovedadCard
                  key={novedad.id}
                  novedad={novedad}
                  onDelete={eliminarNovedad}
                  onPrimaryAction={() => void cambiarEstado(novedad.id, "pendiente")}
                  primaryLabel={actualizandoId === novedad.id ? "Moviendo..." : "Pasar a pendiente"}
                  deleting={eliminandoId === novedad.id}
                  disabled={actualizandoId === novedad.id || eliminandoId === novedad.id}
                />
              ))}
            </div>

            {publicadas.length > PAGE_SIZE ? (
              <PaginationControls
                page={publicadasPage}
                totalPages={publicadasTotalPages}
                onPrev={() => setPublicadasPage((prev) => Math.max(1, prev - 1))}
                onNext={() => setPublicadasPage((prev) => Math.min(publicadasTotalPages, prev + 1))}
              />
            ) : null}
          </article>
        </section>
      </div>
    </main>
  );
}

function NovedadCard({
  novedad,
  onPrimaryAction,
  primaryLabel,
  onDelete,
  deleting,
  disabled,
}: {
  novedad: NovedadAdmin;
  onPrimaryAction: () => void;
  primaryLabel: string;
  onDelete: (id: string) => Promise<void>;
  deleting: boolean;
  disabled: boolean;
}) {
  return (
    <article className="admin-card rounded-xl p-3">
      <p className="text-sm font-bold text-brand-dark">{novedad.titulo}</p>
      <p className="mt-1 text-xs text-brand-dark/70">Slug: {novedad.slug}</p>
      <p className="mt-1 text-xs text-brand-dark/75 line-clamp-2">{novedad.resumen || "Sin resumen"}</p>
      {novedad.videoUrl ? <p className="mt-1 text-xs text-brand-dark/70">Incluye video de YouTube</p> : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onPrimaryAction}
          disabled={disabled}
          className="admin-secondary-btn px-3 py-1 text-xs disabled:opacity-60"
        >
          {primaryLabel}
        </button>
        <button
          type="button"
          onClick={() => void onDelete(novedad.id)}
          disabled={disabled}
          className="admin-danger-btn px-3 py-1 text-xs disabled:opacity-60"
        >
          {deleting ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </article>
  );
}

function PaginationControls({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-5 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={page <= 1}
        className="admin-secondary-btn px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-35"
      >
        Anterior
      </button>
      <p className="text-xs font-bold text-brand-dark/75">
        Pagina {page} de {totalPages}
      </p>
      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages}
        className="admin-secondary-btn px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-35"
      >
        Siguiente
      </button>
    </div>
  );
}

async function getAdminJson<T>(path: string): Promise<T> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Debes iniciar sesion como admin.");
  }

  const idToken = await user.getIdToken();
  const response = await fetch(path, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    cache: "no-store",
  });

  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "No se pudo completar la accion");
  }

  return data;
}
