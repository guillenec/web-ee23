# Plan de trabajo web institucional

## Escuela Especial N 23 - Ingeniero Jacobacci, Rio Negro

Documento actualizado para arrancar el proyecto con foco en una primera version funcional, administrable y escalable.

---

## 1. Vision del proyecto

Construir la web oficial de la Escuela Especial N 23 para concentrar informacion institucional, publicar novedades, mostrar actividades y fortalecer la comunicacion con familias y comunidad.

La web reemplaza la dependencia exclusiva de redes sociales y deja una base profesional para crecimiento futuro.

---

## 2. Objetivos

### Objetivo general

Crear un sitio institucional claro, accesible y facil de actualizar por el equipo de la escuela.

### Objetivos especificos

- Centralizar informacion oficial y datos de contacto.
- Publicar novedades, actos, eventos y proyectos.
- Mostrar galeria de imagenes institucionales.
- Implementar un panel de administracion simple y seguro.
- Definir una identidad visual consistente con la institucion.

---

## 3. Publico objetivo

- Familias de estudiantes.
- Estudiantes.
- Docentes y equipos de apoyo.
- Comunidad local.
- Otras instituciones y organismos educativos.

### Cobertura territorial

La comunicacion institucional debe representar el trabajo en toda la Region Sur, no solo en Jacobacci.

- Ingeniero Jacobacci.
- Aguada de Guerra.
- Anecon Grande.
- Comallo.
- El Cain.
- Maquinchao.
- Mencue.
- Pilquiniyeu.
- Otras localidades y parajes de la zona.

---

## 4. Alcance de la version 1

### Sitio publico

- Inicio con propuesta institucional y accesos rapidos.
- Institucion (historia, mision, enfoque pedagogico, equipo).
- Novedades (listado y detalle por publicacion).
- Galeria institucional por actividades.
- Contacto (direccion, medios de contacto, mapa, formulario).

### Panel administrativo (interno)

- Login protegido.
- Gestion de novedades (crear, editar, publicar, despublicar).
- Gestion de galeria (subir, ocultar, eliminar).
- Edicion de informacion institucional basica.

### Fuera de alcance para V1 (dejar preparado)

- Area privada para docentes.
- Sistema de comentarios publicos.
- Tramites/formularios avanzados.

---

## 5. Arquitectura propuesta

### Frontend

- Next.js (App Router)
- React
- Tailwind CSS
- TypeScript

### Backend / servicios

- Firebase Authentication (acceso al panel)
- Firestore (novedades, secciones, configuracion)
- Firebase Storage (imagenes y archivos)

### Criterios tecnicos

- Mobile first.
- SEO basico por pagina (meta title + description).
- Accesibilidad (contraste, focus visible, labels correctos).
- Estructura modular para crecer sin rehacer base.

---

## 6. Mapa de rutas sugerido

### Publico

```txt
/
/institucion
/novedades
/novedades/[slug]
/galeria
/contacto
```

### Admin

```txt
/admin/login
/admin
/admin/novedades
/admin/novedades/nueva
/admin/galeria
/admin/configuracion
```

---

## 7. Modelo de contenido minimo

### Novedad

- titulo
- fecha
- resumen
- contenido
- imagenPrincipal
- galeriaOpcional
- autor
- categoria
- estado (`borrador` | `publicado`)
- slug

### Imagen de galeria

- titulo
- descripcion corta
- urlImagen
- fecha
- categoria (acto, proyecto, salida, efemeride)
- visible (si/no)

---

## 8. Historias de usuario priorizadas

1. Como familiar, quiero ver novedades recientes para mantenerme informado.
2. Como visitante, quiero encontrar rapido contacto y ubicacion de la escuela.
3. Como visitante, quiero conocer la propuesta institucional y proyectos.
4. Como administrador, quiero publicar noticias sin depender de terceros.
5. Como administrador, quiero subir imagenes de actividades de forma simple.

---

## 9. Identidad visual (lineamientos confirmados)

### Paleta seleccionada

Se confirma la paleta institucional basada en la referencia elegida (Image 1), con combinacion profesional y calida:

- Marron profundo: `#4B3831`
- Naranja institucional intenso: `#CA4213`
- Naranja apoyo: `#F98C45`
- Gris neutro: `#CBCBCB`
- Celeste suave: `#C5E4E7`

### Enfoque visual

- Estetica institucional, clara y confiable.
- Toque colorido y cercano por el perfil de trabajo con infancias y adolescencias.
- Equilibrio entre sobriedad (estructura) y calidez (acento cromatico).

### Tipografia sugerida

- Titulos: `Lato` o `Anton` (segun pruebas de legibilidad).
- Texto corrido: `Open Sans` o `Source Sans 3`.

### Referencia de color activa

- `image.png` (paleta aprobada)

---

## 10. Privacidad y resguardo institucional

- Publicar fotos solo con autorizacion vigente.
- Evitar datos personales sensibles de estudiantes y familias.
- Definir responsables de revision antes de publicar.
- No habilitar comentarios publicos en V1.

---

## 11. Recursos multimedia disponibles

Se detectaron logos e imagenes institucionales en:

- `/home/guillenec/Imágenes/cee_2026`

Incluye logos en PNG/SVG y banco de fotos para portada, galeria y secciones internas.

---

## 12. Plan de ejecucion por etapas

### Etapa 1 - Base del proyecto

- Inicializacion del frontend.
- Estructura de rutas publicas.
- Sistema de estilos base + componentes comunes.

### Etapa 2 - Contenido publico

- Secciones Inicio, Institucion, Novedades, Galeria y Contacto.
- Carga de contenido semilla (texto + imagenes).

### Etapa 3 - Admin y Firebase

- Login de administracion.
- CRUD de novedades.
- Carga de imagenes a Storage.

### Etapa 4 - Cierre tecnico

- Ajustes de accesibilidad y responsive.
- Pruebas locales (lint, test, build).
- Preparacion para despliegue.

---

## 13. Proximos pasos inmediatos

1. Consolidar reglas de Firestore para produccion con acceso publico solo a `novedades` publicadas.
2. Implementar detalle de publicacion en `/novedades/[slug]` con contenido completo y galeria opcional.
3. Definir pipeline de media para admin: carga de imagenes a Cloudinary y guardado de URLs en Firestore.
4. Incorporar soporte de video por enlace externo (YouTube) dentro del modelo de novedades.
