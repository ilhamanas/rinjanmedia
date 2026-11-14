# PRD — Rinjan Media (Website Baru)

**Versi:** 1.0
**Tanggal:** 13 November 2026
**Status:** Draft — menunggu review
**Pemilik Produk:** Rinjan Media
**Target Folder:** `D:\laragon\www\rinjanmedia-new`

---

## 1. Latar Belakang

Website `rinjanmedia.com` saat ini berjalan di **WordPress 7.1.4** dengan **Elementor Pro 4.2.4**, diperberat oleh plugin: ElementsKit (+Lite), Essential Addons Lite, Slider Revolution 6.6.5, WPForms, dan WP Rocket. Theme yang dipakai adalah `hello-elementor` (theme kosong, seluruh layout dibangun lewat page builder).

Kondisi ini menimbulkan beberapa masalah:

- **Beban plugin besar** — banyak CSS/JS plugin dimuat di setiap halaman
- **6 keluarga Google Font** (Poppins, Roboto, Lato, Open Sans, Playfair Display, Roboto Slab) dalam berbagai weight
- **Markup tidak semantik** — homepage menghasilkan ~82KB HTML mentah dari widget Elementor
- **Mixed content** — 4 tautan internal masih memakai `http://`
- **SEO dasar** — title hanya "Rinjan Media", tanpa schema.org, tanpa strategi konten terstruktur
- **Ketergantungan page builder** — perubahan layout menuntut pengetahuan Elementor, sulit di-version-control
- **WooCommerce tidak terpakai** — halaman shop/cart/checkout/my-account ada, tetapi tanpa produk aktif (WC Store API mengembalikan 404)

Website ini perlu dibangun ulang dengan arsitektur modern agar cepat, mudah dirawat, dan siap dikembangkan.

---

## 2. Tujuan

### 2.1 Tujuan Bisnis
1. Menampilkan 4 lini layanan Rinjan Media secara profesional dan meyakinkan
2. Meningkatkan jumlah lead masuk (WhatsApp / form kontak)
3. Meningkatkan visibilitas organik di mesin pencari
4. Menurunkan biaya perawatan teknis jangka panjang

### 2.2 Tujuan Teknis
1. Skor Lighthouse >= 90 untuk Performance, Accessibility, Best Practices, SEO (mobile)
2. LCP < 2,5 detik pada koneksi 4G
3. Zero plugin bloat — tidak ada page builder, tidak ada dependency WordPress
4. Konten dapat diedit oleh tim non-developer melalui admin panel
5. Seluruh infrastruktur berjalan di VPS sendiri (self-hosted, data milik sendiri)

### 2.3 Non-Tujuan (Out of Scope)
- **Migrasi konten otomatis** dari WordPress lama (keputusan: tidak perlu, hanya referensi)
- **WooCommerce / e-commerce** (keputusan: dibuang)
- Multi-bahasa (i18n) — ditunda
- Portal pelanggan, billing Wifi Rinjan, tiket IT support — ditunda, arsitektur disiapkan
- Aplikasi mobile

---

## 3. Pengguna & Peran

| Peran | Deskripsi | Kebutuhan Utama |
|---|---|---|
| **Pengunjung** | Calon klien UMKM, perorangan, perusahaan | Cepat paham layanan, mudah menghubungi |
| **Editor Konten** | Tim non-developer Rinjan Media | Tambah/edit halaman, tulis blog, unggah gambar tanpa developer |
| **Administrator** | Developer / pemilik | Kelola user, konfigurasi, deploy, backup |

---

## 4. Ruang Lingkup Konten

| Halaman | Path | Keterangan |
|---|---|---|
| Home | `/` | Hero, 4 layanan, keunggulan, portofolio, testimoni, CTA, blog terbaru |
| Tentang Rinjan | `/tentang` | Profil, visi-misi, tim, nilai |
| Rinjan Website | `/layanan/website` | Jasa web development |
| Rinjan Desain | `/layanan/desain` | Jasa desain grafis/branding |
| Wifi Rinjan | `/layanan/wifi` | Layanan jaringan/ISP |
| Rinjan IT Support | `/layanan/it-support` | Jasa dukungan IT |
| Kontak | `/kontak` | Form lead, WhatsApp, alamat, jam operasional, peta |
| Blog | `/blog` | Daftar artikel, filter kategori, pencarian |
| Detail Blog | `/blog/[slug]` | Artikel + artikel terkait + CTA |
| Kebijakan Privasi | `/privasi` | Untuk form & analytics |
| Halaman 404 | `not-found` | Ramah, dengan tautan navigasi |

