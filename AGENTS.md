# AGENTS.md — Panduan Kerja Agent & Developer

Dokumen ini adalah **kontrak kerja** untuk setiap agent/AI maupun developer manusia yang bekerja di repositori ini. Baca dokumen ini lebih dulu sebelum menyentuh kode.

**Proyek:** Rinjan Media — website company profile + blog
**Stack:** Next.js 15 (App Router) + Payload CMS 3 + PostgreSQL 17 + Tailwind CSS v4
**Target Deploy:** VPS sendiri (Docker Compose + Nginx + Cloudflare)

---

## 1. Urutan Baca Wajib (setiap sesi baru)

Baca berurutan **sebelum** menulis kode atau menjawab pertanyaan teknis:

1. **`AGENTS.md`** (dokumen ini) — aturan main
2. **`PROGRESS.md`** — posisi pekerjaan saat ini, task mana yang sudah selesai, apa blocker-nya
3. **`doc/`** — seluruh dokumentasi teknis & produk:
   - `doc/PRD.md` — apa yang dibangun dan mengapa
   - `doc/DOCUMENTATION.md` — setup lokal, deploy, backup, troubleshooting
   - file `.md` lain di `doc/` (lihat §2)
4. **`requirement/`** — bahan referensi dari situs lama (read-only)

> ⚠️ **Jangan pernah mulai bekerja tanpa membaca `PROGRESS.md` dan isi `doc/`.** Keduanya adalah sumber kebenaran status proyek dan keputusan teknis. Melewatkannya berisiko mengulang pekerjaan yang sudah selesai atau membatalkan keputusan yang sudah dikunci.

---

## 2. Struktur Dokumentasi

| Path | Isi | Status |
|---|---|---|
| `AGENTS.md` | Aturan kerja, konvensi, skill, larangan | Wajib baca |
| `PROGRESS.md` | Status per fase, task, blocker, log perubahan | **Wajib baca & wajib update** |
| `README.md` | Quick start & peta dokumen | Ringkasan |
| `doc/PRD.md` | Kebutuhan produk, ruang lingkup, arsitektur, DoD | Wajib baca |
| `doc/DOCUMENTATION.md` | Setup, deploy, backup, troubleshooting, ADR | Wajib baca |
| `doc/*.md` | Dokumen tambahan (lihat aturan penamaan di bawah) | Baca bila relevan |
| `requirement/` | Screenshot, inventaris konten, copy, aset brand | Read-only |

### 2.1 Aturan Menambah Dokumen Baru

Semua dokumentasi teknis/produk baru **wajib** dibuat di dalam `doc/`, bukan di root.

**Penamaan file** — `kebab-case.md`, diawali kategori:

| Prefix | Untuk |
|---|---|
| `prd-*.md` | Dokumen produk tambahan (mis. `prd-fitur-portal-klien.md`) |
| `adr-*.md` | Architecture Decision Record (mis. `adr-001-payload-vs-nestjs.md`) |
| `guide-*.md` | Panduan (mis. `guide-deploy-staging.md`, `guide-backup-restore.md`) |
| `audit-*.md` | Hasil audit (mis. `audit-lighthouse-2026-11.md`) |
| `api-*.md` | Dokumentasi API/endpoint |
| `design-*.md` | Design system, token, spesifikasi visual |
| `notes-*.md` | Catatan riset/eksplorasi |

**Setiap dokumen baru wajib:**
1. Punya header: judul, tanggal, status (`Draft`/`Final`/`Deprecated`), penulis
2. Didaftarkan di tabel `doc/README.md` (indeks dokumentasi)
3. Bila mengubah keputusan arsitektur → tambahkan baris di `doc/DOCUMENTATION.md` §11 (ADR) dan `PROGRESS.md` log perubahan

**Jangan** membuat file `.md` dokumentasi di root selain `AGENTS.md`, `PROGRESS.md`, `README.md`.

---

## 3. Skill yang Wajib Digunakan

