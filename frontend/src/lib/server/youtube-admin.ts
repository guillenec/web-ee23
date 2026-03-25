type YouTubeOAuthTokenResponse = {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
};

type UploadVideoInput = {
  file: File;
  title: string;
  description: string;
  privacyStatus: "private" | "public" | "unlisted";
};

function getYouTubeConfig() {
  const clientId = process.env.YOUTUBE_CLIENT_ID ?? "";
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET ?? "";
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI ?? "";
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN ?? "";

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Faltan variables YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET o YOUTUBE_REDIRECT_URI");
  }

  return { clientId, clientSecret, redirectUri, refreshToken };
}

export function buildYouTubeConsentUrl(state: string): string {
  const { clientId, redirectUri } = getYouTubeConfig();
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set(
    "scope",
    ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.force-ssl"].join(" "),
  );
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("state", state);
  return url.toString();
}

export async function exchangeCodeForYouTubeTokens(code: string): Promise<YouTubeOAuthTokenResponse> {
  const { clientId, clientSecret, redirectUri } = getYouTubeConfig();
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });

  const data = (await response.json()) as YouTubeOAuthTokenResponse;
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "No se pudo intercambiar el codigo OAuth");
  }

  return data;
}

async function getAccessTokenFromRefreshToken(): Promise<string> {
  const { clientId, clientSecret, refreshToken } = getYouTubeConfig();

  if (!refreshToken) {
    throw new Error("Falta YOUTUBE_REFRESH_TOKEN. Conecta YouTube y agrega el refresh token en entorno.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });

  const data = (await response.json()) as YouTubeOAuthTokenResponse;
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "No se pudo renovar token de YouTube");
  }

  return data.access_token;
}

export async function uploadVideoToYouTube({
  file,
  title,
  description,
  privacyStatus,
}: UploadVideoInput): Promise<{ videoId: string; videoUrl: string }> {
  const accessToken = await getAccessTokenFromRefreshToken();
  const uploadStart = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status&uploadType=resumable", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Type": file.type || "video/mp4",
      "X-Upload-Content-Length": String(file.size),
    },
    body: JSON.stringify({
      snippet: {
        title,
        description,
        categoryId: "22",
      },
      status: {
        privacyStatus,
      },
    }),
    cache: "no-store",
  });

  if (!uploadStart.ok) {
    const text = await uploadStart.text();
    throw new Error(`YouTube rechazo inicio de carga: ${text || uploadStart.statusText}`);
  }

  const uploadUrl = uploadStart.headers.get("location");
  if (!uploadUrl) {
    throw new Error("YouTube no devolvio URL de carga");
  }

  const bytes = await file.arrayBuffer();
  const uploadFinish = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Length": String(file.size),
      "Content-Type": file.type || "video/mp4",
    },
    body: bytes,
    cache: "no-store",
  });

  const result = (await uploadFinish.json()) as { id?: string; error?: { message?: string } };
  if (!uploadFinish.ok || !result.id) {
    const message = result.error?.message || "No se pudo completar la carga del video";
    throw new Error(message);
  }

  return {
    videoId: result.id,
    videoUrl: `https://www.youtube.com/watch?v=${result.id}`,
  };
}

export async function deleteYouTubeVideo(videoId: string): Promise<void> {
  const normalizedVideoId = videoId.trim();
  if (!normalizedVideoId) return;

  const accessToken = await getAccessTokenFromRefreshToken();
  const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${encodeURIComponent(normalizedVideoId)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`YouTube rechazo borrar video: ${text || response.statusText}`);
  }
}
