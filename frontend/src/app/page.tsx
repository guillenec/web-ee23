export default function Home() {
  const localidades = [
    "Ingeniero Jacobacci",
    "Aguada de Guerra",
    "Anecon Grande",
    "Comallo",
    "El Cain",
    "Maquinchao",
    "Mencue",
    "Pilquiniyeu",
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_20%,#c5e4e7_0%,#f6f2ee_35%,#f6f2ee_100%)]">
      <header className="border-b border-brand-dark/10 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-main uppercase">
              Escuela Especial N 23
            </p>
            <p className="text-sm text-brand-dark/75">Ingeniero Jacobacci - Rio Negro</p>
          </div>
          <a
            href="#contacto"
            className="rounded-full border border-brand-main px-4 py-2 text-sm font-semibold text-brand-main transition hover:bg-brand-main hover:text-white"
          >
            Contacto
          </a>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-8 sm:px-8 sm:py-12">
        <section className="relative overflow-hidden rounded-3xl bg-brand-dark p-7 text-white sm:p-12">
          <div className="float-shape absolute -top-16 -right-10 h-44 w-44 rounded-full bg-brand-soft/55 blur-2xl" />
          <div className="float-shape absolute -bottom-16 left-8 h-40 w-40 rounded-full bg-sky/30 blur-2xl" />
          <p className="fade-up inline-block rounded-full border border-white/35 px-3 py-1 text-xs tracking-widest uppercase">
            Web institucional en construccion
          </p>
          <h1 className="fade-up delay-1 mt-4 max-w-3xl text-3xl leading-tight font-black sm:text-5xl">
            Inclusion, acompanamiento y trabajo territorial en toda la Region Sur.
          </h1>
          <p className="fade-up delay-2 mt-5 max-w-2xl text-base text-white/90 sm:text-lg">
            Este sitio va a acercar informacion clara para familias, docentes e instituciones,
            visibilizando propuestas de la Escuela Especial N 23 desde primera infancia hasta nivel
            secundario.
          </p>
          <div className="fade-up delay-3 mt-7 flex flex-wrap gap-3">
            <a
              href="#alcance"
              className="rounded-full bg-brand-main px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-soft"
            >
              Ver alcance territorial
            </a>
            <a
              href="#proximamente"
              className="rounded-full border border-white/45 px-5 py-2 text-sm font-semibold transition hover:bg-white hover:text-brand-dark"
            >
              Proximas secciones
            </a>
          </div>
        </section>

        <section id="alcance" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {localidades.map((localidad, idx) => (
            <article
              key={localidad}
              className="fade-up rounded-2xl border border-brand-dark/10 bg-surface p-4 shadow-[0_8px_20px_rgba(75,56,49,0.06)]"
              style={{ animationDelay: `${0.08 * idx}s` }}
            >
              <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Region Sur</p>
              <h2 className="mt-2 text-lg font-extrabold text-brand-dark">{localidad}</h2>
            </article>
          ))}
        </section>

        <section id="proximamente" className="grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl bg-brand-main p-6 text-white">
            <h3 className="text-xl font-black">Novedades</h3>
            <p className="mt-2 text-sm text-white/90">
              Comunicados, actos, proyectos y actividades con actualizacion periodica.
            </p>
          </article>
          <article className="rounded-2xl bg-sky p-6 text-brand-dark">
            <h3 className="text-xl font-black">Galeria institucional</h3>
            <p className="mt-2 text-sm text-brand-dark/85">
              Registro visual del trabajo pedagogico en escuelas y parajes de la region.
            </p>
          </article>
          <article id="contacto" className="rounded-2xl bg-neutral p-6 text-brand-dark">
            <h3 className="text-xl font-black">Contacto y acompanamiento</h3>
            <p className="mt-2 text-sm text-brand-dark/85">
              Canal directo con la escuela para familias e instituciones de la zona.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
