import { NextResponse, type NextRequest } from "next/server";

import { assertAdminRequest } from "@/lib/server/admin-request";
import { getAdminDb } from "@/lib/server/firebase-admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await assertAdminRequest(request);

    const body = (await request.json()) as { id?: string; estado?: string };
    const id = String(body.id ?? "").trim();
    const estado = body.estado === "publicado" ? "publicado" : "pendiente";

    if (!id) {
      return NextResponse.json({ error: "Falta id de video" }, { status: 400 });
    }

    await getAdminDb().collection("canalVideos").doc(id).set(
      {
        estado,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo cambiar estado";
    const status = message.includes("autoriz") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
