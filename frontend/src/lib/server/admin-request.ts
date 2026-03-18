import type { NextRequest } from "next/server";

import { getAdminAuth } from "@/lib/server/firebase-admin";

function getAdminEmailsServer(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "";

  return raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization") ?? request.headers.get("Authorization");
  if (!header) return null;
  const [type, token] = header.split(" ");
  if (type?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

export async function assertAdminRequest(request: NextRequest): Promise<{ email: string }> {
  const token = getBearerToken(request);
  if (!token) {
    throw new Error("Falta token de autorizacion");
  }

  const decoded = await getAdminAuth().verifyIdToken(token);
  const email = (decoded.email ?? "").trim().toLowerCase();
  const allowlist = getAdminEmailsServer();

  if (!email || !allowlist.includes(email)) {
    throw new Error("Cuenta no autorizada para accion admin");
  }

  return { email };
}
