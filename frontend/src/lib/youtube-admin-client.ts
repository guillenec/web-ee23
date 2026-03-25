import { auth } from "@/lib/firebase";

type UploadVideoParams = {
  file: File;
  titulo: string;
  descripcion: string;
  privacidad?: "private" | "public" | "unlisted";
};

type StartUploadResponse = {
  error?: string;
  uploadUrl?: string;
};

type ChunkUploadResponse = {
  error?: string;
  complete?: boolean;
  videoId?: string;
  videoUrl?: string;
};

const CHUNK_SIZE_BYTES = 4 * 1024 * 1024;

export async function uploadVideoFromAdmin({
  file,
  titulo,
  descripcion,
  privacidad = "unlisted",
}: UploadVideoParams): Promise<{ videoId: string; videoUrl: string }> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Debes iniciar sesion como admin para subir videos");
  }

  const idToken = await user.getIdToken();
  const response = await fetch("/api/admin/youtube/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      titulo,
      descripcion,
      privacidad,
      contentType: file.type || "video/mp4",
      contentLength: file.size,
    }),
  });

  const data = (await response.json()) as StartUploadResponse;

  if (!response.ok || !data.uploadUrl) {
    throw new Error(data.error || "No se pudo iniciar la carga de video");
  }

  const contentType = file.type || "video/mp4";
  let offset = 0;

  while (offset < file.size) {
    const end = Math.min(offset + CHUNK_SIZE_BYTES, file.size) - 1;
    const chunkBlob = file.slice(offset, end + 1);
    const query = new URLSearchParams({
      uploadUrl: data.uploadUrl,
      start: String(offset),
      end: String(end),
      total: String(file.size),
      contentType,
    });

    const chunkResponse = await fetch(`/api/admin/youtube/upload/chunk?${query.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        Authorization: `Bearer ${idToken}`,
      },
      body: await chunkBlob.arrayBuffer(),
    });

    const chunkData = (await chunkResponse.json()) as ChunkUploadResponse;
    if (!chunkResponse.ok) {
      throw new Error(chunkData.error || "Fallo al subir un bloque del video");
    }

    if (chunkData.complete && chunkData.videoId && chunkData.videoUrl) {
      return {
        videoId: chunkData.videoId,
        videoUrl: chunkData.videoUrl,
      };
    }

    offset = end + 1;
  }

  throw new Error("La carga finalizo sin confirmacion de YouTube. Revisa YouTube Studio y vuelve a intentar.");
}
