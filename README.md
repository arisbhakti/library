# Booky - Digital Library Frontend

> [!NOTE]
> Dokumentasi ini merangkum implementasi aktual project `Booky` pada codebase saat ini: teknologi, arsitektur, komponen shadcn/ui yang dipakai, flow implementasi, endpoint API internal, dan error yang pernah muncul beserta penanganannya.

## Quick Overview

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.3-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-v5-FF4154)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Enabled-111111)

## Deskripsi Aplikasi

`Booky` adalah aplikasi frontend perpustakaan digital dengan dua role utama:

- `USER`: jelajah buku, pinjam buku, kelola cart, lihat riwayat pinjam, tulis review, dan update profil.
- `ADMIN`: kelola data buku, user, dan monitoring status peminjaman.

Aplikasi menggunakan **Next.js App Router** sebagai UI dan server route API (`/app/api/*`) sebagai proxy ke backend utama melalui env `BASE_URL_API_LIBRARY`.

## Fitur Utama

- Authentication (login/register) berbasis token.
- Role-based routing (`USER` diarahkan ke flow user, `ADMIN` ke dashboard admin).
- Home recommendation, popular author, category browsing, dan detail buku.
- Cart + checkout + peminjaman (single borrow atau borrow from cart).
- User profile management (update nama, phone, foto).
- User review management dan riwayat peminjaman.
- Admin tabs untuk `Book List`, `User`, dan `Borrowed List`.
- UI toast feedback, skeleton loading, dialog confirmation, dan tab transition animation.

## Teknologi yang Digunakan

| Layer | Teknologi | Kegunaan |
| --- | --- | --- |
| Framework | `next@16.1.6` | App Router, API Routes, Metadata API |
| UI Library | `react@19.2.3`, `react-dom@19.2.3` | Komponen dan interaksi UI |
| Language | `typescript@5` | Type safety |
| Styling | `tailwindcss@4`, `@tailwindcss/postcss`, `tw-animate-css` | Styling utility dan animation classes |
| Data Fetching | `@tanstack/react-query@5`, `axios` | Query caching dan HTTP client |
| State Management | `@reduxjs/toolkit` | State cart global |
| UI Primitives | `shadcn` + `radix-ui` + `@base-ui/react` | Reusable accessible components |
| Icons | `lucide-react`, `react-icons` | Icon set |
| Utility | `class-variance-authority`, `clsx`, `tailwind-merge`, `dayjs` | Utility styling dan date formatting |
| Motion | `framer-motion` | Transition/animation pada layout |

## Arsitektur Singkat

```text
UI Pages (App Router)
  -> lib/tanstack-api.ts (React Query + Axios)
  -> /api/* (Next.js Route Handlers sebagai proxy)
  -> External Backend (BASE_URL_API_LIBRARY)
```

### Komponen Arsitektur

1. `app/*`: halaman UI dan layout.
2. `app/api/*`: internal API gateway/proxy ke backend eksternal.
3. `lib/tanstack-api.ts`: data layer untuk query/mutation.
4. `lib/auth.ts`: auth utilities (token/user storage + helper role).
5. `lib/redux/*`: state cart (`itemCount`, `items`).
6. `components/ui/*`: shadcn/ui components + custom wrappers.

## Struktur Folder Utama

```text
app/
  (site)/
    page.tsx
    home/page.tsx
    category/page.tsx
    detail/[id]/page.tsx
    cart/page.tsx
    checkout/page.tsx
    profile/page.tsx
    list/page.tsx
    book/page.tsx
    preview/[id]/page.tsx
  api/
    auth/*
    books/*
    categories/*
    cart/*
    loans/*
    me/*
    reviews/*
    admin/*
components/
  layout/
  home/
  ui/
lib/
  auth.ts
  tanstack-api.ts
  redux/
```

## Komponen shadcn/ui yang Dipakai

Komponen berikut **terdeteksi dipakai** dari import aktual (`@/components/ui/*`):

