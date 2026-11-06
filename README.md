# Laravel Route Viewer

Visualisasi route aplikasi Laravel. Membaca impor data Artisan dan route aplikasi viewer ini sendiri; tidak mengakses proyek lain tanpa data dari pengguna.

## Fitur

- Import JSON hasil php artisan route:list --json melalui file atau teks.
- HTTP method, URI, nama route, controller/action, middleware, dan domain.
- Pencarian, filter method/prefix, pengelompokan prefix, export JSON dan CSV.
- Integrasi lokal terbatas pada route aplikasi ini.

## Teknologi

Laravel 13, Blade, Tailwind CSS 4, TypeScript, Vite, Vitest, PHPUnit.

## Cara menjalankan

Memerlukan PHP 8.4+, Composer, dan Node.js 22.12+. Arahkan document root Laragon ke folder `public`.

```sh
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm ci
npm run build
php artisan serve
```

Buka http://127.0.0.1:8000. Jalankan `php artisan test` dan `npm test` untuk pengujian.
