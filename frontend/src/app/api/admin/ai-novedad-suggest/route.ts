import { NextResponse, type NextRequest } from "next/server";

import { assertAdminRequest } from "@/lib/server/admin-request";

export const runtime = "nodejs";

type Payload = {
  action?: "improve_title" | "improve_content";
  tone?: "formal" | "moderado" | "energetico";
  titulo?: string;
  categoria?: string;
  resumen?: string;
  contenido?: string;
};

function getOpenRouterConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;
  const baseUrl = process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";

  if (!apiKey || !model) {
    throw new Error("Faltan variables OPENROUTER_API_KEY u OPENROUTER_MODEL");
  }

  return { apiKey, model, baseUrl };
}

function extractJsonObject(text: string): string {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) {
    throw new Error("La IA no devolvio JSON valido");
  }

  return text.slice(first, last + 1);
}

export async function POST(request: NextRequest) {
  try {
    await assertAdminRequest(request);

    const payload = (await request.json()) as Payload;
    const action = payload.action;
    const tone = payload.tone ?? "moderado";

    if (action !== "improve_title" && action !== "improve_content") {
      return NextResponse.json({ error: "Accion IA no valida" }, { status: 400 });
    }

    const { apiKey, model, baseUrl } = getOpenRouterConfig();

    const system = action === "improve_title"
      ? [
          "Eres asistente de redaccion institucional para una escuela publica de educacion especial en Rio Negro, Argentina.",
          "Tu tarea es SOLO mejorar un titulo dado, sin inventar informacion ni agregar datos no presentes.",
          "Conserva el sentido original del docente.",
          "Devuelve EXCLUSIVAMENTE JSON valido con esta clave exacta: titulo.",
          "No devuelvas markdown, comentarios ni texto adicional.",
          "Longitud maxima del titulo: 90 caracteres.",
        ].join(" ")
      : [
          "Eres asistente de redaccion institucional para una escuela publica de educacion especial en Rio Negro, Argentina.",
          "Tu tarea es SOLO mejorar redaccion y claridad del contenido dado por el docente, sin inventar informacion, nombres, fechas ni hechos.",
          "Conserva fielmente ideas y datos originales.",
          "Devuelve EXCLUSIVAMENTE JSON valido con estas claves exactas: contenido, resumen.",
          "No devuelvas markdown, comentarios ni texto adicional.",
          "contenido: 2 a 4 parrafos claros.",
          "resumen: 180 a 260 caracteres, fiel al contenido mejorado.",
        ].join(" ");

    const user = action === "improve_title"
      ? [
          `Tono solicitado: ${tone}`,
          `Titulo original: ${payload.titulo ?? ""}`,
          "Regla critica: no inventar informacion; solo reformular para mejorar claridad e impacto institucional.",
        ].join("\n")
      : [
          `Tono solicitado: ${tone}`,
          `Categoria: ${payload.categoria ?? "Institucional"}`,
          `Titulo de referencia: ${payload.titulo ?? ""}`,
          `Contenido original del docente: ${payload.contenido ?? ""}`,
          "Regla critica: no inventar informacion; solo ordenar y mejorar redaccion con los datos dados.",
        ].join("\n");

    if (action === "improve_title" && !(payload.titulo ?? "").trim()) {
      return NextResponse.json({ error: "Debes escribir un titulo antes de mejorarlo con IA" }, { status: 400 });
    }

    if (action === "improve_content" && !(payload.contenido ?? "").trim()) {
      return NextResponse.json({ error: "Debes escribir contenido antes de mejorarlo con IA" }, { status: 400 });
    }

    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenRouter rechazo la solicitud: ${text.slice(0, 300)}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("OpenRouter no devolvio contenido");
    }

    const parsed = JSON.parse(extractJsonObject(content)) as {
      titulo?: string;
      resumen?: string;
      contenido?: string;
    };

    if (action === "improve_title") {
      const titulo = (parsed.titulo ?? payload.titulo ?? "").trim();
      return NextResponse.json({ ok: true, suggestion: { titulo } });
    }

    const contenido = (parsed.contenido ?? payload.contenido ?? "").trim();
    const resumen = (parsed.resumen ?? payload.resumen ?? "").trim();
    return NextResponse.json({ ok: true, suggestion: { contenido, resumen } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    const status = message.includes("autoriz") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
