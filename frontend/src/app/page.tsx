import type { Metadata } from "next";
import Image from "next/image";

import { GaleriaPreview } from "@/components/galeria-preview";
import { NovedadesPreview } from "@/components/novedades-preview";
import { TransitionLink } from "@/components/transition-link";
import { contactoInstitucional } from "@/lib/contacto";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

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
    <main className="page-enter bg-app">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-8 sm:px-8 sm:py-12">
        <div
          data-reveal
          className="relative rounded-3xl bg-brand-dark text-white shadow-[0_24px_50px_rgba(78,56,49,0.28)]"
        >
          <section
            id="banner"
            className="relative overflow-hidden rounded-3xl bg-brand-dark text-white shadow-[0_24px_50px_rgba(78,56,49,0.28)]"
          >
            <Image
              src="/assets/images/hero-frente.jpg"
              alt="Frente de la Escuela Especial N 23"
              width={1600}
              height={900}
              className="hero-pan absolute inset-0 h-full w-full object-cover opacity-95"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-brand-dark/65 to-transparent" />
            <div className="relative flex min-h-135 items-center p-5 sm:p-10 lg:p-12">
              <div className="w-full max-w-xl rounded-2xl border border-white/18 bg-black/25 p-6 backdrop-blur-[1.5px] sm:p-7">
                <p className="fade-up text-lg font-bold tracking-wide text-white/90 uppercase">Bienvenidos al</p>
                <h1 className="fade-up delay-1 mt-1 text-5xl leading-[0.95] font-black sm:text-6xl">CEE N 23</h1>
                <p className="fade-up delay-2 mt-5 text-xl font-semibold text-white/95">
                  Brindamos educación especial de calidad, promoviendo inclusión, desarrollo y autonomía.
                </p>
                <div className="fade-up delay-3 mt-7 flex flex-wrap gap-3">
                  <TransitionLink
                    href="/sobre-nosotros"
                    className="cta-pop rounded-full bg-brand-main px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-soft"
                  >
                    Conocé la institución
                  </TransitionLink>
                  <a
                    href={contactoInstitucional.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/55 bg-white/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-white hover:text-brand-dark"
                  >
                    Ir al canal de YouTube
                  </a>
                </div>
              </div>
            </div>
          </section>
          <div className="cardsBanner hidden md:absolute md:inset-x-0 md:-bottom-26 md:z-10 md:block md:px-6 md:pb-6">
            <div className="grid gap-3 rounded-2xl border border-brand-dark/10 bg-surface p-4 text-brand-dark shadow-[0_14px_30px_rgba(75,56,49,0.12)] sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
              {[
                {
                  titulo: "Inclusión y respeto",
                  texto: "Promovemos un ambiente de respeto y valoración de la diversidad.",
                },
                {
                  titulo: "Educación personalizada",
                  texto: "Propuestas adaptadas a las necesidades de cada estudiante.",
                },
                {
                  titulo: "Compromiso y acompañamiento",
                  texto: "Acompañamos cada trayectoria educativa y personal.",
                },
                {
                  titulo: "Autonomía y desarrollo",
                  texto: "Fortalecemos habilidades para la vida cotidiana y comunitaria.",
                },
              ].map((item) => (
                <article key={item.titulo} className="rounded-xl border border-brand-dark/10 bg-white/80 p-4">
                  <h3 className="text-base font-extrabold">{item.titulo}</h3>
                  <p className="mt-2 text-sm text-brand-dark/80">{item.texto}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <section data-reveal className="audiovisualesYoutube surface-hover rounded-3xl border border-brand-dark/10 bg-surface/95 p-6 shadow-[0_12px_28px_rgba(75,56,49,0.08)] sm:p-8 md:mt-30">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Canal EE23</p>
              <h2 className="text-2xl font-black text-brand-dark sm:text-3xl">
                Producciones audiovisuales de estudiantes y docentes
              </h2>
              <p className="text-sm leading-relaxed text-brand-dark/80 sm:text-base">
                Este espacio reúne videos creados en proyectos pedagógicos y experiencias institucionales.
                Es una propuesta propia del canal de YouTube de la escuela, complementaria a novedades y
                galería.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={contactoInstitucional.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="chip-hover rounded-full border border-red-500/55 bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Ver canal @escuela.especial23
                </a>
                <TransitionLink
                  href="/canal"
                  className="chip-hover rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
                >
                  Abrir seccion Canal
                </TransitionLink>
                <TransitionLink
                  href="/novedades"
                  className="chip-hover rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
                >
                  Ver novedades institucionales
                </TransitionLink>
              </div>
            </div>

            <article className="overflow-hidden rounded-2xl border border-brand-dark/10 bg-brand-dark p-3 shadow-[0_8px_20px_rgba(75,56,49,0.10)]">
              <iframe
                title="Canal de YouTube Escuela Especial N 23"
                src="https://www.youtube.com/embed/videoseries?list=UUpwpsXvwzzjAYT7bDAJj7Q"
                className="h-64 w-full rounded-xl sm:h-72"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </article>
          </div>
        </section>

        <section
          id="sobre-nosotros"
          data-reveal
          className="surface-hover rounded-3xl border border-brand-dark/10 bg-surface/95 p-6 shadow-[0_12px_28px_rgba(75,56,49,0.08)] sm:p-8"
        >
          <div className="grid gap-7 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-4">
              <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Sobre nosotros</p>
              <h2 className="text-2xl font-black text-brand-dark sm:text-3xl">
                Educación especial pública, cercana y territorial
              </h2>
              <p className="text-sm leading-relaxed text-brand-dark/80 sm:text-base">
                La Escuela Especial N 23 acompaña trayectorias de niñas, niños y adolescentes con
                apoyos específicos, priorizando inclusión, autonomía y participación en la comunidad.
              </p>
              <p className="text-sm leading-relaxed text-brand-dark/80 sm:text-base">
                Nuestro trabajo combina propuestas pedagógicas adaptadas, grupos reducidos y
                articulación permanente con familias e instituciones de Ingeniero Jacobacci y Región Sur.
              </p>
              <TransitionLink
                href="/sobre-nosotros"
                className="chip-hover inline-flex rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
              >
                Conocer más
              </TransitionLink>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <article className="surface-hover rounded-2xl border border-brand-dark/12 bg-white/70 p-4">
                <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Enfoque</p>
                <p className="mt-2 text-sm text-brand-dark/80">
                  Acompañamiento personalizado y contenidos adaptados a cada estudiante.
                </p>
              </article>
              <article className="surface-hover rounded-2xl border border-brand-dark/12 bg-white/70 p-4">
                <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Comunidad</p>
                <p className="mt-2 text-sm text-brand-dark/80">
                  Trabajo conjunto con familias, equipos y redes locales para sostener cada proceso.
                </p>
              </article>
              <article className="surface-hover rounded-2xl border border-brand-dark/12 bg-white/70 p-4 sm:col-span-2 lg:col-span-1">
                <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Accesibilidad</p>
                <p className="mt-2 text-sm text-brand-dark/80">
                  Entorno institucional accesible y propuestas que fortalecen autonomía para la vida diaria.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section data-reveal className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">
                Galería institucional
              </p>
              <h2 className="text-2xl font-black text-brand-dark">Imágenes destacadas</h2>
            </div>
            <TransitionLink
              href="/galeria"
              className="chip-hover rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
            >
              Ver galería completa
            </TransitionLink>
          </div>

          <GaleriaPreview cantidad={3} />
        </section>

        <section data-reveal className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">
                Novedades
              </p>
              <h2 className="text-2xl font-black text-brand-dark">Últimas novedades publicadas</h2>
            </div>
            <TransitionLink
              href="/novedades"
              className="chip-hover rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
            >
              Ver todas
            </TransitionLink>
          </div>
          <NovedadesPreview cantidad={3} />
        </section>


        <section
          id="contacto"
          data-reveal
          className="space-y-4"
        >
          <div className="surface-hover grid gap-6 lg:grid-cols-[1.2fr_1fr] rounded-3xl border border-brand-dark/10 bg-surface/95 p-6 shadow-[0_12px_28px_rgba(75,56,49,0.08)] sm:p-8 ">
            <div className="space-y-4">
              <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Contacto</p>
              <h2 className="text-2xl font-black text-brand-dark sm:text-3xl">Canales directos de la escuela</h2>
              <p className="text-sm leading-relaxed text-brand-dark/80 sm:text-base">
                Si necesitás información institucional, acompañamiento o coordinar una visita, podés
                comunicarte con nosotros por WhatsApp, email o Facebook.
              </p>
              <p className="text-sm text-brand-dark/75">{contactoInstitucional.direccion}</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={contactoInstitucional.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="chip-hover rounded-full border border-brand-main/35 bg-brand-main/8 px-4 py-2 text-sm font-semibold text-brand-main transition hover:bg-brand-main hover:text-white"
                >
                  WhatsApp
                </a>
                <a
                  href={contactoInstitucional.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="chip-hover rounded-full border border-red-500/55 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                >
                  YouTube
                </a>
                <a
                  href={`mailto:${contactoInstitucional.email}`}
                  className="chip-hover rounded-full border border-brand-dark/20 bg-white px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
                >
                  Email
                </a>
                <TransitionLink
                  href="/contacto"
                  className="chip-hover rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
                >
                  Conocer más
                </TransitionLink>
              </div>
            </div>

            <article className="overflow-hidden rounded-2xl border border-brand-dark/10 bg-surface shadow-[0_8px_20px_rgba(75,56,49,0.10)]">
              <iframe
                title="Ubicación Escuela Especial N 23"
                src={contactoInstitucional.mapsEmbedUrl}
                className="h-70 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </article>
          </div>
        </section>

        <section id="alcance" data-reveal className="space-y-4">
          <div className="surface-hover rounded-3xl border border-brand-dark/10 bg-surface/95 p-6 shadow-[0_10px_24px_rgba(75,56,49,0.07)] sm:p-7">
            <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Alcance territorial</p>
            <h2 className="mt-2 text-2xl font-black text-brand-dark sm:text-3xl">Región Sur y localidades acompañadas</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-brand-dark/80 sm:text-base">
              La escuela sostiene propuestas pedagógicas y comunitarias en Jacobacci y parajes de la región,
              en articulación con familias e instituciones locales.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 relative" id="regiones">
            {localidades.map((localidad, idx) => (
              <article
                key={localidad}
                className="surface-hover rounded-2xl border border-brand-dark/12 bg-surface p-4 shadow-[0_8px_20px_rgba(75,56,49,0.06)]"
                style={{ animationDelay: `${0.08 * idx}s` }}
              >
                <p className="text-[11px] font-bold tracking-[0.13em] text-brand-main uppercase">Localidad</p>
                <h3 className="mt-2 text-lg font-extrabold text-brand-dark">{localidad}</h3>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
