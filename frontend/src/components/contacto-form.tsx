"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";


type ContactoData = {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
};

const inicial: ContactoData = {
  nombre: "",
  email: "",
  asunto: "Consulta institucional",
  mensaje: "",
};

export function ContactoForm() {
  const [form, setForm] = useState<ContactoData>(inicial);
  const [tocado, setTocado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const errores = useMemo(() => {
    const next: Partial<Record<keyof ContactoData, string>> = {};

    if (!form.nombre.trim()) next.nombre = "Ingresa tu nombre.";
    if (!form.email.trim()) next.email = "Ingresa tu email.";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Email invalido.";
    }
    if (!form.asunto.trim()) next.asunto = "Ingresa un asunto.";
    if (!form.mensaje.trim()) next.mensaje = "Escribe tu consulta.";

    return next;
  }, [form]);

  const valido = Object.keys(errores).length === 0;

  const enviarFormulario = async () => {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      throw new Error(result.error ?? "No se pudo enviar tu mensaje.");
    }
  };

  return (
    <article data-reveal className="h-full rounded-2xl border border-brand-dark/10 bg-white/70 p-5">
      <p className="text-xs font-bold tracking-[0.11em] text-brand-main uppercase">Formulario directo</p>
      <h3 className="mt-1 text-xl font-black text-brand-dark">Escribinos tu consulta</h3>
      <p className="mt-2 text-sm text-brand-dark/80">
        Completá tus datos y el mensaje se envía directo al correo del equipo institucional.
      </p>

      <form
        className="mt-4 grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          setTocado(true);
          if (!valido) return;
          setEnviando(true);
          void enviarFormulario()
            .then(() => {
              toast.success("Mensaje enviado con éxito.");
              setForm(inicial);
              setTocado(false);
            })
            .catch((error: unknown) => {
              const message = error instanceof Error ? error.message : "No se pudo enviar tu consulta.";
              toast.error(message);
            })
            .finally(() => {
              setEnviando(false);
            });
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Campo label="Nombre" error={tocado ? errores.nombre : undefined}>
            <input
              value={form.nombre}
              onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
              className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
            />
          </Campo>
          <Campo label="Email" error={tocado ? errores.email : undefined}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
            />
          </Campo>
        </div>

        <Campo label="Asunto" error={tocado ? errores.asunto : undefined}>
          <input
            value={form.asunto}
            onChange={(e) => setForm((prev) => ({ ...prev, asunto: e.target.value }))}
            className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
          />
        </Campo>

        <Campo label="Mensaje" error={tocado ? errores.mensaje : undefined}>
          <textarea
            value={form.mensaje}
            onChange={(e) => setForm((prev) => ({ ...prev, mensaje: e.target.value }))}
            className="min-h-32 w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm"
          />
        </Campo>

        <button
          type="submit"
          disabled={enviando}
          className="w-fit rounded-full bg-brand-main px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-soft"
        >
          {enviando ? "Enviando..." : "Enviar consulta"}
        </button>
      </form>
    </article>
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
