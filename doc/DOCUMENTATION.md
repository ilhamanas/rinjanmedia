# DOCUMENTATION.md — Dokumentasi Teknis

Panduan teknis untuk pengembangan, deployment, dan perawatan website Rinjan Media.

**Terakhir diperbarui:** 13 November 2026

---

## 1. Ringkasan Proyek

| Item | Nilai |
|---|---|
| Nama | Rinjan Media — Website |
| Domain produksi | `rinjanmedia.com` |
| Domain staging | `staging.rinjanmedia.com` |
| Stack | Next.js 15 + Payload CMS 3 + PostgreSQL 17 + Tailwind v4 |
| Repositori | `D:\laragon\www\rinjanmedia-new` |
| Hosting | VPS sendiri (Docker Compose) |
| CDN | Cloudflare |

---

## 2. Prasyarat

| Tool | Versi minimum | Catatan |
|---|---|---|
| Node.js | 22 LTS | Mesin dev ini: **24.22.1**. Node 22 portable juga tersedia di `.dev/node22/` |
| npm | 10 | **`pnpm` tidak dipakai** — gagal di mesin ini (lihat §3.1) |
| PostgreSQL | 17 | Mesin dev: 17.6 **portable** di `.dev/pg/` port 5433. Docker tidak tersedia di sini |
| Docker | 27 | Hanya untuk deploy VPS, bukan untuk dev lokal |
| Git | 2.40 | Repo belum di-inisialisasi |

Cek versi:
```powershell
node -v
npm -v
& ".dev\pg\pgsql\bin\psql.exe" --version
```

---

## 3. Setup Development Lokal

### 3.1 Clone & install
```powershell
cd D:\laragon\www
git clone <repo-url> rinjanmedia-new
cd rinjanmedia-new
npm install
```

> **Pakai `npm`, bukan `pnpm`.** `pnpm` tidak bisa dipakai di mesin dev ini (install script diblokir, `corepack enable` gagal dengan EPERM).

### 3.2 Environment
```powershell
Copy-Item .env.example .env
```

Isi `.env` (nilai di bawah sudah cocok dengan PostgreSQL portable lokal):

```env
# Database lokal — PostgreSQL portable di .dev/pg, port 5433
DATABASE_URI=postgres://rinjan:rinjan_dev_2026@127.0.0.1:5433/rinjanmedia

# Wajib. Ganti dengan string acak 32+ karakter di produksi.
PAYLOAD_SECRET=dev-secret-ganti-di-produksi-minimal-32-karakter

# URL publik situs (dipakai metadata + CORS Payload)
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

Generate secret:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Variabel untuk Fase 4 (belum dipakai): `RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL`.

### 3.3 Database lokal
Mesin dev ini **tidak punya PostgreSQL dan tidak punya Docker**. PostgreSQL 17.6 dipasang portable di `.dev/pg/` (di luar repo, masuk `.gitignore`) dan berjalan di **port 5433**.

Panduan lengkap — menyalakan, seed, psql, reset password, troubleshooting: **[`guide-local-postgres.md`](./guide-local-postgres.md)**.

Ringkasnya:
```powershell
# nyalakan (harus jalan sebelum npm run dev)
Start-Process -FilePath ".dev\pg\pgsql\bin\postgres.exe" `
  -ArgumentList '-D','.dev\pg\data','-p','5433' -WindowStyle Hidden

# cek siap
& ".dev\pg\pgsql\bin\pg_isready.exe" -p 5433 -h 127.0.0.1
```

Alternatif bila suatu saat tersedia Docker:
```bash
docker run -d --name rinjan-db \
  -e POSTGRES_USER=rinjan -e POSTGRES_PASSWORD=rinjan_dev_2026 \
  -e POSTGRES_DB=rinjanmedia -p 5433:5432 \
  -v rinjan-db-data:/var/lib/postgresql/data postgres:17
```

### 3.4 Skema & seed

**Skema:** saat dev, adapter `@payloadcms/db-postgres` melakukan push otomatis. Menambah field di koleksi langsung mengubah tabel — tidak perlu `payload migrate`. (Migrasi eksplisit baru diperlukan sebelum deploy produksi.)

**Admin pertama** (sekali saja, saat tabel `users` masih kosong):
```powershell
$body = @{ email='admin@rinjanmedia.com'; password='RinjanAdmin2026!'; name='Admin Rinjan'; role='admin' } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/users/first-register" `
  -Method Post -Body $body -ContentType "application/json" -UseBasicParsing
