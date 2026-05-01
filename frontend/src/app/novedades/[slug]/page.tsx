import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NovedadDetalleClient } from "@/components/novedad-detalle-client";
import { getNovedadPublicadaPorSlugServer } from "@/lib/server/novedades-public";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.escuelaespecial23.com";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const slug = decodeURIComponent(resolved.slug ?? "").trim();

  if (!slug) {
    return {
      title: "Novedad",
    };
  }

  const novedad = await getNovedadPublicadaPorSlugServer(slug);
  if (!novedad) {
    return {
      title: "Novedad no encontrada",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = novedad.titulo || "Novedad institucional";
  const description = novedad.resumen || "Novedad institucional de la Escuela Especial N 23.";
  const canonicalSlug = encodeURIComponent(novedad.slug || novedad.id || slug);
  const canonicalUrl = `${siteUrl}/novedades/${canonicalSlug}`;
  const image = novedad.imagenPrincipal || "/assets/images/hero-frente.jpg";

  return {
    title,
    description,
    alternates: {
      canonical: `/novedades/${canonicalSlug}`,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: image,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function NovedadDetallePage({ params }: PageProps) {
  const resolved = await params;
  const slug = decodeURIComponent(resolved.slug ?? "").trim();

  if (!slug) {
    notFound();
  }

  const novedad = await getNovedadPublicadaPorSlugServer(slug);
  if (!novedad) {
    notFound();
  }

  return <NovedadDetalleClient novedad={novedad} slug={slug} />;
}
