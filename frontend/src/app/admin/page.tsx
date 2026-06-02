import { ArrowRight, Images, Newspaper, Video } from "lucide-react";

import { TransitionLink } from "@/components/transition-link";

const cards = [
  {
    href: "/admin/novedades/crear",
    titulo: "Gestionar novedades",
    descripcion: "Crear publicaciones nuevas y revisar pendientes/publicadas en paneles separados.",
    cta: "Crear novedad",
    etiqueta: "Contenido editorial",
    color: "from-brand-main/20 via-brand-soft/10 to-transparent",
    icon: Newspaper,
    accesos: [
      { href: "/admin/novedades/crear", label: "Crear novedad" },
      { href: "/admin/novedades/ver", label: "Ver novedades" },
    ],
  },
  {
    href: "/admin/galeria",
    titulo: "Gestionar galeria",
    descripcion: "Subir imagenes, editar datos y ocultar o eliminar fotos publicas.",
    cta: "Ir a galeria",
    etiqueta: "Memoria visual",
    color: "from-sky/40 via-brand-soft/5 to-transparent",
    icon: Images,
    accesos: [
      { href: "/admin/galeria", label: "Abrir galeria" },
    ],
  },
  {
    href: "/admin/canal",
    titulo: "Gestionar canal YouTube",
    descripcion: "Subir videos, completar metadatos y controlar estado publicado o pendiente.",
    cta: "Abrir canal",
    etiqueta: "Audiovisuales",
    color: "from-red-500/25 via-brand-soft/5 to-transparent",
    icon: Video,
    accesos: [{ href: "/admin/canal", label: "Panel canal" }],
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="admin-shell page-enter px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section
          data-reveal
          className="admin-hero rounded-3xl p-6 sm:p-8"
        >
          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-end">
            <div>
              <p className="admin-kicker">Panel administrador</p>
              <h1 className="mt-2 text-3xl leading-tight font-black text-brand-dark sm:text-5xl">Centro de control del sitio</h1>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-brand-dark/80 sm:text-base">
                Publica novedades, organiza la galeria y administra videos desde un flujo simple, seguro y pensado para trabajo diario.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-dark/10 bg-white/72 p-4">
              <p className="text-sm font-black text-brand-dark">Prioridad operativa</p>
              <p className="mt-1 text-xs leading-relaxed text-brand-dark/72">
                Primero crea o sube contenido, luego revisa estados antes de publicarlo. Todo queda separado por modulo.
              </p>
            </div>
          </div>

          <div className="relative mt-5 grid gap-3 sm:grid-cols-3">
            <article className="rounded-2xl border border-brand-dark/10 bg-white/72 p-4">
              <p className="admin-kicker">Estado</p>
              <p className="mt-1 text-base font-black text-brand-dark">Operacion normal</p>
            </article>
            <article className="rounded-2xl border border-brand-dark/10 bg-white/72 p-4">
              <p className="admin-kicker">Flujo</p>
              <p className="mt-1 text-base font-black text-brand-dark">Crear / Revisar / Publicar</p>
            </article>
            <article className="rounded-2xl border border-brand-dark/10 bg-white/72 p-4">
              <p className="admin-kicker">Acceso</p>
              <p className="mt-1 text-base font-black text-brand-dark">Solo cuentas admin</p>
            </article>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.href}
              data-reveal
              className="admin-card relative overflow-hidden rounded-3xl p-5"
            >
              <div className="absolute top-4 right-4 rounded-2xl border border-brand-main/15 bg-brand-main/8 p-2 text-brand-main">
                <card.icon className="h-5 w-5" />
              </div>
              <div className={`pointer-events-none absolute inset-0 bg-linear-to-br ${card.color}`} />
              <p className="admin-kicker relative pr-12">{card.etiqueta}</p>
              <h2 className="relative mt-2 pr-12 text-2xl font-black text-brand-dark">{card.titulo}</h2>
              <p className="relative mt-2 min-h-12 text-sm leading-relaxed text-brand-dark/78">{card.descripcion}</p>
              <TransitionLink
                href={card.href}
                className="admin-primary-btn relative mt-4 px-4 py-2 text-sm"
              >
                {card.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </TransitionLink>
              <div className="relative mt-3 flex flex-wrap gap-2">
                {card.accesos.map((atajo) => (
                  <TransitionLink
                    key={atajo.href}
                    href={atajo.href}
                    className="admin-secondary-btn px-3 py-1.5 text-xs"
                  >
                    {atajo.label}
                  </TransitionLink>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
