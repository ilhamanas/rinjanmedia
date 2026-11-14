# PROGRESS.md — Status Pekerjaan

**Terakhir diperbarui:** 14 November 2026
**Fase aktif:** Fase 3 — Redesign UI/UX (berjalan), Fase 4 sebagian
**Keseluruhan:** 34% (2 dari 8 fase selesai, 2 fase berjalan sebagian)

---

## Ringkasan Progres

| Fase | Nama | Status | Progres |
|---|---|---|---|
| 0 | Reference Pack | 🟡 Berjalan | 75% |
| 1 | Fondasi Next.js + Tailwind | ✅ Selesai | 100% |
| 2 | Payload CMS + Koleksi | ✅ Selesai | 100% |
| 3 | Redesign UI/UX | 🟡 Berjalan | 45% |
| 4 | Form Lead + Email | 🟡 Berjalan | 67% |
| 5 | SEO, Sitemap, Redirect | 🟡 Berjalan | 40% |
| 6 | QA | ⬜ Belum mulai | 0% |
| 7 | Deploy + Cutover | ⬜ Belum mulai | 0% |

**Legenda:** ⬜ Belum mulai · 🟡 Berjalan · ✅ Selesai · ⏸️ Tertahan · ❌ Dibatalkan

---

## Fase 0 — Reference Pack

**Tujuan:** Mengumpulkan bahan referensi dari situs lama. Tidak ada migrasi konten otomatis.

| # | Task | Status | Catatan |
|---|---|---|---|
| 0.1 | Buat folder `requirement/` beserta subfolder | ✅ | `screenshots/`, `content/`, `blog/`, `assets/` |
| 0.2 | Screenshot semua halaman (desktop + mobile) | 🟡 | Desktop 10 file lengkap; `mobile/` masih kosong |
| 0.3 | Inventaris konten: 4 layanan + deskripsi | ✅ | `requirement/content/inventaris.md` |
| 0.4 | Data kontak & sosmed | ✅ | WhatsApp, email, alamat, jam operasional |
| 0.5 | Copy teks yang masih relevan | ✅ | `requirement/content/copy-reference.md` |
| 0.6 | Salin 4 artikel blog lama | ⬜ | `requirement/blog/` masih kosong |
| 0.7 | Aset brand: logo, favicon, foto utama | ✅ | Diunduh dari situs live ke `requirement/assets/` |
| 0.8 | Catat ID analytics (GTM `GT-P36LTCV`, GA4) | ⬜ | Belum dipasang di kode |

**Struktur folder `requirement/` yang diharapkan:**
```
requirement/
├─ screenshots/
│  ├─ desktop/   (home.png, tentang.png, layanan-*.png, kontak.png, blog.png, blog-detail.png)
│  └─ mobile/    (nama file sama)
├─ content/
│  ├─ inventaris.md      # daftar halaman + ringkasan konten
│  └─ copy-reference.md  # teks yang bisa dipakai ulang
├─ blog/
│  ├─ 22-platform-media-sosial.md
│  ├─ peluang-bisnis-online.md
│  ├─ edukasi-kdrt.md
│  └─ sosialisasi-pencegahan-kekerasan.md
└─ assets/
   ├─ logo.svg / logo.png
   ├─ favicon.ico
   └─ foto-*.jpg
```

---

## Fase 1 — Fondasi Next.js + Tailwind

| # | Task | Status | Catatan |
|---|---|---|---|
| 1.1 | Init Next.js 15 + TypeScript + App Router | ✅ | Resolved ke Next.js **16.4.6** (15.5.4 punya CVE-2025-66478) |
| 1.2 | Setup Tailwind CSS v4 + design token (warna, font, spacing) | ✅ | `src/app/globals.css`, satu font (Poppins) |
| 1.3 | Setup shadcn/ui + lucide-react | ✅ | shadcn/ui **tidak dipakai** — komponen ditulis manual, hanya `lucide-react` + `clsx` + `tailwind-merge` |
| 1.4 | Layout global: Header (sticky, dropdown, mobile drawer) | ✅ | Dropdown: Esc + klik luar menutup; drawer dengan `aria-expanded` |
| 1.5 | Layout global: Footer | ✅ | Kontak, layanan, sosial (ikon), copyright |
| 1.6 | Halaman 404 kustom | ✅ | `src/app/not-found.tsx` |
| 1.7 | Setup ESLint, Prettier, husky + lint-staged | 🟡 | ESLint terpasang; **Prettier + husky belum** |
| 1.8 | Setup struktur folder sesuai AGENTS.md §3 | ✅ | `src/app/(frontend)`, `src/components/{sections,ui}`, `src/lib` |

