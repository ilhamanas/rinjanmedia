# Design System Panel Admin

**Tanggal:** 14 November 2026
**Status:** Final (Fase 3)
**Penulis:** Agent (sesi Fase 3)

Dokumen ini menjelaskan tema panel `/admin` Payload CMS: peran warna, nilai ramp, hasil ukur kontras di dua tema, dan alasan di balik setiap penyimpangan dari bawaan Payload.

Sumber tunggal: `src/app/(payload)/custom.css`.
Verifikator: `.verify/admin-ramp.mjs` (kontras), `.verify/admin-field-test.mjs` (kontrol form), `.verify/admin-nav-focus-test.mjs` (nav + fokus keyboard), `.verify/admin-brand-test.mjs` (token + logo + screenshot).

> Semua rasio di dokumen ini **diukur**, bukan diperkirakan. Angka yang tidak bisa diukur (mis. skor Lighthouse) tidak dicantumkan.

---

## 1. Peran Warna

Panel admin memakai 3 peran inti + 1 aksen, sesuai batas R-29.

| Peran | Warna | Dipakai untuk | Alasan |
|---|---|---|---|
| Identitas + interaktif | biru `#3171B3` | cincin fokus, indikator nav aktif, selection, status sukses, tombol sekunder | Biru adalah warna terbanyak di CSS situs lama (16 kemunculan), jadi panel terasa milik Rinjan, bukan panel Payload generik |
| Aksi utama | oranye `#D93A00` | **hanya** Publish, Simpan, Login | Satu warna aksi di seluruh panel; kalau oranye dipakai di banyak tempat, tidak ada lagi yang menonjol |
| Netral | ramp `base-*` | permukaan, border, teks | Panel admin adalah alat kerja; netral menjaga konten tetap jadi fokus |
| Error / warning | merah & amber bawaan Payload | validasi, gagal simpan | **Sengaja tidak disentuh.** Merah berarti error; menggantinya dengan warna brand akan menghapus maknanya |

### Kenapa oranye tombol bukan `#EB4101`

Oranye asli logo hanya mencapai **3.97:1** dengan teks putih (gagal AA 4.5:1). Tombol solid memakai `#D93A00` = **4.61:1**. Hover `#B83000` = **6.07:1**, active `#A02A00`.

### Kenapa cincin fokus biru, bukan oranye

Tombol utama panel ini oranye. Cincin fokus oranye di atas tombol oranye **tidak terlihat**. Biru memberi kontras 5.07:1 di atas putih dan 6.02:1 di kanvas gelap.

---

## 2. Struktur CSS: Cascade Layer

Payload mendeklarasikan `@layer payload-default, payload;`. Semua CSS bawaannya ada di `payload-default`.

`custom.css` menulis ke layer `payload`, dan **mendeklarasikan ulang urutan layer** di baris paling atas:

```css
@layer payload-default, payload;
```

Tanpa deklarasi ulang, urutan layer bergantung pada urutan bundling CSS Next.js. Bila `custom.css` termuat lebih dulu, `payload` menjadi layer pertama dan justru **kalah** dari `payload-default`.

**Konsekuensi penting:** urutan layer mengalahkan specificity. Aturan di layer `payload` selalu menang atas `payload-default` milik Payload, sebesar apa pun specificity lawannya. Jadi menurunkan specificity dengan `:where()` **tidak** membuat aturan Payload menang. Untuk membiarkan state tertentu tetap milik Payload, state itu harus **dikecualikan lewat selector**:

```css
.field-type:not(.error) :where(input, textarea) { border-color: var(--rinjan-control-border); }
```

Pendekatan `:where()` saja pernah dicoba dan gagal: border merah field invalid ikut tertimpa warna brand. Ini sudah diperbaiki dan dijaga oleh uji `.verify/admin-field-test.mjs`.

---

## 3. Ramp Netral

Stop 0-350 mempertahankan luminansi asli Payload, karena stop itulah yang menjadi permukaan kartu, panel, dan input. Stop 400-550 digelapkan.

