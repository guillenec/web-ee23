import { Timestamp, collection, getDocs, limit, query, where } from "firebase/firestore";

import { db } from "@/lib/firebase";

export const categoriasGaleria = ["Aulas", "Territorio", "Actos"] as const;
export type CategoriaGaleria = (typeof categoriasGaleria)[number];

export type FotoGaleria = {
  id: string;
  titulo: string;
  categoria: CategoriaGaleria;
  descripcion: string;
  src: string;
  fecha: string;
  visible: boolean;
};

type FotoGaleriaFirestore = {
  titulo?: string;
  categoria?: string;
  descripcion?: string;
  src?: string;
  urlImagen?: string;
  usImagen?: string;
  fecha?: Timestamp | string;
  visible?: boolean;
};

export const fotosGaleria: FotoGaleria[] = [
  {
    id: "aula-jardin",
    titulo: "Propuestas en primera infancia",
    categoria: "Aulas",
    descripcion: "Actividades de juego y estimulacion en espacios pedagogicos cuidados.",
    src: "/assets/images/alumnos-jardin.jpg",
    fecha: "",
    visible: true,
  },
  {
    id: "jornada-vial",
    titulo: "Aprendizaje para la vida diaria",
    categoria: "Territorio",
    descripcion: "Jornadas de educacion vial y autonomia con estudiantes y familias.",
    src: "/assets/images/educacion-vial.jpg",
    fecha: "",
    visible: true,
  },
  {
    id: "acto-institucional",
    titulo: "Celebraciones institucionales",
    categoria: "Actos",
    descripcion: "Actos escolares como espacios de encuentro y pertenencia comunitaria.",
    src: "/assets/images/acto-tradicion.jpg",
    fecha: "",
    visible: true,
  },
  {
    id: "frente-escuela",
    titulo: "Escuela en Ingeniero Jacobacci",
    categoria: "Territorio",
    descripcion: "Sede institucional de referencia para comunidades de Region Sur.",
    src: "/assets/images/hero-frente.jpg",
    fecha: "",
    visible: true,
  },
];

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
  };
}

export async function getFotosGaleriaPublicas(): Promise<FotoGaleria[]> {
  const ref = collection(db, "galeria");
  const q = query(ref, where("visible", "==", true), limit(120));
  const snapshot = await getDocs(q);

  const fotos = snapshot.docs
    .map((doc) => mapFotoGaleria(doc.id, doc.data() as FotoGaleriaFirestore))
    .filter((foto) => Boolean(foto.src))
    .sort((a, b) => {
      if (!a.fecha && !b.fecha) return 0;
      if (!a.fecha) return 1;
      if (!b.fecha) return -1;
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
    });

  return fotos;
}
