# ADR-001 — Payload CMS 3 Berjalan di Dalam Next.js

**Tanggal:** 14 November 2026
**Status:** Final
**Penulis:** Tim Rinjan Media

---

## Konteks

PRD §13 keputusan #5 mengunci **Payload CMS 3 + PostgreSQL** sebagai backend/CMS. Yang belum diputuskan adalah bagaimana Payload dijalankan: sebagai proses terpisah (seperti Strapi/Directus) atau di dalam proses Next.js.

Saat implementasi, ditemukan juga bahwa versi Next.js proyek ini adalah **16.4.6** (bukan 15.x seperti tertulis di PRD §7.1), karena Next 15.5.4 punya CVE-2025-66478.

## Keputusan

Payload 3 dijalankan **di dalam proses Next.js yang sama** (bukan server terpisah), memakai paket `@payloadcms/next`.

Konsekuensi struktural:

| Hal | Implementasi |
|---|---|
| Root layout | Dua route group: `src/app/(frontend)/layout.tsx` dan `src/app/(payload)/layout.tsx` |
| Admin | `src/app/(payload)/admin/[[...segments]]/page.tsx` |
| REST API | `src/app/(payload)/api/[...slug]/route.ts` |
| GraphQL | `src/app/(payload)/api/graphql/route.ts` |
| Config alias | `@payload-config` → `./src/payload.config.ts` (di `tsconfig.json`) |
| Build | `withPayload(config)` membungkus `next.config.ts` |
| Akses data dari halaman | `getPayload({ config })` langsung — tanpa HTTP call |

## Alasan

1. **Satu deploy, satu proses.** Tidak perlu mengelola container CMS terpisah, tidak ada network hop antar-service, tidak ada dua set kredensial DB.
2. **Tidak ada duplikasi tipe.** Halaman dan CMS berbagi `payload.config.ts` yang sama, jadi perubahan field langsung terasa di keduanya.
3. **Server Component bisa query langsung.** `/layanan/[slug]` memanggil `payload.find()` di server, tanpa `fetch` ke diri sendiri.
4. **Ini memang cara resmi Payload 3.** Payload 3 dirancang sebagai *Next.js native*; memisahkannya justru melawan desainnya.

## Alternatif yang Ditolak

| Alternatif | Alasan ditolak |
|---|---|
| Payload sebagai server Express terpisah | Dua proses, dua deploy, perlu CORS + auth lintas service; Payload 3 tidak lagi mendukung pola ini sebagai jalur utama |
| Strapi / Directus | Keduanya butuh proses terpisah; PRD §13 sudah mengunci Payload |
| CMS SaaS (Sanity, Contentful) | Data keluar dari VPS sendiri — bertentangan dengan keputusan #4 (self-host) |

## Konsekuensi

**Positif**
- Satu `npm run build`, satu `npm run start`.
- Data mengalir satu arah: DB → Payload → Server Component → HTML.

**Negatif / risiko**
- **Admin dan situs berbagi proses.** Kalau admin crash, situs ikut terdampak. Mitigasi: Payload sudah production-grade; proses dijalankan di bawah PM2/Docker restart policy.
- **Payload memaksa `middleware` → `proxy`.** Next 16 mengganti konvensi `middleware.ts` menjadi `proxy.ts` (fungsi `proxy`). Redirect 301 diimplementasikan di `src/proxy.ts`.
- **CLI Payload tidak bisa dipakai di mesin dev ini** (lihat ADR-002). Import map di-generate lewat jalur alternatif.

## Verifikasi

- `npm run build` → 13 rute, `/admin` dan `/api/*` bertanda `ƒ (Dynamic)`.
- `/admin` 200, login berhasil, dashboard menampilkan 9 koleksi + 1 global.
- `/api/pages` 200, `/api/leads` 403, `/api/users` 403.
- Halaman `/layanan/website` membaca dari DB (diubah lewat SQL → halaman berubah).
