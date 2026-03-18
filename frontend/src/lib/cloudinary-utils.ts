export function extractCloudinaryPublicId(url: string): string | null {
  const raw = url.trim();
  if (!raw) return null;

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }

  if (!parsed.hostname.includes("res.cloudinary.com")) {
    return null;
  }

  const marker = "/upload/";
  const idx = parsed.pathname.indexOf(marker);
  if (idx === -1) return null;

  const rest = parsed.pathname.slice(idx + marker.length);
  if (!rest) return null;

  const parts = rest.split("/").filter(Boolean);
  if (!parts.length) return null;

  const versionIndex = parts.findIndex((item) => /^v\d+$/.test(item));
  const publicParts = versionIndex >= 0 ? parts.slice(versionIndex + 1) : parts;
  if (!publicParts.length) return null;

  const last = publicParts[publicParts.length - 1] ?? "";
  publicParts[publicParts.length - 1] = last.replace(/\.[a-z0-9]+$/i, "");

  const publicId = publicParts.join("/").trim();
  return publicId || null;
}