Tint biru dijaga **2%**, bukan 5%: pada 5% kartu berubah menjadi abu-abu kusam `#e8ecef` dan panel kehilangan kesan bersih.

| Token | Nilai |
|---|---|
| `--color-base-0` | `#ffffff` |
| `--color-base-50` | `#f1f2f4` |
| `--color-base-100` | `#e7e9ea` |
| `--color-base-150` | `#dadbdc` |
| `--color-base-250` | `#c0c1c3` |
| `--color-base-400` | `#747576` |
| `--color-base-450` | `#6e6f70` |
| `--color-base-500` | `#69696a` |
| `--color-base-600` | `#535353` |
| `--color-base-700` | `#3a3a3a` |
| `--color-base-800` | `#272727` |
| `--color-base-900` | `#151515` |

### Sebelum vs sesudah (teks di atas putih)

| Pasangan | Bawaan Payload | Sesudah | Min |
|---|---|---|---|
| Deskripsi field / thead (`base-400`) | **2.81:1** | 4.62:1 | 4.5:1 |
| Label field (`base-450`) | **3.32:1** | 5.04:1 | 4.5:1 |
| Teks sekunder (`base-500`) | **3.95:1** | 5.48:1 | 4.5:1 |
| Teks body (`base-550`) | 4.81:1 | 6.29:1 | 4.5:1 |
| Teks utama (`base-800`) | 13.39:1 | 14.94:1 | 4.5:1 |

Tiga pasangan yang tadinya **gagal AA** sekarang lolos. Tidak ada satu pun pasangan yang memburuk (diverifikasi `.verify/admin-before-after.mjs`).

---

## 4. Ramp Aksen (Biru)

Ramp `success` diganti ramp biru brand yang berlabuh tepat di `#3171B3` pada stop 600. Payload memakai token `success` untuk aksen, status, dan fokus, sehingga satu ramp biru sudah menutup ketiganya.

| Token | Nilai |
|---|---|
| `--color-success-50` | `#f6f9fc` |
| `--color-success-100` | `#f0f5fa` |
| `--color-success-150` | `#e3ecf5` |
| `--color-success-250` | `#bcd2e9` |
| `--color-success-400` | `#6398cf` |
| `--color-success-500` | `#387cc2` |
| `--color-success-600` | `#3171b3` |
| `--color-success-700` | `#275686` |
| `--color-success-800` | `#1e3f62` |

---

## 5. Mode Gelap: Elevation Di-override Eksplisit

Payload membalik `--theme-elevation-*` untuk mode gelap lewat indeks. Pembalikan itu membuat stop teks informatif (400/450) hanya mencapai **3.7-4.2:1** di kanvas gelap.

Karena itu mode gelap **tidak** memakai pembalikan, tetapi pemetaan eksplisit:

```css
html[data-theme='dark'] {
  --theme-elevation-0: var(--color-base-900);   /* kanvas #151515 */
  --theme-elevation-50: var(--color-base-850);
  --theme-elevation-100: var(--color-base-800);
  /* ... 150 sampai 750, lihat custom.css ... */
}
```

### Hasil ukur mode gelap

| Pasangan | Rasio | Min |
|---|---|---|
| Teks utama `elev-1000` di `elev-0` | 18.26:1 | 4.5:1 |
| Deskripsi `elev-400` di `elev-0` | 6.89:1 | 4.5:1 |
| Label `elev-450` di `elev-0` | 8.79:1 | 4.5:1 |
| Label sekunder `elev-500` di `elev-0` | 10.14:1 | 4.5:1 |
| Teks di kartu (`elev-50`) | 16.67:1 | 4.5:1 |
| Pill Published `success-800` di `success-150` | 9.63:1 | 4.5:1 |
| Banner sukses `success-600` di `success-100` | 5.01:1 | 4.5:1 |
| Cincin fokus `success-600` di `elev-0` | 6.02:1 | 3:1 |
| Nav aktif `success-600` di `elev-0` | 6.02:1 | 4.5:1 |
| Tombol sekunder `success-600` di `elev-0` | 6.02:1 | 4.5:1 |
| Selection `elev-1000` di `success-250` | 9.28:1 | 4.5:1 |

