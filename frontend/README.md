# Frontend - Escuela Especial N 23

Aplicacion Next.js (App Router) del sitio institucional.

## Stack

- Next.js 16
- Firebase (Auth + Firestore)
- Cloudinary (media)
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

Para el formulario de contacto configurar:

- `RESEND_API_KEY`
- `CONTACT_FORM_TO_EMAIL`
- `CONTACT_FORM_FROM_EMAIL` (en pruebas puede ser `onboarding@resend.dev`)

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
