import { NextResponse } from "next/server";

type ContactoPayload = {
  nombre?: string;
  email?: string;
  asunto?: string;
  mensaje?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DESTINO_CONTACTO = process.env.CONTACT_FORM_TO_EMAIL ?? "guillermoneculqueo@gmail.com";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactoPayload;
    const nombre = body.nombre?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const asunto = body.asunto?.trim() ?? "Consulta institucional";
    const mensaje = body.mensaje?.trim() ?? "";

    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ error: "Completa nombre, email y mensaje." }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "El email no es valido." }, { status: 400 });
    }

    const origin = request.headers.get("origin") ?? undefined;
    const referer = request.headers.get("referer") ?? undefined;

    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(DESTINO_CONTACTO)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(origin ? { Origin: origin } : {}),
        ...(referer ? { Referer: referer } : {}),
      },
      body: JSON.stringify({
        name: nombre,
        email,
        subject: `[Web EE23] ${asunto}`,
        message: mensaje,
        _captcha: "false",
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "No se pudo enviar el mensaje en este momento." },
        { status: 502 },
      );
    }

    const result = (await response.json()) as { success?: string | boolean; message?: string };
    const envioConfirmado = result.success === true || result.success === "true";

    if (!envioConfirmado) {
      return NextResponse.json(
        { error: result.message ?? "No se pudo confirmar el envio del mensaje." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error inesperado al enviar el formulario." }, { status: 500 });
  }
}