**Halaman yang sudah ada (data statis dari `src/lib/content.ts`):**

| Rute | Status |
|---|---|
| `/` | ✅ |
| `/tentang` | ✅ |
| `/layanan` | ✅ |
| `/layanan/[slug]` (website, desain, wifi, it-support) | ✅ SSG |
| `/kontak` (form + peta + detail kontak) | ✅ |
| `/blog` (empty state jujur, belum ada artikel) | ✅ |
| `/blog/[slug]` | ⬜ Menunggu konten Fase 2 |
| `/privasi` | ⬜ |

---

## Fase 2 — Payload CMS + Koleksi

| # | Task | Status | Catatan |
|---|---|---|---|
| 2.1 | Install Payload 3 + PostgreSQL adapter | ✅ | Payload **3.93.0** + `@payloadcms/db-postgres` + `richtext-lexical` + `graphql@16.8.1` + `sharp@0.34.5`. Cocok dengan Next 16.4.6 |
| 2.2 | Konfigurasi `payload.config.ts` + koneksi DB | ✅ | `src/payload.config.ts`, alias `@payload-config`, `withPayload()` di `next.config.ts`. PostgreSQL 17.6 portable di `.dev/pg` port **5433** |
| 2.3 | Koleksi `users` + role admin/editor | ✅ | Editor tidak bisa menaikkan perannya sendiri (`access.update` pada field `role`) |
| 2.4 | Koleksi `media` (upload + alt wajib) | ✅ | `alt` required; 3 varian (`thumbnail` 400, `card` 768, `hero` 1600) — **terbukti dibuat sharp** dari gambar 2000×1200 |
| 2.5 | Koleksi `pages` + blok konten | ✅ | Drafts + autosave 800ms, `slug` auto dari `title` |
| 2.6 | Koleksi `posts` + `categories` | ✅ | Skema siap; **belum ada artikel** (`requirement/blog/` kosong) |
| 2.7 | Koleksi `services` | ✅ | Paket/harga/fitur/highlights/extras/blocks + SEO + `order` + `status` |
| 2.8 | Global `settings` (kontak, sosmed, GTM) | ✅ | Tab: Identitas, Kontak, Sosial Media, Analytics |
| 2.9 | Koleksi `redirects` | ✅ | 11 redirect terisi lewat seed |
| 2.10 | Koleksi `leads` | ✅ | `create: () => false` — satu-satunya jalur masuk Server Action (`overrideAccess: true`) |
| 2.11 | Blok konten | ✅ | hero, richText, servicesGrid, cta, faq. **Testimonials & Gallery tidak dibuat** — tidak ada data asli (antislop R-18/R-38) |
| 2.12 | Seed data awal dari `requirement/` | ✅ | `scripts/seed.mjs` lewat REST, idempoten (dijalankan 2×: dibuat → diperbarui) |
| 2.13 | Generate types + migrasi awal | 🟡 | 47 tabel terbuat otomatis (push dev). **`payload-types.ts` tidak di-generate** — CLI rusak, tipe ditulis manual di `src/lib/payload.ts` |

**Struktur route group setelah restrukturisasi:**

| Grup | Isi |
|---|---|
| `src/app/(frontend)/` | `layout.tsx` (html/body + skip link + header + footer), semua halaman publik, `not-found.tsx` |
| `src/app/(payload)/` | `layout.tsx` (RootLayout Payload), `admin/[[...segments]]`, `api/[...slug]`, `api/graphql` |

**Hasil verifikasi Fase 2:**

