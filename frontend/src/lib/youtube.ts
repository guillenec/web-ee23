const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

function parseTimestampToSeconds(value: string | null): number {
  if (!value) return 0;

  const normalized = value.trim().toLowerCase();
  if (!normalized) return 0;

  if (/^\d+$/.test(normalized)) {
    return Number.parseInt(normalized, 10);
  }

  const match = normalized.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!match) return 0;

  const hours = Number.parseInt(match[1] ?? "0", 10);
  const minutes = Number.parseInt(match[2] ?? "0", 10);
  const seconds = Number.parseInt(match[3] ?? "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
}

export function extractYouTubeVideoId(urlValue: string): string | null {
  const value = urlValue.trim();
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  let candidate = "";

  if (host === "youtu.be") {
    candidate = url.pathname.replace(/^\/+/, "").split("/")[0] ?? "";
  } else if (
    host === "youtube.com" ||
    host === "www.youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtube-nocookie.com" ||
    host === "www.youtube-nocookie.com"
  ) {
    if (url.pathname === "/watch") {
      candidate = url.searchParams.get("v") ?? "";
    } else {
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live") {
        candidate = parts[1] ?? "";
      }
    }
  }

  return YOUTUBE_ID_REGEX.test(candidate) ? candidate : null;
}

export function toYouTubeEmbedUrl(urlValue: string): string | null {
  const id = extractYouTubeVideoId(urlValue);
  if (!id) return null;

  const url = new URL(`https://www.youtube.com/embed/${id}`);

  const source = new URL(urlValue);
  const start = parseTimestampToSeconds(source.searchParams.get("t") ?? source.searchParams.get("start"));
  if (start > 0) {
    url.searchParams.set("start", String(start));
  }

  return url.toString();
}

export function isValidYouTubeUrl(urlValue: string): boolean {
  return toYouTubeEmbedUrl(urlValue) !== null;
}
