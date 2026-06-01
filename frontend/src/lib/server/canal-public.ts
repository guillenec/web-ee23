import type { Timestamp } from "firebase-admin/firestore";

import type { CanalVideo } from "@/lib/canal";
import { getAdminDb } from "@/lib/server/firebase-admin";

type CanalVideoDoc = {
  slug?: string;
  titulo?: string;
  subtitulo?: string;
  descripcion?: string;
  hashtags?: string[];
  youtubeVideoId?: string;
  youtubeUrl?: string;
  thumbnailUrl?: string;
  estado?: "pendiente" | "publicado";
  autorEmail?: string;
  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
};

export const CANAL_PAGE_SIZE = 8;

function toIsoDate(value: Timestamp | string | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.toDate().toISOString();
}

function mapCanalVideo(id: string, data: CanalVideoDoc): CanalVideo {
  return {
    id,
    slug: data.slug?.trim() || id,
    titulo: data.titulo?.trim() || "Video institucional",
    subtitulo: data.subtitulo?.trim() || "",
    descripcion: data.descripcion?.trim() || "",
    hashtags: Array.isArray(data.hashtags) ? data.hashtags.map((tag) => String(tag).trim()).filter(Boolean) : [],
    youtubeVideoId: data.youtubeVideoId?.trim() || "",
    youtubeUrl: data.youtubeUrl?.trim() || "",
    thumbnailUrl: data.thumbnailUrl?.trim() || "",
    estado: data.estado === "publicado" ? "publicado" : "pendiente",
    autorEmail: data.autorEmail?.trim() || "",
    createdAt: toIsoDate(data.createdAt),
    updatedAt: toIsoDate(data.updatedAt),
  };
}

export async function getCanalVideosPublicados(page = 1, pageSize = CANAL_PAGE_SIZE): Promise<{
  items: CanalVideo[];
  total: number;
  totalPages: number;
  currentPage: number;
}> {
  const normalizedPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const normalizedSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : CANAL_PAGE_SIZE;
  const collectionRef = getAdminDb().collection("canalVideos");
  const baseQuery = collectionRef.where("estado", "==", "publicado");

  const countSnapshot = await baseQuery.count().get();
  const total = Number(countSnapshot.data().count ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / normalizedSize));

  const snapshot = await baseQuery.limit(300).get();

  const sorted = snapshot.docs
    .map((doc) => mapCanalVideo(doc.id, doc.data() as CanalVideoDoc))
    .sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const offset = (normalizedPage - 1) * normalizedSize;
  const items = sorted.slice(offset, offset + normalizedSize);

  return {
    items,
    total,
    totalPages,
    currentPage: Math.min(normalizedPage, totalPages),
  };
}
