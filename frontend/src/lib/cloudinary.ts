const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
};

export async function uploadImageWithMeta(file: File): Promise<CloudinaryUploadResult> {
  if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
    throw new Error("Faltan variables de Cloudinary");
  }

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", cloudinaryUploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    throw new Error("Cloudinary rechazo la carga");
  }

  const result = (await response.json()) as { secure_url?: string; public_id?: string };
  if (!result.secure_url || !result.public_id) {
    throw new Error("Cloudinary no devolvio URL de imagen");
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const result = await uploadImageWithMeta(file);
  return result.url;
}
