/**
 * Seed konten awal ke Payload via REST API.
 *
 * Kenapa lewat REST, bukan `payload seed`:
 * CLI Payload 3.93 gagal di mesin ini (tsx + undici bentrok di Node 22/24),
 * sedangkan REST API berjalan normal. Hasilnya sama.
 *
 * Pakai:
 *   node scripts/seed.mjs
 *
 * Butuh .env terisi dan dev server jalan di NEXT_PUBLIC_SERVER_URL.
 */

import { readFileSync } from 'node:fs'

// Muat .env tanpa dependency tambahan.
const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => {
      const i = line.indexOf('=')
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()]
    })
)

const BASE = (env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
const EMAIL = process.env.SEED_EMAIL || 'admin@rinjanmedia.com'
const PASSWORD = process.env.SEED_PASSWORD || 'RinjanAdmin2026!'

let token = ''

async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
      ...options.headers,
    },
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    json = { raw: text.slice(0, 300) }
  }
  if (!res.ok) {
    throw new Error(`${options.method || 'GET'} ${path} → ${res.status}: ${text.slice(0, 400)}`)
  }
  return json
}

/** Buat dokumen bila slug belum ada. Idempoten — aman dijalankan berulang. */
async function upsert(collection, slugField, doc) {
  const existing = await api(
    `/api/${collection}?where[${slugField}][equals]=${encodeURIComponent(doc[slugField])}&limit=1&draft=false`
  )
  if (existing.docs?.length) {
    const id = existing.docs[0].id
    await api(`/api/${collection}/${id}`, { method: 'PATCH', body: JSON.stringify(doc) })
    return { id, action: 'diperbarui' }
  }
  const created = await api(`/api/${collection}`, { method: 'POST', body: JSON.stringify(doc) })
  return { id: created.doc.id, action: 'dibuat' }
}

/** Ubah array string menjadi format array Payload: [{ text }]. */
const texts = (arr) => arr.map((text) => ({ text }))

// ---------------------------------------------------------------------------