---

## 5. Kebutuhan Fungsional

### FR-01 Navigasi & Layout
- Header sticky: logo, menu utama, tombol CTA "Konsultasi Gratis"
- Menu layanan berupa dropdown
- Mobile: drawer/off-canvas, tutup dengan Esc, focus-trap
- Footer: kontak, tautan cepat, sosial media, copyright, tautan privasi

### FR-02 Home
- Hero: headline, subheadline, CTA primer + sekunder (WhatsApp)
- Grid 4 kartu layanan (ikon, judul, deskripsi, tautan)
- Section keunggulan (3-4 poin)
- Section klien/portofolio
- Section testimoni
- Section blog terbaru (3 artikel)
- CTA penutup

### FR-03 Halaman Layanan
- Hero layanan + CTA
- Deskripsi & cakupan pekerjaan
- Paket/harga (opsional, bisa dikosongkan lewat CMS)
- Proses kerja (timeline)
- FAQ (accordion)
- CTA penutup

### FR-04 Blog
- Daftar artikel, paginasi 12/halaman
- Filter kategori, pencarian judul/isi
- Detail: judul, tanggal, kategori, cover, rich text, share, artikel terkait
- Estimasi waktu baca
- Open Graph image otomatis per artikel

### FR-05 Form Kontak / Lead
- Field: nama (wajib), email (wajib), WhatsApp (wajib), layanan diminati (select), pesan (wajib)
- Validasi client + server (Zod)
- Anti-spam: honeypot + rate limit
- Simpan lead ke database
- Notifikasi email ke admin
- Pesan sukses/error jelas, tanpa reload

### FR-06 Admin Panel (Payload CMS)
- Login aman, role `admin` dan `editor`
- CRUD: Pages, Posts, Categories, Services, Media, Settings, Redirects, Leads
- Rich text + blok: heading, paragraf, list, gambar, quote, embed video, CTA, tabel
- Draft / Publish, preview
- Media library dengan alt text wajib
- Perubahan konten memicu revalidasi ISR halaman terkait

### FR-07 SEO
- Metadata dinamis per halaman (title, description, canonical, OG, Twitter Card)
- `sitemap.xml` dan `robots.txt` otomatis
- Schema.org: `Organization`, `WebSite`, `BreadcrumbList`, `Article`, `LocalBusiness`
- Slug editable + redirect otomatis saat slug berubah
- Redirect 301 terkelola dari CMS

### FR-08 Analytics
- GTM `GT-P36LTCV` tetap dipasang
- Event: klik WhatsApp, submit form, klik CTA utama

### FR-09 Aksesibilitas
- Target WCAG 2.1 AA
- Kontras terverifikasi, navigasi keyboard penuh, `aria-*` sesuai peran
- Menghormati `prefers-reduced-motion`
- Alt text wajib pada media

---

## 6. Kebutuhan Non-Fungsional

| Aspek | Target |
|---|---|
| Performance | Lighthouse >= 90 (mobile); LCP < 2,5s; CLS < 0,1; INP < 200ms |
| Availability | Uptime >= 99,5%; uptime monitoring aktif |
| Keamanan | HTTPS wajib, HSTS, rate limit, CSRF protection, validasi input, security headers |
| Backup | `pg_dump` harian, retensi 30 hari, disimpan di luar VPS |
| Skalabilitas | 10.000 kunjungan/bulan tanpa perubahan arsitektur |
| Maintainability | TypeScript strict, lint + format otomatis, dokumentasi lengkap |
| Kompatibilitas | 2 versi terakhir Chrome, Firefox, Safari, Edge; iOS Safari & Android Chrome |

---

## 7. Arsitektur Teknis

### 7.1 Stack

