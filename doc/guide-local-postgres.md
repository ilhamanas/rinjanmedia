# Guide — Menjalankan PostgreSQL & CMS Secara Lokal

**Tanggal:** 14 November 2026
**Status:** Final
**Penulis:** Tim Rinjan Media

---

## Ringkas

Mesin dev ini tidak punya PostgreSQL dan tidak punya Docker. PostgreSQL 17.6 dipasang **portable** di dalam proyek (`.dev/pg/`), berjalan di **port 5433** supaya tidak bentrok dengan instalasi lain. Tidak ada yang ditambahkan ke sistem (tanpa service, tanpa admin rights).

`.dev/` sudah masuk `.gitignore` — tidak ikut ke repo.

## Prasyarat

| Hal | Nilai |
|---|---|
| Binary | `.dev/pg/pgsql/bin/` |
| Data cluster | `.dev/pg/data/` |
| Port | **5433** |
| Database | `rinjanmedia` |
| Role | `rinjan` |
| Password | `rinjan_dev_2026` |
| Superuser | `postgres` (password sama) |

Nilai yang sama ada di `.env` sebagai `DATABASE_URI`.

## 1. Menyalakan database

PostgreSQL harus jalan **sebelum** `npm run dev`, kalau tidak semua halaman yang membaca CMS akan 500.

```powershell
cd "D:\laragon\www\rinjanmedia-new"
Start-Process -FilePath ".dev\pg\pgsql\bin\postgres.exe" `
  -ArgumentList '-D','.dev\pg\data','-p','5433' `
  -WindowStyle Hidden
```

Cek siap:

```powershell
& ".dev\pg\pgsql\bin\pg_isready.exe" -p 5433 -h 127.0.0.1
# harapan: 127.0.0.1:5433 - accepting connections
```

> **Jangan pakai `pg_ctl start` dari shell yang punya timeout.** Saat shell induk dimatikan, proses anak ikut terbunuh dan PostgreSQL mati dengan error `0xC0000142`. Jalankan sebagai proses terpisah/latar permanen.

## 2. Menjalankan aplikasi

```powershell
npm run dev     # http://localhost:3000
```

## 3. Membuka psql

```powershell
$env:PGPASSWORD="rinjan_dev_2026"
& ".dev\pg\pgsql\bin\psql.exe" -h 127.0.0.1 -p 5433 -U rinjan -d rinjanmedia
```

Perintah yang sering dipakai:

```sql
\dt                          -- daftar tabel (harusnya 47)
\d services                  -- struktur tabel
SELECT slug, title, status FROM services ORDER BY "order";
SELECT id, name, status FROM leads ORDER BY id DESC LIMIT 5;
```

## 4. Seed konten awal

Setelah dev server jalan dan admin pertama sudah dibuat:

```powershell
node scripts/seed.mjs
```

Skrip ini **idempoten** — aman dijalankan berulang. Ia meng-upsert (bukan menduplikasi) berdasarkan slug:

- 4 layanan (`website`, `desain`, `wifi`, `it-support`) lengkap dengan paket & harga
- 11 redirect 301
- Global `settings` (kontak, sosmed, GTM)

Login default: `admin@rinjanmedia.com` / `RinjanAdmin2026!`
Bisa dioverride lewat env `SEED_EMAIL` dan `SEED_PASSWORD`.

## 5. Membuat admin pertama (sekali saja)

Kalau database masih kosong:

```powershell
$body = @{
  email = 'admin@rinjanmedia.com'
  password = 'RinjanAdmin2026!'
  name = 'Admin Rinjan'
  role = 'admin'
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/users/first-register" `
  -Method Post -Body $body -ContentType "application/json" -UseBasicParsing
```

Endpoint ini **hanya berfungsi saat tabel `users` masih kosong**.

## 6. Mematikan database

```powershell
& ".dev\pg\pgsql\bin\pg_ctl.exe" -D ".dev\pg\data" stop -m fast
```

Atau hentikan proses `postgres.exe` yang menunjuk ke `.dev\pg\data`.

## Skema berubah saat dev

Payload `db-postgres` melakukan **push otomatis** saat dev — menambah field di koleksi langsung mengubah tabel. Tidak perlu `payload migrate`.

Di produksi, jangan andalkan push otomatis. Pakai migrasi (lihat `DOCUMENTATION.md`).

## Kalau lupa password database

```powershell
# 1. matikan server, lalu jalankan mode single-user
& ".dev\pg\pgsql\bin\postgres.exe" --single -D ".dev\pg\data" postgres

# 2. di prompt yang muncul
ALTER ROLE rinjan WITH PASSWORD 'password_baru';
\q
```

## Troubleshooting

| Gejala | Penyebab | Solusi |
|---|---|---|
| Semua halaman CMS 500 | PostgreSQL mati | Nyalakan DB (§1), cek `pg_isready` |
| `ECONNREFUSED 127.0.0.1:5433` | Port salah / DB belum jalan | Pastikan `-p 5433` dan `.env` cocok |
| `password authentication failed` | Password `.env` beda dengan role | Reset password (§ di atas) |
| Tabel tidak lengkap | Payload belum pernah init | Jalankan `npm run dev` sekali, tunggu "Pulling schema" selesai |
| Admin kosong tanpa isi | `importMap` basi | Lihat `adr-002-workaround-cli-payload.md` |
| `first-register` 403 | Sudah ada user | Login biasa; atau hapus baris di `users` dulu |

## Catatan produksi

Semua di atas **khusus lokal**. Di VPS:

- PostgreSQL jalan sebagai container Docker (`db:5432`), bukan portable.
- `DATABASE_URI` menunjuk ke `db:5432`, bukan `127.0.0.1:5433`.
- `PAYLOAD_SECRET` **wajib** diganti string acak 32+ karakter.
- Password `rinjan_dev_2026` tidak boleh dipakai.
- Jangan jalankan `scripts/seed.mjs` terhadap database produksi tanpa backup.
