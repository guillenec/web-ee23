import { Timestamp } from "firebase-admin/firestore";
import { NextResponse, type NextRequest } from "next/server";

import { assertAdminRequest } from "@/lib/server/admin-request";
import { getAdminDb } from "@/lib/server/firebase-admin";

export const runtime = "nodejs";

type Payload = {
  id?: string;
  titulo?: string;
  slug?: string;
  categoria?: string;
  autor?: string;
  resumen?: string;
  contenido?: string;
  imagenPrincipal?: string;
  videoUrl?: string;
  fecha?: string;
  estado?: "publicado" | "pendiente";
};

export async function POST(request: NextRequest) {
  try {
    await assertAdminRequest(request);

    const body = (await request.json()) as Payload;
    const id = (body.id ?? "").trim();
    if (!id) {
      return NextResponse.json({ error: "Falta id de novedad" }, { status: 400 });
    }

    const titulo = (body.titulo ?? "").trim();
    const slug = (body.slug ?? "").trim();
    const resumen = (body.resumen ?? "").trim();
    const contenido = (body.contenido ?? "").trim();
    const categoria = (body.categoria ?? "").trim();
    const autor = (body.autor ?? "").trim();
    const imagenPrincipal = (body.imagenPrincipal ?? "").trim();
    const videoUrl = (body.videoUrl ?? "").trim();
    const fecha = (body.fecha ?? "").trim();
    const estado = body.estado;

    if (!titulo || !slug || !resumen || !contenido || !categoria || !autor || !imagenPrincipal) {
      return NextResponse.json({ error: "Completa todos los campos obligatorios" }, { status: 400 });
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: "El slug solo puede tener minusculas, numeros y guiones" }, { status: 400 });
    }

    if (estado && estado !== "publicado" && estado !== "pendiente") {
      return NextResponse.json({ error: "Estado no valido" }, { status: 400 });
    }

    const patch: Record<string, unknown> = {
      titulo,
      slug,
      resumen,
      contenido,
      categoria,
      autor,
      imagenPrincipal,
      videoUrl,
      actualizadoEn: Timestamp.now(),
    };

    if (fecha) {
      patch.fecha = Timestamp.fromDate(new Date(`${fecha}T12:00:00`));
    }

    if (estado) {
      patch.estado = estado;
    }

    await getAdminDb().collection("novedades").doc(id).set(patch, { merge: true });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    const status = message.includes("autoriz") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
