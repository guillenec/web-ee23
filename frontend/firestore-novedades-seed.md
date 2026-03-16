# Firestore seed inicial - coleccion novedades

Este paso se hace desde Firebase Console porque la base esta en modo produccion y las escrituras de cliente estan cerradas por defecto.

## 1) Crear coleccion

- Coleccion: `novedades`
- ID de documento recomendado: `inicio-ciclo-lectivo-2026`

## 2) Cargar primer documento

Campos sugeridos para que impacte en el front actual:

- `titulo` (string): `Inicio del ciclo lectivo 2026 en Region Sur`
- `fecha` (timestamp): fecha actual
- `resumen` (string): `La comunidad educativa de la Escuela Especial N 23 inicio el ciclo lectivo con actividades de bienvenida para estudiantes y familias.`
- `contenido` (string): `Durante la jornada se presentaron propuestas pedagogicas, equipos de acompanamiento y lineas de trabajo territorial en Jacobacci y localidades vecinas.`
- `imagenPrincipal` (string): `/assets/images/hero-frente.jpg`
- `galeria` (array):
  - `/assets/images/alumnos-jardin.jpg`
  - `/assets/images/educacion-vial.jpg`
- `autor` (string): `Equipo directivo`
- `categoria` (string): `Institucional`
- `estado` (string): `publicado`
- `slug` (string): `inicio-ciclo-lectivo-2026`

## 3) Consulta del front

La app consulta `novedades` filtrando por:

- `estado == "publicado"`
- orden por `fecha` descendente

Si hay documentos viejos con `fechaPublicacion`, el front mantiene compatibilidad.
