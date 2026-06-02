import { ArrowRight, FilePenLine, ListChecks } from "lucide-react";

import { TransitionLink } from "@/components/transition-link";

const accesos = [
  {
    href: "/admin/novedades/crear",
    titulo: "Crear novedad",
    descripcion: "Formulario dedicado para cargar una publicacion nueva en Firebase.",
    cta: "Ir a crear",
    tonos: "border-brand-main/25 bg-brand-main/5",
    icon: FilePenLine,
  },
  {
    href: "/admin/novedades/ver",
    titulo: "Ver novedades",
    descripcion: "Listado completo de pendientes y publicadas con acciones de estado.",
    cta: "Ir a ver",
    tonos: "border-emerald-300/60 bg-emerald-50/60",
    icon: ListChecks,
  },
];

export default function AdminNovedadesIndexPage() {
  return (
    <main className="admin-shell page-enter px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="admin-hero rounded-3xl p-6 sm:p-8">
          <p className="admin-kicker">Modulo de novedades</p>
          <h1 className="mt-2 text-3xl leading-tight font-black text-brand-dark sm:text-5xl">Flujo editorial claro</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-brand-dark/80 sm:text-base">
            Separamos la carga y la gestion para que el panel sea mas claro: crear en una ruta y revisar/publicar en otra.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {accesos.map((acceso) => {
            const Icon = acceso.icon;

            return (
              <article key={acceso.href} className={`admin-card rounded-3xl border p-6 ${acceso.tonos}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-brand-dark">{acceso.titulo}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-brand-dark/80">{acceso.descripcion}</p>
                  </div>
                  <span className="rounded-2xl border border-brand-dark/10 bg-white/70 p-3 text-brand-main">
                    <Icon className="h-6 w-6" />
                  </span>
                </div>
                <TransitionLink href={acceso.href} className="admin-primary-btn mt-5 px-4 py-2 text-sm">
                  {acceso.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </TransitionLink>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