```

**Seed konten** (idempoten, aman diulang):
```powershell
node scripts/seed.mjs
```

**Jangan pakai CLI Payload** — `payload generate:importmap`, `generate:types`, dan `migrate` gagal di mesin ini. Lihat [`adr-002-workaround-cli-payload.md`](./adr-002-workaround-cli-payload.md).

### 3.5 Jalankan
```powershell
npm run dev
```

| URL | Fungsi |
|---|---|
| `http://localhost:3000` | Website |
| `http://localhost:3000/admin` | Admin panel |
| `http://localhost:3000/api` | REST API |
| `http://localhost:3000/api/graphql` | GraphQL (POST) |

Build produksi lokal:
```powershell
npm run build
npm run start
```

Buat user admin pertama lewat `/api/users/first-register` (§3.4) — endpoint itu hanya aktif saat tabel `users` kosong.

---

## 4. Struktur Direktori

```
rinjanmedia-new/
├─ src/
│  ├─ app/
│  │  ├─ (frontend)/          # halaman publik + root layout situs
│  │  │  ├─ layout.tsx        # html/body, skip link, header, footer
│  │  │  ├─ page.tsx          # beranda (baca CMS)
│  │  │  ├─ tentang/
│  │  │  ├─ layanan/          # index + [slug] (baca CMS)
│  │  │  ├─ kontak/
│  │  │  ├─ blog/
│  │  │  └─ not-found.tsx
│  │  ├─ (payload)/           # admin + API Payload
│  │  │  ├─ layout.tsx        # RootLayout Payload
│  │  │  ├─ admin/[[...segments]]/page.tsx
│  │  │  ├─ admin/importMap.js        # di-generate, jangan diedit
│  │  │  └─ api/[...slug]/route.ts    # REST
│  │  │     api/graphql/route.ts      # GraphQL
│  │  ├─ actions/             # Server Actions (submit-lead.ts)
│  │  └─ globals.css          # design token Tailwind v4
│  ├─ collections/            # skema Payload (Users, Media, Pages, Posts, Services, Leads, Redirects)
│  ├─ blocks/                 # definisi blok konten Payload
│  ├─ globals/                # Settings
│  ├─ components/
│  │  ├─ ui/                  # primitif (ButtonLink, dll)
│  │  └─ sections/            # komposisi (SiteHeader, SiteFooter, ContactForm, Section)
│  ├─ lib/
│  │  ├─ payload.ts           # getPayload client + getServices/getSettings
│  │  ├─ lead.ts              # skema Zod + helper WhatsApp
│  │  ├─ site.ts              # data kontak
│  │  └─ content.ts           # sisa konten statis (faqs)
│  ├─ proxy.ts                # redirect 301/302 dari CMS (Next 16)
│  └─ payload.config.ts
├─ scripts/seed.mjs           # seed idempoten lewat REST
├─ requirement/               # bahan referensi (read-only)
├─ doc/                       # dokumentasi teknis & produk
│  ├─ README.md               # indeks dokumentasi
│  ├─ PRD.md
│  ├─ DOCUMENTATION.md        # dokumen ini
│  ├─ design-tokens.md
│  ├─ adr-001-payload-di-dalam-nextjs.md
│  ├─ adr-002-workaround-cli-payload.md
│  └─ guide-local-postgres.md
├─ .dev/                      # PostgreSQL portable + Node 22 (tidak di-commit)
├─ .verify/                   # skrip verifikasi CDP (tidak di-commit)
├─ public/
├─ docker-compose.yml
├─ Dockerfile
├─ .env.example
├─ AGENTS.md                  # aturan kerja agent
├─ PROGRESS.md                # status pekerjaan
└─ README.md
```

> `sitemap.ts` dan `robots.ts` **belum ada** — bagian dari Fase 5.

---

## 5. Alur Konten (CMS)

```
Editor login /admin
   -> edit halaman / tulis artikel
   -> simpan (draft)
   -> preview
   -> publish
        |
        v
Payload simpan ke PostgreSQL
        |
        v
halaman publik query via getPayload() (Server Component)
        |
        v
ISR revalidate 60 detik -> halaman diperbarui
        |
        v
Pengunjung melihat konten baru (tanpa deploy)
```

> Catatan jujur: belum ada hook `afterChange` yang memanggil `revalidatePath`. Pembaruan terjadi lewat **ISR 60 detik** (`export const revalidate = 60` di halaman). Artinya perubahan konten bisa tertunda sampai 1 menit. Untuk pembaruan instan, tambahkan hook `afterChange` di koleksi — belum dikerjakan.