const services = [
  {
    title: 'Rinjan Website',
    slug: 'website',
    headline: 'Wujudkan website impianmu bersama kami',
    summary:
      'Pembuatan website dengan rekomendasi domain dan hosting murah, cocok untuk landing page, profil perusahaan, sampai toko online.',
    intro:
      'Rinjan Web Developer menyediakan layanan perancangan website dengan rekomendasi domain dan hosting yang murah dan berkualitas. Semua paket sudah termasuk domain gratis dan template premium, dikerjakan dengan WordPress atau kode custom sesuai kebutuhan.',
    highlights: texts([
      'Gratis domain .com, .net, atau .my.id',
      'Template premium dan mobile friendly',
      'Halaman tambahan Rp300.000 per halaman',
      'Bonus tombol click to WhatsApp',
    ]),
    packages: [
      {
        name: 'Landing Page',
        price: 'Rp500rb',
        note: 'Cocok sebagai halaman landing dengan budget terbatas.',
        features: texts([
          'Menggunakan WordPress',
          '1 landing page',
          'Template premium',
          'Mobile friendly',
          'Tanpa autobackup',
        ]),
        featured: false,
      },
      {
        name: 'Portofolio',
        price: 'Rp1,5jt',
        note: 'Cocok untuk membangun portofolio sendiri.',
        featured: true,
        features: texts(['3 halaman', 'Template premium', 'Mobile friendly']),
      },
      {
        name: 'Company Profile',
        price: 'Rp4jt',
        note: 'Cocok sebagai website profil perusahaan.',
        features: texts([
          'HTML / PHP / CodeIgniter / Laravel',
          'Mulai dari 5 halaman',
          'Tampilan dan fitur custom',
          'User role manager',
          'Dengan autobackup',
        ]),
      },
      {
        name: 'Aplikasi Berbasis Web',
        price: 'Rp5,5jt',
        note: 'Untuk perusahaan yang menginginkan desain dan fitur khusus.',
        features: texts(['Mulai dari 5 halaman', 'Desain dan fitur custom']),
      },
      {
        name: 'Toko Online',
        price: 'Rp6jt',
        features: texts([
          'HTML / PHP / CodeIgniter / Laravel',
          'Mulai dari 5 halaman',
          'Dengan autobackup',
        ]),
      },
      {
        name: 'Aplikasi Android',
        price: 'Rp7,5jt',
        features: texts([
          'Dart / Flutter',
          'Design UI/UX dengan Figma',
          'Full custom',
          'Backend integration',
        ]),
      },
      {
        name: 'Sistem Informasi Akademik',
        price: 'Rp8,5jt',
        features: texts(['Desain dan fitur custom', 'Dengan autobackup']),
      },
      {
        name: 'Portal Berita Online',
        price: 'Rp8,7jt',
        features: texts(['Desain dan fitur custom', 'Dengan autobackup']),
      },
      {
        name: 'Custom Desain',
        price: 'Rp11jt',
        features: texts(['Desain sepenuhnya custom', 'Fitur menyesuaikan kebutuhan']),
      },
    ],
    extras: {
      title: 'Paket web maintenance',
      body: 'Website yang sudah jalan tetap butuh perawatan. Pilih paket maintenance bulanan sesuai intensitas pembaruan konten Anda.',
      items: texts([
        'Basic: perbaikan minor bugs, 3 artikel SEO, update konten 3 halaman, backup otomatis per bulan',
        'Advanced Rp2,5jt: 6 artikel SEO, update konten 7 halaman, backup per 2 minggu, analisa traffic, SEO basic',
        'Premium Rp3,5jt: 10 artikel SEO, update konten 10 halaman, backup per minggu, optimasi keamanan, layanan on site 1x per bulan',
      ]),
    },
    closing: 'Desain khusus dengan Figma tersedia sebagai tambahan Rp600.000.',
    order: 10,
    status: 'published',
    seo: {
      title: 'Jasa Pembuatan Website Tangerang Selatan',
      description:
        'Paket pembuatan website mulai Rp500rb: landing page, company profile, toko online, sampai aplikasi web. Termasuk domain dan hosting.',
    },
  },
  {
    title: 'Rinjan Desain',
    slug: 'desain',
    headline: 'Bawa brand Anda ke level berikutnya',
    summary:
      'Desain grafis, kelola sosial media, digital marketing, dan percetakan untuk kebutuhan promosi bisnis Anda.',
    intro:
      'Rinjan Designer Studio memberikan layanan jasa desain, kelola sosial media, digital marketing, dan percetakan. Kami hadir memenuhi kebutuhan bisnis Anda dengan kreativitas dan ketepatan yang meningkatkan daya tarik serta profesionalisme brand.',
    highlights: texts([
      'Revisi desain sesuai paket',
      'File master diserahkan ke Anda',
      'Layanan percetakan menyusul setelah desain',
      'Brand guideline untuk paket logo',
    ]),
    packages: [
      {
        name: 'Desain Banner',
        price: 'Rp70rb',
        note: '1 model desain dari 1 pesanan.',
        features: texts(['Revisi 2x', 'File JPG, PNG', 'Penyimpanan file 3 bulan']),
      },
      {
        name: 'Desain Sertifikat',
        price: 'Rp70rb',
        note: '1 model desain dari 1 pesanan.',
        features: texts([
          'Revisi 2x',
          'File JPG, PNG, SVG, PDF, EPS',
          'Penyimpanan file 3 bulan',
        ]),
      },
      {
        name: 'Desain Sablon',
        price: 'Rp150rb',
        note: '4 model desain dari 1 pesanan.',
        features: texts([
          'Revisi 5x',
          'File JPG, PNG, SVG, PDF, EPS, CDR / PSD',
          'Penyimpanan file 12 bulan',
        ]),
      },
      {
        name: 'Desain Logo',
        price: 'Rp500rb',
        note: '2 pilihan desain, selaras dengan nama perusahaan.',
        features: texts(['Revisi 5x', '4-6 mockup', 'Brand guideline', 'Tanpa lisensi']),
      },
      {
        name: 'Desain Branding',
        price: 'Rp500rb',
        features: texts(['1 pilihan desain', 'Revisi 5x', '4-6 mockup']),
      },
      {
        name: 'Desain UI/UX',
        price: 'Rp1,5jt',
        features: texts(['UX analis', 'Wireframing', 'User interface desain', 'File PDF']),
      },
    ],
    extras: {
      title: 'Layanan percetakan',
      body: 'Setelah desain selesai, Anda tidak perlu mencari percetakan sendiri. Kami cetak langsung dari file yang sama supaya hasilnya konsisten.',
      items: texts([
        'Banner',
        'Sertifikat',
        'Stiker',
        'Kop surat',
        'Stempel',
        'Undangan',
        'Merchandise',
        'Signage',
        'Paket lengkap',
      ]),
    },
    order: 20,
    status: 'published',
    seo: {
      title: 'Jasa Desain Grafis dan Percetakan',
      description:
        'Desain banner, logo, branding, UI/UX, sampai cetak. Paket mulai Rp70rb dengan file master diserahkan ke Anda.',
    },
  },
  {
    title: 'Wifi Rinjan',
    slug: 'wifi',
    headline: 'Akses internet murah, cepat, dan berkualitas',
    summary:
      'Layanan jaringan internet untuk mendukung pembelajaran, multimedia, dan bisnis online dengan biaya terjangkau.',
    intro:
      'Kami memberikan layanan jaringan internet sebagai media pendukung pembelajaran, multimedia, dan bisnis online dengan biaya terjangkau. Jaringan full fiber optik, tanpa batasan kuota, didukung tim ahli.',
    highlights: texts([
      'Tanpa batasan kuota',
      'Jaringan full fiber optik',
      'Biaya instalasi Rp150.000 dari normal Rp500.000',
      'Cakupan Kelurahan Ciater, Kecamatan Serpong',
    ]),
    packages: [
      {
        name: 'Home',
        price: 'Rp111K',
        unit: '/bulan',
        features: texts([
          'Up to 5 Mbps',
          'Tanpa batasan kuota',
          'Full fiber optik',
          'Kapasitas 4 gadget',
          'Signal relatif stabil',
          'Didukung tim ahli',
        ]),
      },
      {
        name: 'Gamers',
        price: 'Rp166,5K',
        unit: '/bulan',
        features: texts(['Up to 10 Mbps', 'Tanpa batasan kuota', 'Kapasitas 10 gadget']),
      },
      {
        name: 'Business',
        price: 'Rp222K',
        unit: '/bulan',
        features: texts(['Up to 15 Mbps', 'Tanpa batasan kuota', 'Kapasitas 15 gadget']),
      },
      {
        name: 'Business Pro',
        price: 'Rp271,9K',
        unit: '/bulan',
        features: texts(['Up to 25 Mbps', 'Tanpa batasan kuota', 'Kapasitas 20 gadget']),
      },
    ],
    extras: {
      title: 'Cakupan area',
      body: 'Saat ini jaringan Wifi Rinjan tersedia di Kelurahan Ciater, Kecamatan Serpong, Kota Tangerang Selatan. Hubungi kami untuk memastikan ketersediaan di alamat Anda sebelum memesan.',
    },
    closing: 'Butuh kapasitas lebih besar? Upgrade paket kapan saja tanpa mengganti perangkat.',
    order: 30,
    status: 'published',
    seo: {
      title: 'Pasang Wifi Serpong Tangerang Selatan',
      description:
        'Internet fiber optik tanpa batas kuota mulai Rp111rb per bulan. Cakupan Kelurahan Ciater, Kecamatan Serpong.',
    },
  },
  {
    title: 'Rinjan IT Support',
    slug: 'it-support',
    headline: 'Konsultasi seputar IT dan lainnya',
    summary:
      'Servis komputer dan laptop, rakit PC, pasang CCTV, instalasi jaringan komputer, FTTH, dan FTTX.',
    intro:
      'Rinjan IT Support memberikan layanan jasa IT untuk kebutuhan rumah maupun bisnis: service komputer dan laptop, rakit PC, pasang CCTV, instalasi jaringan komputer, FTTH, sampai FTTX.',
    highlights: texts([
      'Konsultasi gratis sebelum pengerjaan',
      'Penanganan di lokasi maupun bengkel',
      'Rakit PC sesuai anggaran dan kebutuhan',
      'Instalasi jaringan untuk kantor dan rumah',
    ]),
    packages: [
      {
        name: 'Jasa IT Konsultan',
        price: 'Konsultasi',
        note: 'Pendampingan teknis untuk keputusan perangkat dan jaringan.',
        features: texts(['Audit kebutuhan', 'Rekomendasi perangkat', 'Perencanaan jaringan']),
      },
      {
        name: 'Jasa Rakit PC',
        price: 'Sesuai spesifikasi',
        note: 'Diracik menurut anggaran dan pemakaian Anda.',
        features: texts(['Pemilihan komponen', 'Perakitan', 'Instalasi sistem operasi']),
      },
      {
        name: 'Instalasi Jaringan FTTH',
        price: 'Sesuai survei',
        features: texts(['Penarikan kabel fiber', 'Pemasangan perangkat', 'Pengujian koneksi']),
      },
      {
        name: 'Jasa Pasang CCTV',
        price: 'Sesuai survei',
        features: texts(['Penentuan titik kamera', 'Instalasi dan konfigurasi', 'Akses lewat ponsel']),
      },
      {
        name: 'Service Komputer / Laptop',
        price: 'Sesuai diagnosa',
        features: texts(['Diagnosa kerusakan', 'Perbaikan perangkat', 'Instalasi ulang sistem']),
      },
    ],
    order: 40,
    status: 'published',
    seo: {
      title: 'Jasa IT Support dan Service Komputer',
      description:
        'Service komputer dan laptop, rakit PC, pasang CCTV, instalasi jaringan FTTH dan FTTX di Tangerang Selatan.',
    },
  },
]

