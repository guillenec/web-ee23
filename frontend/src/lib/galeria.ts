export type FotoGaleria = {
  id: string;
  titulo: string;
  categoria: "Aulas" | "Territorio" | "Actos";
  descripcion: string;
  src: string;
};

export const fotosGaleria: FotoGaleria[] = [
  {
    id: "aula-jardin",
    titulo: "Propuestas en primera infancia",
    categoria: "Aulas",
    descripcion: "Actividades de juego y estimulacion en espacios pedagogicos cuidados.",
    src: "/assets/images/alumnos-jardin.jpg",
  },
  {
    id: "jornada-vial",
    titulo: "Aprendizaje para la vida diaria",
    categoria: "Territorio",
    descripcion: "Jornadas de educacion vial y autonomia con estudiantes y familias.",
    src: "/assets/images/educacion-vial.jpg",
  },
  {
    id: "acto-institucional",
    titulo: "Celebraciones institucionales",
    categoria: "Actos",
    descripcion: "Actos escolares como espacios de encuentro y pertenencia comunitaria.",
    src: "/assets/images/acto-tradicion.jpg",
  },
  {
    id: "frente-escuela",
    titulo: "Escuela en Ingeniero Jacobacci",
    categoria: "Territorio",
    descripcion: "Sede institucional de referencia para comunidades de Region Sur.",
    src: "/assets/images/hero-frente.jpg",
  },
];
