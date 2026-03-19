import Image from "next/image";

import { contactoInstitucional } from "@/lib/contacto";

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-dark/12 bg-brand-dark text-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:grid-cols-2 sm:px-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/logos/logo1.svg"
              alt="Escuela Especial N 23"
              width={160}
              height={72}
              className="h-8 w-[72px] object-contain sm:h-9 sm:w-[82px]"
            />
            <p className="text-sm font-semibold tracking-[0.12em] uppercase">Escuela Especial N 23</p>
          </div>
          <p className="max-w-md text-sm text-white/80">
            Institución pública de educación especial en Ingeniero Jacobacci con acompañamiento
            territorial en Región Sur.
          </p>
        </div>

        <div className="space-y-2 text-sm text-white/85 sm:text-right">
          <p>{contactoInstitucional.direccion}</p>
          <p>
            Teléfono: <a href={`tel:${contactoInstitucional.telefonoLink}`}>{contactoInstitucional.telefonoVisible}</a>
          </p>
          <p>
            Email: <a href={`mailto:${contactoInstitucional.email}`}>{contactoInstitucional.email}</a>
          </p>
          <p>Comunidad educativa 2026</p>
        </div>
      </div>
    </footer>
  );
}
