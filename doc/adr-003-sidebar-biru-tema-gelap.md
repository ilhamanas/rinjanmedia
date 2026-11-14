# ADR-003: Sidebar Biru dan Tema Gelap Default di Panel Admin

**Tanggal:** 14 November 2026
**Status:** Final
**Penulis:** Agent (sesi Fase 3 lanjutan)

---

## Konteks

Pemilik produk meminta tampilan panel `/admin` didekatkan dengan referensi dashboard modern: sidebar biru solid, shell gelap, kartu besar dengan radius lega.

Referensi yang diberikan adalah dashboard produk smart home. Referensi seperti itu memuat konten yang tidak dimiliki proyek ini: nama pengguna, suhu ruangan, perangkat (Rooms, Kitchen, Bathroom), serta tombol Signin/Signup dan Download.

Dua batasan mengikat keputusan ini:

1. **Konten tidak boleh dikarang** (R-17, R-18, R-38, C-5). Angka dan teks yang tampil harus berasal dari database.
2. **Aksesibilitas tidak boleh turun.** Sebelum perubahan ini, panel punya 44 pasangan kontras terukur dengan 0 kegagalan, dan 12/12 langkah Tab menampilkan indikator fokus.

## Keputusan

Mengambil **bahasa visual** referensi, bukan isinya.

### Yang diadopsi

- Sidebar biru brand solid `#275686` dengan teks putih
- Tema gelap sebagai default
- Grid kartu dashboard 3 kolom dengan radius 12px
- Radius tombol 10px

### Yang ditolak

| Elemen referensi | Alasan ditolak |
|---|---|
| Nama pengguna, suhu, nama ruangan | Bukan data proyek ini |
| Tombol Signin / Signup / Download | Tidak ada alurnya; R-26 melarang kontrol tanpa perilaku |
| Kotak pencarian | Fitur baru, bukan styling. Ditunda ke pekerjaan terpisah |
| Pemilih 5 warna tema | Fitur baru. Panel memakai satu palet brand |

### Kartu statistik

Kartu berisi angka (Layanan, Lead, Redirect, Media) **tidak** dikerjakan pada langkah ini. Angka memerlukan query server, artinya komponen admin baru dan regenerasi import map manual (ADR-002). Pekerjaan itu dipisah ke langkah berikutnya agar bila ada regresi, penyebabnya mudah dilacak.

## Konsekuensi

**Positif**

- Panel terasa milik Rinjan, bukan panel Payload generik.
- Tidak ada konten karangan.
- Struktur nav tidak disentuh, sehingga urutan Tab dan focus trap tetap utuh.
- Tidak ada dependency baru.

**Negatif**

- Empat elemen sidebar (toggler, hamburger, logout, chevron) memakai warna teks global sehingga harus ditimpa satu per satu. Ini rapuh terhadap perubahan internal Payload dan perlu dicek ulang saat upgrade.
- Sidebar berwarna solid di kedua tema, jadi beberapa token tema tidak lagi relevan di area itu dan harus dikecualikan secara eksplisit.

## Alternatif yang ditolak

| Alternatif | Alasan |
|---|---|
| `admin.theme: 'dark'` di config | Menghilangkan pilihan tema sepenuhnya; melanggar R-21 |
| Mengganti `admin.components.Nav` | Perlu membangun ulang menu mobile, focus trap, dan `aria-expanded`. Risiko regresi tinggi untuk keuntungan visual kecil |
| Menyalin referensi apa adanya | Mengarang konten |

## Verifikasi

| Uji | Hasil |
|---|---|
| `admin-ramp.mjs` | 0 gagal, termasuk 5 pasangan baru untuk sidebar |
| `admin-restyle-test.mjs` | Semua lulus: sidebar biru, indikator putih, cincin fokus putih, toggle berfungsi, kartu 3 kolom |
| `admin-nav-focus-test.mjs` | 12/12 Tab punya `:focus-visible` dan indikator |
| `admin-field-test.mjs` | 24/24 lulus |
| `admin-brand-test.mjs` | Semua asersi lulus |
| `prod-smoke.mjs` | Semua lulus |

## Kapan ditinjau ulang

1. Bila Payload mengubah struktur kelas nav (cek `.nav-toggler`, `.hamburger`, `.nav__controls`).
2. Bila kartu statistik ditambahkan, dokumen ini perlu bagian baru.
3. Bila pemilik produk ingin pencarian atau pemilih warna, itu ADR terpisah.
