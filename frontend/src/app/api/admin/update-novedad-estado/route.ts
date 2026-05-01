import { Timestamp } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { assertAdminRequest } from "@/lib/server/admin-request";
import { getAdminDb } from "@/lib/server/firebase-admin";
import { invalidateNovedadesPublicCache } from "@/lib/server/novedades-public";

export const runtime = "nodejs";

type Payload = {
  id?: string;
  estado?: "publicado" | "pendiente";
};

export async function POST(request: NextRequest) {
  try {
    await assertAdminRequest(request);

    const body = (await request.json()) as Payload;
    const id = (body.id ?? "").trim();
    const estado = body.estado;

    if (!id) {
      return NextResponse.json({ error: "Falta id de novedad" }, { status: 400 });
    }

    if (estado !== "publicado" && estado !== "pendiente") {
      return NextResponse.json({ error: "Estado no valido" }, { status: 400 });
    }

    await getAdminDb().collection("novedades").doc(id).set(
      {
        estado,
        actualizadoEn: Timestamp.now(),
      },
      { merge: true },
    );

    invalidateNovedadesPublicCache();
    revalidatePath("/");
    revalidatePath("/novedades");

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    const status = message.includes("autoriz") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
