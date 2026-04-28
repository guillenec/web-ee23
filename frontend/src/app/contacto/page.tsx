import type { Metadata } from "next";

import { ContactoSection } from "@/components/contacto-section";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Canales de contacto institucional de la Escuela Especial N 23 en Ingeniero Jacobacci.",
  alternates: {
    canonical: "/contacto",
  },
};

export default function ContactoPage() {
  return (
    <main className="page-enter bg-app px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div data-reveal>
          <ContactoSection
            titulo="Estamos para acompañar"
            subtitulo="Acercate a la escuela o escribinos para consultas institucionales y pedagógicas."
          />
        </div>
      </div>
    </main>
  );
}
