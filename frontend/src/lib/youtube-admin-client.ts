import { auth } from "@/lib/firebase";

type UploadVideoParams = {
  file: File;
  titulo: string;
  descripcion: string;
  privacidad?: "private" | "public" | "unlisted";
};

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

  const data = (await response.json()) as {
    error?: string;
    uploadUrl?: string;
  };

  if (!response.ok || !data.uploadUrl) {
    throw new Error(data.error || "No se pudo iniciar la carga de video");
  }

  const uploadResponse = await fetch(data.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "video/mp4",
    },
    body: file,
  });

  const uploadText = await uploadResponse.text();
  let uploadData: { id?: string; error?: { message?: string } } = {};
  if (uploadText) {
    try {
      uploadData = JSON.parse(uploadText) as { id?: string; error?: { message?: string } };
    } catch {
      // ignore parse error
    }
  }

  if (!uploadResponse.ok || !uploadData.id) {
    throw new Error(uploadData.error?.message || "No se pudo completar la carga del video");
  }

  return {
    videoId: uploadData.id,
    videoUrl: `https://www.youtube.com/watch?v=${uploadData.id}`,
  };
}
