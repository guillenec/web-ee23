# Bitacora - Web Institucional Escuela Especial N 23

## Contexto

Proyecto inicial para construir la web institucional de la Escuela Especial N 23.

## Registro de avances

### 2026-03-15

- Se reviso y actualizo `plan_web_escuela23.md` con enfoque en V1, arquitectura, rutas y etapas.
- Se incorporo inventario de recursos visuales disponibles en `/home/guillenec/Imágenes/cee_2026`.
- Se definio que la configuracion de Firebase quedara para la siguiente etapa guiada.
- Se creo esta bitacora para dejar trazabilidad tecnica y funcional.

### 2026-03-16

- Se confirmo paleta oficial para V1 con referencia institucional (Image 1).
- Se incorporaron codigos de color finales al plan: `#4B3831`, `#CA4213`, `#F98C45`, `#CBCBCB`, `#C5E4E7`.
- Se amplio el alcance territorial en el plan para reflejar trabajo en Jacobacci y Region Sur.
- Se limpiaron imagenes de referencia temporales `image-*.png`.
- Se creo base `frontend/` con Next.js, Tailwind y TypeScript.
- Se copiaron logos e imagenes institucionales a `frontend/public/assets` para no depender de rutas externas.
- Se integro una home inicial con estilo institucional, paleta definida y contenido territorial.
- Se agrego base de integracion Firebase en `frontend/src/lib/firebase.ts` y plantilla `frontend/.env.example`.
- Se integro lectura de novedades desde Firestore para portada y pagina dedicada en `frontend/src/app/novedades/page.tsx`.
- Se confirmo creacion de Firestore en `Standard`, modo produccion y ubicacion `southamerica-east1`.
- Se alineo schema de `novedades` a campos editoriales: `titulo`, `fecha`, `resumen`, `contenido`, `imagenPrincipal`, `galeria`, `autor`, `categoria`, `estado`, `slug`.
- Se actualizo `frontend/src/lib/novedades.ts` para leer `fecha` y mantener compatibilidad con `fechaPublicacion`.
- Se amplio `frontend/src/components/novedades-preview.tsx` para mostrar imagen principal, categoria y autor.
- Se habilito dominio de Firebase Storage en `frontend/next.config.ts` para imagenes remotas.
- Se habilito tambien `res.cloudinary.com` en `frontend/next.config.ts` para soportar `imagenPrincipal` desde Cloudinary.
- Se documento carga semilla en `frontend/firestore-novedades-seed.md` para crear primer documento publicado.
- Se ajusto lectura de `novedades` para evitar dependencia de indice compuesto (`estado + fecha`) y ordenar por fecha del lado cliente.
- Se agrego cache en memoria (TTL 60s) para evitar reconsultas consecutivas de novedades entre portada y listado.
- Se reemplazo link de "Ver todas" por `next/link` para navegacion cliente mas fluida.

## Proximos hitos

- Crear base frontend (Next.js + Tailwind + TypeScript).
- Maquetar estructura de paginas publicas y estilos institucionales.
- Configurar Firebase Auth, Firestore y Storage.
- Cargar contenido inicial real de la escuela.

## Riesgos y consideraciones

- Validar permisos de uso de imagenes antes de publicar.
- Confirmar responsables internos para alta/edicion de contenidos.
- Priorizar rendimiento y acceso desde celular por conectividad local.