### 5.1 Menambah halaman baru
1. `/admin` → Pages → Create New
2. Isi title, slug (otomatis dari title), SEO title & description
3. Susun blok konten (Hero, RichText, CTA, dll)
4. Set status `published`
5. Simpan

> **Belum otomatis tampil di situs.** Rute `src/app/(frontend)/[slug]/page.tsx` belum dibuat, jadi dokumen di koleksi `pages` baru tersimpan di CMS dan bisa dibaca lewat `/api/pages`, tetapi belum bisa diakses pengunjung di `/<slug>`. Halaman publik yang ada (`/`, `/tentang`, `/layanan`, `/kontak`, `/blog`) masih ditulis sebagai file rute tetap.
>
> Yang sudah membaca CMS: `/`, `/layanan`, `/layanan/[slug]` (koleksi `services`) dan metadata SEO-nya. Menghubungkan `pages` ke rute generik adalah pekerjaan Fase 3.

### 5.2 Menulis artikel blog
1. `/admin` → Posts → Create New
2. Isi title, excerpt, kategori, cover image (alt wajib)
3. Tulis konten dengan rich text
4. Publish

> **Belum tampil di `/blog`.** Koleksi `posts` sudah ada dan `/api/posts` berfungsi, tetapi `/blog` masih menampilkan empty state dan `/blog/[slug]` belum dibuat — menunggu 4 artikel lama di `requirement/blog/` yang masih kosong.

### 5.3 Media
- Upload via `/admin` → Media, atau `POST /api/media` (butuh login)
- Format: semua `image/*`
- **Alt text wajib** — dipakai untuk aksesibilitas & SEO
- Batas ukuran file: 5 MB
- Varian otomatis (sharp): `thumbnail` 400px, `card` 768px, `hero` 1600px — hanya dibuat bila gambar asli lebih besar
- Disimpan di folder `media/` (masuk `.gitignore`); di produksi arahkan ke volume VPS atau Cloudflare R2

---

## 6. Design Token

Didefinisikan di `src/app/globals.css` menggunakan `@theme` Tailwind v4. Sumber kebenaran lengkap (termasuk tabel kontras) ada di **[`design-tokens.md`](./design-tokens.md)**.

```css
@theme {
  /* Brand — diambil dari logo & situs live */
  --color-brand-500: #3171b3;   /* biru utama */
  --color-brand-600: #27609b;
  --color-brand-700: #1e4e7f;

  /* Aksen oranye: accent-500 dekoratif, accent-600 untuk tombol solid */
  --color-accent-500: #eb4101;  /* kontras 3.97:1 — JANGAN untuk teks putih */
  --color-accent-600: #d93a00;  /* 4.61:1 — aman untuk teks putih */

  /* Netral */
  --color-ink-900: #101010;
  --color-ink-700: #303133;
  --color-ink-500: #4d4d4d;
  --color-ink-300: #6b7176;     /* 4.94:1 — batas bawah untuk teks */

  /* Pendukung */
  --color-sun-400: #ffc600;

  /* Tipografi */
  --font-sans: var(--font-poppins), ui-sans-serif, system-ui, sans-serif;
}
```

**Aturan:**
1. Jangan menulis hex langsung di komponen — pakai `bg-brand-500`, `text-ink-700`, dst.
2. Tombol solid oranye **wajib** `accent-600`; `accent-500` hanya untuk focus ring dan titik dekoratif.
3. Setiap pasangan teks/latar baru harus ≥ 4.5:1 (teks normal) sebelum dipakai.

---

## 7. Deployment Produksi (VPS)

### 7.1 Spesifikasi VPS
| Item | Minimum | Disarankan |
|---|---|---|
| vCPU | 2 | 4 |
| RAM | 4 GB | 8 GB |
| Disk | 40 GB SSD | 80 GB NVMe |
| OS | Ubuntu 24.04 LTS | Ubuntu 24.04 LTS |

### 7.2 Hardening awal
```bash
# update sistem
apt update && apt upgrade -y

# buat user non-root
adduser deploy && usermod -aG sudo deploy

# SSH key only
# di /etc/ssh/sshd_config: PasswordAuthentication no, PermitRootLogin no
systemctl restart ssh

# firewall
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# docker
curl -fsSL https://get.docker.com | sh
usermod -aG docker deploy
```

### 7.3 Nginx + SSL
```bash
apt install -y nginx certbot python3-certbot-nginx
```

