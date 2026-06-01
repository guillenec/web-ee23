import type { Metadata } from "next";
import Link from "next/link";

import { TransitionLink } from "@/components/transition-link";
import { contactoInstitucional } from "@/lib/contacto";
import { CANAL_PAGE_SIZE, getCanalVideosPublicados } from "@/lib/server/canal-public";

export const metadata: Metadata = {
  title: "Canal YouTube",
  description:
    "Producciones audiovisuales de estudiantes y docentes de la Escuela Especial N 23, publicadas en nuestro canal de YouTube.",
  alternates: {
    canonical: "/canal",
  },
};

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function CanalPage({ searchParams }: Props) {
  const params = await searchParams;
  const pageFromQuery = Number(params.page ?? "1");
  const page = Number.isFinite(pageFromQuery) && pageFromQuery > 0 ? Math.floor(pageFromQuery) : 1;

  const { items, currentPage, totalPages, total } = await getCanalVideosPublicados(page, CANAL_PAGE_SIZE);

  return (
    <main className="page-enter bg-app px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section data-reveal className="rounded-3xl border border-brand-dark/10 bg-surface p-6 shadow-[0_12px_28px_rgba(75,56,49,0.08)] sm:p-8">
          <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Canal EE23</p>
          <h1 className="mt-2 text-3xl font-black text-brand-dark sm:text-4xl">Audiovisuales de estudiantes y docentes</h1>
          <p className="mt-3 max-w-3xl text-sm text-brand-dark/80 sm:text-base">
            Esta sección reúne producciones pedagógicas del canal, con material trabajado en clase y
            experiencias institucionales compartidas por la comunidad educativa.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={contactoInstitucional.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="chip-hover rounded-full border border-red-500/55 bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Ir al canal oficial
            </a>
            <TransitionLink
              href="/novedades"
              className="chip-hover rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
            >
              Ver novedades
            </TransitionLink>
          </div>
        </section>

        <section data-reveal className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-brand-dark">Videos publicados</h2>
            <p className="text-xs font-semibold tracking-[0.08em] text-brand-dark/70 uppercase">{total} en total</p>
          </div>

          {items.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((item) => (
                <article key={item.id} className="surface-hover overflow-hidden rounded-2xl border border-brand-dark/10 bg-surface shadow-[0_8px_20px_rgba(75,56,49,0.08)]">
                  <div className="relative aspect-video bg-brand-dark/15">
                    {item.youtubeVideoId ? (
                      <iframe
                        title={`Vista previa ${item.titulo}`}
                        src={`https://www.youtube.com/embed/${item.youtubeVideoId}`}
                        className="h-full w-full"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-brand-dark/60">
                        Sin vista previa disponible
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 p-4">
                    <h3 className="text-lg font-extrabold text-brand-dark">{item.titulo}</h3>
                    {item.subtitulo ? <p className="text-sm text-brand-dark/80">{item.subtitulo}</p> : null}
                    {item.hashtags.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {item.hashtags.map((tag) => (
                          <span key={`${item.id}-${tag}`} className="rounded-full border border-brand-dark/15 bg-white px-2 py-1 text-[11px] font-semibold text-brand-dark/75">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <a
                      href={item.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full border border-red-500/55 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                    >
                      Ver en YouTube
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-brand-dark/10 bg-surface p-6 text-sm text-brand-dark/80">
              Aun no hay videos publicados en esta sección.
            </div>
          )}
        </section>

        <section data-reveal className="flex items-center justify-center gap-2">
          <Link
            href={currentPage <= 1 ? "/canal" : `/canal?page=${currentPage - 1}`}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              currentPage <= 1
                ? "cursor-not-allowed border-brand-dark/10 text-brand-dark/35"
                : "border-brand-dark/20 text-brand-dark hover:bg-brand-dark hover:text-white"
            }`}
            aria-disabled={currentPage <= 1}
          >
            Anterior
          </Link>
          <p className="px-2 text-sm font-semibold text-brand-dark/80">
            Pagina {currentPage} de {totalPages}
          </p>
          <Link
            href={currentPage >= totalPages ? `/canal?page=${totalPages}` : `/canal?page=${currentPage + 1}`}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              currentPage >= totalPages
                ? "cursor-not-allowed border-brand-dark/10 text-brand-dark/35"
                : "border-brand-dark/20 text-brand-dark hover:bg-brand-dark hover:text-white"
            }`}
            aria-disabled={currentPage >= totalPages}
          >
            Siguiente
          </Link>
        </section>
      </div>
    </main>
  );
}
