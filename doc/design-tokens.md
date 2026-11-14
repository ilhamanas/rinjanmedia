# Design Tokens & Panduan Visual

**Tanggal:** 14 November 2026
**Status:** Final (Fase 1)
**Penulis:** Agent (sesi Fase 1)

Dokumen ini mencatat palet, tipografi, dan aturan visual yang dipakai di situs baru. Semua nilai berasal dari **logo asli dan CSS situs lama `rinjanmedia.com`** — tidak ada warna yang dikarang.

Sumber token: `src/app/globals.css` (blok `@theme`).

---

## 1. Palet Brand

| Token | Hex | Asal | Pemakaian |
|---|---|---|---|
| `brand-500` | `#3171B3` | Warna terbanyak di CSS Elementor situs lama (16 kemunculan) | Warna utama: hero, page hero, tombol primer |
| `brand-600` | `#27609B` | Turunan (hover/gelap) | Hover tombol primer, link |
| `brand-700` | `#1E4E7F` | Turunan | Background footer, teks harga |
| `brand-50` | `#EEF5FB` | Turunan (tint) | Background section bergantian, kartu aside |
| `accent-500` | `#EB4101` | Tombol "Minta Penawaran" di header situs lama | **Hanya untuk elemen non-teks** dan focus ring |
| `accent-600` | `#D93A00` | Turunan yang digelapkan | **Tombol solid dengan teks putih** |
| `accent-700` | `#B83000` | Turunan | Hover tombol accent, teks error |
| `sun-400` | `#FFC600` | CTA "Mulai Sekarang" di hero situs lama | Aksen kecil (bullet, penanda) |
| `ink-900` | `#101010` | CSS situs lama | Judul, teks utama |
| `ink-700` | `#303133` | CSS situs lama | Teks body |
| `ink-500` | `#4D4D4D` | CSS situs lama | Teks sekunder, deskripsi |
| `ink-300` | `#6B7176` | **Disesuaikan** (asli `#8A8F94`) | Placeholder, ikon non-esensial |

Warna pendukung dari logo (belum dipakai di UI, tersedia bila perlu): hijau `#50B552`, cyan `#5BCBF5`.

---

## 2. Aturan Kontras (WCAG AA)

Semua pasangan teks di bawah sudah diukur, bukan diperkirakan.

| Kombinasi | Rasio | Status |
|---|---|---|
| Putih di `brand-500` | 5.07:1 | ✅ AA |
| Putih di `accent-600` | 4.61:1 | ✅ AA |
| Putih di `accent-500` | 3.97:1 | ❌ **Dilarang untuk teks** |
| `brand-100` di `brand-700` (footer) | 6.79:1 | ✅ AA |
| `brand-200` di `brand-700` (copyright) | 5.29:1 | ✅ AA |
| `ink-500` di putih | 8.45:1 | ✅ AA |
| `ink-700` di putih | 13.02:1 | ✅ AA |
| `ink-300` di putih (placeholder) | 4.94:1 | ✅ AA |
| `brand-600` di putih (link) | 6.50:1 | ✅ AA |
| `brand-50` di `brand-500` (breadcrumb) | 4.61:1 | ✅ AA |

### Kenapa `accent-500` tidak boleh jadi tombol solid

Oranye asli `#EB4101` hanya mencapai **3.97:1** dengan teks putih — gagal AA untuk teks normal (butuh 4.5:1). Tombol solid memakai `#D93A00` yang mencapai 4.61:1 dan secara visual masih oranye brand.

`accent-500` tetap dipakai untuk focus ring dan bullet dekoratif, di mana rasio teks tidak berlaku.

---

## 3. Tipografi

| Item | Nilai |
|---|---|
| Font | **Poppins** (satu keluarga saja), via `next/font/google` |
| Bobot | 400, 500, 600, 700 |
| Variabel CSS | `--font-poppins` → `--font-sans` |
| Fallback | `ui-sans-serif, system-ui, sans-serif` |
| `display` | `swap` (teks langsung tampil, tidak memblokir render) |

Skala yang dipakai konsisten:

| Peran | Mobile | Desktop |
|---|---|---|
| H1 hero | `text-3xl` | `text-5xl` |
| H1 page hero | `text-2xl` | `text-4xl` |
| H2 section | `text-xl` | `text-3xl` |
| Body | `text-sm` | `text-base` |
| Teks kecil | `text-xs` | `text-xs` |

---

## 4. Bentuk & Spasial

| Item | Nilai |
|---|---|
| Radius kartu | `rounded-xl` (12px) |
| Radius tombol | `rounded-lg` (8px) |
| Lebar konten | `max-w-6xl` (1152px) |
| Padding horizontal | `px-4` mobile, `px-6` desktop |
| Jarak section | `py-12` mobile, `py-16` desktop |

---

## 5. State & Aksesibilitas

- **Focus ring:** `outline: 2px solid var(--color-accent-500); outline-offset: 2px` — selalu terlihat, tidak pernah `outline: none`.
- **Cursor:** `a[href]`, `button:not(:disabled)`, `summary`, `select`, `label[for]` memakai `cursor: pointer`; elemen disabled memakai `cursor: not-allowed`.
- **Reduced motion:** semua animasi/transisi dipangkas ke `0.01ms` bila `prefers-reduced-motion: reduce`.
- **Skip link:** elemen fokus pertama di setiap halaman adalah "Lewati ke konten utama".
- **Form:** setiap input punya `<label for>`, `aria-invalid` saat error, dan `aria-describedby` yang menunjuk pesan error atau hint.

---

## 6. Yang Sengaja Tidak Dibuat

| Item | Alasan |
|---|---|
| Testimoni & foto klien | Tidak ada aset asli; membuatnya berarti mengarang bukti sosial |
| Logo klien | Sama seperti di atas |
| Foto tim | Tidak ada foto yang disediakan |
| Ilustrasi dekoratif / blob gradien | Tidak ada di situs lama; menambah tanpa alasan |
| Ikon sosial sebagai teks "Fa/In/Wh" | Diganti ikon `lucide-react` yang sebenarnya |

---

## 7. Cara Mengubah Token

1. Sunting blok `@theme` di `src/app/globals.css`.
2. Jalankan `node -e` dengan fungsi rasio kontras (lihat §2) untuk memastikan pasangan teks baru masih ≥ 4.5:1.
3. Perbarui tabel §2 dokumen ini.
4. Jalankan `npm run build` untuk memastikan tidak ada kelas Tailwind yang hilang.

Tailwind v4 membaca token langsung dari `@theme`, jadi tidak perlu `tailwind.config.ts`.
