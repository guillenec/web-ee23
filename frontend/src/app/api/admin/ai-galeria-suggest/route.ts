import { NextResponse, type NextRequest } from "next/server";

import { assertAdminRequest } from "@/lib/server/admin-request";

export const runtime = "nodejs";

type Payload = {
  idea?: string;
  categoria?: string;
  titulo?: string;
  descripcion?: string;
  tone?: "formal" | "moderado" | "energetico";
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
    const idea = (payload.idea ?? "").trim();
    if (!idea) {
      return NextResponse.json({ error: "Debes escribir una idea para generar sugerencia" }, { status: 400 });
    }

    const { apiKey, model, baseUrl } = getOpenRouterConfig();
    const tone = payload.tone ?? "moderado";

    const system = [
      "Eres asistente de comunicacion institucional para una escuela publica de educacion especial en Rio Negro, Argentina.",
      "Tu tarea es sugerir un titulo breve y una descripcion clara para una imagen de galeria.",
      "No inventes hechos, fechas ni nombres que no esten en el texto proporcionado.",
      "Devuelve EXCLUSIVAMENTE JSON valido con estas claves exactas: titulo, descripcion, categoria.",
      "Sin markdown, sin comentarios y sin texto extra.",
      "descripcion: una sola frase, entre 80 y 180 caracteres.",
      "titulo: maximo 80 caracteres.",
    ].join(" ");

    const user = [
      `Tono solicitado: ${tone}`,
      `Idea/contexto: ${idea}`,
      `Categoria actual (si existe): ${payload.categoria ?? ""}`,
      `Titulo actual (si existe): ${payload.titulo ?? ""}`,
      `Descripcion actual (si existe): ${payload.descripcion ?? ""}`,
      "Usa una categoria breve (ej: Aulas, Territorio, Actos, Talleres, Familias, Salidas).",
    ].join("\n");

    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.35,
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
      descripcion?: string;
      categoria?: string;
    };

    return NextResponse.json({
      ok: true,
      suggestion: {
        titulo: (parsed.titulo ?? payload.titulo ?? "").trim(),
        descripcion: (parsed.descripcion ?? payload.descripcion ?? "").trim(),
        categoria: (parsed.categoria ?? payload.categoria ?? "Territorio").trim(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    const status = message.includes("autoriz") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