| Uji | Hasil |
|---|---|
| `npm run build` | ✅ 13 rute; `/admin` + `/api/*` dinamis, sisanya ISR 60s |
| Typecheck (`npx tsc --noEmit`) | ✅ 0 error |
| Admin login + dashboard | ✅ 9 koleksi + 1 global tampil, 0 error konsol |
| Editor blok + rich text | ✅ 3 blok, editor lexical aktif |
| `/api/pages`, `/api/services` publik | ✅ 200 |
| `/api/leads`, `/api/users` publik | ✅ 403 |
| Layanan draf | ✅ 404 saat `status='draft'` |
| Halaman membaca DB | ✅ ubah `headline` via SQL → halaman berubah |
| Upload media + sharp | ✅ 3 varian dibuat, bisa diakses publik |
| Redirect 301 | ✅ 11/11 benar (diuji di dev **dan** produksi) |

---

## Fase 3 — Redesign UI/UX

| # | Task | Status | Catatan |
|---|---|---|---|
| 3.1 | Home | 🟡 | Halaman ada dan membaca CMS; restyle final menunggu screenshot mobile |
| 3.2 | Tentang | 🟡 | Idem |
| 3.3 | Halaman layanan (template dinamis, 4 layanan) | 🟡 | Idem, 4 layanan dari CMS |
| 3.4 | Kontak | 🟡 | Form → Server Action, sudah teruji end-to-end |
| 3.5 | Blog index (list + filter + pencarian + paginasi) | ⬜ | Menunggu `requirement/blog/` terisi |
| 3.6 | Blog detail | ⬜ | Idem |
| 3.7 | Kebijakan Privasi | ⬜ | |
| 3.8 | Responsif semua halaman | 🟡 | Diuji 360 dan 1440; 768 dan 1920 belum |
| 3.9 | Audit aksesibilitas (keyboard, kontras, aria) | 🟡 | Situs publik + panel admin sudah diaudit dengan skrip terukur; audit penuh (Lighthouse/axe) belum |
| 3.10 | **Tema panel admin sesuai brand Rinjan** | ✅ | `src/app/(payload)/custom.css`. Detail: `doc/design-admin.md` |
| 3.11 | Sidebar biru + tema gelap default | ✅ | Gradien `#006dbc`→`#0060a5`, shell kartu rounded, item aktif berlatar putih. `doc/adr-003-sidebar-biru-tema-gelap.md` |
| 3.12 | Kartu statistik dashboard (angka dari DB) | ✅ | Komponen `AdminStats` via `beforeDashboard`; import map 26→27 entri. Angka diverifikasi sama dengan `/api/*` |

### Hasil kerja 3.10: tema panel admin

Palet brand diterapkan ke `/admin`: biru `#3171B3` untuk identitas dan interaktif, oranye `#D93A00` **hanya** untuk aksi utama, merah/amber error sengaja tidak disentuh.

| Uji | Hasil |
|---|---|
| `node .verify/admin-ramp.mjs` | ✅ **0 gagal**: 17 pasangan terang + 15 gelap, ramp monoton |
| `node .verify/admin-field-test.mjs` | ✅ 24/24: border kontrol 3.85:1 / 4.52:1, cincin fokus 5.07:1 / 5.50:1, state error tetap merah Payload |
| `node .verify/admin-nav-focus-test.mjs` | ✅ nav aktif 7.60:1 / 6.02:1, 12/12 langkah Tab punya `:focus-visible` + indikator |
| `node .verify/admin-brand-test.mjs` | ✅ login lewat UI, logo terang/gelap berganti benar, token sesuai tema, 0 console error |
| `node .verify/admin-before-after.mjs` | ✅ 3 pasangan teks yang tadinya gagal AA kini lolos, 0 memburuk |

Cacat bawaan Payload yang ditemukan dan diperbaiki:

| Cacat | Sebelum | Sesudah |
|---|---|---|
| Deskripsi field (`base-400`) | 2.81:1 (gagal AA) | 4.62:1 |
| Label field (`base-450`) | 3.32:1 (gagal AA) | 5.04:1 |
| Teks sekunder (`base-500`) | 3.95:1 (gagal AA) | 5.48:1 |
| Border input/textarea/select | 1.36:1 (gagal 1.4.11) | 3.85:1 terang / 4.52:1 gelap |
| Fokus input | hanya warna border <3:1 | outline 2px, 5.07:1 / 5.50:1 |
| Nav aktif mode gelap | 3.60:1 | 6.02:1 |
| Tombol sekunder mode gelap | 4.20:1 | 6.02:1 |

