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
- Se rediseno el hero de portada: mayor altura, bloque de contenido con fondo translcido y mejor contraste para titulos y botones.
- Se incorporaron animaciones nuevas (`hero-pan`, `card-lift`, `cta-pop`) con soporte `prefers-reduced-motion`.
- Se detecto y corrigio formato invalido en `frontend/.env` (valores con comillas y coma final) que bloqueaba consultas a Firestore.
- Se verifico lectura de `novedades` desde Firestore con documento publicado real y se normalizo uso de campo `galeria` (sin tilde).
- Se valido integracion de imagen principal con Cloudinary en el listado de novedades.
- Se ajusto `frontend/src/lib/novedades.ts` para evitar ocultar documentos sin `estado` en Firebase Console: ahora se trae lote amplio y se filtra en cliente (`borrador` fuera, resto publicado).
- Se agregaron fallbacks editoriales en portada/listado: si faltan `titulo` o `resumen`, se derivan desde `contenido` para que cada alta manual se vea reflejada.
- Se revierte el ajuste anterior de `novedades`: se mantiene filtro estricto `estado == "publicado"` en Firestore para respetar reglas de seguridad productivas.
- Se incorpora bloque `Sobre nosotros` en `frontend/src/app/page.tsx` con descripcion institucional, enfoque pedagogico y ejes de comunidad/accesibilidad.
- Se toma como referencia publica complementaria la ficha de institucion en `ifts1.com.ar` para enriquecer texto de presentacion.
- Se implementa apertura de novedad en pantalla completa con nueva ruta `frontend/src/app/novedades/[slug]/page.tsx` y tarjetas clickeables.
- Se agregan transiciones entre paginas con `View Transition API` via `frontend/src/components/transition-link.tsx` (con fallback si el navegador no soporta).
- Se incorporan animaciones de entrada y de scroll reveal reutilizables (`page-enter`, `data-reveal`) con observador en `frontend/src/components/scroll-reveal.tsx`.
- Se agrega footer institucional reutilizable en `frontend/src/components/site-footer.tsx` y se integra en portada, listado y detalle.
- Se reemplazan assets base de Next/Vercel: favicon por `frontend/src/app/icon.png` y nuevos logos institucionales en `frontend/public/assets/logos`.
- Se unifica navegacion global en todas las rutas con header fijo reutilizable (`frontend/src/components/site-header.tsx`) y logo clickeable al inicio.
- Se reestructura `frontend/src/app/layout.tsx` para mantener header/footer persistentes y evitar saltos visuales al navegar.
- Se agrega seccion de galeria real con categorias y filtros en `frontend/src/app/galeria/page.tsx` usando `frontend/src/lib/galeria.ts`.
- Se suma pagina completa de `Sobre nosotros` en `frontend/src/app/sobre-nosotros/page.tsx` con mision, vision, valores y enfoque institucional.
- Se crea panel admin minimo para prevalidar cargas de novedades en `frontend/src/app/admin/novedades/page.tsx` con salida JSON lista para Firebase.
- Se incorporan esqueletos de carga para listado y detalle de novedades en `frontend/src/app/novedades/loading.tsx` y `frontend/src/app/novedades/[slug]/loading.tsx`.
- Se mejora experiencia de carga en tarjetas y detalle con placeholders para evitar cortes visuales durante transiciones.
- Se corrige desborde en `frontend/src/app/admin/novedades/page.tsx`: columnas con `minmax(0, ...)`, contenedores `min-w-0` y bloque JSON con `break-all` + altura maxima scrolleable.
- Se incorpora seccion de contacto con mapa embebido, direccion exacta y horarios institucionales en portada (`frontend/src/components/contacto-section.tsx`).
- Se agrega pagina dedicada `frontend/src/app/contacto/page.tsx` y se actualiza boton de header para navegar a esa ruta desde cualquier pagina.
- Se normaliza informacion de contacto en `frontend/src/lib/contacto.ts` (telefono, email, Facebook, coordenadas y links de Maps).
- Se actualiza footer (`frontend/src/components/site-footer.tsx`) para reflejar telefono y email institucional vigentes.
- Se optimiza bloque de horarios para ocupar menos espacio: resumen visible + detalle semanal desplegable en la seccion de contacto.
- Se transforman canales de contacto en botones de accion (WhatsApp, Email y Facebook) siguiendo paleta institucional.
- Se incorpora formulario de contacto directo (`frontend/src/components/contacto-form.tsx`) con validacion basica y salida por `mailto` para integracion futura con envio automatico.
- Se ajusta composicion desktop del bloque de contacto: formulario con ancho controlado y panel visual lateral con logo institucional para equilibrar la seccion.
- Se simplifica la portada: se reemplaza el bloque completo de contacto por una version resumida con CTA a `/contacto`, manteniendo mapa y accesos rapidos.
- Se implementa menu hamburguesa en mobile para `frontend/src/components/site-header.tsx`, evitando deformaciones y manteniendo navegacion completa en pantallas pequenas.
- Se homogeneiza la fila de cards en portada (`Novedades`, `Galeria institucional`, `Contacto y acompanamiento`) agregando CTA en las tres para mantener formato visual consistente.
- Se ajusta branding en pestana del navegador con `frontend/src/app/favicon.ico` generado desde logo institucional.
- Se fortalece SEO tecnico en `frontend/src/app/layout.tsx` (title template, canonical, Open Graph, Twitter, robots e iconos declarados).
- Se agregan `frontend/src/app/robots.ts` y `frontend/src/app/sitemap.ts` para indexacion consistente en despliegue.
- Se define `noindex` para rutas admin via `frontend/src/app/admin/layout.tsx` y se documenta `NEXT_PUBLIC_SITE_URL` en `frontend/.env.example`.
- Se realiza primer deploy productivo en Vercel con URL publica `https://escuela-especial-23.vercel.app/`.
- Se alinea fallback SEO/canonical/sitemap/robots al dominio productivo actual en `layout.tsx`, `robots.ts`, `sitemap.ts` y `.env.example`.
- Se implementa guard de acceso admin con Google Sign-In y whitelist de correos (`frontend/src/components/admin-access-gate.tsx`).
- Se integra el guard en `frontend/src/app/admin/layout.tsx` para proteger rutas administrativas.
- Se agrega helper de permisos por email en `frontend/src/lib/admin-auth.ts` y variable `NEXT_PUBLIC_ADMIN_EMAILS` en `frontend/.env.example`.
- Se documenta configuracion de Auth + reglas Firestore para admin en `frontend/firebase-admin-setup.md`.
- Se evoluciona `frontend/src/app/admin/novedades/page.tsx` a panel mas intuitivo para perfiles no tecnicos: pasos guiados, placeholders y mensajes de estado claros.
- Se agrega generacion automatica de slug desde el titulo (editable manualmente) para reducir errores de carga.
- Se implementa guardado directo en Firestore desde el panel admin (`setDoc` con ID=slug), con feedback de exito/error y accion de limpieza del formulario.
- Se agrega soporte de galeria en panel admin: lista de URLs con alta/baja y persistencia a Firestore en campo `galeria`.
- Se habilita carga local de imagen principal y galeria hacia Cloudinary (requiere `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` y `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`).
- Se incorpora borrador automatico en `localStorage` del navegador para evitar perdida de datos al recargar la pagina.
- Se crea y valida preset `ee23_unsigned` en Cloudinary (`folder: ee_23/novedades`, modo unsigned) para habilitar subidas directas desde el panel admin.
- Se confirma prueba funcional en local: subida desde equipo (imagen principal y galeria) + guardado de novedad en Firestore.
- Se deja preconfigurada integracion IA para etapa siguiente: variables `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` y `OPENROUTER_BASE_URL` agregadas en entorno local y Vercel.
- Se ejecuta redeploy/rollback en Vercel para consolidar variables de entorno antes de implementar el boton de sugerencias IA en admin.

