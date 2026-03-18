# Frontend - Escuela Especial N 23

Aplicacion Next.js (App Router) del sitio institucional.

## Stack

- Next.js 16
- Firebase (Auth + Firestore)
- Cloudinary (media)
- OpenRouter (asistente IA en admin)

## Ejecutar local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Configuracion

Variables de entorno de referencia en `./.env.example`.

Setup completo de admin, Firebase, Cloudinary e IA en:

- `./firebase-admin-setup.md`
- `./firestore.rules`

## Verificacion

```bash
npm run lint
npm run build
```
