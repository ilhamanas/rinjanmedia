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

Panel admin memakai 3 peran inti + 1 aksen, sesuai batas R-29. Peran ini mengikuti pembagian di template referensi: warna brand untuk identitas, tombol aksi monokrom.

| Peran | Warna | Dipakai untuk | Alasan |
|---|---|---|---|
| Identitas + interaktif | biru `#3171B3` | cincin fokus, indikator nav aktif, selection, status sukses, link | Biru adalah warna terbanyak di CSS situs lama (16 kemunculan), jadi panel terasa milik Rinjan, bukan panel Payload generik |
| Aksi utama | monokrom `#171717` (terang) / `#FAFAFA` (gelap) | Publish, Simpan, Create New | Referensi memakai `--primary` monokrom untuk tombol dan menyimpan warna brand untuk identitas. Kontras teks 17.18:1 |
| Netral | ramp `base-*` + tiga permukaan | panel kerja, kartu, chip | Panel admin adalah alat kerja; netral menjaga konten tetap jadi fokus |
| Error / warning | merah & amber bawaan Payload | validasi, gagal simpan | **Sengaja tidak disentuh.** Merah berarti error; menggantinya dengan warna brand akan menghapus maknanya |

Oranye brand `#D93A00` **tidak dipakai di panel admin**. Oranye tetap warna aksi situs publik; di panel, peran itu diambil tombol monokrom seperti referensi.

### Kenapa tombol utama monokrom, bukan oranye

Versi sebelumnya memakai oranye `#D93A00` untuk semua aksi utama. Itu menyimpang dari referensi, yang tombolnya monokrom (hampir putih di tema gelap, hampir hitam di tema terang) dan hanya memakai warna brand untuk identitas dan elemen interaktif. Setelah panel disamakan dengan referensi, tombol ikut monokrom.

Kontras tidak berkurang: teks `#171717` di atas `#FAFAFA` = **17.18:1**, jauh di atas AA.

### Kenapa cincin fokus biru, bukan monokrom

Cincin fokus monokrom akan menyatu dengan tombol monokrom. Biru memberi kontras 5.07:1 di atas putih dan 6.02:1 di kanvas gelap, jadi fokus selalu terlihat di atas tombol aksi mana pun.

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
| Mark sidebar | `public/icon-rinjan.png` | 26×25 di dalam chip putih 36px |

Mark sidebar memakai latar chip **putih solid**, bukan putih transparan seperti versi awal. Logo berwarna di atas gradien biru dengan alas transparan terbaca kotor dan tenggelam; alas putih membuat bentuk logo utuh. Ukuran gambar 26×25 supaya mengisi chip 36px tanpa menyentuh sudut.

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
| Shell | `margin: 24px 16px`, `border-radius: 24px`, `height: 95vh`, `min-height: 0` | Referensi membungkus seluruh app dalam satu kartu mengambang |
| Sidebar | Gradien `#006dbc` ke `#0060a5`, radius **hanya kiri**, lebar `208px` | Mengikuti `rounded-l-3xl` dan `w-52` referensi |
| Area kerja | `--rinjan-panel` (`#262626` gelap / `#f1f2f4` terang) | Referensi memakai latar muted yang berbeda dari kartu |
| Topbar | `64px`, `85%` + blur, garis bawah | Lengket seperti referensi |
| Item nav | padding `12px`, radius 12px, gap 12px, ikon 20px | Referensi `px-3 py-3 gap-3` + ikon `size-5` |
| Item nav **aktif** | **Latar putih penuh**, teks biru `#006dbc` (5.37:1) | Referensi menandai aktif dengan latar putih, bukan garis |
| Label grup | 11px, uppercase, tracking `0.06em` | Membedakan tingkat hierarki |
| Kartu | radius 16px, `--rinjan-card`, garis `elevation-150` | Referensi memakai `ring-1` + `shadow-sm` |
| Tombol | radius 8px, tinggi 36px, teks 14px/500 | Referensi `h-9 rounded-md text-sm` |