| Komponen | Digunakan di Area |
| --- | --- |
| `app-toast` | providers, login/register, profile, book form, checkout, cart, detail, preview |
| `avatar` | header, home, detail, profile, author page |
| `breadcrumb` | detail buku |
| `button` | hampir seluruh halaman utama + komponen internal |
| `card` | profile reviews |
| `checkbox` | cart, category filter, checkout |
| `combobox` | admin book form |
| `dialog` | cart dan beberapa action profile/admin |
| `dropdown-menu` | header user/admin menu |
| `input` | header search, profile form, book form, sidebar internals |
| `input-group` | internal combobox utilities |
| `radio-group` | checkout payment/form options |
| `separator` | sidebar internals |
| `sheet` | sidebar internals |
| `sidebar` | category page filter panel |
| `skeleton` | loading state di home/detail/list/profile/admin |
| `tabs` | profile page dan admin list page |
| `textarea` | book form |
| `tooltip` | sidebar internals |

## Flow Implementasi

<details>
<summary><strong>Flow 1 - Bootstrapping & Providers</strong></summary>

1. `app/layout.tsx` memuat metadata global, icon, viewport, dan font.
2. `app/providers.tsx` inject `QueryClientProvider` dan `AppToastProvider`.
3. User masuk ke route sesuai URL App Router.

</details>

<details>
<summary><strong>Flow 2 - Authentication (Login/Register)</strong></summary>

1. User submit form `login` atau `register`.
2. UI memanggil `lib/auth.ts` (`login`, `register`) ke `/api/auth/*`.
3. Route handler proxy request ke backend `BASE_URL_API_LIBRARY`.
4. Jika login sukses, token + user disimpan di localStorage (`saveAuthSession`).
5. Redirect otomatis berdasarkan role:
   - `ADMIN` -> `/list`
   - `USER` -> `/home`

</details>

<details>
<summary><strong>Flow 3 - Route Guard & Role Access</strong></summary>

1. `app/(site)/layout.tsx` cek token + role saat route berubah.
2. Role `ADMIN` dibatasi ke area admin (`/list`, `/book`, `/preview`).
3. Role `USER` diarahkan keluar dari area admin ke `/home`.
4. Header ikut sinkron via event `AUTH_STATE_CHANGED_EVENT`.

</details>

<details>
<summary><strong>Flow 4 - Data Fetching & Caching</strong></summary>

1. Halaman memanggil hook dari `lib/tanstack-api.ts`.
2. Hook memakai `axios` ke internal API `/api/*`.
3. API route memvalidasi input/token lalu forward ke backend utama.
4. Response dikembalikan ke UI, cache dikelola TanStack Query.

Hook utama yang dipakai:

- `useRecommendationInfiniteQuery`
- `usePopularAuthorsInfiniteQuery`
- `useCategoriesQuery`
- `useBookDetailQuery`
- `useBooksInfiniteQuery`
- `useCartQuery`
- `useCheckoutQuery`
- `useMyProfileQuery`
- `useMyLoansInfiniteQuery`
- `useMyReviewsInfiniteQuery`
- `useAdminUsersQuery`
- `useAdminBooksInfiniteQuery`
- `useAdminLoansInfiniteQuery`

</details>

<details>
<summary><strong>Flow 5 - Cart, Borrow, Return, Review</strong></summary>

1. User tambah buku ke cart (`/api/cart/items`).
2. Cart state disinkronkan ke Redux (`setCartState`) untuk badge/header.
3. Checkout menarik detail item + user (`/api/cart/checkout`).
4. Borrow bisa dari cart (`/api/loans/from-cart`) atau satuan (`/api/loans`).
5. Return buku via `/api/loans/[id]/return`.
6. User kirim review via `/api/reviews`.

</details>

<details>
<summary><strong>Flow 6 - Admin Management</strong></summary>

1. Admin buka `/list` (tab User, Book List, Borrowed List).
2. Data user/books/loans diambil dari endpoint admin.
3. CRUD buku via `/api/books` dan `/api/books/[id]`.
4. Preview/detail admin didukung di route `/preview/[id]` dan `/book`.

</details>

## Daftar Internal API Endpoints

