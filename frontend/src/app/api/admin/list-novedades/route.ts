import { NextResponse, type NextRequest } from "next/server";

import { assertAdminRequest } from "@/lib/server/admin-request";
import { getAdminDb } from "@/lib/server/firebase-admin";

export const runtime = "nodejs";

type NovedadAdminDTO = {
  id: string;
  titulo: string;
  slug: string;
  categoria: string;
  autor: string;
  resumen: string;
  contenido: string;
  imagenPrincipal: string;
  imagenPrincipalPublicId: string;
  galeria: string[];
  galeriaPublicIds: string[];
  fecha: string;
  estado: "publicado" | "pendiente";
};

function toIsoDate(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;

  if (typeof value === "object" && value !== null && "toDate" in value) {
    const maybe = value as { toDate?: () => Date };
    if (typeof maybe.toDate === "function") {
      const date = maybe.toDate();
      if (!Number.isNaN(date.getTime())) {
        return date.toISOString();
      }
    }
  }

  return "";
}

export async function GET(request: NextRequest) {
  try {
    await assertAdminRequest(request);

    const snapshot = await getAdminDb().collection("novedades").limit(300).get();

    const items: NovedadAdminDTO[] = snapshot.docs
      .map((item) => {
        const data = item.data() as {
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
          fecha?: unknown;
          fechaPublicacion?: unknown;
          estado?: "publicado" | "pendiente" | "borrador";
        };

        const fecha = toIsoDate(data.fecha) || toIsoDate(data.fechaPublicacion);

        return {
          id: item.id,
          titulo: data.titulo ?? "Sin titulo",
          slug: data.slug ?? item.id,
          categoria: data.categoria ?? "General",
          autor: data.autor ?? "Equipo institucional",
          resumen: data.resumen ?? "",
          contenido: data.contenido ?? "",
          imagenPrincipal: data.imagenPrincipal ?? "",
          imagenPrincipalPublicId: data.imagenPrincipalPublicId ?? "",
          galeria: Array.isArray(data.galeria) ? data.galeria : [],
          galeriaPublicIds: Array.isArray(data.galeriaPublicIds) ? data.galeriaPublicIds : [],
          fecha,
          estado: data.estado === "publicado" ? "publicado" : "pendiente",
        } satisfies NovedadAdminDTO;
      })
      .sort((a, b) => {
        if (!a.fecha && !b.fecha) return 0;
        if (!a.fecha) return 1;
        if (!b.fecha) return -1;
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      });

    return NextResponse.json({ ok: true, items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    const status = message.includes("autoriz") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