| Layer | Teknologi | Alasan |
|---|---|---|
| Frontend | **Next.js 15 (App Router)** + React 19 + TypeScript | RSC untuk performa & SEO |
| Styling | **Tailwind CSS v4** | Utility-first, konsisten, tanpa CSS bloat |
| Komponen | **shadcn/ui** + Radix UI | Aksesibel, tanpa lock-in |
| Ikon | **lucide-react** | Ringan, tree-shakeable |
| Animasi | **Motion** — terbatas | Halus, hormati `prefers-reduced-motion` |
| CMS | **Payload CMS 3** | Admin jadi, blok konten, akses kontrol, jalan di dalam Next.js |
| Database | **PostgreSQL 17** | Relasional, andal |
| ORM | **Drizzle** (bawaan Payload) | Type-safe, migrasi jelas |
| Auth | Bawaan Payload (JWT + httpOnly cookie) | Tidak perlu bangun sendiri |
| Email | **Resend** atau SMTP | Notifikasi lead |
| Media | **Cloudflare R2** (rekomendasi) atau volume VPS | Murah, aman saat rebuild |
| Deployment | **Docker Compose** di VPS + **Nginx** + Certbot | Self-hosted, kontrol penuh |
| CDN/DNS | **Cloudflare** (proxy + cache) | Gratis, proteksi, cache edge |

### 7.2 Diagram

```
Internet
   |
   v
Cloudflare (DNS, proxy, cache)
   |
   v
Nginx (:443, HTTP/2, Brotli, SSL Certbot)
   |
   +-- app (container :3000)
   |     +-- /        -> halaman publik (RSC + ISR)
   |     +-- /admin   -> Payload admin panel
   |     +-- /api     -> REST/GraphQL Payload
   |
   +-- db (container :5432, volume persisten)
   |
   +-- backup (cron: pg_dump -> restic -> R2/B2)
```

### 7.3 Struktur Repositori

```
rinjanmedia-new/
├─ src/
│  ├─ app/
│  │  ├─ (frontend)/
│  │  │  ├─ page.tsx
│  │  │  ├─ tentang/page.tsx
│  │  │  ├─ layanan/[slug]/page.tsx
│  │  │  ├─ blog/page.tsx
│  │  │  ├─ blog/[slug]/page.tsx
│  │  │  ├─ kontak/page.tsx
│  │  │  └─ layout.tsx
│  │  ├─ (payload)/
│  │  │  ├─ admin/[[...segments]]/page.tsx
│  │  │  └─ api/[...slug]/route.ts
│  │  ├─ sitemap.ts
│  │  ├─ robots.ts
│  │  └─ not-found.tsx
│  ├─ collections/
│  ├─ blocks/
│  ├─ components/
│  ├─ lib/
│  └─ payload.config.ts
├─ requirement/          # bahan referensi (screenshot, copy, aset)
├─ doc/                  # dokumentasi teknis & produk
│  ├─ README.md          # indeks dokumentasi
│  ├─ PRD.md             # dokumen ini
│  └─ DOCUMENTATION.md   # setup, deploy, backup, troubleshooting
├─ public/
├─ docker-compose.yml
├─ Dockerfile
├─ .env.example
├─ AGENTS.md             # aturan kerja agent
├─ PROGRESS.md           # status pekerjaan
└─ README.md
```

---

## 8. Model Data (Ringkas)

```
users        id, email, password_hash, name, role, created_at
media        id, filename, mime, filesize, width, height, url, alt, created_at
pages        id, slug, title, blocks(json), seo_title, seo_desc, status, published_at
posts        id, slug, title, excerpt, content(json), cover_id, category_id,
             status, published_at, reading_time
categories   id, slug, name, description
services     id, slug, title, short_desc, icon, blocks(json), order, status
settings     site name, kontak, sosmed, GTM id, jam operasional
redirects    id, from_path, to_path, status_code
leads        id, name, email, phone, service, message, source, created_at
```

Konten kaya (pages, posts, services) memakai **blok terstruktur (JSON)**, bukan HTML mentah, agar dapat dirender sebagai komponen React yang konsisten dan aman.

---

## 9. SEO & Pemetaan URL