| Endpoint | Method | Keterangan |
| --- | --- | --- |
| `/api/auth/login` | `POST` | Login user |
| `/api/auth/register` | `POST` | Register user |
| `/api/me` | `GET`, `PATCH` | Ambil dan update profile |
| `/api/me/reviews` | `GET` | List review milik user |
| `/api/categories` | `GET` | List kategori |
| `/api/authors` | `GET` | List author |
| `/api/authors/popular` | `GET` | Popular authors |
| `/api/authors/[id]/books` | `GET` | Buku berdasarkan author |
| `/api/books` | `GET`, `POST` | List buku + create buku |
| `/api/books/[id]` | `GET`, `PUT`, `DELETE` | Detail/update/delete buku |
| `/api/books/recommend` | `GET` | Buku rekomendasi |
| `/api/cart` | `GET` | Ambil cart |
| `/api/cart/items` | `POST` | Tambah item cart |
| `/api/cart/items/[id]` | `DELETE` | Hapus item cart |
| `/api/cart/checkout` | `GET` | Data checkout |
| `/api/loans` | `POST` | Borrow single book |
| `/api/loans/from-cart` | `POST` | Borrow dari cart |
| `/api/loans/my` | `GET` | Riwayat pinjam user |
| `/api/loans/[id]/return` | `PATCH` | Return buku |
| `/api/reviews` | `POST` | Create review |
| `/api/admin/users` | `GET` | List user admin |
| `/api/admin/books` | `GET` | List buku admin |
| `/api/admin/loans` | `GET` | List peminjaman admin |

## Environment Variables

Buat file `.env`:

```bash
BASE_URL_API_LIBRARY=https://your-backend-domain/api/
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Keterangan:

- `BASE_URL_API_LIBRARY` wajib untuk semua route API proxy.
- `NEXT_PUBLIC_SITE_URL` dan `NEXT_PUBLIC_APP_URL` dipakai untuk metadata base URL.

## Setup & Menjalankan Project

### Prasyarat

- Node.js `>= 20` (direkomendasikan untuk Next.js 16).
- npm (atau package manager lain yang kompatibel).

### Instalasi

```bash
npm install
```

### Development

```bash
npm run dev
```

Akses: `http://localhost:3000`

### Build Production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Error yang Pernah Didapatkan & Cara Menangani

| Error | Lokasi/Konteks | Penyebab | Penanganan |
| --- | --- | --- | --- |
| `Type 'number' is not assignable to type 'Timeout'` | `app/register/page.tsx` saat `next build` | Tipe `useRef` timeout tidak konsisten antara browser dan Node typings | Ubah ref ke `useRef<number | null>` untuk `window.setTimeout` |
| Favicon tetap logo Vercel | Browser tab icon | Browser cache + file favicon default belum override | Ganti `app/favicon.ico`, tambah `app/icon.svg`, versioning URL icon metadata, lakukan hard refresh |
| Build gagal fetch font Quicksand dari Google | `npm run build` di environment tanpa koneksi keluar | `next/font/google` perlu akses internet saat build | Jalankan build dengan internet aktif atau ganti ke local font (`next/font/local`) |
| `BASE_URL_API_LIBRARY belum dikonfigurasi` (500) | Semua route `/api/*` proxy | Env backend tidak ada/invalid | Set env `BASE_URL_API_LIBRARY` di `.env` |
| `Authorization token wajib diisi` (401) | Route proteksi (`/api/me`, `/api/cart/*`, `/api/admin/*`, dll.) | Header auth tidak dikirim | Pastikan token tersimpan saat login dan dikirim via header `Authorization` |

## Catatan Implementasi Tambahan

- `app/(site)/profile/page.tsx` dan `app/(site)/list/page.tsx` sudah memakai transisi tab content (`animate-in + fade + slide`).
- Metadata global, icon, manifest, dan viewport dikelola di `app/layout.tsx` dan `app/manifest.ts`.
- API route di `app/api/*` berfungsi sebagai anti-coupling layer antara frontend dan backend.

## Lisensi

Project ini digunakan untuk kebutuhan pembelajaran/bootcamp internal.