---

## Fase 4 — Form Lead + Email

| # | Task | Status | Catatan |
|---|---|---|---|
| 4.1 | Server Action / route handler untuk submit lead | ✅ | `src/app/actions/submit-lead.ts` |
| 4.2 | Validasi Zod client + server | ✅ | `src/lib/lead.ts` dipakai dua sisi; pesan error Bahasa Indonesia |
| 4.3 | Honeypot + rate limit | 🟡 | Honeypot ✅ (field `website`); **rate limit belum** |
| 4.4 | Simpan ke koleksi `leads` | ✅ | Terbukti: baris `id=1` masuk DB lewat form sungguhan (CDP), di dev dan produksi |
| 4.5 | Notifikasi email (Resend/SMTP) | ⬜ | Butuh provider + API key |
| 4.6 | UI state: loading, sukses, error | ✅ | `idle` / `invalid` / `saved` / `failed`, fokus dipindah ke alert |

---

## Fase 5 — SEO, Sitemap, Redirect

| # | Task | Status | Catatan |
|---|---|---|---|
| 5.1 | Metadata dinamis per halaman | ✅ | `generateMetadata` di `/layanan/[slug]` memakai `seo` dari CMS |
| 5.2 | `sitemap.ts` + `robots.ts` | ⬜ | |
| 5.3 | Schema.org: Organization, WebSite, Breadcrumb, Article | ⬜ | |
| 5.4 | OG image otomatis untuk artikel | ⬜ | Menunggu artikel ada |
| 5.5 | Redirect 301 sesuai PRD §9 | ✅ | `src/proxy.ts` (konvensi Next 16), data dari koleksi `redirects`, cache 60s. 11/11 terverifikasi |
| 5.6 | Hapus semua tautan `http://` internal | 🟡 | Internal pakai `next/link`; perlu audit akhir |

---

## Fase 6 — QA

| # | Task | Status | Catatan |
|---|---|---|---|
| 6.1 | Lighthouse mobile >= 90 (4 kategori) | ⬜ | |
| 6.2 | Uji lintas browser (Chrome, Firefox, Safari, Edge) | ⬜ | |
| 6.3 | Uji perangkat mobile (iOS Safari, Android Chrome) | ⬜ | |
| 6.4 | Uji form end-to-end | ⬜ | |
| 6.5 | Uji admin panel bersama tim non-developer | ⬜ | |
| 6.6 | Cek semua redirect 301 (`curl -I`) | ⬜ | |
| 6.7 | Cek broken link & gambar | ⬜ | |
| 6.8 | Uji `prefers-reduced-motion` | ⬜ | |

---

## Fase 7 — Deploy + Cutover

| # | Task | Status | Catatan |
|---|---|---|---|
| 7.1 | Provision VPS + Docker + Docker Compose | ⬜ | |
| 7.2 | Nginx reverse proxy + Certbot SSL | ⬜ | |
| 7.3 | Firewall UFW + hardening SSH | ⬜ | |
| 7.4 | Setup Cloudflare R2 (media) | ⬜ | |
| 7.5 | Script backup harian (`pg_dump` + restic) | ⬜ | |
| 7.6 | Uji restore backup | ⬜ | |
| 7.7 | Uptime monitoring (Uptime Kuma) | ⬜ | |
| 7.8 | Deploy staging + uji | ⬜ | |
| 7.9 | DNS cutover | ⬜ | |
| 7.10 | Submit sitemap ke Google Search Console | ⬜ | |
| 7.11 | Pelatihan tim editor | ⬜ | |
| 7.12 | Monitor 14 hari pasca cutover | ⬜ | |

---

## Blocker