### 2026-03-17

- Se crea dashboard admin inicial en `frontend/src/app/admin/page.tsx` con accesos directos a modulos de contenidos.
- Se agrega navegacion interna de panel en `frontend/src/components/admin-dashboard-nav.tsx` y se integra en `frontend/src/app/admin/layout.tsx`.
- Se evoluciona `frontend/src/app/admin/novedades/page.tsx` a CRUD completo: crear, editar, actualizar slug y eliminar publicaciones.
- Se incorpora listado de novedades en admin con acciones de edicion/eliminacion y recarga desde Firestore.
- Se centraliza carga de imagenes a Cloudinary en `frontend/src/lib/cloudinary.ts` para reutilizar en modulos admin.
- Se crea `frontend/src/app/admin/galeria/page.tsx` con gestion completa de galeria: alta, edicion, visibilidad y eliminacion.
- Se habilita lectura publica de galeria desde Firestore en `frontend/src/lib/galeria.ts` y fallback local en `frontend/src/app/galeria/page.tsx`.
- Se ajusta acceso principal de navegacion para admin hacia `frontend/src/components/site-header.tsx` con destino `/admin`.
- Se normaliza compatibilidad de campos de galeria (`src`, `urlImagen` y `usImagen`) y categorias en mayusculas/minusculas para tolerar cargas manuales desde Firebase Console.
- Se elimina fallback hardcodeado de galeria publica para mostrar solo datos reales de Firestore (con estado vacio cuando aun no hay imagenes publicadas).
- Se incorpora sistema de notificaciones visuales con `sonner` en `frontend/src/components/app-toaster.tsx` y eventos de exito/error en modulos admin.
- Se agrega bloque de pasos guiados en `frontend/src/app/admin/galeria/page.tsx` para facilitar uso por perfiles no tecnicos.
- Se ajusta UX de notificaciones admin: los toasts ya no se disparan al cargar listas al navegar entre modulos; se mantienen para acciones explicitas (guardar, editar, eliminar, subir).
- Se elimina bloque de pasos sugeridos en formulario de galeria por feedback de uso para mejorar limpieza visual.
- Se implementa visor ampliado en `frontend/src/app/galeria/page.tsx`: clic en imagen abre modal fullscreen con transicion, cierre por boton/fondo y tecla `Esc`.
- Se completa accion rapida de estado en CRUD de novedades (`publicado` <-> `borrador`) desde listado admin en `frontend/src/app/admin/novedades/page.tsx`.
- Se habilita borrado rapido en cards publicas para administradores logueados: icono de tacho en `/novedades` (`frontend/src/components/novedades-preview.tsx`) y `/galeria` (`frontend/src/app/galeria/page.tsx`) con confirmacion previa y eliminacion en Firestore.
- Se revierte accion rapida de cambio de estado en listado admin de novedades por feedback operativo, priorizando flujo simple de edicion/eliminacion.
- Se suma edicion rapida en cards publicas para administradores: icono de lapiz en `/novedades` y `/galeria` con modal de actualizacion y guardado directo en Firestore.
- Se valida flujo operativo de borrado/edicion desde cards publicas para admins y se confirma eliminacion de documentos en Firestore.
- Se documenta preparacion para siguiente etapa de limpieza de medios: variables server `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET` para borrar assets al eliminar contenido.

## Proximos hitos

- Definir reglas finales de Firestore para entorno productivo (lectura publica de publicados + escritura admin).
- Implementar detalle de novedad en ruta `frontend/src/app/novedades/[slug]/page.tsx`.
- Diseñar flujo de carga de imagenes desde admin a Cloudinary y persistencia en Firestore.
- Modelar soporte de video por enlace (YouTube) en publicaciones.

## Riesgos y consideraciones

- Validar permisos de uso de imagenes antes de publicar.
- Confirmar responsables internos para alta/edicion de contenidos.
- Priorizar rendimiento y acceso desde celular por conectividad local.
