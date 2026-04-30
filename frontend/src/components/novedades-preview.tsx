import { NovedadesPreviewClient } from "@/components/novedades-preview-client";
import { getNovedadesPublicadasServer } from "@/lib/server/novedades-public";

type Props = {
  cantidad?: number;
  headingLevel?: "h2" | "h3";
};

export async function NovedadesPreview({ cantidad = 3, headingLevel = "h3" }: Props) {
  let novedades;

  try {
    novedades = await getNovedadesPublicadasServer(cantidad);
  } catch {
    novedades = null;
  }

  if (novedades === null) {
    return (
      <div className="rounded-2xl border border-brand-main/30 bg-brand-main/5 p-4 text-sm text-brand-dark">
        No se pudieron cargar las novedades por el momento.
      </div>
    );
  }

  if (!novedades.length) {
    return (
      <div className="rounded-2xl border border-brand-dark/10 bg-surface p-4 text-sm text-brand-dark/80">
        Aun no hay novedades publicadas.
      </div>
    );
  }

  return <NovedadesPreviewClient initialNovedades={novedades} headingLevel={headingLevel} />;
}
