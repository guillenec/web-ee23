import { ContactoSection } from "@/components/contacto-section";

export default function ContactoPage() {
  return (
    <main className="page-enter bg-[radial-gradient(circle_at_0%_0%,#c5e4e7_0%,#f6f2ee_45%,#f6f2ee_100%)] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <ContactoSection
          titulo="Estamos para acompanar"
          subtitulo="Acercate a la escuela o escribinos para consultas institucionales y pedagogicas."
        />
      </div>
    </main>
  );
}
