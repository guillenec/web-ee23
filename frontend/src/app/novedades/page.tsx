import { NovedadesPreview } from "@/components/novedades-preview";
import { SiteFooter } from "@/components/site-footer";
import { TransitionLink } from "@/components/transition-link";

export default function NovedadesPage() {
  return (
    <div className="page-enter min-h-screen bg-[radial-gradient(circle_at_0%_0%,#c5e4e7_0%,#f6f2ee_45%,#f6f2ee_100%)]">
      <main className="px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div data-reveal className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Comunidad EE23</p>
              <h1 className="text-3xl font-black text-brand-dark">Novedades institucionales</h1>
            </div>
            <TransitionLink
              href="/"
              className="rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
            >
              Volver al inicio
            </TransitionLink>
          </div>
          <NovedadesPreview cantidad={12} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
