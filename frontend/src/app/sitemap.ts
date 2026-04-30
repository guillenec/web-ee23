import type { MetadataRoute } from "next";

import { getTodasNovedadesPublicadasServer } from "@/lib/server/novedades-public";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.escuelaespecial23.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const novedades = await getTodasNovedadesPublicadasServer();

  const urlsNovedades: MetadataRoute.Sitemap = novedades.map((novedad) => {
    const slug = encodeURIComponent(novedad.slug || novedad.id);
    const lastModified = novedad.fecha ? new Date(novedad.fecha) : now;

    return {
      url: `${siteUrl}/novedades/${slug}`,
      lastModified: Number.isNaN(lastModified.getTime()) ? now : lastModified,
      changeFrequency: "weekly",
      priority: 0.75,
    };
  });

  return [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/novedades`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/galeria`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/sobre-nosotros`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contacto`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...urlsNovedades,
  ];
}