### Jebakan: `--theme-success-500` tidak ada di tabel flip Payload

Payload memetakan token `success` gelap dengan tabel **sendiri**, bukan peta elevation:

```
50→950, 100→900, 150→850, 200→800, 250→750, 300→700, 350→650,
400→600, 450→550, 550→450, 600→400, 650→350, 700→300, 750→250,
800→200, 850→150, 900→100, 950→50
```

Perhatikan: **stop 500 tidak ada** di tabel itu (melompat 450 → 550). Akibatnya `--theme-success-500` tetap memakai nilai terang `#387CC2` dan hanya mencapai **4.20:1** di kanvas gelap.

Hal yang sama berlaku untuk `--theme-success-400`, yang di mode gelap memetakan ke `--color-success-600` yaitu biru brand `#3171B3` = **3.60:1**.

Keduanya **tidak boleh** dipakai untuk teks di mode gelap. Yang dipakai: `--theme-success-600` (→ `#6398CF`, 6.02:1).

Bukti regresi disimpan di `.verify/admin-ramp.mjs`, yang mencetak kedua token lama sebagai "GAGAL (sesuai dugaan)" supaya kesalahan ini tidak kembali tanpa ketahuan.

---

## 6. Kontrol Form

Dua cacat bawaan Payload diperbaiki. Keduanya adalah kegagalan WCAG, bukan selera.

### 6.1 Batas kontrol di bawah 3:1 (WCAG 1.4.11)

Border input/textarea/select bawaan memakai `elevation-150`:

| Tema | Bawaan | Sesudah | Min |
|---|---|---|---|
| Terang (di atas putih) | **1.36:1** | 3.85:1 | 3:1 |
| Gelap (di atas `#1e1e1e`) | **1.38:1** | 4.52:1 | 3:1 |

Nilai baru: `--rinjan-control-border` = `#808285` (terang) / `#858585` (gelap); hover `#69696a` / `#9e9fa0` (5.48:1 dan 6.29:1).

### 6.2 Fokus input hanya ditandai warna border

Payload menulis `input:focus { outline: 0 }` dan hanya mengubah warna border 1px. Karena border itu sendiri di bawah 3:1, indikator fokusnya **tidak memenuhi syarat** (WCAG 2.4.11).

Cincin fokus dikembalikan:

```css
.field-type :where(input, textarea):focus-visible {
  outline: var(--accessibility-outline);
  outline-offset: var(--accessibility-outline-offset);
}
```

Hasil: outline `2px solid #3171b3` (terang, 5.07:1) dan `2px solid #6398cf` (gelap, 5.50:1).

### 6.3 Yang tidak boleh ditimpa

State error dan disabled tetap milik Payload. Selector memakai `.field-type:not(.error)` dan `:not(:disabled)` agar border merah error tidak ikut berubah. Diverifikasi: border error tetap `#da4b48` (terang) dan `#b63636` (gelap).

---

## 7. Logo dan Ikon

| Slot | Berkas | Catatan |
|---|---|---|
| Logo login | `public/logo-rinjan.png` (terang), `public/logo-rinjan-dark.png` (gelap) | 297×61, alpha |
| Ikon breadcrumb | `public/icon-rinjan.png` | mark saja, 63×61 |

Wordmark di logo resmi berwarna **hitam pekat** dan tidak terbaca di permukaan gelap. `logo-rinjan-dark.png` adalah turunan yang sama persis: **hanya** piksel wordmark hitam yang dijadikan putih (3331 piksel), bagian mark berwarna tidak diubah.

Pemilihan logo diatur CSS, bukan JavaScript:

```css
html[data-theme='light'] .rinjan-logo--dark,
html[data-theme='dark'] .rinjan-logo--light { display: none; }
```

