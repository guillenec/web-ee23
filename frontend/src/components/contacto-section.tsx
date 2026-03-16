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
            <p className="text-xs font-bold tracking-[0.11em] text-brand-main uppercase">Direccion</p>
            <p className="mt-1 text-sm text-brand-dark/85">{contactoInstitucional.direccion}</p>
          </div>

          <div className="grid gap-2 text-sm text-brand-dark/85">
            <p>
              Telefono: <a href={`tel:${contactoInstitucional.telefonoLink}`}>{contactoInstitucional.telefonoVisible}</a>
            </p>
            <p>
              Email: <a href={`mailto:${contactoInstitucional.email}`}>{contactoInstitucional.email}</a>
            </p>
            <p>
              Facebook: <a href={contactoInstitucional.facebookUrl}>Escuela Especial N 23</a>
            </p>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.11em] text-brand-main uppercase">Horario</p>
            <ul className="mt-2 grid gap-1 text-sm text-brand-dark/85">
              {horariosInstitucionales.map((fila) => (
                <li key={fila.dia} className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{fila.dia}</span>
                  <span>{fila.horario}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <div className="overflow-hidden rounded-2xl border border-brand-dark/10 bg-surface shadow-[0_8px_20px_rgba(75,56,49,0.10)]">
          <iframe
            title="Ubicacion Escuela Especial N 23"
            src={contactoInstitucional.mapsEmbedUrl}
            className="h-[360px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
