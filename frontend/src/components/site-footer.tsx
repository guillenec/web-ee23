import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-dark/12 bg-brand-dark text-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:grid-cols-2 sm:px-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/logos/logo1.png"
              alt="Escuela Especial N 23"
              width={42}
              height={42}
              className="h-10 w-10"
            />
            <p className="text-sm font-semibold tracking-[0.12em] uppercase">Escuela Especial N 23</p>
          </div>
          <p className="max-w-md text-sm text-white/80">
            Institucion publica de educacion especial en Ingeniero Jacobacci con acompanamiento
            territorial en Region Sur.
          </p>
        </div>

        <div className="space-y-2 text-sm text-white/85 sm:text-right">
          <p>R8418 Ingeniero Jacobacci, Rio Negro</p>
          <p>Telefono: (02940) 432002</p>
          <p>Comunidad educativa 2026</p>
        </div>
      </div>
    </footer>
  );
}
