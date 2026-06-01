import { NextResponse, type NextRequest } from "next/server";

import { assertAdminRequest } from "@/lib/server/admin-request";
import { getAdminDb } from "@/lib/server/firebase-admin";
import { deleteYouTubeVideo } from "@/lib/server/youtube-admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await assertAdminRequest(request);

    const body = (await request.json()) as { id?: string };
    const id = String(body.id ?? "").trim();
    if (!id) {
      return NextResponse.json({ error: "Falta id" }, { status: 400 });
    }

    const ref = getAdminDb().collection("canalVideos").doc(id);
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      return NextResponse.json({ ok: true, alreadyDeleted: true });
    }

    const data = snapshot.data() as { youtubeVideoId?: string };
    const youtubeVideoId = String(data.youtubeVideoId ?? "").trim();

    let youtubeDeleteWarning = "";
    if (youtubeVideoId) {
      try {
        await deleteYouTubeVideo(youtubeVideoId);
      } catch (error) {
        youtubeDeleteWarning =
          error instanceof Error ? error.message : "No se pudo eliminar el video en YouTube";
      }
    }

    await ref.delete();

    return NextResponse.json({
      ok: true,
      youtubeDeleteWarning: youtubeDeleteWarning || undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo eliminar canalVideos";
    const status = message.includes("autoriz") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
