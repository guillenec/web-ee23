import Image from "next/image";
import Link from "next/link";

import { NovedadesPreview } from "@/components/novedades-preview";

export default function Home() {
  const localidades = [
    "Ingeniero Jacobacci",
    "Aguada de Guerra",
    "Anecon Grande",
    "Comallo",
    "El Cain",
    "Maquinchao",
    "Mencue",
    "Pilquiniyeu",
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_20%,#c5e4e7_0%,#f6f2ee_35%,#f6f2ee_100%)]">
      <header className="border-b border-brand-dark/10 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/logos/logo-escuela.svg"
              alt="Logo Escuela Especial N 23"
              width={48}
              height={48}
              className="h-12 w-12"
            />
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-brand-main uppercase">
                Escuela Especial N 23
              </p>
              <p className="text-sm text-brand-dark/75">Ingeniero Jacobacci - Rio Negro</p>
            </div>
          </div>
          <a
            href="#contacto"
            className="rounded-full border border-brand-main px-4 py-2 text-sm font-semibold text-brand-main transition hover:bg-brand-main hover:text-white"
          >
            Contacto
          </a>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-8 sm:px-8 sm:py-12">
        <section id="banner" className="relative h-[520px]  md:h-[550px] overflow-hidden rounded-3xl bg-brand-dark text-white shadow-[0_24px_50px_rgba(78,56,49,0.28)]">
          <Image
            src="/assets/images/hero-frente.jpg"
            alt="Frente de la Escuela Especial N 23"
            width={1600}
            height={900}
            className="hero-pan  w-full h-full object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-brand-main/55" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_22%,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_58%)]" />
          <div className="float-shape absolute -top-16 -right-10 h-44 w-44 rounded-full bg-brand-soft/55 blur-2xl" />
          <div className="float-shape absolute -bottom-16 left-8 h-40 w-40 rounded-full bg-sky/30 blur-2xl" />
          <div className="caja1 absolute inset-0  p-2 sm:p-10 lg:p-12 w-auto h-auto flex justify-start items-center">
            <div className="caja2 w-full max-w-4xl rounded-2xl border border-white/20 bg-[rgba(0,0,0,0.18)] p-5 backdrop-blur-[1.5px] sm:p-7">
              <p className="fade-up inline-block rounded-full border border-white/35 px-3 py-1 text-xs tracking-widest uppercase">
                Web institucional en construccion
              </p>
              <h1 className="fade-up delay-1 mt-4 max-w-3xl text-3xl leading-tight font-black md:text-5xl">
                Inclusion, acompanamiento y trabajo territorial en toda la Region Sur.
              </h1>
              <p className="fade-up delay-2 mt-5 max-w-2xl text-base text-white/90 md:text-lg">
                Este sitio va a acercar informacion clara para familias, docentes e instituciones,
                visibilizando propuestas de la Escuela Especial N 23 desde primera infancia hasta nivel
                secundario.
              </p>
              <div className="fade-up delay-3 mt-7 flex flex-wrap gap-3">
                <a
                  href="#alcance"
                  className="cta-pop rounded-full bg-brand-main px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-soft"
                >
                  Ver alcance territorial
                </a>
                <a
                  href="#proximamente"
                  className="rounded-full border border-white/50 bg-white/8 px-5 py-2 text-sm font-semibold transition hover:bg-white hover:text-brand-dark"
                >
                  Proximas secciones
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="proximamente" className="grid gap-5 lg:grid-cols-3">
          <article className="card-lift overflow-hidden rounded-2xl bg-surface shadow-[0_8px_20px_rgba(75,56,49,0.08)]">
            <Image
              src="/assets/images/alumnos-jardin.jpg"
              alt="Actividad con estudiantes"
              width={800}
              height={600}
              className="h-44 w-full object-cover"
            />
            <div className="bg-brand-main p-5 text-white">
              <h3 className="text-xl font-black">Novedades</h3>
              <p className="mt-2 text-sm text-white/90">
                Comunicados, actos, proyectos y actividades con actualizacion periodica.
              </p>
            </div>
          </article>
          <article className="card-lift overflow-hidden rounded-2xl bg-surface shadow-[0_8px_20px_rgba(75,56,49,0.08)]">
            <Image
              src="/assets/images/educacion-vial.jpg"
              alt="Jornada de educacion vial"
              width={800}
              height={600}
              className="h-44 w-full object-cover"
            />
            <div className="bg-sky p-5 text-brand-dark">
              <h3 className="text-xl font-black">Galeria institucional</h3>
              <p className="mt-2 text-sm text-brand-dark/85">
                Registro visual del trabajo pedagogico en escuelas y parajes de la region.
              </p>
            </div>
          </article>
          <article
            id="contacto"
            className="card-lift overflow-hidden rounded-2xl bg-surface shadow-[0_8px_20px_rgba(75,56,49,0.08)]"
          >
            <Image
              src="/assets/images/acto-tradicion.jpg"
              alt="Acto escolar de tradicion"
              width={800}
              height={600}
              className="h-44 w-full object-cover"
            />
            <div className="bg-neutral p-5 text-brand-dark">
              <h3 className="text-xl font-black">Contacto y acompanamiento</h3>
              <p className="mt-2 text-sm text-brand-dark/85">
                Canal directo con la escuela para familias e instituciones de la zona.
              </p>
            </div>
          </article>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">
                Conexion Firestore
              </p>
              <h2 className="text-2xl font-black text-brand-dark">Ultimas novedades publicadas</h2>
            </div>
            <Link
              href="/novedades"
              className="rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
            >
              Ver todas
            </Link>
          </div>
          <NovedadesPreview cantidad={3} />
        </section>

        <section id="alcance" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {localidades.map((localidad, idx) => (
            <article
              key={localidad}
              className="fade-up rounded-2xl border border-brand-dark/10 bg-surface p-4 shadow-[0_8px_20px_rgba(75,56,49,0.06)]"
              style={{ animationDelay: `${0.08 * idx}s` }}
            >
              <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Region Sur</p>
              <h2 className="mt-2 text-lg font-extrabold text-brand-dark">{localidad}</h2>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
