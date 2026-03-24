# Admin + Firebase (siguiente etapa)

Esta guia deja listo el panel `/admin/novedades` con login Google y whitelist por correo.

## 1) Variables de entorno

En Vercel y local, definir:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ADMIN_EMAILS` (lista separada por coma)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (preset unsigned para cargas desde navegador)
- `CLOUDINARY_CLOUD_NAME` (solo server)
- `CLOUDINARY_API_KEY` (solo server)
- `CLOUDINARY_API_SECRET` (solo server)
- `FIREBASE_ADMIN_PROJECT_ID` (solo server)
- `FIREBASE_ADMIN_CLIENT_EMAIL` (solo server)
- `FIREBASE_ADMIN_PRIVATE_KEY` (solo server; mantener saltos de linea como `\n`)
- `OPENROUTER_API_KEY` (solo server)
- `OPENROUTER_MODEL` (solo server)
- `OPENROUTER_BASE_URL` (opcional; por defecto `https://openrouter.ai/api/v1`)
- `YOUTUBE_CLIENT_ID` (solo server)
- `YOUTUBE_CLIENT_SECRET` (solo server)
- `YOUTUBE_REDIRECT_URI` (solo server)
- `YOUTUBE_REFRESH_TOKEN` (solo server; token offline del canal conectado)

Ejemplo:

```env
NEXT_PUBLIC_ADMIN_EMAILS=guillermoneculqueo@gmail.com,escuelaespecial023@gmail.com
```

## 2) Habilitar login Google en Firebase Auth

1. Firebase Console -> Authentication -> Sign-in method.
2. Habilitar `Google`.
3. Agregar dominio de Vercel en `Authorized domains`.

## 3) Reglas Firestore productivas (lectura publica + escritura admin)

Las reglas activas de referencia quedaron en `frontend/firestore.rules`.

Cobertura:

- `novedades`: lectura publica solo si `estado == "publicado"`.
- `galeria`: lectura publica solo si `visible == true`.
- Los admins autenticados pueden leer todos los documentos (incluye `pendiente` y ocultos).
- Escritura (`create/update/delete`) solo para admins autenticados por email.
- Denegacion explicita para cualquier otro documento/ruta.

Admins incluidos en el archivo de reglas:

- `guillermoneculqueo@gmail.com`
- `escuelaespecial023@gmail.com`

Aplicacion manual en Firebase Console:

1. Firebase Console -> Firestore Database -> Rules.
2. Copiar el contenido de `frontend/firestore.rules`.
3. Publicar reglas.

## 4) Estado actual del panel

- Ruta: `/admin/novedades`
- Login: Google popup
- Acceso: solo correos incluidos en `NEXT_PUBLIC_ADMIN_EMAILS`
- Si el correo no esta en whitelist: se bloquea acceso
- Carga de novedades: formulario guiado con validacion + guardado directo en Firestore
- Carga de imagenes: URL manual o subida local a Cloudinary (principal y galeria)
- Carga de video: URL manual de YouTube o subida desde equipo a canal YouTube conectado (OAuth)
- Persistencia de borrador: `localStorage` para evitar perdida al recargar

### Troubleshooting rapido: no se listan pendientes/publicadas

Si en `/admin/novedades/ver` aparece error de carga, revisar estos puntos:

1. En Firestore Rules, `match /novedades/{docId}` debe incluir `allow read: if isPublished() || isAdmin();`
2. Confirmar que el correo logueado en Google coincide exacto con alguno de `NEXT_PUBLIC_ADMIN_EMAILS`.
3. Cerrar sesion y volver a iniciar para refrescar `request.auth.token.email`.

## 5) Proximo paso recomendado

Implementado: API Routes seguras (server-side) para eliminar assets en Cloudinary al borrar novedades/galeria y evitar contenido huerfano.

Rutas:

- `POST /api/admin/delete-novedad`
- `POST /api/admin/delete-galeria-item`
- `POST /api/admin/ai-novedad-suggest`
- `POST /api/admin/ai-galeria-suggest`
- `GET /api/admin/youtube/oauth/start`
- `GET /api/admin/youtube/oauth/callback`
- `POST /api/admin/youtube/upload`

Notas:

- Requieren `Authorization: Bearer <Firebase ID Token>`.
- Validan whitelist admin por email (`NEXT_PUBLIC_ADMIN_EMAILS` o `ADMIN_EMAILS`).
- Borran assets en Cloudinary y luego eliminan documento en Firestore.
- Al eliminar novedades con video YouTube, se muestra recordatorio para borrado manual en YouTube Studio.
- Para nuevas cargas se guarda metadata de media (`publicId`) para borrado exacto.
- Para verificar token en servidor se inicializa Firebase Admin con variables `FIREBASE_ADMIN_*`.
