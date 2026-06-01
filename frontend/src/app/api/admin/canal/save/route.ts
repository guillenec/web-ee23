import { NextResponse, type NextRequest } from "next/server";

import { slugDesdeTexto } from "@/lib/canal";
import { assertAdminRequest } from "@/lib/server/admin-request";
import { getAdminDb } from "@/lib/server/firebase-admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { email } = await assertAdminRequest(request);

    const body = (await request.json()) as {
      titulo?: string;
      subtitulo?: string;
      descripcion?: string;
      hashtags?: string[];
      youtubeVideoId?: string;
      youtubeUrl?: string;
      thumbnailUrl?: string;
      estado?: string;
    };

    const titulo = String(body.titulo ?? "").trim();
    const youtubeVideoId = String(body.youtubeVideoId ?? "").trim();
    const youtubeUrl = String(body.youtubeUrl ?? "").trim();

    if (!titulo) {
      return NextResponse.json({ error: "El titulo es obligatorio" }, { status: 400 });
    }

    if (!youtubeVideoId || !youtubeUrl) {
      return NextResponse.json({ error: "Falta informacion del video subido" }, { status: 400 });
    }

    const hashtags = Array.isArray(body.hashtags)
      ? body.hashtags.map((item) => String(item).trim()).filter(Boolean)
      : [];

    const estado = body.estado === "publicado" ? "publicado" : "pendiente";
    const slugBase = slugDesdeTexto(titulo) || `video-${Date.now()}`;
    const id = `${slugBase}-${Date.now()}`;
    const nowIso = new Date().toISOString();

    await getAdminDb().collection("canalVideos").doc(id).set({
      slug: slugBase,
      titulo,
      subtitulo: String(body.subtitulo ?? "").trim(),
      descripcion: String(body.descripcion ?? "").trim(),
      hashtags,
      youtubeVideoId,
      youtubeUrl,
      thumbnailUrl: String(body.thumbnailUrl ?? "").trim(),
      estado,
      autorEmail: email,
      createdAt: nowIso,
      updatedAt: nowIso,
    });

    return NextResponse.json({ ok: true, id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo guardar canalVideos";
    const status = message.includes("autoriz") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
