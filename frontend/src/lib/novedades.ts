import {
  Timestamp,
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type Novedad = {
  id: string;
  titulo: string;
  slug: string;
  categoria: string;
  autor: string;
  resumen: string;
  contenido: string;
  imagenPrincipal: string;
  imagenPrincipalPublicId?: string;
  galeria: string[];
  galeriaPublicIds?: string[];
  fecha: string;
  estado: "pendiente" | "publicado";
};

type NovedadFirestore = {
  titulo?: string;
  slug?: string;
  categoria?: string;
  autor?: string;
  resumen?: string;
  contenido?: string;
  imagenPrincipal?: string;
  imagenPrincipalPublicId?: string;
  galeria?: string[];
  galeriaPublicIds?: string[];
  fecha?: Timestamp | string;
  fechaPublicacion?: Timestamp | string;
  estado?: "pendiente" | "publicado" | "borrador";
};

const NOVEDADES_CACHE_TTL_MS = 60_000;

let novedadesCache: { value: Novedad[]; loadedAt: number } | null = null;

const toIsoDate = (value: Timestamp | string | undefined): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.toDate().toISOString();
};

const mapNovedad = (id: string, data: NovedadFirestore): Novedad => {
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
    imagenPrincipalPublicId: data.imagenPrincipalPublicId,
    galeria: data.galeria ?? [],
    galeriaPublicIds: data.galeriaPublicIds ?? [],
    fecha,
    estado: data.estado === "publicado" ? "publicado" : "pendiente",
  };
};

export const getNovedadesPublicadas = async (
  cantidad = 3,
): Promise<Novedad[]> => {
  if (novedadesCache && Date.now() - novedadesCache.loadedAt < NOVEDADES_CACHE_TTL_MS) {
    return novedadesCache.value.slice(0, cantidad);
  }

  const ref = collection(db, "novedades");
  const q = query(ref, where("estado", "==", "publicado"), limit(24));
  const snapshot = await getDocs(q);

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
};

export const getNovedadPublicadaPorSlug = async (slug: string): Promise<Novedad | null> => {
  const ref = collection(db, "novedades");
  const q = query(ref, where("estado", "==", "publicado"), limit(48));
  const snapshot = await getDocs(q);

  const normalizado = decodeURIComponent(slug).trim().toLowerCase();
  const match = snapshot.docs
    .map((doc) => mapNovedad(doc.id, doc.data() as NovedadFirestore))
    .filter((item) => item.estado === "publicado")
    .find((novedad) => {
      return novedad.slug.trim().toLowerCase() === normalizado || novedad.id.trim().toLowerCase() === normalizado;
    });

  return match ?? null;
};
