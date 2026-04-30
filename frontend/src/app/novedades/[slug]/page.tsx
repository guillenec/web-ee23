import { notFound } from "next/navigation";

import { NovedadDetalleClient } from "@/components/novedad-detalle-client";
import { getNovedadPublicadaPorSlugServer } from "@/lib/server/novedades-public";

type PageProps = {
  params: Promise<{ slug: string }>;
};

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
