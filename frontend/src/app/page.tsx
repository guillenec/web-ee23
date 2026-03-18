import Image from "next/image";

import { GaleriaPreview } from "@/components/galeria-preview";
import { NovedadesPreview } from "@/components/novedades-preview";
import { TransitionLink } from "@/components/transition-link";
import { contactoInstitucional } from "@/lib/contacto";

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
    <main className="page-enter bg-[radial-gradient(circle_at_10%_20%,#c5e4e7_0%,#f6f2ee_35%,#f6f2ee_100%)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-8 sm:px-8 sm:py-12">
        <section
          id="banner"
          data-reveal
          className="relative h-[520px] overflow-hidden rounded-3xl bg-brand-dark text-white shadow-[0_24px_50px_rgba(78,56,49,0.28)] md:h-[550px]"
        >
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

        <section
          id="sobre-nosotros"
          data-reveal
          className="rounded-3xl border border-brand-dark/10 bg-surface/95 p-6 shadow-[0_12px_28px_rgba(75,56,49,0.08)] sm:p-8"
        >
          <div className="grid gap-7 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-4">
              <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Sobre nosotros</p>
              <h2 className="text-2xl font-black text-brand-dark sm:text-3xl">
                Educacion especial publica, cercana y territorial
              </h2>
              <p className="text-sm leading-relaxed text-brand-dark/80 sm:text-base">
                La Escuela Especial N 23 acompana trayectorias de ninas, ninos y adolescentes con
                apoyos especificos, priorizando inclusion, autonomia y participacion en la comunidad.
              </p>
              <p className="text-sm leading-relaxed text-brand-dark/80 sm:text-base">
                Nuestro trabajo combina propuestas pedagogicas adaptadas, grupos reducidos y
                articulacion permanente con familias e instituciones de Ingeniero Jacobacci y Region Sur.
              </p>
              <TransitionLink
                href="/sobre-nosotros"
                className="inline-flex rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
              >
                Conocer mas
              </TransitionLink>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <article className="rounded-2xl border border-brand-dark/12 bg-white/70 p-4">
                <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Enfoque</p>
                <p className="mt-2 text-sm text-brand-dark/80">
                  Acompanamiento personalizado y contenidos adaptados a cada estudiante.
                </p>
              </article>
              <article className="rounded-2xl border border-brand-dark/12 bg-white/70 p-4">
                <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Comunidad</p>
                <p className="mt-2 text-sm text-brand-dark/80">
                  Trabajo conjunto con familias, equipos y redes locales para sostener cada proceso.
                </p>
              </article>
              <article className="rounded-2xl border border-brand-dark/12 bg-white/70 p-4 sm:col-span-2 lg:col-span-1">
                <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Accesibilidad</p>
                <p className="mt-2 text-sm text-brand-dark/80">
                  Entorno institucional accesible y propuestas que fortalecen autonomia para la vida diaria.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="proximamente" data-reveal className="grid gap-5 lg:grid-cols-3">
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
              <TransitionLink
                href="/novedades"
                className="mt-3 inline-block rounded-full border border-white/45 px-3 py-1.5 text-xs font-bold uppercase transition hover:bg-white hover:text-brand-dark"
              >
                Ver novedades
              </TransitionLink>
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
              <TransitionLink
                href="/galeria"
                className="mt-3 inline-block rounded-full border border-brand-dark/25 px-3 py-1.5 text-xs font-bold uppercase transition hover:bg-brand-dark hover:text-white"
              >
                Abrir galeria
              </TransitionLink>
            </div>
          </article>
          <article
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
              <TransitionLink
                href="/contacto"
                className="mt-3 inline-block rounded-full border border-brand-dark/25 px-3 py-1.5 text-xs font-bold uppercase transition hover:bg-brand-dark hover:text-white"
              >
                Ir a contacto
              </TransitionLink>
            </div>
          </article>
        </section>

        <section
          id="contacto"
          data-reveal
          className="rounded-3xl border border-brand-dark/10 bg-surface/95 p-6 shadow-[0_12px_28px_rgba(75,56,49,0.08)] sm:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-4">
              <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Contacto</p>
              <h2 className="text-2xl font-black text-brand-dark sm:text-3xl">Canales directos de la escuela</h2>
              <p className="text-sm leading-relaxed text-brand-dark/80 sm:text-base">
                Si necesitas informacion institucional, acompanamiento o coordinar una visita, podes
                comunicarte con nosotros por WhatsApp, email o Facebook.
              </p>
              <p className="text-sm text-brand-dark/75">{contactoInstitucional.direccion}</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={contactoInstitucional.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-brand-main/35 bg-brand-main/8 px-4 py-2 text-sm font-semibold text-brand-main transition hover:bg-brand-main hover:text-white"
                >
                  WhatsApp
                </a>
                <a
                  href={`mailto:${contactoInstitucional.email}`}
                  className="rounded-full border border-brand-dark/20 bg-white px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
                >
                  Email
                </a>
                <TransitionLink
                  href="/contacto"
                  className="rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
                >
                  Conocer mas
                </TransitionLink>
              </div>
            </div>

            <article className="overflow-hidden rounded-2xl border border-brand-dark/10 bg-surface shadow-[0_8px_20px_rgba(75,56,49,0.10)]">
              <iframe
                title="Ubicacion Escuela Especial N 23"
                src={contactoInstitucional.mapsEmbedUrl}
                className="h-[280px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </article>
          </div>
        </section>

        <section data-reveal className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">
                Galeria institucional
              </p>
              <h2 className="text-2xl font-black text-brand-dark">Imagenes destacadas</h2>
            </div>
            <TransitionLink
              href="/galeria"
              className="rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
            >
              Ver galeria completa
            </TransitionLink>
          </div>

          <GaleriaPreview cantidad={3} />
        </section>

        <section data-reveal className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">
                Conexion Firestore
              </p>
              <h2 className="text-2xl font-black text-brand-dark">Ultimas novedades publicadas</h2>
            </div>
            <TransitionLink
              href="/novedades"
              className="rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
            >
              Ver todas
            </TransitionLink>
          </div>
          <NovedadesPreview cantidad={3} />
        </section>

        <section id="alcance" data-reveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
      </div>
    </main>
  );
}
