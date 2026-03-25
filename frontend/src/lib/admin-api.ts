import { auth } from "@/lib/firebase";

export async function postAdminAction<TResponse = Record<string, unknown>>(
  path: string,
  payload: Record<string, unknown>,
): Promise<TResponse> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Debes iniciar sesion como admin");
  }

  const idToken = await user.getIdToken();
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "No se pudo completar la accion";
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // ignore
    }

    throw new Error(message);
  }

  try {
    return (await response.json()) as TResponse;
  } catch {
    return {} as TResponse;
  }
}
