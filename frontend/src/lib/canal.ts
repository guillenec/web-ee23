export type CanalVideo = {
  id: string;
  slug: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  hashtags: string[];
  youtubeVideoId: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  estado: "pendiente" | "publicado";
  autorEmail: string;
  createdAt: string;
  updatedAt: string;
};

export function slugDesdeTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function parseHashtags(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => (item.startsWith("#") ? item : `#${item}`));
}
