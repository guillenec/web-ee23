import Image from "next/image";

import { ContactoForm } from "@/components/contacto-form";
import { contactoInstitucional, horariosInstitucionales } from "@/lib/contacto";

type Props = {
  titulo?: string;
  subtitulo?: string;
  id?: string;
};

export function ContactoSection({
  titulo = "Contacto",
  subtitulo = "Canales para familias, instituciones y comunidad.",
  id,
}: Props) {
  return (
    <section
      id={id}
      data-reveal
      className="rounded-3xl border border-brand-dark/10 bg-surface p-6 shadow-[0_12px_28px_rgba(75,56,49,0.08)] sm:p-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Contacto institucional</p>
          <h2 className="text-2xl font-black text-brand-dark sm:text-3xl">{titulo}</h2>
          <p className="mt-2 text-sm text-brand-dark/80">{subtitulo}</p>
        </div>
        <a
          href={contactoInstitucional.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
        >
          Abrir en Google Maps
        </a>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <article className="space-y-4 rounded-2xl border border-brand-dark/10 bg-white/70 p-5">
          <div>
            <p className="text-xs font-bold tracking-[0.11em] text-brand-main uppercase">Dirección</p>
            <p className="mt-1 text-sm text-brand-dark/85">{contactoInstitucional.direccion}</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <a
              href={contactoInstitucional.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-brand-main/35 bg-brand-main/8 px-3 py-2 text-center text-sm font-semibold text-brand-main transition hover:bg-brand-main hover:text-white"
            >
              WhatsApp
            </a>
            <a
              href={`mailto:${contactoInstitucional.email}`}
              className="rounded-xl border border-brand-dark/20 bg-white px-3 py-2 text-center text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
            >
              Email
            </a>
            <a
              href={contactoInstitucional.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-sky/45 bg-sky/45 px-3 py-2 text-center text-sm font-semibold text-brand-dark transition hover:bg-sky/70"
            >
              Facebook
            </a>
          </div>

          <div className="rounded-xl border border-brand-dark/10 bg-white/80 p-3">
            <p className="text-xs font-bold tracking-[0.11em] text-brand-main uppercase">Horario</p>
            <p className="mt-2 text-sm text-brand-dark/85">Lunes a viernes: 08:00-12:30 y 13:00-17:30</p>
            <p className="text-sm text-brand-dark/85">Sábado y domingo: cerrado</p>

            <details className="mt-2 rounded-lg border border-brand-dark/10 bg-white/90 p-2">
              <summary className="cursor-pointer text-sm font-semibold text-brand-dark">
                Ver detalle semanal
              </summary>
              <ul className="mt-2 grid gap-1 text-sm text-brand-dark/85">
                {horariosInstitucionales.map((fila) => (
                  <li key={fila.dia} className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{fila.dia}</span>
                    <span>{fila.horario}</span>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </article>

        <div className="overflow-hidden rounded-2xl border border-brand-dark/10 bg-surface shadow-[0_8px_20px_rgba(75,56,49,0.10)]">
          <iframe
            title="Ubicación Escuela Especial N 23"
            src={contactoInstitucional.mapsEmbedUrl}
            className="h-[360px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="min-w-0 lg:max-w-3xl">
          <ContactoForm />
        </div>

        <article
          data-reveal
          className="flex items-center justify-center rounded-2xl border border-brand-dark/10 bg-[linear-gradient(160deg,rgba(197,228,231,0.26),rgba(255,255,255,0.75))] p-6"
        >
          <div className="flex h-full w-full flex-col items-center justify-start gap-4">
            <h2 className="text-sm font-semibold text-brand-dark/75 text-center">
              Comunidad educativa, inclusión y acompañamiento territorial.
            </h2>
            <Image
              src="/assets/images/identidad_visual.png"
              alt="Logo institucional Escuela Especial N 23"
              width={460}
              height={376}
              className="w-auto h-72 md:h-[400px] rounded-lg border border-brand-dark/20 object-cover object-center"
            />
          </div>
        </article>
      </div>
    </section>
  );
}
