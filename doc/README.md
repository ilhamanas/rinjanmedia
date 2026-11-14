# doc/ — Indeks Dokumentasi

Semua dokumentasi teknis dan produk proyek Rinjan Media berada di folder ini. Root repo hanya menyimpan `AGENTS.md`, `PROGRESS.md`, dan `README.md`.

**Terakhir diperbarui:** 14 November 2026

---

## Dokumen Inti

| Dokumen | Isi | Status |
|---|---|---|
| [`PRD.md`](./PRD.md) | Kebutuhan produk, ruang lingkup, arsitektur, kriteria penerimaan, risiko, estimasi | Draft |
| [`DOCUMENTATION.md`](./DOCUMENTATION.md) | Setup lokal, deploy VPS, backup/restore, monitoring, troubleshooting, ADR | Draft |
| [`design-tokens.md`](./design-tokens.md) | Palet brand, aturan kontras WCAG, tipografi, state aksesibilitas (situs publik) | Final |
| [`design-admin.md`](./design-admin.md) | Tema panel `/admin`: peran warna, ramp netral & aksen, kontras terukur dua tema, override elevation gelap, kontrol form, logo | Final |

## Architecture Decision Records

| Dokumen | Keputusan | Status |
|---|---|---|
| [`adr-001-payload-di-dalam-nextjs.md`](./adr-001-payload-di-dalam-nextjs.md) | Payload 3 dijalankan di dalam proses Next.js (bukan server terpisah) — termasuk konsekuensi route group dan `proxy.ts` | Final |
| [`adr-002-workaround-cli-payload.md`](./adr-002-workaround-cli-payload.md) | CLI Payload rusak di mesin ini (`tsx` + `undici`); import map di-generate lewat rute sementara di Next.js, tipe ditulis manual | Final |
| [`adr-003-sidebar-biru-tema-gelap.md`](./adr-003-sidebar-biru-tema-gelap.md) | Panel admin memakai bahasa visual dashboard modern (sidebar biru, gelap default) tanpa menyalin konten referensi; kartu statistik dipisah ke langkah berikutnya | Final |

## Panduan Operasional

| Dokumen | Isi | Status |
|---|---|---|
| [`guide-local-postgres.md`](./guide-local-postgres.md) | PostgreSQL portable di `.dev/pg` (port 5433): menyalakan, seed, psql, reset password, troubleshooting | Final |

---

## Konvensi Penamaan

Dokumen baru **wajib** dibuat di folder ini dengan format `kebab-case.md` dan prefix kategori:

| Prefix | Untuk | Contoh |
|---|---|---|
| `prd-*` | Dokumen produk tambahan | `prd-portal-klien.md` |
| `adr-*` | Architecture Decision Record | `adr-002-r2-vs-volume-lokal.md` |
| `guide-*` | Panduan operasional | `guide-deploy-staging.md` |
| `audit-*` | Hasil audit | `audit-lighthouse-2026-11.md` |
| `api-*` | Dokumentasi API | `api-leads-endpoint.md` |
| `design-*` | Design system & token | `design-tokens.md`, `design-admin.md` |
| `notes-*` | Catatan riset/eksplorasi | `notes-riset-cms.md` |

### Header wajib setiap dokumen baru

```markdown
# Judul Dokumen

**Tanggal:** 13 November 2026
**Status:** Draft | Final | Deprecated
**Penulis:** <nama>
```

### Setelah membuat dokumen baru

1. Tambahkan barisnya ke tabel **Dokumen Inti** di atas (atau buat tabel bagian baru bila kategorinya berbeda)
2. Bila mengubah keputusan arsitektur → tambahkan ADR di `DOCUMENTATION.md` §11 dan catat di `PROGRESS.md` log perubahan

---

## Dokumen yang Direncanakan

| Dokumen | Kapan dibuat |
|---|---|
| `guide-deploy-staging.md` | Fase 7 — saat setup VPS |
| `guide-backup-restore.md` | Fase 7 — setelah script backup teruji |
| `audit-lighthouse-*.md` | Fase 6 — hasil QA |
| `adr-*.md` | Kapan pun ada keputusan arsitektur baru |
