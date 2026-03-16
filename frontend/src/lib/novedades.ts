import {
  Timestamp,
  collection,
  getDocs,
  limit,
  orderBy,
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
  galeria: string[];
  fecha: string;
  estado: "borrador" | "publicado";
};

type NovedadFirestore = {
  titulo?: string;
  slug?: string;
  categoria?: string;
  autor?: string;
  resumen?: string;
  contenido?: string;
  imagenPrincipal?: string;
  galeria?: string[];
  fecha?: Timestamp | string;
  fechaPublicacion?: Timestamp | string;
  estado?: "borrador" | "publicado";
};

const toIsoDate = (value: Timestamp | string | undefined): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.toDate().toISOString();
};

export const getNovedadesPublicadas = async (
  cantidad = 3,
): Promise<Novedad[]> => {
  const ref = collection(db, "novedades");
  const qFecha = query(ref, where("estado", "==", "publicado"), orderBy("fecha", "desc"), limit(cantidad));
  const qFechaPublicacion = query(
    ref,
    where("estado", "==", "publicado"),
    orderBy("fechaPublicacion", "desc"),
    limit(cantidad),
  );

  let snapshot;

  try {
    snapshot = await getDocs(qFecha);
  } catch {
    snapshot = await getDocs(qFechaPublicacion);
  }

  return snapshot.docs.map((doc) => {
    const data = doc.data() as NovedadFirestore;
    const fecha = toIsoDate(data.fecha) || toIsoDate(data.fechaPublicacion);

    return {
      id: doc.id,
      titulo: data.titulo ?? "Sin titulo",
      slug: data.slug ?? doc.id,
      categoria: data.categoria ?? "General",
      autor: data.autor ?? "Equipo institucional",
      resumen: data.resumen ?? "",
      contenido: data.contenido ?? "",
      imagenPrincipal: data.imagenPrincipal ?? "",
      galeria: data.galeria ?? [],
      fecha,
      estado: data.estado ?? "borrador",
    };
  });
};
