import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { exchangeCodeForYouTubeTokens } from "@/lib/server/youtube-admin";

export const runtime = "nodejs";

function renderHtml(title: string, body: string) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; background: #f8fafc; color: #0f172a; }
      main { max-width: 760px; margin: 36px auto; background: white; border-radius: 16px; padding: 22px; border: 1px solid #e2e8f0; }
      h1 { margin-top: 0; font-size: 1.4rem; }
      p { line-height: 1.5; }
      pre { white-space: pre-wrap; word-break: break-all; background: #0f172a; color: #f8fafc; padding: 12px; border-radius: 10px; }
      a { color: #0f766e; }
    </style>
  </head>
  <body>
    <main>
      ${body}
    </main>
  </body>
</html>`;
}

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams;
    const code = search.get("code") ?? "";
    const state = search.get("state") ?? "";
    const oauthError = search.get("error");

    if (oauthError) {
      const html = renderHtml(
        "OAuth cancelado",
        `<h1>OAuth cancelado</h1><p>Google devolvio: <strong>${oauthError}</strong>.</p>`,
      );
      return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    const cookieStore = await cookies();
    const stateCookie = cookieStore.get("yt_oauth_state")?.value ?? "";
    if (!state || !stateCookie || state !== stateCookie) {
      const html = renderHtml(
        "Estado invalido",
        "<h1>No se pudo validar el estado OAuth</h1><p>Vuelve a iniciar el flujo desde <code>/api/admin/youtube/oauth/start</code>.</p>",
      );
      return new NextResponse(html, { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    if (!code) {
      const html = renderHtml("Codigo faltante", "<h1>Falta el codigo OAuth</h1><p>Intenta nuevamente.</p>");
      return new NextResponse(html, { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    const tokenData = await exchangeCodeForYouTubeTokens(code);
    const refreshToken = tokenData.refresh_token ?? "";
    if (!refreshToken) {
      const html = renderHtml(
        "Sin refresh token",
        "<h1>No llego refresh token</h1><p>Vuelve a autorizar con <code>prompt=consent</code> y revisa que sea la primera autorizacion para este cliente.</p>",
      );
      return new NextResponse(html, { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    cookieStore.delete("yt_oauth_state");

    const html = renderHtml(
      "Refresh token listo",
      `<h1>Refresh token generado</h1>
<p>Copia este valor y guardalo en tu entorno como <code>YOUTUBE_REFRESH_TOKEN</code> (local y Vercel).</p>
<pre>${refreshToken}</pre>
<p>Luego reinicia el entorno y vuelve al admin para subir videos.</p>`,
    );

    return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado en callback OAuth";
    const html = renderHtml("Error OAuth", `<h1>Error</h1><p>${message}</p>`);
    return new NextResponse(html, { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
}
