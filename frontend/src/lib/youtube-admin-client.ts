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
  const form = new FormData();
  form.append("file", file);
  form.append("titulo", titulo);
  form.append("descripcion", descripcion);
  form.append("privacidad", privacidad);

  const response = await fetch("/api/admin/youtube/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    body: form,
  });

  const data = (await response.json()) as {
    error?: string;
    videoId?: string;
    videoUrl?: string;
  };

  if (!response.ok || !data.videoId || !data.videoUrl) {
    throw new Error(data.error || "No se pudo subir video a YouTube");
  }

  return {
    videoId: data.videoId,
    videoUrl: data.videoUrl,
  };
}