| URL Lama | URL Baru | Status |
|---|---|---|
| `/` | `/` | 200 |
| `/tentang-rinjan` | `/tentang` | 301 |
| `/rinjan-website` | `/layanan/website` | 301 |
| `/rinjan-desain` | `/layanan/desain` | 301 |
| `/wifi-rinjan` | `/layanan/wifi` | 301 |
| `/rinjan-it` | `/layanan/it-support` | 301 |
| `/kontak-kami` | `/kontak` | 301 |
| `/blog` | `/blog` | 200 |
| `/tips-rinjan/<slug>` | `/blog/<slug>` | 301 |
| `/tips-rinjan/<kategori>/<slug>` | `/blog/<slug>` | 301 |
| `/shop`, `/cart`, `/checkout`, `/my-account` | `/` | 301 |
| `/komputer-laptop` | `/` | 301 |

---

## 10. Kriteria Penerimaan (Definition of Done)

- [ ] Semua halaman di §4 dapat diakses dan responsif (360px - 1920px)
- [ ] Konten dapat diedit dari `/admin` oleh role `editor` tanpa bantuan developer
- [ ] Form kontak berfungsi: lead tersimpan + email notifikasi terkirim
- [ ] Lighthouse mobile >= 90 pada keempat kategori
- [ ] `sitemap.xml`, `robots.txt`, metadata OG valid
- [ ] Redirect 301 pada §9 berfungsi (verifikasi `curl -I`)
- [ ] Tidak ada tautan `http://` internal (mixed content nol)
- [ ] Backup otomatis berjalan dan pernah diuji restore
- [ ] Aksesibilitas: keyboard penuh, kontras lulus, `prefers-reduced-motion` dihormati
- [ ] Dokumentasi lengkap: setup lokal, deploy, backup, restore, troubleshooting
- [ ] Situs lama tetap hidup sebagai fallback 14 hari setelah cutover

---

## 11. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Konten belum siap saat desain final | Sedang | Bangun dengan placeholder, isi via CMS |
| Scope creep (portal, billing) | Tinggi | Tegas di non-goals; arsitektur disiapkan, fitur ditunda |
| Kehilangan SEO saat cutover | Sedang | Redirect 301, sitemap baru, submit GSC, pantau 2 minggu |
| VPS tunggal = single point of failure | Sedang | Backup harian ke storage eksternal, uptime monitoring |
| Tim non-developer kesulitan admin panel | Sedang | Pelatihan + panduan bergambar pasca go-live |
| Editor blok terasa rumit | Sedang | Batasi jenis blok; sediakan template halaman |

---

## 12. Estimasi & Fase

| Fase | Isi | Estimasi |
|---|---|---|
| 0 | Reference pack (screenshot, inventaris konten, copy, aset) | 0,5 hari |
| 1 | Fondasi: Next.js, Tailwind, design token, layout global | 2-3 hari |
| 2 | Payload CMS + koleksi + import konten | 3-4 hari |
| 3 | Redesign UI/UX seluruh halaman | 4-5 hari |
| 4 | Form lead + notifikasi email | 1-2 hari |
| 5 | SEO, sitemap, redirect 301 | 1 hari |
| 6 | QA: Lighthouse, aksesibilitas, lintas perangkat | 2-3 hari |
| 7 | Deploy VPS, DNS cutover, pelatihan, monitoring | 1 hari + 14 hari monitor |
| **Total** | | **± 2,5 - 3 minggu** |

---

## 13. Keputusan yang Sudah Dikunci

| # | Keputusan | Tanggal |
|---|---|---|
| 1 | Migrasi ke **Next.js** (bukan tetap WordPress) | 13 Nov 2026 |
| 2 | **WooCommerce dibuang** — tidak ada produk aktif | 13 Nov 2026 |
| 3 | **Konten lama tidak dimigrasi** — hanya referensi visual & copy | 13 Nov 2026 |
| 4 | **Self-host di VPS sendiri**, domain tetap milik Rinjan | 13 Nov 2026 |
| 5 | **Payload CMS + PostgreSQL** sebagai backend/CMS | 13 Nov 2026 |
| 6 | Situs WordPress lama tetap hidup sebagai referensi & fallback | 13 Nov 2026 |

## 14. Pertanyaan Terbuka

1. Redirect 301 (§9) dipertahankan atau dipangkas?
2. 4 artikel blog lama: dipindahkan manual atau mulai dari nol?
3. Siapa penanggung jawab penulisan copy baru, dan kapan tersedia?
4. Provider & spesifikasi VPS sudah ada, atau perlu rekomendasi?
5. Media upload: volume VPS atau Cloudflare R2?
