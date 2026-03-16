"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { fotosGaleria } from "@/lib/galeria";

const filtros = ["Todas", "Aulas", "Territorio", "Actos"] as const;
type Filtro = (typeof filtros)[number];

export default function GaleriaPage() {
  const [filtro, setFiltro] = useState<Filtro>("Todas");

  const fotos = useMemo(() => {
    if (filtro === "Todas") return fotosGaleria;
    return fotosGaleria.filter((foto) => foto.categoria === filtro);
  }, [filtro]);

  return (
    <main className="page-enter bg-[radial-gradient(circle_at_0%_0%,#c5e4e7_0%,#f6f2ee_45%,#f6f2ee_100%)] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-7">
        <section data-reveal className="rounded-3xl border border-brand-dark/10 bg-surface p-6 sm:p-8">
          <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Galeria institucional</p>
          <h1 className="mt-2 text-3xl font-black text-brand-dark sm:text-4xl">
            Imagenes del trabajo pedagogico y comunitario
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-brand-dark/80 sm:text-base">
            Registro visual de propuestas de aula, actividades territoriales y actos que forman parte de
            la vida institucional de la Escuela Especial N 23.
          </p>
        </section>

        <section data-reveal className="flex flex-wrap gap-2">
          {filtros.map((opcion) => (
            <button
              key={opcion}
              type="button"
              onClick={() => setFiltro(opcion)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filtro === opcion
                  ? "bg-brand-main text-white"
                  : "border border-brand-dark/15 bg-surface text-brand-dark hover:bg-brand-dark/5"
              }`}
            >
              {opcion}
            </button>
          ))}
        </section>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {fotos.map((foto) => (
            <article
              key={foto.id}
              data-reveal
              className="card-lift overflow-hidden rounded-2xl border border-brand-dark/10 bg-surface shadow-[0_8px_20px_rgba(75,56,49,0.08)]"
            >
              <Image
                src={foto.src}
                alt={foto.titulo}
                width={1000}
                height={700}
                className="h-52 w-full object-cover"
              />
              <div className="space-y-2 p-4">
                <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">{foto.categoria}</p>
                <h2 className="text-lg font-extrabold text-brand-dark">{foto.titulo}</h2>
                <p className="text-sm text-brand-dark/80">{foto.descripcion}</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