1. **`requirement/blog/` masih kosong** — 4 artikel blog lama belum disalin. `/blog/[slug]` tidak dibuat sampai konten ada, supaya tidak ada halaman karangan.
2. **`requirement/screenshots/mobile/` masih kosong** — desain mobile diturunkan dari versi desktop. Perlu screenshot mobile asli untuk verifikasi akhir.
3. **Notifikasi email lead belum ada.** Lead sudah tersimpan di DB dan bisa dilihat di `/admin/collections/leads`, tapi belum ada email masuk ke tim. Butuh Resend/SMTP + API key (Fase 4.5).
4. **Rate limit form belum ada.** Honeypot sudah jalan, tapi belum ada pembatas jumlah submit per IP. Perlu ditambahkan sebelum deploy publik.
5. **CLI Payload rusak di mesin ini.** `npx payload generate:importmap` dan `generate:types` gagal (`tsx` + `undici` v7 bentrok di Node 22 & 24). Workaround: import map di-generate lewat rute sementara di Next.js, tipe ditulis manual. Detail: `doc/adr-002-workaround-cli-payload.md`.
6. **`payload-types.ts` tidak ada.** Konsekuensi blocker #5. Tipe `ServiceDoc`/`SettingsDoc` di `src/lib/payload.ts` harus diperbarui manual saat skema berubah.
7. **Belum ada migrasi database.** Selama dev, Payload push skema otomatis. Sebelum produksi, migrasi harus dibuat dan diuji.
8. **25 kerentanan npm belum ditangani.** `npm audit` melaporkan 1 critical, 5 high. Belum ditindaklanjuti; perlu ditinjau sebelum deploy.

---

## Log Perubahan

