import type { Timestamp } from "firebase-admin/firestore";

import type { Novedad } from "@/lib/novedades";
import { getAdminDb } from "@/lib/server/firebase-admin";

type NovedadFirestore = {
  titulo?: string;
  slug?: string;
  categoria?: string;
  autor?: string;
  resumen?: string;
  contenido?: string;
  imagenPrincipal?: string;
  videoUrl?: string;
  youtubeVideoId?: string;
  imagenPrincipalPublicId?: string;
  galeria?: string[];
  galeriaPublicIds?: string[];
  fecha?: Timestamp | string;
  fechaPublicacion?: Timestamp | string;
  estado?: "pendiente" | "publicado" | "borrador";
};

const NOVEDADES_CACHE_TTL_MS = 60_000;

let novedadesCache: { value: Novedad[]; loadedAt: number } | null = null;

function toIsoDate(value: Timestamp | string | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.toDate().toISOString();
}

function mapNovedad(id: string, data: NovedadFirestore): Novedad {
  const fecha = toIsoDate(data.fecha) || toIsoDate(data.fechaPublicacion);

  return {
    id,
    titulo: data.titulo ?? "Sin titulo",
    slug: data.slug ?? id,
    categoria: data.categoria ?? "General",
    autor: data.autor ?? "Equipo institucional",
    resumen: data.resumen ?? "",
    contenido: data.contenido ?? "",
    imagenPrincipal: data.imagenPrincipal ?? "",
    videoUrl: data.videoUrl?.trim() || "",
    youtubeVideoId: data.youtubeVideoId?.trim() || "",
    imagenPrincipalPublicId: data.imagenPrincipalPublicId,
    galeria: data.galeria ?? [],
    galeriaPublicIds: data.galeriaPublicIds ?? [],
    fecha,
    estado: data.estado === "publicado" ? "publicado" : "pendiente",
  };
}

export async function getNovedadesPublicadasServer(cantidad = 3): Promise<Novedad[]> {
  if (novedadesCache && Date.now() - novedadesCache.loadedAt < NOVEDADES_CACHE_TTL_MS) {
    return novedadesCache.value.slice(0, cantidad);
  }

  const snapshot = await getAdminDb()
    .collection("novedades")
    .where("estado", "==", "publicado")
    .limit(48)
    .get();

  const novedades = snapshot.docs
    .map((doc) => mapNovedad(doc.id, doc.data() as NovedadFirestore))
    .filter((item) => item.estado === "publicado")
    .sort((a, b) => {
      if (!a.fecha && !b.fecha) return 0;
      if (!a.fecha) return 1;
      if (!b.fecha) return -1;
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
    });

  novedadesCache = {
    value: novedades,
    loadedAt: Date.now(),
  };

  return novedades.slice(0, cantidad);
}

export async function getTodasNovedadesPublicadasServer(): Promise<Novedad[]> {
  if (novedadesCache && Date.now() - novedadesCache.loadedAt < NOVEDADES_CACHE_TTL_MS) {
    return novedadesCache.value;
  }

  await getNovedadesPublicadasServer(100);
  return novedadesCache?.value ?? [];
}

export async function getNovedadPublicadaPorSlugServer(slug: string): Promise<Novedad | null> {
  const normalizado = decodeURIComponent(slug).trim().toLowerCase();
  if (!normalizado) return null;

  const snapshot = await getAdminDb()
    .collection("novedades")
    .where("estado", "==", "publicado")
    .limit(80)
    .get();

  const match = snapshot.docs
    .map((doc) => mapNovedad(doc.id, doc.data() as NovedadFirestore))
    .find((novedad) => {
      return novedad.slug.trim().toLowerCase() === normalizado || novedad.id.trim().toLowerCase() === normalizado;
    });

  return match ?? null;
}
