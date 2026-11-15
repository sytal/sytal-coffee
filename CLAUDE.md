# Sytal Coffee

Laravel 13 + Inertia.js + React restaurant website. Single app, no separate frontend/backend, no full-page reloads (Inertia SPA navigation).

## Stack
- Backend: Laravel 13, MySQL (InnoDB — forced via `config/database.php`, WAMP default is MyISAM)
- Frontend: React via Inertia (`resources/js/`), Vite build
- Auth: Laravel Breeze (React stack)

## Conventions
- All colors come from `resources/js/config/colors.js` — never hardcode hex/rgb in components.
- Components live in `resources/js/Components/`, pages in `resources/js/Pages/`. Keep components small and reusable; extract repeated markup instead of copy-pasting.
- Design source material: `../maison-noir-main` (Next.js structure/UX reference) and `../restaurantly-main` (static HTML visual reference) — port and polish, don't copy verbatim.

## Commands
- Dev: `PHP_INI_SCAN_DIR=":$PWD/php" php artisan serve --port=8011` + `npm run dev` (the scan dir loads `php/uploads.ini`, which raises PHP's 2 MB upload limit so 4 MB admin images work; on FPM hosts `public/.user.ini` does the same; ports 8000/5173 may be occupied by other local WAMP services — check before assuming default ports)
- Admin uploads are saved straight into `public/uploads/` (the `uploads` disk) — no `storage:link` needed
- Migrate: `php artisan migrate`
- Build: `npm run build`

## Notes
- Port 8000 is occupied by another local service on this machine; this app runs on 8011.
- GitHub: https://github.com/sytal/sytal-coffee (public, `main` branch); app repo: https://github.com/sytal/kavo-app
- Brand: KAVO — "Coffee Brings Energy". Live: https://kavo.sytal.io, admin: https://kavo-admin.sytal.io (set `ADMIN_URL`)
