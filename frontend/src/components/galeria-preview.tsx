import Image from "next/image";

import { getFotosGaleriaPublicasServer } from "@/lib/server/galeria-public";

type Props = {
  cantidad?: number;
};

export async function GaleriaPreview({ cantidad = 3 }: Props) {
  let fotos;

  try {
    fotos = await getFotosGaleriaPublicasServer(cantidad);
  } catch {
    fotos = null;
  }

  if (fotos === null) {
    return <article className="rounded-2xl border border-brand-main/25 bg-brand-main/5 p-4 text-sm text-brand-dark">No se pudieron cargar imagenes destacadas.</article>;
  }

  if (!fotos.length) {
    return (
      <article className="rounded-2xl border border-brand-dark/15 bg-surface p-4 text-sm text-brand-dark/80">
        Aun no hay imagenes publicadas en galeria.
      </article>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {fotos.map((foto) => (
        <article
          key={foto.id}
          className="surface-hover card-lift overflow-hidden rounded-2xl border border-brand-dark/10 bg-surface shadow-[0_8px_20px_rgba(75,56,49,0.08)]"
        >
          <Image src={foto.src} alt={foto.titulo} width={900} height={700} className="h-44 w-full object-cover" />
          <div className="space-y-2 p-4">
            <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">{foto.categoria}</p>
            <h3 className="text-lg font-extrabold text-brand-dark">{foto.titulo}</h3>
            <p className="text-sm text-brand-dark/80">{foto.descripcion}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
