# ADR-002 — Workaround CLI Payload yang Rusak di Mesin Ini

**Tanggal:** 14 November 2026
**Status:** Final
**Penulis:** Tim Rinjan Media

---

## Konteks

CLI Payload (`npx payload generate:importmap`, `generate:types`, `migrate`) **gagal total** di mesin pengembangan ini. Dua kegagalan terpisah, keduanya di luar kendali kode proyek:

### Kegagalan 1 — `tsx` + `undici` v7 (Node 22 & 24)

```
TypeError: TypeError: Illegal constructor
    at new CacheStorage (node_modules/undici/lib/web/cache/cachestorage.js:17:14)
```

Penyebab: `payload` mendeklarasikan `undici@7.30.1` sebagai dependency. `undici` meng-import dirinya dua kali — sekali lewat jalur CJS, sekali lewat loader ESM milik `tsx`. Akibatnya simbol internal `kConstruct` menjadi dua objek berbeda, sehingga konstruktor `CacheStorage` menolak dijalankan.

Sudah dicoba: Node 24.22.1 (bawaan) dan Node 22.23.4 (LTS portable). **Keduanya gagal sama.**

### Kegagalan 2 — `--disable-transpile` (melewati tsx)

```
TypeError: Cannot destructure property 'loadEnvConfig' of 'import_env.default' as it is undefined.
    at loadedEnvFiles (node_modules/payload/dist/bin/loadEnv.js:3:9)
```

Saat `tsx` dilewati, Node memuat `payload.config.ts` sebagai ESM murni. File itu meng-import koleksi tanpa ekstensi (`./collections/Users`), yang tidak bisa di-resolve ESM Node.

Menambahkan `.js` pada import **memperbaiki CLI tapi merusak Next.js** — Turbopack tidak memetakan `./Users.js` ke `Users.ts`. Kedua tool punya aturan resolusi yang bertentangan, dan Next.js adalah yang harus menang.

## Keputusan

**Tidak memakai CLI Payload sama sekali.** Setiap kebutuhan CLI digantikan jalur lain yang setara:

| Kebutuhan CLI | Pengganti | Status |
|---|---|---|
| `generate:importmap` | Rute sementara di dalam Next.js yang memanggil `generateImportMap()` dari paket `payload` | ✅ Terbukti (26 komponen) |
| `generate:types` | Tipe ditulis manual di `src/lib/payload.ts` (`ServiceDoc`, `SettingsDoc`) | ✅ Berjalan |
| `payload migrate` | Payload `db-postgres` push otomatis saat dev | ✅ 47 tabel terbuat |
| `payload seed` | `scripts/seed.mjs` lewat REST API | ✅ Idempoten |

### Cara regenerate import map

Import map **hanya perlu dibuat ulang** bila menambah komponen admin kustom (`admin.components.*`) atau mengubah `lexicalEditor()` features. Saat ini ada 2 komponen admin kustom (`BrandLogo`, `BrandIcon`), dan rich text butuh 23 komponen bawaan.

Prosedur (pernah dipakai, terbukti berhasil):

1. Buat `src/app/(payload)/api/dev-generate-importmap/route.ts`:

```ts
import config from '@payload-config'
import { generateImportMap } from 'payload'

export const dynamic = 'force-dynamic'

export async function GET() {
  const sanitized = await config
  await generateImportMap(sanitized, { force: true, log: true })
  return Response.json({ ok: true })
}
```

2. Jalankan dev server, lalu `curl http://localhost:3000/api/dev-generate-importmap`
3. **Hapus rute itu** — jangan sampai ikut ke produksi.

Hasilnya `src/app/(payload)/admin/importMap.js` berisi 26 entri: 23 dari `@payloadcms/richtext-lexical`, 2 komponen brand (`BrandLogo`, `BrandIcon`), dan 1 `CollectionCards` dari `@payloadcms/next/rsc`.

## Kenapa import map wajib ada

Tanpa import map yang benar, admin **tampil tapi kosong**. Dashboard hanya menampilkan header, dan konsol mencatat:

```
getFromImportMap: PayloadComponent not found in importMap
```

Payload memakai import map untuk meresolusi komponen React lintas batas server/client. `importMap = {}` hanya cukup bila tidak ada satu pun field rich text dan tidak ada dashboard widget — kondisi yang tidak berlaku di proyek ini.

## Konsekuensi

**Positif**
- Proyek tetap bisa di-build dan dijalankan penuh tanpa CLI.
- Import map yang dihasilkan identik dengan keluaran CLI resmi (fungsi generatornya sama).

**Negatif**
- Regenerasi import map butuh langkah manual (tambah rute → panggil → hapus).
- Tidak ada `payload-types.ts` otomatis; tipe di `src/lib/payload.ts` harus diperbarui manual saat skema berubah.
- `npm run build` tidak akan mendeteksi import map yang basi. Bila menambah komponen admin, ingat regenerasi.

## Kapan keputusan ini ditinjau ulang

Bila salah satu terjadi, coba CLI lagi:

1. `undici` memperbaiki double-load `kConstruct`, atau `tsx` berhenti memuat `undici` dua kali.
2. Payload merilis CLI yang tidak bergantung pada `tsx`.
3. Proyek dipindah ke Node versi lain yang tidak terkena masalah ini.

Cara cepat menguji: `npx payload generate:importmap` — bila tidak lagi melempar `Illegal constructor`, workaround ini bisa dilepas.
