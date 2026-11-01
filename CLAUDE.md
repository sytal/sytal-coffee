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
- Dev: `php artisan serve --port=8011` + `npm run dev` (ports 8000/5173 may be occupied by other local WAMP services — check before assuming default ports)
- Migrate: `php artisan migrate`
- Build: `npm run build`

## Notes
- Port 8000 is occupied by another local service on this machine; this app runs on 8011.
- GitHub: https://github.com/sytal/sytal-coffee (private, `main` branch)
