import { TransitionLink } from "@/components/transition-link";

const cards = [
  {
    href: "/admin/novedades/crear",
    titulo: "Gestionar novedades",
    descripcion: "Crear publicaciones nuevas y revisar pendientes/publicadas en paneles separados.",
    cta: "Crear novedad",
    etiqueta: "Contenido editorial",
    color: "from-brand-main/20 via-brand-soft/10 to-transparent",
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
    accesos: [
      { href: "/admin/galeria", label: "Abrir galeria" },
    ],
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="page-enter bg-app px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section
          data-reveal
          className="relative overflow-hidden rounded-3xl border border-brand-dark/10 bg-surface p-6 shadow-[0_12px_34px_rgba(75,56,49,0.12)] sm:p-8"
        >
          <div className="pointer-events-none absolute -top-12 -right-10 h-44 w-44 rounded-full bg-brand-main/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-10 h-44 w-44 rounded-full bg-sky/40 blur-2xl" />
          <p className="relative text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Panel administrador</p>
          <h1 className="relative mt-2 text-3xl font-black text-brand-dark sm:text-4xl">Dashboard de contenidos</h1>
          <p className="relative mt-3 max-w-3xl text-sm text-brand-dark/80 sm:text-base">
            Gestiona novedades y galeria con un flujo simple para publicar rapido, revisar pendientes y mantener el sitio actualizado.
          </p>

          <div className="relative mt-5 grid gap-3 sm:grid-cols-3">
            <article className="rounded-2xl border border-brand-dark/10 bg-white/70 p-3">
              <p className="text-xs font-bold tracking-[0.12em] text-brand-main uppercase">Estado</p>
              <p className="mt-1 text-sm font-semibold text-brand-dark">Operacion normal</p>
            </article>
            <article className="rounded-2xl border border-brand-dark/10 bg-white/70 p-3">
              <p className="text-xs font-bold tracking-[0.12em] text-brand-main uppercase">Flujo</p>
              <p className="mt-1 text-sm font-semibold text-brand-dark">Crear / Ver / Publicar</p>
            </article>
            <article className="rounded-2xl border border-brand-dark/10 bg-white/70 p-3">
              <p className="text-xs font-bold tracking-[0.12em] text-brand-main uppercase">Acceso</p>
              <p className="mt-1 text-sm font-semibold text-brand-dark">Solo cuentas admin</p>
            </article>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.href}
              data-reveal
              className="relative overflow-hidden rounded-2xl border border-brand-dark/10 bg-surface p-5 shadow-[0_8px_20px_rgba(75,56,49,0.08)]"
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.color}`} />
              <p className="relative text-[11px] font-bold tracking-[0.13em] text-brand-main uppercase">{card.etiqueta}</p>
              <h2 className="text-xl font-black text-brand-dark">{card.titulo}</h2>
              <p className="relative mt-2 text-sm text-brand-dark/80">{card.descripcion}</p>
              <TransitionLink
                href={card.href}
                className="relative mt-4 inline-flex rounded-full bg-brand-main px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft"
              >
                {card.cta}
              </TransitionLink>
              <div className="relative mt-3 flex flex-wrap gap-2">
                {card.accesos.map((atajo) => (
                  <TransitionLink
                    key={atajo.href}
                    href={atajo.href}
                    className="inline-flex rounded-full border border-brand-dark/20 bg-white px-3 py-1.5 text-xs font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
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
