import { v2 as cloudinary } from "cloudinary";

import { extractCloudinaryPublicId } from "@/lib/cloudinary-utils";

let configured = false;

function getCloudinaryClient() {
  if (!configured) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Faltan variables CLOUDINARY_* para rutas server");
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    configured = true;
  }

  return cloudinary;
}

export function collectCloudinaryPublicIds(input: Array<string | null | undefined>): string[] {
  const set = new Set<string>();

  for (const value of input) {
    if (!value) continue;
    const trimmed = value.trim();
    if (!trimmed) continue;

    if (trimmed.includes("res.cloudinary.com")) {
      const parsed = extractCloudinaryPublicId(trimmed);
      if (parsed) set.add(parsed);
    } else {
      set.add(trimmed);
    }
  }

  return Array.from(set);
}

export async function deleteCloudinaryAssets(publicIds: string[]): Promise<void> {
  if (!publicIds.length) return;

  const client = getCloudinaryClient();

  const results = await Promise.allSettled(
    publicIds.map((publicId) =>
      client.uploader.destroy(publicId, {
        resource_type: "image",
        invalidate: true,
      }),
    ),
  );

  const hasErrors = results.some((result) => result.status === "rejected");
  if (hasErrors) {
    throw new Error("No se pudieron borrar uno o mas assets en Cloudinary");
  }
}