`/etc/nginx/sites-available/rinjanmedia`:
```nginx
server {
    listen 80;
    server_name rinjanmedia.com www.rinjanmedia.com;
    return 301 https://rinjanmedia.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name rinjanmedia.com www.rinjanmedia.com;

    ssl_certificate     /etc/letsencrypt/live/rinjanmedia.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rinjanmedia.com/privkey.pem;

    client_max_body_size 25M;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

```bash
ln -s /etc/nginx/sites-available/rinjanmedia /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d rinjanmedia.com -d www.rinjanmedia.com
```

### 7.4 Docker Compose

`docker-compose.yml`:
```yaml
services:
  db:
    image: postgres:17-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URI: postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      PAYLOAD_SECRET: ${PAYLOAD_SECRET}
      NEXT_PUBLIC_SERVER_URL: https://rinjanmedia.com
      NEXT_PUBLIC_GTM_ID: ${NEXT_PUBLIC_GTM_ID}
    ports:
      - "127.0.0.1:3000:3000"

volumes:
  db-data:
```

Deploy:
```bash
docker compose up -d --build
docker compose logs -f app
```

### 7.5 Update aplikasi
```bash
git pull
docker compose up -d --build
```

> **Migrasi database di produksi belum disiapkan.** Selama dev, Payload push skema otomatis; di produksi jangan diandalkan. Sebelum go-live, buat migrasi (`payload migrate:create` di mesin yang CLI-nya berfungsi) dan jalankan di container `app` saat deploy. Lihat `adr-002-workaround-cli-payload.md` untuk kendala CLI di mesin dev ini.

---

## 8. Backup & Restore

### 8.1 Backup harian
Script `/opt/backup/backup.sh`:
```bash
#!/bin/bash
set -euo pipefail
DATE=$(date +%Y-%m-%d)
BACKUP_DIR=/opt/backup/dumps
mkdir -p "$BACKUP_DIR"

docker compose -f /opt/rinjanmedia/docker-compose.yml exec -T db \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > "$BACKUP_DIR/db-$DATE.sql.gz"

# unggah ke storage eksternal (R2 / B2)
rclone copy "$BACKUP_DIR/db-$DATE.sql.gz" remote:rinjanmedia-backup/db/

