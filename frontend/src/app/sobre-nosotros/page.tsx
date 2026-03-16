import Image from "next/image";

export default function SobreNosotrosPage() {
  return (
    <main className="page-enter bg-[radial-gradient(circle_at_0%_0%,#c5e4e7_0%,#f6f2ee_45%,#f6f2ee_100%)] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section data-reveal className="grid gap-6 rounded-3xl border border-brand-dark/10 bg-surface p-6 sm:grid-cols-2 sm:p-8">
          <div className="space-y-4">
            <p className="text-xs font-bold tracking-[0.13em] text-brand-main uppercase">Sobre nosotros</p>
            <h1 className="text-3xl font-black text-brand-dark sm:text-4xl">
              Escuela Especial N 23 de Ingeniero Jacobacci
            </h1>
            <p className="text-sm leading-relaxed text-brand-dark/80 sm:text-base">
              Somos una institucion publica de modalidad especial que acompana trayectorias educativas de
              ninas, ninos y adolescentes con apoyos especificos, con una mirada de inclusion, autonomia y
              participacion comunitaria.
            </p>
          </div>
          <Image
            src="/assets/images/hero-frente.jpg"
            alt="Frente de la Escuela Especial N 23"
            width={1200}
            height={800}
            className="h-64 w-full rounded-2xl object-cover"
          />
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <article data-reveal className="rounded-2xl border border-brand-dark/10 bg-surface p-5">
            <h2 className="text-lg font-extrabold text-brand-dark">Mision</h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-dark/80">
              Garantizar el derecho a aprender con propuestas pedagogicas adaptadas y acompanamiento
              personalizado para cada estudiante.
            </p>
          </article>
          <article data-reveal className="rounded-2xl border border-brand-dark/10 bg-surface p-5">
            <h2 className="text-lg font-extrabold text-brand-dark">Vision</h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-dark/80">
              Construir una escuela abierta a la comunidad, con puentes hacia otros espacios educativos,
              sociales y de formacion para la vida adulta.
            </p>
          </article>
          <article data-reveal className="rounded-2xl border border-brand-dark/10 bg-surface p-5">
            <h2 className="text-lg font-extrabold text-brand-dark">Valores</h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-dark/80">
              Respeto por la diversidad, trabajo en equipo, escucha activa de las familias y compromiso con
              la inclusion educativa real.
            </p>
          </article>
        </section>

        <section data-reveal className="rounded-3xl border border-brand-dark/10 bg-surface p-6 sm:p-8">
          <h2 className="text-2xl font-black text-brand-dark">Nuestro enfoque de trabajo</h2>
          <ul className="mt-4 grid gap-3 text-sm text-brand-dark/85 sm:grid-cols-2">
            <li className="rounded-xl border border-brand-dark/10 bg-white/70 p-3">
              Grupos reducidos y estrategias de ensenanza diferenciadas.
            </li>
            <li className="rounded-xl border border-brand-dark/10 bg-white/70 p-3">
              Articulacion permanente con familias y equipos de apoyo.
            </li>
            <li className="rounded-xl border border-brand-dark/10 bg-white/70 p-3">
              Propuestas para autonomia, comunicacion y participacion comunitaria.
            </li>
            <li className="rounded-xl border border-brand-dark/10 bg-white/70 p-3">
              Trabajo territorial en Jacobacci y localidades de Region Sur.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
