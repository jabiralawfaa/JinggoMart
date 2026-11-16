# JinggoMart

Katalog & dashboard produk UMKM Banyuwangi — versi **production** dari prototipe
single-HTML `JinggoMart-prototype.html`, dengan autentikasi 3 peran (admin,
seller, pembeli) dan database **Prisma + SQLite**.

> Salam ✱Kuntul Barong!

## Tech stack

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript
- **Prisma 6** + SQLite (file lokal)
- **Tailwind CSS v4**
- Auth: **JWT (jose)** di cookie `httpOnly` + **bcryptjs** untuk hash password

## Fitur

| Peran | Akses |
|---|---|
| **Admin** | Kelola semua produk, semua pengguna (ubah role / hapus), lihat statistik global. |
| **Seller** | Kelola **hanya produk miliknya** (CRUD + unggah gambar), lihat ringkasan tokonya. |
| **Pembeli** | Lihat katalog, cari/filter/urutkan, pesan via WhatsApp. |

- Katalog: hero Osing, marquee, pencarian real-time, filter kategori, sorting, badge unggulan, indikator stok habis, tombol **Pesan via WhatsApp** (`wa.me/6281234567890`).
- Dashboard role-aware (admin vs seller) dengan 4–6 kartu ringkasan, tabel produk, form tambah/edit (validasi inline + unggah gambar dikompres ke 800px JPEG), dan manajemen pengguna (admin).
- RBAC ditegakkan di **server** (server component + route handler), bukan hanya di UI.
- Logo SVG JinggoMart (bunga Gajah Oling + wordmark) di header, footer, dan favicon.
- Mode gelap/terang mengikuti `prefers-color-scheme`; pilihan tersimpan di `localStorage` (`jinggomart_theme`) dan bisa diubah lewat tombol bulan/matahari di header.
- Seed data dummy: 4 akun + 10 produk.

## Menjalankan

Prasyarat: Node.js 20.9+ dan pnpm.

```bash
pnpm install

# 1) siapkan database & data dummy
cp .env.example .env        # sesuaikan AUTH_SECRET bila perlu
pnpm db:migrate             # = prisma migrate dev (membuat DB + generate client)
pnpm db:seed                # = prisma db seed (data dummy) — otomatis dijalankan saat migrate

# 2) jalankan
pnpm dev                    # http://localhost:3000
```

Build produksi:

```bash
pnpm build
pnpm start
```

## Akun dummy (seed)

| Peran | Email | Password |
|---|---|---|
| Admin | `admin@jinggomart.id` | `admin123` |
| Seller | `seller@jinggomart.id` | `seller123` |
| Seller 2 | `seller2@jinggomart.id` | `seller123` |
| Pembeli | `pembeli@jinggomart.id` | `pembeli123` |

## Script

| Perintah | Keterangan |
|---|---|
| `pnpm dev` | Dev server (Turbopack) |
| `pnpm build` / `pnpm start` | Build & jalankan produksi |
| `pnpm db:migrate` | `prisma migrate dev` |
| `pnpm db:generate` | `prisma generate` |
| `pnpm db:seed` | Isi data dummy |
| `pnpm db:studio` | Prisma Studio (GUI database) |

## Struktur proyek

```
prisma/
  schema.prisma          # model User & Product, enum Role & Kategori
  seed.ts                # data dummy
src/
  app/
    api/                 # Route Handlers (auth, products, admin/users)
    dashboard/           # dashboard role-aware
    login/  register/    # halaman auth
    page.tsx             # landing katalog
  components/            # Header, Footer, Hero, Catalog, ProductCard, DashboardClient, ...
  lib/                   # prisma, auth (JWT/bcrypt), session, validators, dsb.
  proxy tidak dipakai — proteksi dilakukan di server component & route handler.
```

## Endpoint API

- `POST /api/auth/register` — daftar (BUYER/SELLER)
- `POST /api/auth/login` / `POST /api/auth/logout` / `GET /api/auth/me`
- `GET|POST /api/products` — daftar/buat produk (SELLER/ADMIN; seller hanya miliknya)
- `PATCH|DELETE /api/products/[id]` — ubah/hapus (pemilik atau ADMIN)
- `PATCH|DELETE /api/admin/users/[id]` — ubah role / hapus user (ADMIN)

## Catatan

- **Cookie session `Secure`** aktif saat `NODE_ENV=production`. Untuk mencoba
  login secara lokal, gunakan `pnpm dev` (mode development, cookie tidak `Secure`).
- Gambar upload disimpan sebagai **data URI base64** (dikompres client-side ke
  800px JPEG q0.85) di kolom `imageUrl`; kosong → placeholder SVG per kategori.
  Untuk skala produksi besar, gunakan object storage.
- Nomor WhatsApp toko dikonfigurasi di `src/lib/constants.ts` (`WA_NUMBER`).
- Perintah seed/migrate memakai `tsx`; konfigurasi `prisma.seed` ada di
  `package.json` (masih didukung Prisma 6).