Aturan tema ditulis dengan **specificity setara**. Kalau hanya `.rinjan-logo--dark { display: none }`, aturan itu akan mengalahkan `html[data-theme='dark'] .rinjan-logo--light` dan logo terang tetap tersembunyi walau temanya terang. Bug ini pernah terjadi dan sudah diperbaiki.

Dimensi intrinsik (`width`/`height`) ditulis eksplisit supaya tidak ada layout shift (R-40).

---

## 8. Tipografi

Poppins dimuat lewat `next/font` di layout panel admin, lalu `--font-body` Payload diarahkan ke variabelnya:

```tsx
const poppins = Poppins({ subsets: ['latin'], weight: ['400','500','600','700'], display: 'swap', variable: '--font-poppins' })
<RootLayout htmlProps={{ className: poppins.variable }} ...>
```

Satu keluarga font, sama dengan situs publik. Tidak ada font kedua khusus admin.

---

## 9. Cara Mengubah Tema

1. Sunting `src/app/(payload)/custom.css`.
2. Jalankan `node .verify/admin-ramp.mjs` → harus **0 gagal**. Skrip ini mencetak ulang seluruh ramp dan menghitung kontras tiap pasangan di dua tema.
3. Jalankan `node .verify/admin-field-test.mjs` bila menyentuh kontrol form (border, hover, fokus, error).
4. Jalankan `node .verify/admin-nav-focus-test.mjs` bila menyentuh nav atau fokus.
5. Jalankan `npm run build` lalu `npm run start`, karena verifikasi browser menargetkan build produksi di port 3000.

### Kalau menambah komponen admin kustom

Import map **wajib** di-generate ulang, kalau tidak dashboard tampil kosong dengan error `PayloadComponent not found in importMap`. Prosedurnya ada di `doc/adr-002-workaround-cli-payload.md`.

Saat ini import map berisi **26 entri**: 23 dari `@payloadcms/richtext-lexical`, 1 `CollectionCards`, dan 2 komponen brand (`BrandLogo`, `BrandIcon`).

---

## 10. Sidebar Biru dan Tema Gelap Default

Panel memakai sidebar biru terang mengambang dan tema gelap pekat, mengikuti referensi dashboard modern.

### Palet yang diambil dari referensi

Nilai asli referensi diambil dari CSS demo (`--brand: oklch(65% .17 240)` untuk varian biru), lalu dikonversi dan diukur. Kanvas dan permukaan memakai nilai referensi `#0a0a0a` / `#161616`, bukan ramp netral.

| Token | Nilai | Peran |
|---|---|---|
| `--rinjan-nav-bg` | `#006dbc` | Latar sidebar |
| `--rinjan-nav-bg-hover` | `#005aa8` | Hover item nav |
| `--rinjan-nav-text` | `#ffffff` | Teks nav |
| `--rinjan-nav-text-muted` | `#e8f4fd` | Label grup |
| `--rinjan-canvas` | `#0a0a0a` | Kanvas gelap |
| `--rinjan-surface` | `#161616` | Permukaan kartu |
| `--rinjan-border` | `#292929` | Garis kartu |
| `--rinjan-accent` | `#0099eb` | Aksen teks di atas gelap |

### Kenapa dua biru, bukan satu

Warna biru asli referensi adalah `#0099eb`. Putih di atasnya hanya **3.11:1**, gagal AA. Tetapi `#0099eb` justru bagus sebagai **teks** di atas gelap (5.82:1 di kartu).

Tidak ada satu biru yang lolos di kedua peran:

| Kandidat | Putih di atasnya | Sebagai teks di kartu `#161616` |
|---|---|---|
| `#0099eb` (asli referensi) | **3.11 gagal** | 5.82 lolos |
| `#0079c9` | 4.59 lolos | **3.95 gagal** |
| `#006dbc` (dipakai) | **5.37 lolos** | 4.41 (tidak dipakai sebagai teks) |

Jadi permukaan memakai `#006dbc` dan aksen teks memakai `#0099eb`.

### Hasil ukur

