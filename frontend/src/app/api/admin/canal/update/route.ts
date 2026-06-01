import { NextResponse, type NextRequest } from "next/server";

import { assertAdminRequest } from "@/lib/server/admin-request";
import { getAdminDb } from "@/lib/server/firebase-admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await assertAdminRequest(request);

    const body = (await request.json()) as {
      id?: string;
      titulo?: string;
      subtitulo?: string;
      descripcion?: string;
      hashtags?: string[];
      estado?: string;
    };

    const id = String(body.id ?? "").trim();
    if (!id) {
      return NextResponse.json({ error: "Falta id" }, { status: 400 });
    }

    const titulo = String(body.titulo ?? "").trim();
    if (!titulo) {
      return NextResponse.json({ error: "El titulo es obligatorio" }, { status: 400 });
    }

    const hashtags = Array.isArray(body.hashtags)
      ? body.hashtags.map((item) => String(item).trim()).filter(Boolean)
      : [];

    await getAdminDb().collection("canalVideos").doc(id).set(
      {
        titulo,
        subtitulo: String(body.subtitulo ?? "").trim(),
        descripcion: String(body.descripcion ?? "").trim(),
        hashtags,
        estado: body.estado === "publicado" ? "publicado" : "pendiente",
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo actualizar canalVideos";
    const status = message.includes("autoriz") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
