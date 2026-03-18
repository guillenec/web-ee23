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
  imagenPrincipalPublicId: string;
  galeria: string[];
  galeriaPublicIds: string[];
  fecha: string;
  estado: "publicado" | "pendiente";
};

export default function AdminNovedadesVerPage() {
  const [novedades, setNovedades] = useState<NovedadAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [actualizandoId, setActualizandoId] = useState<string | null>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  const pendientes = useMemo(() => novedades.filter((item) => item.estado === "pendiente"), [novedades]);
  const publicadas = useMemo(() => novedades.filter((item) => item.estado === "publicado"), [novedades]);

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
      await postAdminAction("/api/admin/delete-novedad", { id });
      toast.success("Novedad eliminada");
      await cargarNovedades();
    } catch {
      toast.error("No se pudo eliminar la novedad");
    } finally {
      setEliminandoId(null);
    }
  };

  return (
    <main className="page-enter bg-app px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl border border-brand-dark/10 bg-surface p-6 shadow-[0_10px_24px_rgba(75,56,49,0.08)] sm:p-8">
          <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Modulo de novedades</p>
          <h1 className="mt-2 text-3xl font-black text-brand-dark sm:text-4xl">Ver y gestionar estados</h1>
          <p className="mt-3 max-w-3xl text-sm text-brand-dark/80 sm:text-base">
            Aqui ves todas las novedades del proyecto. Puedes pasar pendientes a publicadas o devolver publicadas a pendiente.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void cargarNovedades()}
              className="rounded-full border border-brand-dark/20 bg-white px-4 py-1.5 text-xs font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
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
          <article className="rounded-3xl border border-amber-200/80 bg-amber-50/60 p-5 shadow-[0_8px_20px_rgba(75,56,49,0.08)]">
            <h2 className="text-xl font-black text-amber-900">Pendientes</h2>
            <p className="mt-1 text-sm text-amber-900/80">Publicaciones en espera de revision final.</p>

            <div className="mt-4 space-y-3">
              {!cargando && !pendientes.length ? (
                <p className="rounded-xl border border-amber-200 bg-white/70 p-3 text-sm text-amber-900/80">
                  No hay novedades pendientes.
                </p>
              ) : null}

              {pendientes.map((novedad) => (
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
          </article>

          <article className="rounded-3xl border border-emerald-200/80 bg-emerald-50/60 p-5 shadow-[0_8px_20px_rgba(75,56,49,0.08)]">
            <h2 className="text-xl font-black text-emerald-900">Publicadas</h2>
            <p className="mt-1 text-sm text-emerald-900/80">Contenido visible para visitantes de la web.</p>

            <div className="mt-4 space-y-3">
              {!cargando && !publicadas.length ? (
                <p className="rounded-xl border border-emerald-200 bg-white/70 p-3 text-sm text-emerald-900/80">
                  No hay novedades publicadas.
                </p>
              ) : null}

              {publicadas.map((novedad) => (
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
    <article className="rounded-xl border border-brand-dark/10 bg-white p-3">
      <p className="text-sm font-bold text-brand-dark">{novedad.titulo}</p>
      <p className="mt-1 text-xs text-brand-dark/70">Slug: {novedad.slug}</p>
      <p className="mt-1 text-xs text-brand-dark/75 line-clamp-2">{novedad.resumen || "Sin resumen"}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onPrimaryAction}
          disabled={disabled}
          className="rounded-full border border-brand-main/35 bg-brand-main/8 px-3 py-1 text-xs font-semibold text-brand-main transition hover:bg-brand-main hover:text-white disabled:opacity-60"
        >
          {primaryLabel}
        </button>
        <button
          type="button"
          onClick={() => void onDelete(novedad.id)}
          disabled={disabled}
          className="rounded-full border border-red-400/60 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-600 hover:text-white disabled:opacity-60"
        >
          {deleting ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </article>
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