### Deviasi dari referensi: arah gradien

Referensi memakai `linear-gradient(to bottom, brand, brand-2)` dengan `brand-2` = brand dicampur **putih 15%**. Itu menaikkan luminansi sampai teks putih gagal:

| Campuran putih | Hasil | Putih di atasnya |
|---|---|---|
| 10% | `#1a7cc3` | 4.45:1 gagal |
| 15% (asli referensi) | `#2683c6` | 4.08:1 gagal |
| 20% | `#338ac9` | 3.74:1 gagal |

Karena itu arah gradien dibalik ke **lebih gelap**: `#006dbc` (5.37:1) ke `#0060a5` (6.53:1). Secara visual tetap gradien biru, tetapi kontrasnya menguat ke bawah, bukan melemah.

### Jebakan padding yang sempat membuat item aktif rusak

Latar putih item aktif sempat hanya setinggi teks (25px, bukan 40px). Penyebabnya aturan Payload:

```css
.nav__link:has(.nav__link-indicator) { padding-left: 0 }
```

Aturan itu lebih kuat daripada `.nav a.nav__link`, sehingga padding kiri jadi 0. Perbaikannya: selector override harus memakai bentuk `:has()` yang sama. Diverifikasi lewat `CSS.getMatchedStylesForNode`, bukan tebak-tebakan.

### Tombol buka/tutup bawaan Payload

`.nav-toggler` dan `.hamburger` bukan bagian dari sidebar kita, tetapi ikut memengaruhi tampilan:

| Keadaan | Perlakuan |
|---|---|
| Sidebar penuh/rail | `.nav-toggler--is-open { display: none }` supaya tidak ada dua tombol |
| Sidebar tertutup (layar <1440px) | chip muncul sebagai hamburger; batasnya memakai token kontrol 3.85:1 (terang) / 4.52:1 (gelap) |

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

## 11. Ringkasan Statistik Dashboard

Dashboard diawali kartu ringkasan dari komponen server `AdminStats` (`beforeDashboard`).

| Kartu | Sumber | Filter |
|---|---|---|
| Layanan terbit | koleksi `services` | `status = published` |
| Lead baru | koleksi `leads` | `status = baru` |
| Redirect aktif | koleksi `redirects` | `enabled = true` |
| Media | koleksi `media` | semua |

Angka diambil lewat Local API (`payload.count`), bukan dikarang, dan bukan fetch dari browser. Komponennya Server Component sehingga tidak menambah bundle client.

Setiap kartu menaut ke koleksinya, jadi angka bisa langsung ditindaklanjuti. `safeCount` mengembalikan 0 bila satu hitungan gagal, supaya dashboard tidak ikut rusak hanya karena satu query error.

Verifikasi (`.verify/admin-stats-test.mjs`) membandingkan angka kartu dengan `/api/<koleksi>`: 4 layanan, 11 redirect, 0 media, dan semuanya cocok.

### Catatan regenerasi import map

Menambah `beforeDashboard` mengubah import map: 26 menjadi **27 entri**. Prosedurnya sesuai ADR-002 (rute sementara, panggil, hapus). Tanpa regenerasi, dashboard tampil kosong dengan error `PayloadComponent not found in importMap`.

---

## 12. Navigasi Kustom (`admin.components.Nav`)

Sidebar diganti komponen sendiri (`src/components/admin/BrandNav.tsx` + `NavShellClient.tsx`) supaya bisa memuat ikon per koleksi dan kotak identitas. Ini satu-satunya bagian panel yang **bukan** CSS-only.

### Yang dipakai ulang, bukan ditulis ulang

Perilaku keyboard tidak ditulis dari nol. Semuanya memakai kode Payload:

