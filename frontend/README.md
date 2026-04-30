# Frontend - Escuela Especial N 23

Aplicacion Next.js (App Router) del sitio institucional.

## Stack

- Next.js 16
- Firebase (Auth + Firestore)
- Cloudinary (media)
- YouTube Data API v3 (subida de video desde admin via OAuth)
- OpenRouter (asistente IA en admin)
- Resend (envio de formulario de contacto)

## Ejecutar local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Configuracion

Variables de entorno de referencia en `./.env.example`.

Para subida de video a YouTube configurar:

- `YOUTUBE_CLIENT_ID`
- `YOUTUBE_CLIENT_SECRET`
- `YOUTUBE_REDIRECT_URI`
- `YOUTUBE_REFRESH_TOKEN`

Nota operativa: en Vercel la carga de video se hace en dos pasos (inicio resumable + envio en bloques via API admin) para evitar `413 Content Too Large` y errores CORS del navegador.

Para el formulario de contacto configurar:

- `RESEND_API_KEY`
- `CONTACT_FORM_TO_EMAIL` (ej: `contacto@escuelaespecial23.com`)
- `CONTACT_FORM_FROM_EMAIL` (debe estar validado en Resend; en pruebas puede ser `onboarding@resend.dev`)

Nota operativa contacto: el endpoint `POST /api/contact` aplica controles anti-spam (honeypot, tiempo minimo de completado y limite por IP).

Setup completo de admin, Firebase, Cloudinary e IA en:

- `./firebase-admin-setup.md`
- `./firestore.rules`

## Verificacion

```bash
npm run lint
npm run build
```

## Navegacion

- `TransitionLink` solo usa View Transition API cuando se pasa `useViewTransition`.
- En el estado actual, esa transicion se aplica al flujo de card de novedad hacia su detalle.