| Pasangan | Rasio | Min |
|---|---|---|
| Teks nav putih di `#006dbc` | 5.37:1 | 4.5:1 |
| Label grup `#e8f4fd` di `#006dbc` | 4.80:1 | 4.5:1 |
| Hover nav di `#005aa8` | 6.94:1 | 4.5:1 |
| Indikator aktif putih (non-teks) | 5.37:1 | 3:1 |
| Cincin fokus putih (non-teks) | 5.37:1 | 3:1 |
| Aksen `#0099eb` di kartu `#161616` | 5.82:1 | 4.5:1 |
| Aksen `#0099eb` di kanvas `#0a0a0a` | 6.37:1 | 4.5:1 |

### Bentuk dan jarak

| Elemen | Nilai | Alasan |
|---|---|---|
| Sidebar | `margin: 12px`, `border-radius: 24px` | Mengambang seperti referensi |
| Item nav | padding `9px 12px`, radius 10px, font 15px | Bawaan Payload hanya `padding-block: 2.5px`, terasa sesak |
| Label grup | 12px, uppercase, tracking `0.04em` | Membedakan tingkat hierarki |
| Kartu | radius 16px, `#161616` | Mengikuti referensi |
| Tombol | radius 12px | Tetap di bawah 18px agar tidak jadi pil (R-11) |

### Elemen sidebar yang mudah terlewat

Empat elemen memakai warna teks global, bukan warna nav, sehingga tetap gelap di atas biru:

| Elemen | Gejala | Perbaikan |
|---|---|---|
| `.nav-toggler` (ciutkan nav) | Ikon `#272727` di tema terang | `stroke` dan `color` dipaksa putih |
| `.hamburger` | **Kotak putih solid** karena `background: var(--theme-bg)`, dan `:focus { outline: none }` | Latar transparan, garis putih 45%, cincin fokus dikembalikan |
| Ikon logout `.nav__controls` | Ikon `#272727` di tema terang | `stroke` putih |
| Chevron `.nav-group__indicator` | `#cdcecf` dan `#3a3a3a`, nyaris tak terlihat | `stroke` putih |

Semua ini lolos dari pemeriksaan otomatis pertama dan hanya ketahuan dari screenshot. Karena itu verifikasi visual tetap wajib, bukan cukup assertion.

### Tema gelap default tanpa mengunci toggle

`admin.theme: 'dark'` di `payload.config.ts` **menghilangkan** pilihan tema sepenuhnya (Payload membatasi panel ke satu tema). Yang dipakai adalah cookie `payload-theme` yang dibaca `ThemeProvider`:

```ts
if (pathname.startsWith('/admin') && !request.cookies.has('payload-theme')) {
  res.cookies.set('payload-theme', 'dark', { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
}
```

Cookie hanya ditulis bila belum ada, jadi pilihan pengguna tidak pernah ditimpa. Pilihan tema ada di `/admin/account` sebagai radio group Automatic / Light / Dark, dan ketiganya tetap berfungsi.

---

## 11. Batasan yang Diketahui
| Batasan | Sebab | Dampak |
|---|---|---|
| `--theme-success-500` tidak bisa dipakai untuk teks di mode gelap | Tidak ada di tabel flip Payload | Harus memakai `--theme-success-600` |
| Override border kontrol memakai daftar selector eksplisit | Payload tidak punya variabel border khusus kontrol | Kontrol baru dari plugin pihak ketiga tidak otomatis ikut tertata |
| Payload menutup nav pada viewport ≤1440px | `$breakpoint-l-width: 1440px` bawaan Payload | Di 1440px nav tampak tertutup; itu perilaku Payload, bukan bug tema |
| Field tampak abu-abu sebelum hidrasi | Payload menonaktifkan field sampai izin selesai dimuat | Bukan bug; screenshot harus menunggu `!input.disabled && !input.readOnly` |
| Indikator nav aktif hanya muncul di halaman koleksi | Dashboard tidak punya link aktif | Uji indikator harus di `/admin/collections/*`, bukan `/admin` |
| Pilihan tema ada di `/admin/account`, bukan tombol header | Desain bawaan Payload | Untuk menguji toggle, buka halaman akun |
