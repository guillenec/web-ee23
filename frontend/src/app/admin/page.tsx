import { TransitionLink } from "@/components/transition-link";

const cards = [
  {
    href: "/admin/novedades",
    titulo: "Gestionar novedades",
    descripcion: "Crear, editar, publicar o eliminar noticias institucionales.",
    cta: "Abrir modulo",
  },
  {
    href: "/admin/galeria",
    titulo: "Gestionar galeria",
    descripcion: "Subir imagenes, editar datos y ocultar o eliminar fotos publicas.",
    cta: "Ir a galeria",
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="page-enter bg-[radial-gradient(circle_at_0%_0%,#c5e4e7_0%,#f6f2ee_45%,#f6f2ee_100%)] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section data-reveal className="rounded-3xl border border-brand-dark/10 bg-surface p-6 sm:p-8">
          <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Panel administrador</p>
          <h1 className="mt-2 text-3xl font-black text-brand-dark sm:text-4xl">Dashboard de contenidos</h1>
          <p className="mt-3 max-w-3xl text-sm text-brand-dark/80 sm:text-base">
            Desde aca puedes gestionar novedades y galeria sin usar la consola de Firebase.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.href}
              data-reveal
              className="rounded-2xl border border-brand-dark/10 bg-surface p-5 shadow-[0_8px_20px_rgba(75,56,49,0.08)]"
            >
              <h2 className="text-xl font-black text-brand-dark">{card.titulo}</h2>
              <p className="mt-2 text-sm text-brand-dark/80">{card.descripcion}</p>
              <TransitionLink
                href={card.href}
                className="mt-4 inline-flex rounded-full bg-brand-main px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft"
              >
                {card.cta}
              </TransitionLink>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