| Kebutuhan | Sumber |
|---|---|
| `navOpen` / `setNavOpen` | `useNav()` dari NavProvider yang dipasang `Root` |
| `inert` saat nav tertutup | `<aside inert={!navOpen}>` meniru `NavWrapper` |
| `tabIndex -1` saat tertutup | sama seperti `DefaultNavClient` |
| Navigasi client-side | `<Link>` dari `@payloadcms/ui` |
| Pengelompokan menu + label | `groupNavItems` dari `@payloadcms/ui/shared` |
| Slot `beforeNav` dkk | `RenderServerComponent` |
| Tombol logout | `Logout` dari `@payloadcms/ui` |

### Risiko yang diuji, bukan diasumsikan

| Risiko | Uji | Hasil |
|---|---|---|
| Deteksi item aktif dobel | 9 rute, hitung `.rinjan-nav__link--active` | tepat 1 per halaman, 0 di dashboard |
| Tab masuk menu tersembunyi | 20 langkah Tab di viewport 900px | **0/20** masuk; `.focus()` paksa juga ditolak |
| Dua tombol tutup terlihat | hitung kontrol yang `checkVisibility()` | 1 di setiap keadaan |
| Rail tidak menggeser konten | ukur lebar nav + posisi area kerja | 208 -> 80px, area kerja ikut bergeser |
| Ikon rail tidak di tengah | ukur pusat ikon vs pusat sidebar | 56px = 56px (sebelumnya 38px, selisih 18px) |
| Rail hilang setelah muat ulang | klik, reload, ukur lebar | tetap 80px (localStorage) |
| Sidebar tertutup tanpa jalan kembali | klik mouse sungguhan di chip hamburger | terbuka kembali |

### Satu kontrol buka/tutup

Payload sudah merender tombol buka/tutup sendiri: chip kecil di pojok kiri atas template, di luar `<aside>`. Komponen kita punya tombol di kotak identitas. Dua-duanya sempat tampil bersamaan.

Aturannya sekarang:

| Keadaan | Yang terlihat |
|---|---|
| Layar >= 1440px | tombol kita mengecilkan sidebar jadi rail 80px (tidak menutupnya); chip Payload `display: none` |
| Layar < 1440px, sidebar terbuka | tombol kita menutup sidebar; chip Payload `display: none` |
| Layar < 1440px, sidebar tertutup | chip Payload menjadi ikon hamburger, satu-satunya jalan membuka |

Chip disembunyikan lewat kelas yang sudah disediakan Payload sendiri:

```css
.nav-toggler--is-open { display: none; }
```

Nama kelas itu berarti "nav sedang terbuka", jadi chip otomatis muncul lagi begitu sidebar ditutup. Karena chip ikut terklik, sidebar tidak bisa terkunci dalam keadaan tertutup.

Batas chip juga dinaikkan ke token kontrol (`#808285` = 3.85:1) karena garis bawaan `elevation-150` hanya 1.36:1 di tema terang.

**Cara menguji hal ini penting.** `element.click()` di DevTools melewati hit-testing, jadi tombol yang tertutup elemen lain tetap "bisa diklik". Uji memakai `Input.dispatchMouseEvent` pada koordinat tombol, dan menghitung visibilitas dengan `checkVisibility({ checkOpacity: true })` supaya tombol di dalam sidebar ber-`opacity: 0` tidak dihitung terlihat.

Aturan aktif **wajib** meniru Payload apa adanya:

```ts
pathname.startsWith(href) && ['/', undefined].includes(pathname[href.length])
```

Kalau hanya memakai `startsWith`, beberapa item aktif sekaligus (mis. `/admin/collections/services` vs `/admin/collections/services-x`) dan semuanya akan mendapat pil putih.

### Catatan implementasi

- `req` tidak dideklarasikan pada tipe `ServerProps`, padahal ada saat runtime. Dibaca lewat `BrandNavProps = ServerProps & { req?: Partial<PayloadRequest> }`.
- `admin.routes` berisi rute relatif (account, login, dst). Rute admin ada di `payload.config.routes.admin`.
- `visibleEntities` bisa `undefined`; dipakai fallback ke seluruh koleksi.
- Import map bertambah menjadi **28 entri** setelah `Nav` kustom. Wajib regenerasi setiap kali komponen ini berubah.