# hapus backup lokal lebih dari 7 hari
find "$BACKUP_DIR" -name "db-*.sql.gz" -mtime +7 -delete
```

Cron:
```cron
0 2 * * * /opt/backup/backup.sh >> /var/log/rinjan-backup.log 2>&1
```

### 8.2 Restore
```bash
gunzip -c db-2026-11-13.sql.gz | docker compose exec -T db psql -U rinjan -d rinjanmedia
```

> **Wajib diuji minimal sekali** sebelum go-live. Backup yang tidak pernah direstore belum terbukti berfungsi.

---

## 9. Monitoring

| Alat | Fungsi |
|---|---|
| **Uptime Kuma** (self-host) | Cek uptime + notifikasi Telegram/email |
| **Cloudflare Analytics** | Traffic, cache hit ratio, error rate |
| **Docker logs** | `docker compose logs -f --tail=100 app` |
| **Google Search Console** | Indexing, error crawl, query organik |

---

## 10. Troubleshooting

| Gejala | Penyebab umum | Solusi |
|---|---|---|
| Semua halaman CMS 500 | PostgreSQL mati | Nyalakan DB: lihat `guide-local-postgres.md` §1 |
| `/admin` tampil tapi kosong | `importMap` kosong/basi | Regenerate import map: `adr-002-workaround-cli-payload.md` |
| `/admin` blank / 500 | Skema DB belum dibuat | Jalankan `npm run dev` sekali, tunggu "Pulling schema" selesai |
| Perubahan konten tidak muncul | ISR 60 detik belum lewat | Tunggu ≤60 detik, atau restart dev server |
| Gambar tidak tampil | File tidak ada di `media/` | Cek `media/`, pastikan folder bisa ditulis |
| Build gagal: tipe error | Tipe manual tidak cocok skema | Perbarui `ServiceDoc`/`SettingsDoc` di `src/lib/payload.ts` |
| Form gagal simpan | DB mati / koleksi `leads` belum ada | Cek log server, pastikan tabel `leads` ada |
| `payload generate:importmap` error `Illegal constructor` | Bug `tsx` + `undici` di Node 22/24 | Pakai workaround `adr-002`, jangan pakai CLI |
| 502 dari Nginx | Container app mati | `docker compose ps`, `docker compose logs app` |
| DB connection refused (produksi) | Container db belum healthy | Tunggu healthcheck, cek `docker compose logs db` |
| Halaman 404 setelah deploy | Build cache basi | `rm -rf .next && npm run build` |
| Redirect 301 tidak jalan | `proxy.ts` tidak terdeteksi | Pastikan file bernama `src/proxy.ts` dan mengekspor fungsi `proxy` (bukan `middleware`) |

---

## 11. Keputusan Teknis (Architecture Decision Record)

| # | Keputusan | Alasan | Tanggal |
|---|---|---|---|
| 1 | Next.js App Router, bukan Pages Router | RSC, streaming, layout nesting, masa depan framework | 13 Nov 2026 |
| 2 | Payload CMS, bukan NestJS custom | Admin panel + editor blok jadi, hemat 7-10 hari kerja; tetap di Next.js sehingga satu deploy | 13 Nov 2026 |
| 3 | Payload, bukan Sanity | Data harus di VPS sendiri (self-host), bukan SaaS | 13 Nov 2026 |
| 4 | PostgreSQL, bukan MySQL | Ekosistem Payload/Drizzle lebih matang, tipe JSONB kuat | 13 Nov 2026 |
| 5 | Konten blok JSON, bukan HTML mentah | Konsisten, aman, bisa dirender komponen React | 13 Nov 2026 |
| 6 | Tidak migrasi konten otomatis | Konten sedikit (13 halaman, 4 artikel); desain baru menuntut penataan ulang | 13 Nov 2026 |
| 7 | Buang WooCommerce | Tidak ada produk aktif | 13 Nov 2026 |
| 8 | Cloudflare R2 untuk media | Murah, tanpa biaya egress, aman saat container rebuild | 13 Nov 2026 |
| 9 | Docker Compose, bukan Kubernetes | Skala situs tidak butuh orkestrasi kompleks; sederhana = mudah dirawat | 13 Nov 2026 |
| 10 | Next.js **16.4.6**, bukan 15.x | 15.5.4 punya CVE-2025-66478; Payload 3.93 mendukung Next `>=16.3.3 <17` | 14 Nov 2026 |
| 11 | Payload berjalan **di dalam** proses Next.js | Satu deploy, tidak ada HTTP hop, Server Component query langsung. Detail: `adr-001-payload-di-dalam-nextjs.md` | 14 Nov 2026 |
| 12 | **Tidak memakai CLI Payload** | `tsx` + `undici` v7 bentrok di Node 22 & 24. Import map lewat rute sementara, tipe manual. Detail: `adr-002-workaround-cli-payload.md` | 14 Nov 2026 |
| 13 | PostgreSQL **portable** di `.dev/pg` port 5433 | Mesin dev tidak punya PostgreSQL/Docker; tanpa admin rights. Detail: `guide-local-postgres.md` | 14 Nov 2026 |
| 14 | shadcn/ui **tidak dipakai** | Komponen ditulis manual; hanya `lucide-react` + `clsx` + `tailwind-merge` | 14 Nov 2026 |
| 15 | Tombol solid oranye pakai `accent-600` `#d93a00` | `accent-500` `#eb4101` hanya 3.97:1 dengan teks putih — gagal WCAG AA | 14 Nov 2026 |

---

## 12. Referensi

| Sumber | URL |
|---|---|
| Next.js Docs | https://nextjs.org/docs |
| Payload CMS Docs | https://payloadcms.com/docs |
| Tailwind CSS v4 | https://tailwindcss.com/docs |
| shadcn/ui | https://ui.shadcn.com |
| Drizzle ORM | https://orm.drizzle.team |
| Cloudflare R2 | https://developers.cloudflare.com/r2 |

---

## 13. Catatan Migrasi dari Situs Lama

Situs lama **tidak dimigrasi**. Yang diambil hanya:

| Item | Lokasi |
|---|---|
| Screenshot halaman | `requirement/screenshots/` |
| Inventaris konten & copy | `requirement/content/` |
| 4 artikel blog lama | `requirement/blog/` |
| Aset brand (logo, favicon, foto) | `requirement/assets/` |

**Yang sengaja dibuang:**
- Seluruh markup Elementor
- 150 file media lama (hanya aset brand diambil)
- WooCommerce (shop, cart, checkout, my-account)
- Plugin: ElementsKit, Essential Addons, Slider Revolution, WPForms, WP Rocket
- 6 Google Font lama (diganti maksimal 2 font)
- 4 tautan `http://` (mixed content)

**Analytics yang dipertahankan:**
- GTM: `GT-P36LTCV`
- GA4 (via Site Kit)
