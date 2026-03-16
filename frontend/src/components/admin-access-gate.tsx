"use client";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { useEffect, useMemo, useState } from "react";

import { esEmailAdmin, getAdminEmails } from "@/lib/admin-auth";
import { auth } from "@/lib/firebase";

type Props = {
  children: React.ReactNode;
};

type Estado = "cargando" | "sin-sesion" | "sin-permiso" | "admin";

export function AdminAccessGate({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const off = onAuthStateChanged(auth, (current) => {
      setUser(current);
      setCargando(false);
    });

    return () => off();
  }, []);

  const estado = useMemo<Estado>(() => {
    if (cargando) return "cargando";
    if (!user) return "sin-sesion";
    if (!esEmailAdmin(user.email)) return "sin-permiso";
    return "admin";
  }, [cargando, user]);

  const loginGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch {
      setError("No se pudo iniciar sesion. Revisa si el popup fue bloqueado.");
    }
  };

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
    } catch {
      setError("No se pudo cerrar sesion en este momento.");
    }
  };

  if (estado === "cargando") {
    return (
      <main className="min-h-[60vh] bg-[radial-gradient(circle_at_0%_0%,#c5e4e7_0%,#f6f2ee_45%,#f6f2ee_100%)] px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-brand-dark/10 bg-surface p-6 text-sm text-brand-dark/80">
          Verificando acceso de administrador...
        </div>
      </main>
    );
  }

  if (estado === "sin-sesion") {
    return (
      <AccesoBase
        titulo="Acceso administrador"
        descripcion="Inicia sesion con Google para acceder al panel de novedades."
        botonLabel="Ingresar con Google"
        onAction={loginGoogle}
        error={error}
      />
    );
  }

  if (estado === "sin-permiso") {
    return (
      <AccesoBase
        titulo="Acceso no autorizado"
        descripcion="Tu cuenta no esta habilitada como administradora para esta seccion."
        botonLabel="Cerrar sesion"
        onAction={cerrarSesion}
        error={error}
        extra={
          <p className="text-xs text-brand-dark/70">
            Cuenta actual: <span className="font-semibold">{user?.email ?? "sin email"}</span>
          </p>
        }
      />
    );
  }

  return (
    <div>
      <div className="border-b border-brand-dark/10 bg-brand-dark/95 px-5 py-2 text-xs text-white sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <p>
            Admin activo: <span className="font-semibold">{user?.email}</span>
          </p>
          <button
            type="button"
            onClick={cerrarSesion}
            className="rounded-full border border-white/30 px-3 py-1 font-semibold transition hover:bg-white hover:text-brand-dark"
          >
            Cerrar sesion
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

function AccesoBase({
  titulo,
  descripcion,
  botonLabel,
  onAction,
  error,
  extra,
}: {
  titulo: string;
  descripcion: string;
  botonLabel: string;
  onAction: () => void;
  error: string | null;
  extra?: React.ReactNode;
}) {
  const admins = getAdminEmails();

  return (
    <main className="min-h-[60vh] bg-[radial-gradient(circle_at_0%_0%,#c5e4e7_0%,#f6f2ee_45%,#f6f2ee_100%)] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-brand-dark/10 bg-surface p-6 shadow-[0_10px_24px_rgba(75,56,49,0.08)]">
        <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Panel administrador</p>
        <h1 className="mt-2 text-3xl font-black text-brand-dark">{titulo}</h1>
        <p className="mt-2 text-sm text-brand-dark/80">{descripcion}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onAction}
            className="rounded-full bg-brand-main px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-soft"
          >
            {botonLabel}
          </button>
          {extra}
        </div>

        {error ? <p className="mt-3 text-sm text-brand-main">{error}</p> : null}

        <div className="mt-5 rounded-xl border border-brand-dark/12 bg-white/70 p-4 text-xs text-brand-dark/75">
          <p className="font-semibold">Admins habilitados (env `NEXT_PUBLIC_ADMIN_EMAILS`):</p>
          {admins.length ? (
            <ul className="mt-2 space-y-1">
              {admins.map((email) => (
                <li key={email}>- {email}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2">No hay correos configurados aun.</p>
          )}
        </div>
      </div>
    </main>
  );
}
