# requirement/ — Bahan Referensi

Folder ini berisi bahan referensi dari situs lama `rinjanmedia.com`. **Bukan untuk dimigrasi otomatis** — hanya dipakai sebagai acuan visual dan sumber copy.

> ⚠️ Folder ini **read-only** untuk agent. Jangan mengedit atau menghapus isinya.

---

## Struktur

```
requirement/
├─ screenshots/
│  ├─ desktop/          # screenshot full-page desktop (1440px+)
│  └─ mobile/           # screenshot full-page mobile (390px)
├─ content/
│  ├─ inventaris.md     # daftar halaman + ringkasan isi
│  └─ copy-reference.md # teks yang masih relevan untuk dipakai ulang
├─ blog/                # 4 artikel blog lama (markdown)
└─ assets/              # logo, favicon, foto brand
```

---

## Checklist Pengisian

### screenshots/
- [ ] `desktop/home.png`
- [ ] `desktop/tentang.png`
- [ ] `desktop/layanan-website.png`
- [ ] `desktop/layanan-desain.png`
- [ ] `desktop/layanan-wifi.png`
- [ ] `desktop/layanan-it-support.png`
- [ ] `desktop/kontak.png`
- [ ] `desktop/blog.png`
- [ ] `desktop/blog-detail.png`
- [ ] versi `mobile/` untuk semua halaman di atas

### content/inventaris.md
- [ ] Nama 4 layanan + deskripsi singkat
- [ ] Daftar halaman dan tujuan masing-masing
- [ ] Struktur menu (header & footer)
- [ ] Data kontak: WhatsApp, email, alamat, jam operasional
- [ ] Akun sosial media aktif

### content/copy-reference.md
- [ ] Headline & subheadline yang masih relevan
- [ ] Paragraf "Tentang Rinjan"
- [ ] Deskripsi tiap layanan
- [ ] CTA yang dipakai
- [ ] Testimoni (bila ada)

### blog/
- [ ] `22-platform-media-sosial.md`
- [ ] `peluang-bisnis-online.md`
- [ ] `edukasi-kdrt.md`
- [ ] `sosialisasi-pencegahan-kekerasan.md`

### assets/
- [ ] `logo.svg` atau `logo.png` (transparan)
- [ ] `favicon.ico`
- [ ] Foto utama / hero (bila ada)
- [ ] Foto tim / kantor (bila ada)

---

## Cara Mengambil Screenshot

**Chrome DevTools:**
1. Buka halaman → `F12`
2. `Ctrl+Shift+P` → ketik "Capture full size screenshot"
3. Untuk mobile: aktifkan Device Toolbar (`Ctrl+Shift+M`), pilih iPhone 14 Pro, ulangi

**Ekstensi alternatif:** GoFullPage, Fireshot

---

## Catatan Analytics

Nilai berikut dipertahankan di situs baru:

| Item | Nilai |
|---|---|
| Google Tag Manager | `GT-P36LTCV` |
| GA4 | via Site Kit by Google |

---

## Catatan Git

Folder ini **dilacak di git** karena menjadi sumber acuan konten. Jika screenshot berukuran besar (>5MB total) membuat repo berat, pertimbangkan:

- Kompres screenshot (PNG → WebP/JPEG kualitas 80)
- Atau tambahkan `requirement/screenshots/` ke `.gitignore` dan simpan di storage terpisah

File `.gitkeep` disediakan agar folder kosong tetap ter-track.
