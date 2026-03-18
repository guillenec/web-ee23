# Escuela Especial N 23 - Sitio Web 2026

Repositorio del sitio institucional de la Escuela Especial N 23 (Ingeniero Jacobacci, Rio Negro), construido con Next.js + Firebase + Cloudinary.

## Estructura

- `frontend/`: aplicacion Next.js (App Router)

## Funcionalidades clave

- Landing, secciones institucionales, novedades y galeria publica.
- Panel admin con login Google (whitelist por correo).
- CRUD de novedades y galeria.
- Subida de imagenes a Cloudinary.
- Borrado seguro server-side (Firestore + Cloudinary) para evitar assets huerfanos.
- Asistencia IA en admin para redaccion de novedades y sugerencias en galeria.

## Variables de entorno

Configurar en Vercel (y local) las variables del frontend:

- Publicas (`NEXT_PUBLIC_*`): Firebase cliente, admin emails, Cloudinary upload preset.
- Server-only: `CLOUDINARY_*`, `FIREBASE_ADMIN_*`, `OPENROUTER_*`.

Referencia completa en:

- `frontend/.env.example`
- `frontend/firebase-admin-setup.md`

## Desarrollo local

```bash
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Notas de repositorio

- Los archivos operativos de planificacion (`bitacora`, `plan`, `pr-log`) se mantienen locales y no se versionan en Git.
