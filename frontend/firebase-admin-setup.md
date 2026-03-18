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

Ejemplo:

```env
NEXT_PUBLIC_ADMIN_EMAILS=escuela23jaco@gmail.com,direccion.ee23@gmail.com
```

## 2) Habilitar login Google en Firebase Auth

1. Firebase Console -> Authentication -> Sign-in method.
2. Habilitar `Google`.
3. Agregar dominio de Vercel en `Authorized domains`.

## 3) Reglas Firestore sugeridas (lectura publica + escritura admin)

Base de referencia (ajustar lista de correos):

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null
        && request.auth.token.email != null
        && request.auth.token.email in [
          'escuela23jaco@gmail.com'
        ];
    }

    match /novedades/{docId} {
      allow read: if resource.data.estado == "publicado";
      allow create, update, delete: if isAdmin();
    }

    match /galeria/{docId} {
      allow read: if resource.data.visible == true;
      allow create, update, delete: if isAdmin();
    }
  }
}
```

## 4) Estado actual del panel

- Ruta: `/admin/novedades`
- Login: Google popup
- Acceso: solo correos incluidos en `NEXT_PUBLIC_ADMIN_EMAILS`
- Si el correo no esta en whitelist: se bloquea acceso
- Carga de novedades: formulario guiado con validacion + guardado directo en Firestore
- Carga de imagenes: URL manual o subida local a Cloudinary (principal y galeria)
- Persistencia de borrador: `localStorage` para evitar perdida al recargar

## 5) Proximo paso recomendado

Implementado: API Routes seguras (server-side) para eliminar assets en Cloudinary al borrar novedades/galeria y evitar contenido huerfano.

Rutas:

- `POST /api/admin/delete-novedad`
- `POST /api/admin/delete-galeria-item`
- `POST /api/admin/ai-novedad-suggest`
- `POST /api/admin/ai-galeria-suggest`

Notas:

- Requieren `Authorization: Bearer <Firebase ID Token>`.
- Validan whitelist admin por email (`NEXT_PUBLIC_ADMIN_EMAILS` o `ADMIN_EMAILS`).
- Borran assets en Cloudinary y luego eliminan documento en Firestore.
- Para nuevas cargas se guarda metadata de media (`publicId`) para borrado exacto.
- Para verificar token en servidor se inicializa Firebase Admin con variables `FIREBASE_ADMIN_*`.
