# Rinjan Media — Website Baru

Website company profile + blog untuk **Rinjan Media**, dibangun ulang dari WordPress/Elementor ke stack modern.

**Stack:** Next.js 15 (App Router) · Payload CMS 3 · PostgreSQL 17 · Tailwind CSS v4 · Docker

---

## Status

🚧 **Fase 0 — Reference Pack** (belum mulai)

Lihat [`PROGRESS.md`](./PROGRESS.md) untuk status terkini.

---

## Dokumentasi

| Dokumen | Isi |
|---|---|
| [`AGENTS.md`](./AGENTS.md) | Aturan kerja agent AI & developer, konvensi kode, skill wajib, larangan |
| [`PROGRESS.md`](./PROGRESS.md) | Status per fase, task, blocker, log perubahan |
| [`doc/`](./doc/) | Seluruh dokumentasi teknis & produk |
| [`doc/README.md`](./doc/README.md) | Indeks dokumentasi + konvensi penamaan file baru |
| [`doc/PRD.md`](./doc/PRD.md) | Kebutuhan produk, ruang lingkup, arsitektur, kriteria penerimaan |
| [`doc/DOCUMENTATION.md`](./doc/DOCUMENTATION.md) | Setup lokal, deploy VPS, backup, troubleshooting, ADR |
| [`requirement/`](./requirement/) | Bahan referensi dari situs lama (screenshot, copy, aset) |

**Urutan baca untuk agent/developer baru:**
`AGENTS.md` → `PROGRESS.md` → `doc/README.md` → `doc/PRD.md` → `doc/DOCUMENTATION.md`

---

## Skill Agent

Proyek ini memakai skill dari [skills.sh](https://skills.sh):

| Skill | Fungsi |
|---|---|
| `using-superpowers` | Meta-skill: paksa pemanggilan skill relevan sebelum bertindak |
| `ponytail` + `ponytail-review` | Cegah over-engineering, kode minimal yang benar-benar selesai |
| `antislop` (+ `-ui`, `-human`, `-layoutmobile`, `-copywriting`, `-code`) | Anti desain generik, aksesibilitas, mobile layout, copy |
| `ui-ux-pro-max` | Keputusan UX & review desain |
| `find-skills` | Cari skill baru bila belum tercakup |

```bash
npx skills list        # lihat skill terpasang
```

Detail pemakaian: [`AGENTS.md` §3](./AGENTS.md)

---

## Quick Start

```bash
# 1. install dependency
pnpm install

# 2. siapkan environment
cp .env.example .env

# 3. jalankan database (Docker)
docker run -d --name rinjan-db \
  -e POSTGRES_USER=rinjan \
  -e POSTGRES_PASSWORD=rinjan \
  -e POSTGRES_DB=rinjanmedia \
  -p 5432:5432 postgres:17

# 4. migrasi
pnpm payload migrate
pnpm payload generate:types

# 5. jalankan
pnpm dev
```

| URL | Fungsi |
|---|---|
| http://localhost:3000 | Website |
| http://localhost:3000/admin | Admin panel |
| http://localhost:3000/api | REST API |

Detail lengkap: [`doc/DOCUMENTATION.md`](./doc/DOCUMENTATION.md)

---

## Struktur Singkat

```
rinjanmedia-new/
├─ src/
│  ├─ app/(frontend)/     # halaman publik
│  ├─ app/(payload)/      # admin + API
│  ├─ collections/        # skema Payload
│  ├─ blocks/             # render blok konten
│  ├─ components/         # UI
│  └─ lib/                # util & query
├─ doc/                   # dokumentasi teknis & produk
├─ requirement/           # bahan referensi (read-only)
├─ docker-compose.yml
├─ Dockerfile
├─ AGENTS.md
├─ PROGRESS.md
└─ README.md
```

---

## Perintah Umum

```bash
pnpm dev              # development
pnpm build            # build produksi
pnpm lint             # ESLint
pnpm typecheck        # TypeScript check
pnpm format           # Prettier

pnpm payload migrate          # jalankan migrasi DB
pnpm payload generate:types   # regenerate tipe Payload
```

---

## Keputusan yang Sudah Dikunci

1. Migrasi ke **Next.js** (bukan tetap WordPress)
2. **WooCommerce dibuang** — tidak ada produk aktif
3. **Konten lama tidak dimigrasi** — hanya dipakai sebagai referensi
4. **Self-host di VPS sendiri**
5. **Payload CMS + PostgreSQL** sebagai backend/CMS
6. Situs WordPress lama tetap hidup sebagai fallback

Detail: [`doc/PRD.md` §13](./doc/PRD.md)

---

## Kontak

Pemilik produk: Rinjan Media
Domain produksi: `rinjanmedia.com`
