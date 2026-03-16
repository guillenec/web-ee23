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
  const q = query(ref, where("estado", "==", "publicado"), limit(Math.max(cantidad * 3, 12)));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => {
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
    })
    .sort((a, b) => {
      if (!a.fecha && !b.fecha) return 0;
      if (!a.fecha) return 1;
      if (!b.fecha) return -1;

      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
    })
    .slice(0, cantidad);
};
