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
  resumen: string;
  fechaPublicacion: string;
  estado: "borrador" | "publicado";
};

type NovedadFirestore = {
  titulo?: string;
  resumen?: string;
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
  const q = query(
    ref,
    where("estado", "==", "publicado"),
    orderBy("fechaPublicacion", "desc"),
    limit(cantidad),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data() as NovedadFirestore;

    return {
      id: doc.id,
      titulo: data.titulo ?? "Sin titulo",
      resumen: data.resumen ?? "",
      fechaPublicacion: toIsoDate(data.fechaPublicacion),
      estado: data.estado ?? "borrador",
    };
  });
};
