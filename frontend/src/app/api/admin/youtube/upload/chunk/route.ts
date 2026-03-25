import { NextResponse, type NextRequest } from "next/server";

import { assertAdminRequest } from "@/lib/server/admin-request";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await assertAdminRequest(request);

    const search = request.nextUrl.searchParams;
    const uploadUrl = search.get("uploadUrl")?.trim() ?? "";
    const start = Number(search.get("start") ?? "-1");
    const end = Number(search.get("end") ?? "-1");
    const total = Number(search.get("total") ?? "-1");
    const contentType = (search.get("contentType") ?? "video/mp4").trim() || "video/mp4";

    if (!uploadUrl || !uploadUrl.startsWith("https://www.googleapis.com/upload/youtube/v3/videos")) {
      return NextResponse.json({ error: "URL de subida invalida" }, { status: 400 });
    }

    if (![start, end, total].every((value) => Number.isFinite(value) && value >= 0) || end < start || total <= 0) {
      return NextResponse.json({ error: "Rango de carga invalido" }, { status: 400 });
    }

    const chunk = await request.arrayBuffer();
    const expectedSize = end - start + 1;
    if (chunk.byteLength !== expectedSize) {
      return NextResponse.json({ error: "El bloque recibido no coincide con el rango informado" }, { status: 400 });
    }

    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Length": String(chunk.byteLength),
        "Content-Type": contentType,
        "Content-Range": `bytes ${start}-${end}/${total}`,
      },
      body: chunk,
      cache: "no-store",
    });

    if (uploadResponse.status === 308) {
      const received = uploadResponse.headers.get("Range") ?? "";
      return NextResponse.json({ ok: true, complete: false, received });
    }

    const text = await uploadResponse.text();
    let data: { id?: string; error?: { message?: string } } = {};

    if (text) {
      try {
        data = JSON.parse(text) as { id?: string; error?: { message?: string } };
      } catch {
        // ignore parse error
      }
    }

    if (!uploadResponse.ok || !data.id) {
      const message = data.error?.message || text || "No se pudo completar la carga en YouTube";
      return NextResponse.json({ error: message }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      complete: true,
      videoId: data.id,
      videoUrl: `https://www.youtube.com/watch?v=${data.id}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo enviar el bloque a YouTube";
    const status = message.includes("autoriz") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
