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

Implementar API Routes seguras (server-side) para eliminar assets en Cloudinary al borrar novedades/galeria y evitar contenido huerfano.