| Tanggal | Perubahan |
|---|---|
| 13 Nov 2026 | Dokumen awal dibuat: PRD, AGENTS, PROGRESS, DOCUMENTATION |
| 13 Nov 2026 | `PRD.md` & `DOCUMENTATION.md` dipindah dari root ke `doc/`; dibuat `doc/README.md` sebagai indeks + konvensi penamaan dokumen baru |
| 13 Nov 2026 | `AGENTS.md` diperbarui: urutan baca wajib (`PROGRESS.md` + `doc/`), aturan skill wajib (§3), aturan dokumentasi di `doc/` (§2.1) |
| 14 Nov 2026 | Fase 1 selesai: scaffold Next.js 16.4.6 + Tailwind v4 + token brand, header/footer global, 8 rute (home, tentang, layanan index, 4 layanan detail, kontak, blog), 404 kustom |
| 14 Nov 2026 | Aset brand diunduh dari situs live: `logo-footer.png` (297×61), `icon-rinjan.png`, `favicon.ico` |
| 14 Nov 2026 | Konten 4 layanan diambil ulang dari halaman lama (paket, harga, fitur) — bukan karangan |
| 14 Nov 2026 | Perbaikan data: nama jalan yang benar **Jl. Ciater** (sebelumnya tertulis "Cilater"); embed peta asli dari halaman kontak lama |
| 14 Nov 2026 | Kontras diperbaiki: `ink-300` `#8a8f94`→`#6b7176` (3.26→4.94), breadcrumb `brand-100`→`brand-50` (4.02→4.61) |
| 14 Nov 2026 | Verifikasi: typecheck bersih, build sukses (12 rute prerender), 12 tautan internal 200, form diuji (kosong/invalid/valid), keyboard + drawer + dropdown diuji via CDP |
| 14 Nov 2026 | **Fase 2 selesai:** Payload 3.93.0 + PostgreSQL 17.6 portable (port 5433), 9 koleksi + 1 global, 47 tabel, route group `(frontend)`/`(payload)` |
| 14 Nov 2026 | Import map Payload di-generate lewat rute sementara di Next.js (25 komponen) — CLI resmi rusak di mesin ini. Tanpa ini dashboard admin kosong |
| 14 Nov 2026 | Frontend disambungkan ke CMS: `/`, `/layanan`, `/layanan/[slug]` membaca DB (dibuktikan dengan mengubah `headline` via SQL) |
| 14 Nov 2026 | Form kontak menulis ke koleksi `leads` lewat Server Action; terbukti baris masuk DB di dev dan produksi |
| 14 Nov 2026 | Redirect 301 dipindah ke `src/proxy.ts` (Next 16 mengganti `middleware` → `proxy`); 11/11 redirect terverifikasi |
| 14 Nov 2026 | Build produksi diuji penuh: 13 rute, 30/30 smoke test lulus (halaman, konten CMS, redirect, access control, admin) |
| 14 Nov 2026 | Dokumen baru: `doc/adr-001-payload-di-dalam-nextjs.md`, `doc/adr-002-workaround-cli-payload.md`, `doc/guide-local-postgres.md` |
| 14 Nov 2026 | **Tema panel admin selesai (3.10):** biru `#3171B3` untuk identitas/interaktif, oranye `#D93A00` hanya untuk aksi utama, error/warning Payload tidak disentuh. Override ditulis di `@layer payload` |
| 14 Nov 2026 | Diperbaiki: 3 pasangan teks bawaan Payload gagal AA (2.81, 3.32, 3.95 → 4.62, 5.04, 5.48) |
| 14 Nov 2026 | Diperbaiki: border input 1.36:1 → 3.85:1/4.52:1 (WCAG 1.4.11) dan fokus input yang hanya ditandai warna border → outline 2px |
| 14 Nov 2026 | Diperbaiki: nav aktif dan tombol sekunder mode gelap (3.60:1 & 4.20:1 → 6.02:1). Penyebabnya `--theme-success-500` tidak ada di tabel flip Payload |
| 14 Nov 2026 | Ditemukan: `:where()` TIDAK melindungi state error, karena urutan cascade layer mengalahkan specificity. Diperbaiki dengan `.field-type:not(.error)` |
| 14 Nov 2026 | Import map diperbarui jadi 26 entri (2 komponen brand); `doc/adr-002` dikoreksi dari "25 entri, tanpa komponen kustom" |
| 14 Nov 2026 | Dokumen baru: `doc/design-admin.md` |
| 14 Nov 2026 | Repo git diinisialisasi ulang, remote `origin` = `git@github.com:ilhamanas/rinjanmedia.git`. Commit Fase 3 di-push ke `main` di atas commit awal `master` |
| 14 Nov 2026 | Hook pre-commit (`.githooks/pre-commit`) menolak commit bila `lint` atau `typecheck` gagal. Tanpa husky, cukup `core.hooksPath` |
| 14 Nov 2026 | `.gitignore` diperluas: kunci SSH (`rinjanmedia`, `*.pem`, `id_ed25519`) sebelumnya tidak ter-ignore |
| 14 Nov 2026 | **Sidebar biru + gelap default (3.11):** palet diambil dari CSS demo referensi. Permukaan `#006dbc` (putih 5.37:1), aksen teks `#0099eb` (5.82:1 di kartu). Biru asli referensi `#0099eb` gagal sebagai latar (putih 3.11:1) |
| 14 Nov 2026 | Diperbaiki: cincin fokus di sidebar putih (biru hanya 2.51:1, gagal 3:1) |
| 14 Nov 2026 | Diperbaiki: `.hamburger` tampil sebagai kotak putih solid dan `:focus{outline:none}`; toggler, logout, dan chevron juga masih gelap di atas biru |
| 14 Nov 2026 | Tema gelap default lewat cookie `payload-theme` di `proxy.ts`, bukan `admin.theme:'dark'` yang menghilangkan toggle |
| 14 Nov 2026 | Dokumen baru: `doc/adr-003-sidebar-biru-tema-gelap.md` |
| 14 Nov 2026 | **Struktur ala referensi (3.11 lanjutan):** shell kartu rounded-3xl mengambang, sidebar gradien, item nav aktif berlatar putih, topbar lengket, kartu ring+shadow. Palet diambil dari sumber referensi di `referensi-desain-admin/` |
| 14 Nov 2026 | Deviasi sadar: gradien dibalik ke lebih gelap. Campur putih 15% seperti referensi membuat teks putih hanya 4.08:1 (gagal AA) |
| 14 Nov 2026 | Diperbaiki: latar item nav aktif hanya setinggi teks karena `.nav__link:has(.nav__link-indicator){padding-left:0}` bawaan Payload. Diverifikasi lewat `CSS.getMatchedStylesForNode` |
| 14 Nov 2026 | `referensi-desain-admin/` dikecualikan dari ESLint, tsconfig, dan build karena memakai dependency yang tidak terpasang |
| 14 Nov 2026 | **Kartu statistik dashboard (3.12):** komponen server `AdminStats` lewat `beforeDashboard`. Angka dari Local API: 4 layanan, 11 redirect, 0 media. Diverifikasi sama dengan `/api/*` |
| 14 Nov 2026 | Import map di-regenerate 26 → 27 entri (prosedur ADR-002); rute sementara dihapus setelah dipakai |

