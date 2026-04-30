import { GaleriaPageClient } from "@/components/galeria-page-client";
import { getFotosGaleriaPublicasServer } from "@/lib/server/galeria-public";

export default async function GaleriaPage() {
  const fotos = await getFotosGaleriaPublicasServer();

  return <GaleriaPageClient initialFotos={fotos} />;
}
