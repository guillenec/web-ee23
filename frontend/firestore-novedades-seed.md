# Firestore seed inicial - novedades y galeria

Guia rapida para cargar datos manuales desde Firebase Console cuando se parte de una base vacia.

## 1) Coleccion `novedades`

- Coleccion: `novedades`
- ID recomendado: `inicio-ciclo-lectivo-2026`

Campos sugeridos:

- `titulo` (string): `Inicio del ciclo lectivo 2026 en Region Sur`
- `slug` (string): `inicio-ciclo-lectivo-2026`
- `categoria` (string): `Institucional`
- `autor` (string): `Equipo directivo`
- `resumen` (string): breve (180-260 caracteres)
- `contenido` (string): 2-4 parrafos
- `imagenPrincipal` (string): URL Cloudinary
- `imagenPrincipalPublicId` (string): public id Cloudinary de `imagenPrincipal`
- `galeria` (array string): URLs Cloudinary adicionales (opcional)
- `galeriaPublicIds` (array string): public ids en el mismo orden que `galeria` (opcional)
- `fecha` (timestamp): fecha de publicacion
- `estado` (string): `pendiente` o `publicado`

Notas:

- Solo `publicado` se muestra en el sitio publico.
- `pendiente` queda visible para admin y sirve para programar contenidos.

## 2) Coleccion `galeria`

- Coleccion: `galeria`
- ID recomendado: `taller-cocina-familias-2026`

Campos sugeridos:

- `titulo` (string)
- `categoria` (string): `Aulas`, `Territorio`, `Actos`, `Talleres`, `Familias` o `Salidas`
- `descripcion` (string)
- `src` (string): URL Cloudinary
- `urlImagen` (string): misma URL que `src` (compatibilidad)
- `publicId` (string): public id Cloudinary
- `fecha` (timestamp)
- `visible` (boolean): `true` para mostrar en galeria publica

## 3) Reglas de lectura publica usadas por el front

- Novedades: `estado == "publicado"`
- Galeria: `visible == true`

## 4) Recomendacion operativa

Para altas/ediciones normales usar panel admin (`/admin/novedades` y `/admin/galeria`),
asi se guarda metadata de Cloudinary automaticamente y el borrado server-side limpia
tanto Firestore como Cloudinary.
