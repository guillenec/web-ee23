import { notFound } from "next/navigation";

import { NovedadDetalleClient } from "@/components/novedad-detalle-client";
import { getNovedadPublicadaPorSlug } from "@/lib/novedades";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function NovedadDetallePage({ params }: PageProps) {
  const resolved = await params;
  const slug = decodeURIComponent(resolved.slug ?? "").trim();

  if (!slug) {
    notFound();
  }

  const novedad = await getNovedadPublicadaPorSlug(slug);
  if (!novedad) {
    notFound();
  }

  return <NovedadDetalleClient novedad={novedad} slug={slug} />;
}
