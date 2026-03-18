import { TransitionLink } from "@/components/transition-link";

const accesos = [
  {
    href: "/admin/novedades/crear",
    titulo: "Crear novedad",
    descripcion: "Formulario dedicado para cargar una publicacion nueva en Firebase.",
    cta: "Ir a crear",
    tonos: "border-brand-main/25 bg-brand-main/5",
  },
  {
    href: "/admin/novedades/ver",
    titulo: "Ver novedades",
    descripcion: "Listado completo de pendientes y publicadas con acciones de estado.",
    cta: "Ir a ver",
    tonos: "border-emerald-300/60 bg-emerald-50/60",
  },
];

export default function AdminNovedadesIndexPage() {
  return (
    <main className="page-enter bg-app px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl border border-brand-dark/10 bg-surface p-6 shadow-[0_10px_24px_rgba(75,56,49,0.08)] sm:p-8">
          <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Modulo de novedades</p>
          <h1 className="mt-2 text-3xl font-black text-brand-dark sm:text-4xl">Selecciona un flujo</h1>
          <p className="mt-3 max-w-3xl text-sm text-brand-dark/80 sm:text-base">
            Separamos la carga y la gestion para que el panel sea mas claro: crear en una ruta y revisar/publicar en otra.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {accesos.map((acceso) => (
            <article
              key={acceso.href}
              className={`rounded-2xl border p-5 shadow-[0_8px_20px_rgba(75,56,49,0.08)] ${acceso.tonos}`}
            >
              <h2 className="text-2xl font-black text-brand-dark">{acceso.titulo}</h2>
              <p className="mt-2 text-sm text-brand-dark/80">{acceso.descripcion}</p>
              <TransitionLink
                href={acceso.href}
                className="mt-4 inline-flex rounded-full bg-brand-main px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft"
              >
                {acceso.cta}
              </TransitionLink>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
