import { NextResponse, type NextRequest } from "next/server";

import { assertAdminRequest } from "@/lib/server/admin-request";
import { collectCloudinaryPublicIds, deleteCloudinaryAssets } from "@/lib/server/cloudinary-admin";
import { getAdminDb } from "@/lib/server/firebase-admin";

export const runtime = "nodejs";

type NovedadDoc = {
  imagenPrincipal?: string;
  imagenPrincipalPublicId?: string;
  galeria?: string[];
  galeriaPublicIds?: string[];
};

export async function POST(request: NextRequest) {
  try {
    await assertAdminRequest(request);

    const body = (await request.json()) as { id?: string };
    const id = body.id?.trim();
    if (!id) {
      return NextResponse.json({ error: "Falta ID de novedad" }, { status: 400 });
    }

    const ref = getAdminDb().collection("novedades").doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ ok: true, alreadyDeleted: true });
    }

    const data = (snap.data() ?? {}) as NovedadDoc;
    const ids = collectCloudinaryPublicIds([
      data.imagenPrincipalPublicId,
      data.imagenPrincipal,
      ...(data.galeriaPublicIds ?? []),
      ...(data.galeria ?? []),
    ]);

    await deleteCloudinaryAssets(ids);
    await ref.delete();

    return NextResponse.json({ ok: true, deletedCloudinaryAssets: ids.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    const status = message.includes("autoriz") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
