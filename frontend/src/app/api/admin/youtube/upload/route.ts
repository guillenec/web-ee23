import { NextResponse, type NextRequest } from "next/server";

import { assertAdminRequest } from "@/lib/server/admin-request";
import { uploadVideoToYouTube } from "@/lib/server/youtube-admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await assertAdminRequest(request);

    const formData = await request.formData();
    const file = formData.get("file");
    const titulo = String(formData.get("titulo") ?? "Video institucional").trim();
    const descripcion = String(formData.get("descripcion") ?? "").trim();
    const privacidadRaw = String(formData.get("privacidad") ?? "unlisted").trim().toLowerCase();
    const privacidad = privacidadRaw === "public" || privacidadRaw === "private" ? privacidadRaw : "unlisted";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Falta archivo de video" }, { status: 400 });
    }

    if (!file.type.startsWith("video/")) {
      return NextResponse.json({ error: "El archivo debe ser un video valido" }, { status: 400 });
    }

    const upload = await uploadVideoToYouTube({
      file,
      title: titulo || "Video institucional",
      description: descripcion,
      privacyStatus: privacidad,
    });

    return NextResponse.json({ ok: true, ...upload });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo subir video a YouTube";
    const status = message.includes("autoriz") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