### Deviasi dari referensi

Referensi menaruh ikon di dalam kotak berwarna dan memakai daftar menu statis (Home, Messages, Statistics). Sidebar kita mengikuti struktur koleksi Payload, jadi ikon dipetakan per slug koleksi, dan grup menu tetap dinamis dari konfigurasi.

---

## 13. Penyelarasan dengan Template Referensi

Folder referensi ada di `referensi-desain-admin/smart-home-v1` (tidak ikut di-commit). Angka diambil dari `app/globals.css` dan komponennya, lalu diterjemahkan ke token Payload.

### Tiga permukaan, bukan satu

Referensi memakai tiga tingkat permukaan. Payload secara bawaan memakai satu warna untuk panel dan kartu, sehingga semuanya melebur.

| Peran | Tema terang | Tema gelap | Token |
|---|---|---|---|
| Panel kerja | `#f1f2f4` | `#262626` | `--rinjan-panel` |
| Kartu | `#ffffff` | `#161616` | `--rinjan-card` |
| Chip di dalam kartu | `#e7e9ea` | `#2e2e2e` | `--rinjan-chip` |

Perhatikan urutannya dibalik di tema gelap: panel **lebih terang** dari kartu. Itu yang membuat kartu terbaca sebagai objek, dan itu juga yang dipakai referensi.

### Shell

| Properti | Nilai | Catatan |
|---|---|---|
| Tinggi | `95vh` | referensi `h-[95vh]` |
| `min-height` | `0` | Payload memasang `min-height: 100vh`; tanpa ini shell melewati bawah jendela dan radius bawahnya terpotong |
| Jarak dari jendela | `24px 16px` | referensi `sm:py-6 sm:px-4` |
| Radius + garis | `24px` + `inset 0 0 0 1px` | `rounded-3xl ring-1 ring-border` |
| Topbar | `64px`, sticky, `85%` + blur | referensi `h-16 bg-background/80 backdrop-blur` |
| Gutter | `32px` | `--gutter-h`, sebelumnya 60px |

### Sidebar: rail, bukan hilang

Referensi mengecilkan sidebar ke `w-20` (80px) dan menyembunyikan label, bukan menutupnya. Payload bawaan menutup seluruh sidebar.

| Keadaan | Lebar | Isi |
|---|---|---|
| Penuh | `208px` (`w-52`) | mark, nama, tombol ciutkan, ikon + label |
| Rail | `80px` | mark, tombol lebarkan, ikon saja |

Empat jebakan yang harus ditangani bersamaan:

1. **Kolom grid.** `.template-default` memakai `display: grid` dengan `grid-template-columns: var(--nav-width) 1fr`. Menyusutkan `.nav` saja menyisakan pita kosong 128px. Variabelnya ikut diturunkan: `.template-default:has(.rinjan-nav--collapsed) { --nav-width: 80px }`.
2. **Tinggi nav.** Payload memasang `height: 100vh` pada `.nav`, lebih tinggi dari shell `95vh`. Diganti `height: 100%`.
3. **Padding scroll.** `.nav__scroll` membawa `padding: 40px 20px`; 40px itu memakan lebar sidebar sehingga nama brand terpotong. Padding dipindah ke tiap bagian.
4. **Lebar isi.** `.nav__wrap` memakai `align-items: flex-start`, jadi tiap grup dan daftar menyusut selebar isinya. Di rail akibatnya semua ikon menempel ke kiri: terukur pusat ikon 38px sementara pusat sidebar 56px, selisih 18px. Ikon baru benar-benar di tengah setelah `.nav__wrap` di-`stretch` dan grup diberi `width: 100%`. Efek sampingnya di sidebar penuh juga benar: pil item aktif kini selebar sidebar, bukan selebar teks.