const redirects = [
  ['/tentang-rinjan', '/tentang'],
  ['/rinjan-website', '/layanan/website'],
  ['/rinjan-desain', '/layanan/desain'],
  ['/wifi-rinjan', '/layanan/wifi'],
  ['/rinjan-it', '/layanan/it-support'],
  ['/kontak-kami', '/kontak'],
  ['/shop', '/'],
  ['/cart', '/'],
  ['/checkout', '/'],
  ['/my-account', '/'],
  ['/komputer-laptop', '/'],
]

const settings = {
  siteName: 'Rinjan Media',
  tagline: 'Solusi digital untuk bisnis Anda',
  description:
    'Rinjan Media melayani pembuatan website, desain grafis, pemasangan wifi, dan IT support untuk bisnis di Tangerang Selatan dan sekitarnya.',
  phone: '+62 895-0110-0696',
  whatsapp: '6289501100696',
  email: 'rinjanmedia@gmail.com',
  address:
    'Tangerang Selatan (Head Office), Jl. Ciater Rawa Macek RT.007 RW.003 Kel. Ciater Kec. Serpong, Kota Tangerang Selatan, Banten 15310',
  hours: 'Senin - Minggu, 09.00 - 21.00 WIB',
  mapsEmbed: 'https://maps.google.com/maps?q=rinjan%20media&t=m&z=14&output=embed',
  mapsLink: 'https://maps.google.com/maps?q=rinjan%20media&t=m&z=14',
  socials: [
    { platform: 'facebook', url: 'https://www.facebook.com/rinjanmedia' },
    { platform: 'instagram', url: 'https://www.instagram.com/rinjanmedia' },
    { platform: 'whatsapp', url: 'https://wa.me/6289501100696' },
  ],
  gtmId: 'GT-P36LTCV',
}

// ---------------------------------------------------------------------------

async function main() {
  console.log(`Target: ${BASE}`)

  const login = await api('/api/users/login', {
    method: 'POST',
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  token = login.token
  console.log(`Login sebagai ${login.user.email} (${login.user.role})`)

  for (const service of services) {
    const { action } = await upsert('services', 'slug', service)
    console.log(`  layanan ${service.slug}: ${action}`)
  }

  for (const [fromPath, toPath] of redirects) {
    const { action } = await upsert('redirects', 'fromPath', {
      fromPath,
      toPath,
      statusCode: '301',
      enabled: true,
    })
    console.log(`  redirect ${fromPath} → ${toPath}: ${action}`)
  }

  await api('/api/globals/settings', { method: 'POST', body: JSON.stringify(settings) })
  console.log('  settings: disimpan')

  console.log('\nSelesai.')
}

main().catch((err) => {
  console.error('\nGAGAL:', err.message)
  process.exit(1)
})