---

## Catatan untuk Agent Berikutnya

1. **Baca `doc/` sebelum bekerja.** Minimal `doc/PRD.md` dan bagian relevan `doc/DOCUMENTATION.md`. Jangan mulai tanpa itu.
2. **Panggil skill wajib** sesuai `AGENTS.md` §3 — `using-superpowers` di awal sesi, `ponytail` untuk kode, `antislop*` untuk UI/UX.
3. Fase 2 selesai. Fase 3 berjalan: tema panel admin (3.10) sudah selesai; halaman publik sudah ada dan membaca CMS tapi restyle final menunggu screenshot mobile. Berikutnya: Fase 3.5/3.6 (blog) menunggu `requirement/blog/`, atau Fase 4.5 (email notifikasi).
4. **PostgreSQL harus jalan sebelum `npm run dev`** — lihat `doc/guide-local-postgres.md`. Kalau DB mati, semua halaman yang membaca CMS akan 500.
5. **Jangan pakai CLI Payload** — rusak di mesin ini. Untuk regenerate import map, ikuti prosedur di `doc/adr-002-workaround-cli-payload.md`.
6. Keputusan arsitektur yang sudah dikunci ada di `doc/PRD.md` §13 — jangan diubah tanpa persetujuan.
7. Dokumentasi baru **wajib** di `doc/` dengan prefix kategori (`adr-`, `guide-`, `audit-`, dst) dan didaftarkan di `doc/README.md`.
8. **`npm`, bukan `pnpm`.** `pnpm` gagal di mesin ini (install script diblokir, `corepack enable` EPERM). Semua perintah di `AGENTS.md`/`DOCUMENTATION.md` yang memakai `pnpm` harus dijalankan sebagai `npm`.
9. **Jangan pakai PowerShell `-replace` dengan `$1`** pada file sumber — pernah merusak 5 file (`Config`→`Conrig`, `from`→`rrom`). Pakai tool `edit`.
10. **Folder `.verify/`** berisi skrip verifikasi (CDP, tanpa dependency): `redirect-test.mjs`, `prod-smoke.mjs`, `admin-test.mjs`, `form-cms-test.mjs`, `media-test-big.mjs`, `shot.mjs`, `cdp.mjs`. Jalankan dengan `node`. Hapus sebelum deploy.
11. **Verifikasi admin butuh build produksi.** Skrip `.verify/admin-*.mjs` menargetkan `http://localhost:3000` dari `npm run start`, bukan `dev`. Urutannya: `npx next build` → `npm run start` → jalankan skrip. Setelah mengubah `custom.css`, build ulang dulu atau hasil ukur akan memakai CSS lama.
12. **Jangan pakai `.focus()` programatik untuk menguji `:focus-visible`.** Chromium hanya menyalakannya untuk input keyboard sungguhan. Pakai `Input.dispatchKeyEvent` Tab lewat CDP.
13. **Tema Payload disimpan di cookie `payload-theme`, bukan `localStorage`,** dan atribut `data-theme` dikelola React. Memanggil `setAttribute('data-theme', ...)` manual bisa langsung ditimpa balik, sehingga hasil ukur menyesatkan. Set cookie lalu muat ulang halaman.
14. **`:where()` tidak melindungi apa pun dari override lintas layer.** Urutan cascade layer mengalahkan specificity. Untuk membiarkan state Payload menang, kecualikan lewat selector (`.field-type:not(.error)`), bukan dengan menurunkan specificity.