Rail disimpan di `localStorage` (`rinjan-nav-collapsed`), sama seperti referensi menyimpan `sidebar-open`.

### Halaman daftar

| Elemen | Sebelum | Sesudah |
|---|---|---|
| Wadah | tanpa kartu, langsung di panel | kartu `#161616`, radius 16, garis, margin 24 |
| Judul | 32px / 500 | 24px / 600 |
| Create New | pil abu 24px / radius 12 | tombol aksi 36px / radius 8 |
| Pencarian | input tanpa batas, ikon di luarnya | pil 40px, ikon di dalam, lebar maks 420 |
| Header tabel | 13px normal | 11px / 600 / kapital, `#9e9fa0` |
| Baris | belang `elevation-50` | garis pemisah; belang dihapus (di tema terang terlihat sebagai garis-garis) |

Ikon pencarian Payload adalah kolom grid **di luar** input, jadi ikon tampak melayang di kiri pil. Ikon dikeluarkan dari alur (`position: absolute`) dan ditempelkan di dalam pil.

### Kontras pasangan baru

| Pasangan | Rasio |
|---|---|
| Header tabel `#9e9fa0` di kartu `#161616` | 6.83:1 |
| Teks `#ffffff` di panel `#262626` | 15.13:1 |
| Tombol aksi `#171717` di `#fafafa` | 17.18:1 |
| Teks hero `#e8f4fd` di `#006dbc` | 4.80:1 |
| Placeholder `#9e9fa0` di `#0a0a0a` | 7.47:1 |

### Deviasi yang disengaja

| Referensi | Kita | Alasan |
|---|---|---|
| Pencarian di topbar | pencarian per koleksi di halaman daftar | pencarian global butuh endpoint lintas koleksi; belum dibuat |
| Sidebar tanpa label grup | label grup `KONTEN`/`PENJUALAN`/`PENGATURAN` | struktur menu mengikuti koleksi Payload, label membantu orientasi |
| Kartu berisi data contoh (kamar, suhu, perangkat) | hanya data nyata dari database | konten karangan dilarang |

---

## 14. Batasan yang Diketahui
| Batasan | Sebab | Dampak |
|---|---|---|
| `--theme-success-500` tidak bisa dipakai untuk teks di mode gelap | Tidak ada di tabel flip Payload | Harus memakai `--theme-success-600` |
| Override border kontrol memakai daftar selector eksplisit | Payload tidak punya variabel border khusus kontrol | Kontrol baru dari plugin pihak ketiga tidak otomatis ikut tertata |
| Payload menutup nav pada viewport ≤1440px | `$breakpoint-l-width: 1440px` bawaan Payload | Di 1440px nav tampak tertutup; itu perilaku Payload, bukan bug tema |
| Field tampak abu-abu sebelum hidrasi | Payload menonaktifkan field sampai izin selesai dimuat | Bukan bug; screenshot harus menunggu `!input.disabled && !input.readOnly` |
| Indikator nav aktif hanya muncul di halaman koleksi | Dashboard tidak punya link aktif | Uji indikator harus di `/admin/collections/*`, bukan `/admin` |
| Pilihan tema ada di `/admin/account`, bukan tombol header | Desain bawaan Payload | Untuk menguji toggle, buka halaman akun |
| Sidebar memakai ikon dari peta slug, bukan menu statis | Struktur menu mengikuti koleksi Payload | Menambah koleksi baru berarti menambah ikon di `NavShellClient` || Belum ada kotak pencarian di topbar | Butuh endpoint pencarian lintas koleksi | Fitur baru, di luar lingkup restyle |
| Folder `referensi-desain-admin/` dikecualikan dari lint, typecheck, dan build | Kode referensi memakai dependency yang tidak terpasang dan gagal strict TS | Jangan dihapus dari `exclude` selama folder itu ada |
