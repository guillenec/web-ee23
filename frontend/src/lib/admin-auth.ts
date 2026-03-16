const normalizar = (value: string): string => value.trim().toLowerCase();

export const getAdminEmails = (): string[] => {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "";

  return raw
    .split(",")
    .map(normalizar)
    .filter(Boolean);
};

export const esEmailAdmin = (email: string | null | undefined): boolean => {
  if (!email) return false;

  const admins = getAdminEmails();
  if (!admins.length) return false;

  return admins.includes(normalizar(email));
};
