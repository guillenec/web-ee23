"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { TransitionLink } from "@/components/transition-link";
import { getNovedadPublicadaPorSlug, type Novedad } from "@/lib/novedades";
import { toYouTubeEmbedUrl } from "@/lib/youtube";

export default function NovedadDetallePage() {
  const params = useParams<{ slug: string }>();
  const slug = useMemo(() => (params?.slug ? String(params.slug) : ""), [params]);

  const [novedad, setNovedad] = useState<Novedad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagenActiva, setImagenActiva] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      if (!slug) {
        setError("Novedad no encontrada.");
        setLoading(false);
        return;
      }

      try {
        const data = await getNovedadPublicadaPorSlug(slug);
        setNovedad(data);
      } catch {
        setError("No se pudo cargar la novedad.");
      } finally {
        setLoading(false);
      }
    };

    void cargar();
  }, [slug]);

  useEffect(() => {
    if (!imagenActiva) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setImagenActiva(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [imagenActiva]);

  const imagenesGaleria = useMemo(() => {
    if (!novedad) return [];
    return (novedad.galeria ?? []).map((item) => item.trim()).filter(Boolean);
  }, [novedad]);

  const videoEmbedUrl = useMemo(() => {
    if (!novedad) return null;

    if (novedad.videoUrl) {
      return toYouTubeEmbedUrl(novedad.videoUrl);
    }

    if (novedad.youtubeVideoId) {
      return `https://www.youtube.com/embed/${novedad.youtubeVideoId}`;
    }

    return null;
  }, [novedad]);

  return (
    <main className="page-enter min-h-[60vh] bg-app">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-5 py-10 sm:px-8">
        <TransitionLink
          href="/novedades"
          className="w-fit rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
        >
          Volver a novedades
        </TransitionLink>

        {loading ? (
          <div className="rounded-3xl border border-brand-dark/10 bg-surface p-6 shadow-[0_10px_26px_rgba(75,56,49,0.10)] sm:p-8">
            <div className="h-56 animate-pulse rounded-2xl bg-brand-dark/10 sm:h-72" />
            <div className="mt-6 h-3 w-24 animate-pulse rounded bg-brand-dark/10" />
            <div className="mt-4 h-8 w-4/5 animate-pulse rounded bg-brand-dark/10" />
            <div className="mt-3 h-4 w-2/5 animate-pulse rounded bg-brand-dark/10" />
            <div className="mt-8 space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-brand-dark/10" />
              <div className="h-4 w-full animate-pulse rounded bg-brand-dark/10" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-brand-dark/10" />
            </div>
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-2xl border border-brand-main/30 bg-brand-main/5 p-6 text-sm text-brand-dark">
            {error}
          </div>
        ) : null}

        {!loading && !error && !novedad ? (
          <div className="rounded-2xl border border-brand-dark/10 bg-surface p-6 text-sm text-brand-dark/80">
            No se encontro la novedad solicitada.
          </div>
        ) : null}

        {novedad ? (
          <article data-reveal className="rounded-3xl border border-brand-dark/10 bg-surface p-6 shadow-[0_10px_26px_rgba(75,56,49,0.10)] sm:p-8">
            {novedad.imagenPrincipal ? (
              <Image
                src={novedad.imagenPrincipal}
                alt={novedad.titulo}
                width={1300}
                height={780}
                className="mb-6 h-[260px] w-full rounded-2xl object-cover sm:h-[360px]"
                style={{ viewTransitionName: `novedad-${slug.replace(/[^a-zA-Z0-9_-]/g, "-")}` }}
                priority
              />
            ) : null}

            <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">{novedad.categoria}</p>
            <h1 className="mt-3 text-3xl leading-tight font-black text-brand-dark sm:text-4xl">
              {novedad.titulo}
            </h1>
            <p className="mt-4 text-sm text-brand-dark/70">
              {novedad.autor}
              {novedad.fecha
                ? ` - ${new Date(novedad.fecha).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}`
                : ""}
            </p>

            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-brand-dark/85">
              {novedad.resumen ? <p className="font-semibold text-brand-dark/90">{novedad.resumen}</p> : null}
              {novedad.contenido ? (
                <p className="whitespace-pre-line">{novedad.contenido}</p>
              ) : (
                <p>Sin contenido ampliado para esta novedad.</p>
              )}
            </div>

            {videoEmbedUrl ? (
              <section className="mt-8 space-y-3">
                <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Video relacionado</p>
                <div className="overflow-hidden rounded-2xl border border-brand-dark/10 bg-black shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
                  <div className="relative aspect-video w-full">
                    <iframe
                      src={videoEmbedUrl}
                      title={`Video de ${novedad.titulo}`}
                      className="h-full w-full"
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
              </section>
            ) : null}

            {imagenesGaleria.length ? (
              <section className="mt-8 space-y-3">
                <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Galeria de la novedad</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {imagenesGaleria.map((imagen, idx) => (
                    <button
                      key={`${imagen}-${idx}`}
                      type="button"
                      onClick={() => setImagenActiva(imagen)}
                      className="overflow-hidden rounded-xl border border-brand-dark/10"
                      aria-label={`Ampliar imagen ${idx + 1}`}
                    >
                      <Image
                        src={imagen}
                        alt={`${novedad.titulo} - imagen ${idx + 1}`}
                        width={900}
                        height={700}
                        className="h-44 w-full object-cover transition hover:scale-[1.02]"
                      />
                    </button>
                  ))}
                </div>
              </section>
            ) : null}
          </article>
        ) : null}
      </div>

      {imagenActiva ? (
        <div
          className="lightbox-fade fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-[2px]"
          onClick={() => setImagenActiva(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Imagen ampliada"
        >
          <div
            className="lightbox-zoom relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-[0_24px_50px_rgba(0,0,0,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setImagenActiva(null)}
              className="absolute top-3 right-3 z-10 rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white transition hover:bg-black/75"
            >
              Cerrar
            </button>
            <div className="relative h-[62vh] min-h-[280px] w-full">
              <Image src={imagenActiva} alt="Imagen de novedad" fill className="object-contain" />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