Proyek ini memakai **Agent Skills** dari [skills.sh](https://skills.sh). Skill bukan opsional — bila kondisinya cocok, **wajib dipanggil sebelum menulis kode atau menjawab**.

### 3.1 Skill Terpasang

| Skill | Kapan dipakai | Sumber |
|---|---|---|
| **`using-superpowers`** | **Selalu, di awal setiap sesi.** Meta-skill yang memaksa pemanggilan skill yang relevan sebelum bertindak. | `obra/superpowers` |
| **`ponytail`** | Setiap tugas menulis kode: implementasi, fix, refactor, pilih dependency. Menekan over-engineering — kode paling sedikit yang benar-benar selesai. | `DietrichGebert/ponytail` |
| **`ponytail-review`** | Saat me-review diff/PR — cari kode berlebih, abstraksi tak perlu, duplikasi. | `DietrichGebert/ponytail` |
| **`antislop`** | **Selalu aktif saat membangun/mengedit UI.** Filter inti anti desain generik. | `miqdadbadjuber/anti-slop` |
| **`antislop-ui`** | Membangun komponen/halaman: warna, layout, motion, performa. | idem |
| **`antislop-human`** | Aksesibilitas: kontras, keyboard, focus, state, tap target. Wajib untuk komponen interaktif. | idem |
| **`antislop-layoutmobile`** | Layout responsif: grid, overflow, tap target, reflow phone→desktop. | idem |
| **`antislop-copywriting`** | Menulis/menyunting teks UI: headline, CTA, error message, empty state, microcopy. | idem |
| **`antislop-code`** | Higiene komentar kode — hapus komentar generik, pertahankan yang bernilai. | idem |
| **`ui-ux-pro-max`** | Keputusan UX yang lebih besar: alur, hierarki, pola interaksi, review desain. | `nextlevelbuilder/ui-ux-pro-max-skill` |
| **`find-skills`** | Mencari skill baru saat kebutuhan belum tercakup skill yang ada. | `vercel-labs/skills` |

### 3.2 Matriks Pemakaian per Jenis Tugas

| Tugas | Skill wajib |
|---|---|
| Mulai sesi / mulai task baru | `using-superpowers` |
| Menulis komponen atau halaman baru | `ponytail` + `antislop` + `antislop-ui` |
| Komponen interaktif (menu, form, accordion, carousel) | + `antislop-human` |
| Layout responsif / grid / breakpoint | + `antislop-layoutmobile` |
| Menulis teks UI, CTA, pesan error | `antislop-copywriting` |
| Review kode / PR | `ponytail-review` + `antislop-code` |
| Audit desain halaman yang sudah jadi | `ui-ux-pro-max` + `antislop-ui` |
| Riset pola UX atau alur baru | `ui-ux-pro-max` |
| Kebutuhan belum tercakup skill mana pun | `find-skills` |

### 3.3 Cara Memanggil

Saat memakai skill, **umumkan lebih dulu**, lalu ikuti instruksinya:

```
Using ponytail to keep the implementation minimal.
Using antislop-ui + antislop-human to build the contact form.
```

Aturan tambahan:

- `using-superpowers` menyatakan: bila sebuah skill berlaku untuk tugasmu, **tidak ada pilihan lain — wajib dipakai**. Jangan mencari alasan untuk melewatinya.
- `ponytail` aktif sepanjang sesi sampai user bilang "stop ponytail" / "normal mode". Level dapat diubah: `/ponytail lite|full|ultra` (default `full`).
- `antislop` punya mode (lihat SKILL.md-nya). Bila mode belum jelas, tanyakan atau nyatakan mode yang diasumsikan sekali di awal.
- Bila skill yang dibutuhkan belum terpasang, gunakan `find-skills` atau minta izin user sebelum install.

### 3.4 Cek & Pasang Skill

```bash
# lihat skill terpasang
npx skills list

# cari skill
npx skills find "nextjs best practices"

# pasang skill (global)
npx skills add https://github.com/<owner>/<repo> --skill <nama> -g -y
```

Bila `anti-slop` belum terpasang:

```bash
npx skills add https://github.com/miqdadbadjuber/anti-slop --skill '*' -g -y
```

---

## 4. Prinsip Utama

1. **Server Component dulu.** Gunakan `"use client"` hanya bila benar-benar butuh state/effect/event handler.
2. **Data fetching di server.** Jangan fetch dari client kecuali untuk interaksi (submit form, pencarian live).
3. **Konten bukan kode.** Semua teks, gambar, dan halaman berasal dari Payload CMS. Jangan hardcode konten di komponen.
4. **Blok, bukan HTML.** Render konten dari blok terstruktur (JSON) menjadi komponen React. Jangan `dangerouslySetInnerHTML` kecuali untuk output sanitasi yang eksplisit.
5. **Aksesibilitas bukan opsional.** Setiap komponen interaktif wajib bisa dioperasikan dengan keyboard dan memiliki label.
6. **Performa terukur.** Setiap PR yang menambah dependency wajib menyertakan alasan dan dampak ukuran bundle.
7. **Satu sumber kebenaran.** Tipe data diturunkan dari Payload/Drizzle. Jangan mendefinisikan ulang tipe yang sama di banyak tempat.
8. **Kode paling sedikit yang benar-benar selesai.** Sesuai `ponytail`: jangan tambah abstraksi, config, atau fitur yang tidak diminta.

---

## 5. Struktur Direktori & Tanggung Jawab

| Path | Isi | Aturan |
|---|---|---|
| `src/app/(frontend)/` | Route publik | Hanya Server Component kecuali perlu interaksi |
| `src/app/(payload)/` | Admin + API Payload | **Jangan diubah manual** kecuali konfigurasi resmi |
| `src/collections/` | Skema koleksi Payload | Satu file per koleksi |
| `src/blocks/` | Komponen render blok | Nama file = nama blok (PascalCase) |
| `src/components/` | Komponen UI umum | Pisahkan `ui/` (primitif) dan `sections/` (komposisi) |
| `src/lib/` | Util, query, SEO helper | Fungsi murni, mudah dites |
| `doc/` | Dokumentasi teknis & produk | **Boleh diedit**, ikuti §2.1 |
| `requirement/` | Bahan referensi | **Read-only.** Jangan diedit agent |

---

## 6. Konvensi Kode

### 6.1 Penamaan
- File komponen: `PascalCase.tsx`
- File util/hook: `camelCase.ts`
- Koleksi Payload: `kebab-case.ts`, slug koleksi `kebab-case`
- Variabel & fungsi: `camelCase`; tipe/interface: `PascalCase`
- Konstanta: `SCREAMING_SNAKE_CASE`

### 6.2 TypeScript
- `strict: true` wajib. Tidak boleh `any` implisit.
- `any` eksplisit hanya bila ada komentar alasan.
- Gunakan `type` untuk union/utility, `interface` untuk objek yang bisa diperluas.
- Tipe Payload **ditulis manual** di `src/lib/payload.ts` (`ServiceDoc`, `SettingsDoc`). CLI `payload generate:types` tidak bisa dipakai di mesin ini — lihat `doc/adr-002-workaround-cli-payload.md`. Perbarui tipe itu setiap kali skema koleksi berubah.

### 6.3 Styling
- Tailwind utility-first. Hindari `style={{}}` kecuali nilai dinamis.
- Design token di `src/app/globals.css` via `@theme` (Tailwind v4). **Jangan hardcode warna hex** di komponen — pakai token (`bg-brand-600`, bukan `bg-[#0f766e]`).
- Gunakan `cn()` (clsx + tailwind-merge) untuk kelas kondisional.
- Tidak ada `!important`.

### 6.4 Komponen
- Satu komponen per file, default export.
- Props bertipe eksplisit, tanpa `props: any`.
- Server Component tidak boleh mengimpor hook React atau library client-only.
- Komponen client wajib diawali `"use client"` di baris pertama.

### 6.5 Gambar
- Selalu `next/image` dengan `width`/`height` atau `fill` + container berukuran.
- `alt` wajib. Untuk gambar dekoratif: `alt=""` + `aria-hidden`.
- Format modern (AVIF/WebP), `sizes` disesuaikan layout.

### 6.6 Animasi
- Library: `motion` (Framer Motion). Gunakan seminimal mungkin.
- Wajib hormati `prefers-reduced-motion` — gunakan hook `useReducedMotion()`.
- Hindari animasi pada elemen LCP (hero heading/gambar).

---

## 7. Aturan Payload CMS

1. Setiap koleksi punya `access` eksplisit — jangan biarkan default terbuka.
   - Publik: `read` hanya untuk `status = published`.
   - `create/update/delete`: hanya user login dengan role sesuai.
2. Field konten memakai **blocks** atau **richText**, bukan `textarea` HTML.
3. Field `alt` pada media: `required: true`.
4. Slug: `unique: true`, `index: true`, hook `beforeValidate` untuk auto-slug.
5. Setiap perubahan skema wajib disertai migrasi Drizzle yang di-commit.
6. Setelah mengubah konten, panggil `revalidatePath()` / `revalidateTag()` agar ISR segar.
7. Koleksi `leads` hanya bisa dibaca oleh role `admin`.

---

## 8. Keamanan

- **Jangan pernah commit** `.env`, kredensial, private key, atau dump database.
- Semua input user divalidasi dengan **Zod** di server. Validasi client hanya untuk UX.
- Form wajib punya honeypot + rate limit.
- Jangan render HTML dari user tanpa sanitasi (`sanitize-html` bila terpaksa).
- Header keamanan (CSP, HSTS, X-Frame-Options, Referrer-Policy) diatur di `next.config.ts` dan Nginx.
- Dependency baru: cek lisensi, ukuran, dan maintenance. Hindari paket tanpa rilis 12 bulan terakhir.

---

## 9. Git & Commit

### 9.1 Branch
```
main        -> produksi (protected, deploy otomatis)
develop     -> integrasi
feat/<nama> -> fitur baru
fix/<nama>  -> perbaikan bug
chore/<nama>-> tooling/infra
docs/<nama> -> dokumentasi
```

### 9.2 Format Commit (Conventional Commits)
```
feat(blog): tambah filter kategori di halaman daftar artikel
fix(form): perbaiki validasi nomor WhatsApp
chore(deps): upgrade payload ke 3.x
docs(doc): tambah panduan deploy staging
```

Tipe yang dipakai: `feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, `test`, `style`.

### 9.3 Sebelum Commit
```powershell
npm run lint
npx tsc --noEmit
npm run build
```
Ketiganya harus lulus. Jangan commit kode yang gagal build.

**Hook pre-commit otomatis.** `lint` dan `typecheck` sudah dipasang sebagai hook git di `.githooks/pre-commit`, jadi commit ditolak bila keduanya gagal. Tidak memakai husky, hanya `core.hooksPath`, supaya tidak menambah dependency.

Setelah clone baru, aktifkan sekali:

```powershell
git config core.hooksPath .githooks
```

`npm run build` sengaja **tidak** dijalankan di hook: `next build` butuh PostgreSQL hidup dan puluhan detik, terlalu berat untuk setiap commit. Jalankan manual sebelum push.

Melewati hook (hanya bila benar-benar perlu, mis. commit dokumentasi saat DB mati):

```powershell
git commit --no-verify
```

### 9.4 Remote & Kunci SSH

Remote `origin`: `git@github.com:ilhamanas/rinjanmedia.git`

Autentikasi memakai kunci khusus repo ini, diatur **lokal** (bukan global) supaya tidak mengganggu repo lain di mesin yang sama:

```powershell
git config core.sshCommand 'ssh -i C:/ssh-keys/rinjanmedia -o IdentitiesOnly=yes'
```

Kunci privat **wajib** berizin ketat di Windows. Bila `ssh` menolak dengan `Bad permissions`, perbaiki dengan:

```powershell
icacls "C:\ssh-keys\rinjanmedia" /inheritance:r /grant:r "$env:USERDOMAIN\$env:USERNAME:F"
```

Tanpa langkah itu, `BUILTIN\Users` dan `Authenticated Users` masih bisa membaca kunci privat.

Kunci **jangan** disimpan di dalam folder repo. `.gitignore` sudah memblokir `rinjanmedia`, `*.pem`, `*.key`, `id_ed25519`, tetapi mencegah lebih baik daripada mengandalkan ignore.

> **`npm`, bukan `pnpm`.** `pnpm` gagal di mesin ini (install script diblokir, `corepack enable` EPERM). Semua contoh `pnpm` di dokumen ini harus dijalankan sebagai `npm`.

---

## 10. Definition of Done (per task)

Sebuah task dianggap selesai bila:

- [ ] Fungsional sesuai `doc/PRD.md`
- [ ] `npm run lint` bersih
- [ ] `npx tsc --noEmit` bersih
- [ ] `npm run build` sukses
- [ ] Responsif diuji di 360px, 768px, 1280px, 1920px
- [ ] Navigasi keyboard berfungsi pada komponen baru
- [ ] Kontras warna lulus (cek dengan `antislop-human`)
- [ ] Tidak ada error/warning di console browser
- [ ] Konten berasal dari CMS (bukan hardcode)
- [ ] **`PROGRESS.md` diperbarui**
- [ ] Dokumentasi baru/berubah ditulis di `doc/` dan terdaftar di `doc/README.md`

---

## 11. Larangan Keras

1. ❌ Menambah page builder (Elementor-like) atau library drag-drop layout
2. ❌ Menggunakan `dangerouslySetInnerHTML` tanpa sanitasi
3. ❌ Hardcode teks konten di komponen
4. ❌ Commit `.env`, dump DB, atau data sensitif
5. ❌ Mengubah file di `src/app/(payload)/` secara manual
6. ❌ Menambah dependency berat (>50KB gzip) tanpa diskusi
7. ❌ Memakai `!important` di CSS
8. ❌ Menonaktifkan TypeScript strict atau ESLint rule tanpa alasan tertulis
9. ❌ Mengedit isi `requirement/` (hanya baca)
10. ❌ Menghapus atau menimpa migrasi database yang sudah dijalankan
11. ❌ Membuat file dokumentasi `.md` di root selain `AGENTS.md`, `PROGRESS.md`, `README.md`
12. ❌ Melewati skill yang relevan (§3) tanpa alasan tertulis
13. ❌ Mulai bekerja tanpa membaca `PROGRESS.md` dan `doc/`

---

## 12. Perintah Penting

```powershell
# development
npm run dev              # jalankan Next.js + Payload (port 3000)
npm run build            # build produksi
npm run start            # jalankan hasil build

# kualitas kode
npm run lint             # ESLint
npx tsc --noEmit         # typecheck

# database lokal (PostgreSQL portable, port 5433)
Start-Process -FilePath ".dev\pg\pgsql\bin\postgres.exe" `
  -ArgumentList '-D','.dev\pg\data','-p','5433' -WindowStyle Hidden
node scripts/seed.mjs    # seed konten awal (idempoten)

# CLI Payload TIDAK BISA DIPAKAI di mesin ini (lihat doc/adr-002)
# - generate:importmap -> lewat rute sementara di Next.js
# - generate:types     -> tipe ditulis manual di src/lib/payload.ts
# - migrate            -> dev: push otomatis; produksi: belum disiapkan

# docker (produksi)
docker compose up -d --build
docker compose logs -f app
docker compose exec db pg_dump -U rinjan rinjanmedia > backup.sql

# skills
npx skills list          # skill terpasang
npx skills find "<query>" # cari skill
```

---

## 13. Alur Kerja Agent AI

Saat mengerjakan task:

1. **Baca `PROGRESS.md`** — tahu posisi terkini, jangan ulangi pekerjaan yang sudah selesai.
2. **Baca `doc/`** — minimal `doc/PRD.md` dan bagian relevan `doc/DOCUMENTATION.md`.
3. **Panggil skill yang relevan** (§3) dan umumkan pemakaiannya.
4. **Cek `requirement/`** untuk referensi visual/konten yang relevan.
5. **Kerjakan satu task utuh**, jangan setengah lalu pindah.
6. **Update `PROGRESS.md`** setelah selesai (status, tanggal, catatan).
7. **Jika ada keputusan arsitektur baru**, tulis ADR di `doc/adr-*.md` dan daftarkan di `doc/DOCUMENTATION.md` §11.
8. **Jika blocker**, tulis di `PROGRESS.md` bagian "Blocker" — jangan diam-diam berhenti.

### Format update PROGRESS.md
```markdown
| Fase | Task | Status | Tanggal | Catatan |
|---|---|---|---|---|
| 1 | Setup Next.js + Tailwind | ✅ Done | 13 Nov 2026 | Next 15.1, Tailwind v4 |
```

---

## 14. Kontak & Eskalasi

- Pertanyaan produk/prioritas → pemilik produk (Rinjan Media)
- Pertanyaan teknis/arsitektur → developer utama
- Isu keamanan → jangan buat issue publik, laporkan langsung

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
