import { NextResponse } from "next/server";

type ContactoPayload = {
  nombre?: string;
  email?: string;
  asunto?: string;
  mensaje?: string;
  website?: string;
  formStartedAt?: number;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DESTINO_CONTACTO = process.env.CONTACT_FORM_TO_EMAIL ?? "";
const CONTACTO_FROM_EMAIL = process.env.CONTACT_FORM_FROM_EMAIL ?? "";
const RESEND_API_URL = "https://api.resend.com/emails";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_MIN_FILL_TIME_MS = 2500;
const CONTACT_WINDOW_MS = 15 * 60 * 1000;
const CONTACT_MAX_REQUESTS_PER_IP = 5;

const ipRequestLog = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwardedFor) return forwardedFor;

  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const previous = ipRequestLog.get(ip) ?? [];
  const recent = previous.filter((time) => now - time < CONTACT_WINDOW_MS);
  recent.push(now);
  ipRequestLog.set(ip, recent);
  return recent.length > CONTACT_MAX_REQUESTS_PER_IP;
}

function truncate(value: string, max = 6000): string {
  if (value.length <= max) return value;
  return value.slice(0, max);
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Recibimos muchas solicitudes desde esta red. Intenta nuevamente en unos minutos." },
        { status: 429 },
      );
    }

    const body = (await request.json()) as ContactoPayload;
    const nombre = truncate(body.nombre?.trim() ?? "", 180);
    const email = truncate(body.email?.trim() ?? "", 180);
    const asunto = (body.asunto?.trim() || "Consulta institucional").replace(/\s+/g, " ");
    const mensaje = truncate(body.mensaje?.trim() ?? "", 4000);
    const website = body.website?.trim() ?? "";
    const formStartedAt = typeof body.formStartedAt === "number" ? body.formStartedAt : 0;

    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (formStartedAt > 0 && Date.now() - formStartedAt < CONTACT_MIN_FILL_TIME_MS) {
      return NextResponse.json({ error: "Solicitud invalida. Intenta nuevamente." }, { status: 400 });
    }

    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ error: "Completa nombre, email y mensaje." }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "El email no es valido." }, { status: 400 });
    }

    if (!RESEND_API_KEY || !DESTINO_CONTACTO || !CONTACTO_FROM_EMAIL) {
      return NextResponse.json(
        { error: "El servicio de contacto no esta configurado. Intenta nuevamente en unos minutos." },
        { status: 503 },
      );
    }

    const origin = request.headers.get("origin") ?? undefined;
    const referer = request.headers.get("referer") ?? undefined;
    const source = referer ?? origin ?? "No informado";
    const fechaLocal = new Date().toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
    });

    const mensajeInstitucional = [
      "Nueva consulta desde el sitio institucional de la Escuela Especial N 23.",
      "",
      `Nombre: ${nombre}`,
      `Email de respuesta: ${email}`,
      `Asunto: ${asunto}`,
      "",
      "Mensaje:",
      mensaje,
      "",
      "---",
      `Origen: ${source}`,
      `IP: ${ip}`,
      `Fecha: ${fechaLocal}`,
    ].join("\n");

    const asuntoMail = `[EE23 Contacto] ${asunto}`;
    const html = construirHtmlContacto({
      nombre,
      email,
      asunto,
      mensaje,
      source,
      fechaLocal,
    });

    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: CONTACTO_FROM_EMAIL,
        to: [DESTINO_CONTACTO],
        reply_to: email,
        subject: asuntoMail,
        text: mensajeInstitucional,
        html,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "No se pudo enviar el mensaje en este momento." },
        { status: 502 },
      );
    }

    const result = (await response.json()) as { id?: string; message?: string };
    const envioConfirmado = typeof result.id === "string" && result.id.length > 0;

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

function construirHtmlContacto({
  nombre,
  email,
  asunto,
  mensaje,
  source,
  fechaLocal,
}: {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  source: string;
  fechaLocal: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.5; color:#1f2937;">
      <h2 style="margin:0 0 12px;">Nueva consulta web - Escuela Especial N 23</h2>
      <p style="margin:0 0 16px;">Llego una nueva consulta desde el formulario institucional.</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 680px;">
        <tbody>
          <tr><td style="padding:8px; border:1px solid #e5e7eb;"><strong>Nombre</strong></td><td style="padding:8px; border:1px solid #e5e7eb;">${escapeHtml(nombre)}</td></tr>
          <tr><td style="padding:8px; border:1px solid #e5e7eb;"><strong>Email</strong></td><td style="padding:8px; border:1px solid #e5e7eb;">${escapeHtml(email)}</td></tr>
          <tr><td style="padding:8px; border:1px solid #e5e7eb;"><strong>Asunto</strong></td><td style="padding:8px; border:1px solid #e5e7eb;">${escapeHtml(asunto)}</td></tr>
          <tr><td style="padding:8px; border:1px solid #e5e7eb;"><strong>Origen</strong></td><td style="padding:8px; border:1px solid #e5e7eb;">${escapeHtml(source)}</td></tr>
          <tr><td style="padding:8px; border:1px solid #e5e7eb;"><strong>Fecha</strong></td><td style="padding:8px; border:1px solid #e5e7eb;">${escapeHtml(fechaLocal)}</td></tr>
        </tbody>
      </table>
      <h3 style="margin:20px 0 8px;">Mensaje</h3>
      <p style="margin:0; white-space:pre-wrap;">${escapeHtml(mensaje)}</p>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
