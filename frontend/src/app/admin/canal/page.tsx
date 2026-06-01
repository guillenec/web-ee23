"use client";

import { useEffect, useMemo, useState } from "react";

import { auth } from "@/lib/firebase";
import { uploadVideoFromAdmin } from "@/lib/youtube-admin-client";

type EstadoVideo = "pendiente" | "publicado";

type CanalVideoAdmin = {
  id: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  hashtags: string[];
  youtubeVideoId: string;
  estado: EstadoVideo;
  youtubeUrl: string;
  thumbnailUrl: string;
  createdAt: string;
};

const PAGE_SIZE = 10;

export default function AdminCanalPage() {
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [estado, setEstado] = useState<EstadoVideo>("pendiente");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeVideoId, setYoutubeVideoId] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [videos, setVideos] = useState<CanalVideoAdmin[]>([]);
  const [page, setPage] = useState(1);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(videos.length / PAGE_SIZE)), [videos.length]);
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return videos.slice(start, start + PAGE_SIZE);
  }, [page, videos]);

  async function cargarVideos() {
    const user = auth.currentUser;
    if (!user) return;
    const token = await user.getIdToken();

    const response = await fetch("/api/admin/canal/list", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = (await response.json()) as {
      error?: string;
      items?: Array<{
        id: string;
        titulo: string;
        subtitulo: string;
        descripcion: string;
        hashtags: string[];
        youtubeVideoId: string;
        estado: EstadoVideo;
        youtubeUrl: string;
        thumbnailUrl: string;
        createdAt: string;
      }>;
    };

    if (!response.ok) {
      throw new Error(result.error || "No se pudo listar videos del canal");
    }

    const items: CanalVideoAdmin[] = (result.items ?? []).map((item) => ({
      ...item,
      createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString("es-AR") : "-",
    }));

    setVideos(items);
  }

  useEffect(() => {
    void cargarVideos().catch((loadError) => {
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar canalVideos");
    });
  }, []);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const subirVideo = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setOk(null);

    try {
      setSubiendo(true);
      const upload = await uploadVideoFromAdmin({
        file,
        titulo: titulo.trim() || "Video institucional - Escuela Especial N 23",
        descripcion: descripcion.trim() || "Video cargado desde modulo Canal.",
        privacidad: "unlisted",
      });

      setYoutubeUrl(upload.videoUrl);
      setYoutubeVideoId(upload.videoId);
      setThumbnailUrl(`https://img.youtube.com/vi/${upload.videoId}/hqdefault.jpg`);
      setOk("Video subido a YouTube. Ahora puedes guardar la ficha del canal.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "No se pudo subir a YouTube");
    } finally {
      setSubiendo(false);
    }
  };

  const guardar = async () => {
    setError(null);
    setOk(null);

    const user = auth.currentUser;
    if (!user?.email) {
      setError("Debes iniciar sesion como admin");
      return;
    }

    if (!titulo.trim()) {
      setError("El titulo es obligatorio");
      return;
    }

    if (!youtubeUrl.trim() || !youtubeVideoId.trim()) {
      setError("Primero debes subir el video a YouTube desde este formulario");
      return;
    }

    try {
      setGuardando(true);
      const hashtagsList = hashtags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => (item.startsWith("#") ? item : `#${item}`));

      const token = await user.getIdToken();
      const response = await fetch("/api/admin/canal/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: titulo.trim(),
          subtitulo: subtitulo.trim(),
          descripcion: descripcion.trim(),
          hashtags: hashtagsList,
          youtubeVideoId: youtubeVideoId.trim(),
          youtubeUrl: youtubeUrl.trim(),
          thumbnailUrl: thumbnailUrl.trim(),
          estado,
        }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "No se pudo guardar el video en canalVideos");
      }

      setTitulo("");
      setSubtitulo("");
      setDescripcion("");
      setHashtags("");
      setEstado("pendiente");
      setYoutubeUrl("");
      setYoutubeVideoId("");
      setThumbnailUrl("");
      setOk("Video guardado en la seccion Canal.");
      await cargarVideos();
      setPage(1);
    } catch {
      setError("No se pudo guardar el video en Firestore");
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (id: string, next: EstadoVideo) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const response = await fetch("/api/admin/canal/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, estado: next }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "No se pudo cambiar el estado");
      }

      await cargarVideos();
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "No se pudo cambiar el estado");
    }
  };

  const iniciarEdicion = (video: CanalVideoAdmin) => {
    setEditandoId(video.id);
    setTitulo(video.titulo);
    setSubtitulo(video.subtitulo);
    setDescripcion(video.descripcion);
    setHashtags(video.hashtags.join(", "));
    setEstado(video.estado);
    setYoutubeUrl(video.youtubeUrl);
    setYoutubeVideoId(video.youtubeVideoId);
    setThumbnailUrl(video.thumbnailUrl);
    setOk(`Editando: ${video.titulo}`);
    setError(null);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setTitulo("");
    setSubtitulo("");
    setDescripcion("");
    setHashtags("");
    setEstado("pendiente");
    setYoutubeUrl("");
    setYoutubeVideoId("");
    setThumbnailUrl("");
    setOk(null);
    setError(null);
  };

  const actualizar = async () => {
    const user = auth.currentUser;
    if (!user || !editandoId) return;
    if (!titulo.trim()) {
      setError("El titulo es obligatorio");
      return;
    }

    try {
      setGuardando(true);
      const token = await user.getIdToken();
      const hashtagsList = hashtags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => (item.startsWith("#") ? item : `#${item}`));

      const response = await fetch("/api/admin/canal/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editandoId,
          titulo: titulo.trim(),
          subtitulo: subtitulo.trim(),
          descripcion: descripcion.trim(),
          hashtags: hashtagsList,
          estado,
        }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "No se pudo actualizar");
      }

      setOk("Video actualizado correctamente.");
      await cargarVideos();
      cancelarEdicion();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "No se pudo actualizar");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (video: CanalVideoAdmin) => {
    const confirm = window.confirm(`Se eliminara \"${video.titulo}\" del canal web.`);
    if (!confirm) return;

    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const response = await fetch("/api/admin/canal/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: video.id }),
      });

      const result = (await response.json()) as { error?: string; youtubeDeleteWarning?: string };
      if (!response.ok) {
        throw new Error(result.error || "No se pudo eliminar");
      }

      if (result.youtubeDeleteWarning) {
        setError(`El item se elimino, pero YouTube devolvio: ${result.youtubeDeleteWarning}`);
      } else {
        setOk("Video eliminado correctamente.");
      }

      if (editandoId === video.id) {
        cancelarEdicion();
      }

      await cargarVideos();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "No se pudo eliminar");
    }
  };

  return (
    <main className="page-enter bg-app px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl border border-brand-dark/10 bg-surface p-6 shadow-[0_10px_24px_rgba(75,56,49,0.08)] sm:p-8">
          <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Modulo Canal</p>
          <h1 className="mt-2 text-3xl font-black text-brand-dark">Subir video a YouTube y publicar en la web</h1>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs font-bold tracking-[0.08em] text-brand-dark/70 uppercase">Titulo</span>
              <input value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm" />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-bold tracking-[0.08em] text-brand-dark/70 uppercase">Subtitulo</span>
              <input value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm" />
            </label>
          </div>

          <label className="mt-4 block space-y-1">
            <span className="text-xs font-bold tracking-[0.08em] text-brand-dark/70 uppercase">Descripcion</span>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={4} className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm" />
          </label>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs font-bold tracking-[0.08em] text-brand-dark/70 uppercase">Hashtags (separados por coma)</span>
              <input value={hashtags} onChange={(e) => setHashtags(e.target.value)} placeholder="#inclusion, #escuelaespecial" className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm" />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-bold tracking-[0.08em] text-brand-dark/70 uppercase">Estado en web</span>
              <select value={estado} onChange={(e) => setEstado((e.target.value as EstadoVideo) || "pendiente")} className="w-full rounded-xl border border-brand-dark/15 bg-white px-3 py-2 text-sm">
                <option value="pendiente">Pendiente</option>
                <option value="publicado">Publicado</option>
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <label className="inline-block cursor-pointer rounded-full border border-brand-main/35 bg-brand-main/8 px-4 py-2 text-sm font-semibold text-brand-main transition hover:bg-brand-main hover:text-white">
              {subiendo ? "Subiendo video..." : "Subir video desde equipo"}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                disabled={subiendo}
                onChange={(e) => {
                  void subirVideo(e.target.files?.[0] ?? null);
                  e.currentTarget.value = "";
                }}
              />
            </label>
            {editandoId ? (
              <>
                <button
                  type="button"
                  onClick={() => void actualizar()}
                  disabled={guardando}
                  className="rounded-full bg-brand-main px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:opacity-65"
                >
                  {guardando ? "Actualizando..." : "Guardar cambios"}
                </button>
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  className="rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
                >
                  Cancelar edicion
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => void guardar()}
                disabled={guardando}
                className="rounded-full bg-brand-main px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:opacity-65"
              >
                {guardando ? "Guardando..." : "Guardar en seccion Canal"}
              </button>
            )}
          </div>

          {youtubeUrl ? <p className="mt-3 text-xs text-brand-dark/75">Video listo: {youtubeUrl}</p> : null}
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          {ok ? <p className="mt-3 text-sm text-emerald-700">{ok}</p> : null}
        </section>

        <section className="rounded-3xl border border-brand-dark/10 bg-surface p-6 shadow-[0_10px_24px_rgba(75,56,49,0.08)] sm:p-8">
          <h2 className="text-2xl font-black text-brand-dark">Videos cargados</h2>
          <p className="mt-1 text-sm text-brand-dark/75">Paginado interno para evitar listados largos.</p>

          <div className="mt-4 space-y-3">
            {pageItems.map((video) => (
              <article key={video.id} className="rounded-2xl border border-brand-dark/10 bg-white/80 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-brand-dark">{video.titulo}</h3>
                    {video.subtitulo ? <p className="text-sm text-brand-dark/80">{video.subtitulo}</p> : null}
                    <p className="mt-1 text-xs text-brand-dark/70">Creado: {video.createdAt}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${video.estado === "publicado" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {video.estado}
                    </span>
                    <button
                      type="button"
                      onClick={() => void cambiarEstado(video.id, video.estado === "publicado" ? "pendiente" : "publicado")}
                      className="rounded-full border border-brand-dark/20 px-3 py-1 text-xs font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
                    >
                      {video.estado === "publicado" ? "Pasar a pendiente" : "Publicar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => iniciarEdicion(video)}
                      className="rounded-full border border-brand-main/35 bg-brand-main/8 px-3 py-1 text-xs font-semibold text-brand-main transition hover:bg-brand-main hover:text-white"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => void eliminar(video)}
                      className="rounded-full border border-red-500/45 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                    >
                      Eliminar
                    </button>
                    <a href={video.youtubeUrl} target="_blank" rel="noreferrer" className="rounded-full border border-red-500/45 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white">
                      YouTube
                    </a>
                  </div>
                </div>
              </article>
            ))}

            {!pageItems.length ? <p className="text-sm text-brand-dark/70">Aun no hay videos cargados.</p> : null}
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
              className="rounded-full border border-brand-dark/20 px-4 py-1.5 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
            >
              Anterior
            </button>
            <p className="text-sm font-semibold text-brand-dark/80">
              Pagina {page} de {totalPages}
            </p>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
              className="rounded-full border border-brand-dark/20 px-4 py-1.5 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
            >
              Siguiente
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
