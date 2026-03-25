import { NextResponse, type NextRequest } from "next/server";

import { assertAdminRequest } from "@/lib/server/admin-request";
import { startYouTubeResumableUpload } from "@/lib/server/youtube-admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await assertAdminRequest(request);

    const body = (await request.json()) as {
      titulo?: string;
      descripcion?: string;
      privacidad?: string;
      contentType?: string;
      contentLength?: number;
    };

    const titulo = String(body.titulo ?? "Video institucional").trim();
    const descripcion = String(body.descripcion ?? "").trim();
    const privacidadRaw = String(body.privacidad ?? "unlisted").trim().toLowerCase();
    const privacidad = privacidadRaw === "public" || privacidadRaw === "private" ? privacidadRaw : "unlisted";
    const contentType = String(body.contentType ?? "video/mp4").trim();
    const contentLength = Number(body.contentLength ?? 0);

    if (!contentType.startsWith("video/")) {
      return NextResponse.json({ error: "El archivo debe ser un video valido" }, { status: 400 });
    }

    if (!Number.isFinite(contentLength) || contentLength <= 0) {
      return NextResponse.json({ error: "Falta tamano valido del archivo" }, { status: 400 });
    }

    const uploadUrl = await startYouTubeResumableUpload({
      title: titulo || "Video institucional",
      description: descripcion,
      privacyStatus: privacidad,
      contentType,
      contentLength,
    });

    return NextResponse.json({ ok: true, uploadUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo subir video a YouTube";
    const status = message.includes("autoriz") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
