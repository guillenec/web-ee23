"use client";

import { useState } from "react";

type Props = {
  mapsEmbedUrl: string;
  mapsUrl: string;
};

export function MapaEmbedLazy({ mapsEmbedUrl, mapsUrl }: Props) {
  const [mostrarMapa, setMostrarMapa] = useState(false);

  if (mostrarMapa) {
    return (
      <iframe
        title="Ubicación Escuela Especial N 23"
        src={mapsEmbedUrl}
        className="h-90 w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div className="flex h-90 w-full flex-col items-center justify-center gap-4 bg-[linear-gradient(160deg,rgba(197,228,231,0.22),rgba(255,255,255,0.72))] px-5 text-center">
      <p className="text-sm text-brand-dark/80">
        Cargar mapa interactivo puede demorar en conexiones lentas.
      </p>
      <button
        type="button"
        onClick={() => setMostrarMapa(true)}
        className="chip-hover rounded-full bg-brand-main px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft"
      >
        Cargar mapa
      </button>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="text-xs font-semibold text-brand-main underline-offset-2 hover:underline"
      >
        Abrir en Google Maps
      </a>
    </div>
  );
}
