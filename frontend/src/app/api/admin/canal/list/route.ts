import { NextResponse, type NextRequest } from "next/server";

import { assertAdminRequest } from "@/lib/server/admin-request";
import { getAdminDb } from "@/lib/server/firebase-admin";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await assertAdminRequest(request);

    const snapshot = await getAdminDb().collection("canalVideos").limit(300).get();
    const items = snapshot.docs
      .map((doc) => {
        const data = doc.data() as {
          titulo?: string;
          subtitulo?: string;
          descripcion?: string;
          hashtags?: string[];
          youtubeVideoId?: string;
          estado?: "pendiente" | "publicado";
          youtubeUrl?: string;
          thumbnailUrl?: string;
          createdAt?: { toDate?: () => Date } | string;
        };

        const createdAtIso =
          typeof data.createdAt === "string"
            ? data.createdAt
            : data.createdAt?.toDate
              ? data.createdAt.toDate().toISOString()
              : "";

        return {
          id: doc.id,
          titulo: data.titulo ?? "Sin titulo",
          subtitulo: data.subtitulo ?? "",
          descripcion: data.descripcion ?? "",
          hashtags: Array.isArray(data.hashtags)
            ? data.hashtags.map((tag) => String(tag).trim()).filter(Boolean)
            : [],
          youtubeVideoId: data.youtubeVideoId ?? "",
          estado: data.estado === "publicado" ? "publicado" : "pendiente",
          youtubeUrl: data.youtubeUrl ?? "",
          thumbnailUrl: data.thumbnailUrl ?? "",
          createdAt: createdAtIso,
        };
      })
      .sort((a, b) => {
        if (!a.createdAt && !b.createdAt) return 0;
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    return NextResponse.json({ ok: true, items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo listar canalVideos";
    const status = message.includes("autoriz") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
