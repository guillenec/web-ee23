import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { buildYouTubeConsentUrl } from "@/lib/server/youtube-admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const state = randomUUID();
    const cookieStore = await cookies();
    cookieStore.set("yt_oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10,
    });

    const url = buildYouTubeConsentUrl(state);
    return NextResponse.redirect(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo iniciar OAuth";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
