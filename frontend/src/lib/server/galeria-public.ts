import type { Timestamp } from "firebase-admin/firestore";

import type { CategoriaGaleria, FotoGaleria } from "@/lib/galeria";
import { getAdminDb } from "@/lib/server/firebase-admin";

type FotoGaleriaFirestore = {
  titulo?: string;
  categoria?: string;
  descripcion?: string;
  src?: string;
  urlImagen?: string;
  usImagen?: string;
  publicId?: string;
  fecha?: Timestamp | string;
  visible?: boolean;
};

const GALERIA_CACHE_TTL_MS = 60_000;

let galeriaCache: { value: FotoGaleria[]; loadedAt: number } | null = null;

function toIsoDate(value: Timestamp | string | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.toDate().toISOString();
}

function toCategoria(value: string | undefined): CategoriaGaleria {
  const normalizado = (value ?? "").trim().toLowerCase();
  if (normalizado === "aulas") return "Aulas";
  if (normalizado === "territorio") return "Territorio";
  if (normalizado === "actos") return "Actos";
  if (normalizado === "talleres") return "Talleres";
  if (normalizado === "familias") return "Familias";
  if (normalizado === "salidas") return "Salidas";
  return "Territorio";
}

function mapFotoGaleria(id: string, data: FotoGaleriaFirestore): FotoGaleria {
  return {
    id,
    titulo: data.titulo ?? "Sin titulo",
    categoria: toCategoria(data.categoria),
    descripcion: data.descripcion ?? "",
    src: data.src ?? data.urlImagen ?? data.usImagen ?? "",
    fecha: toIsoDate(data.fecha),
    visible: data.visible ?? true,
    publicId: data.publicId,
  };
}

export async function getFotosGaleriaPublicasServer(cantidad?: number): Promise<FotoGaleria[]> {
  if (galeriaCache && Date.now() - galeriaCache.loadedAt < GALERIA_CACHE_TTL_MS) {
    return typeof cantidad === "number" ? galeriaCache.value.slice(0, cantidad) : galeriaCache.value;
  }

  const snapshot = await getAdminDb()
    .collection("galeria")
    .where("visible", "==", true)
    .limit(160)
    .get();

  const fotos = snapshot.docs
    .map((doc) => mapFotoGaleria(doc.id, doc.data() as FotoGaleriaFirestore))
    .filter((foto) => Boolean(foto.src))
    .sort((a, b) => {
      if (!a.fecha && !b.fecha) return 0;
      if (!a.fecha) return 1;
      if (!b.fecha) return -1;
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
    });

  galeriaCache = {
    value: fotos,
    loadedAt: Date.now(),
  };

  return typeof cantidad === "number" ? fotos.slice(0, cantidad) : fotos;
}
