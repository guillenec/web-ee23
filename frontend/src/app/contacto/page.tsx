import { ContactoSection } from "@/components/contacto-section";

export default function ContactoPage() {
  return (
    <main className="page-enter bg-app px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <ContactoSection
          titulo="Estamos para acompañar"
          subtitulo="Acercate a la escuela o escribinos para consultas institucionales y pedagógicas."
        />
      </div>
    </main>
  );
}
