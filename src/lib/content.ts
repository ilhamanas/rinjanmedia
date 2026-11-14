/**
 * Konten statis Fase 1. Akan dipindah ke Payload CMS di Fase 2.
 * Semua teks, paket, dan harga diambil dari halaman layanan di rinjanmedia.com.
 */

export type Package = {
  name: string
  price: string
  unit?: string
  note?: string
  features: string[]
  featured?: boolean
}

export type Service = {
  slug: string
  name: string
  headline: string
  summary: string
  intro: string
  highlights: string[]
  packageHeading: string
  packages: Package[]
  extras?: { title: string; body: string; items?: string[] }
  closing?: string
}

export const services: Service[] = [
  {
    slug: 'website',
    name: 'Rinjan Website',
    headline: 'Wujudkan website impianmu bersama kami',
    summary:
      'Pembuatan website dengan rekomendasi domain dan hosting murah, cocok untuk landing page, profil perusahaan, sampai toko online.',
    intro:
      'Rinjan Web Developer menyediakan layanan perancangan website dengan rekomendasi domain dan hosting yang murah dan berkualitas. Semua paket sudah termasuk domain gratis dan template premium, dikerjakan dengan WordPress atau kode custom sesuai kebutuhan.',
    highlights: [
      'Gratis domain .com, .net, atau .my.id',
      'Template premium dan mobile friendly',
      'Halaman tambahan Rp300.000 per halaman',
      'Bonus tombol click to WhatsApp',
    ],
    packageHeading: 'Pilih paket web all in',
    packages: [
      {
        name: 'Landing Page',
        price: 'Rp500rb',
        note: 'Cocok sebagai halaman landing dengan budget terbatas.',
        features: [
          'Menggunakan WordPress',
          '1 landing page',
          'Template premium',
          'Mobile friendly',
          'Tanpa autobackup',
        ],
      },
      {
        name: 'Portofolio',
        price: 'Rp1,5jt',
        note: 'Cocok untuk membangun portofolio sendiri.',
        featured: true,
        features: ['3 halaman', 'Template premium', 'Mobile friendly'],
      },
      {
        name: 'Company Profile',
        price: 'Rp4jt',
        note: 'Cocok sebagai website profil perusahaan.',
        features: [
          'HTML / PHP / CodeIgniter / Laravel',
          'Mulai dari 5 halaman',
          'Tampilan dan fitur custom',
          'User role manager',
          'Dengan autobackup',
        ],
      },
      {
        name: 'Aplikasi Berbasis Web',
        price: 'Rp5,5jt',
        note: 'Untuk perusahaan yang menginginkan desain dan fitur khusus.',
        features: ['Mulai dari 5 halaman', 'Desain dan fitur custom'],
      },
      {
        name: 'Toko Online',
        price: 'Rp6jt',
        features: [
          'HTML / PHP / CodeIgniter / Laravel',
          'Mulai dari 5 halaman',
          'Dengan autobackup',
        ],
      },
      {
        name: 'Aplikasi Android',
        price: 'Rp7,5jt',
        features: [
          'Dart / Flutter',
          'Design UI/UX dengan Figma',
          'Full custom',
          'Backend integration',
        ],
      },
      {
        name: 'Sistem Informasi Akademik',
        price: 'Rp8,5jt',
        features: ['Desain dan fitur custom', 'Dengan autobackup'],
      },
      {
        name: 'Portal Berita Online',
        price: 'Rp8,7jt',
        features: ['Desain dan fitur custom', 'Dengan autobackup'],
      },
      {
        name: 'Custom Desain',
        price: 'Rp11jt',
        features: ['Desain sepenuhnya custom', 'Fitur menyesuaikan kebutuhan'],
      },
    ],
    extras: {
      title: 'Paket web maintenance',
      body: 'Website yang sudah jalan tetap butuh perawatan. Pilih paket maintenance bulanan sesuai intensitas pembaruan konten Anda.',
      items: [
        'Basic: perbaikan minor bugs, 3 artikel SEO, update konten 3 halaman, backup otomatis per bulan',
        'Advanced Rp2,5jt: 6 artikel SEO, update konten 7 halaman, backup per 2 minggu, analisa traffic, SEO basic',
        'Premium Rp3,5jt: 10 artikel SEO, update konten 10 halaman, backup per minggu, optimasi keamanan, layanan on site 1x per bulan',
      ],
    },
    closing: 'Desain khusus dengan Figma tersedia sebagai tambahan Rp600.000.',
  },
  {
    slug: 'desain',
    name: 'Rinjan Desain',
    headline: 'Bawa brand Anda ke level berikutnya',
    summary:
      'Desain grafis, kelola sosial media, digital marketing, dan percetakan untuk kebutuhan promosi bisnis Anda.',
    intro:
      'Rinjan Designer Studio memberikan layanan jasa desain, kelola sosial media, digital marketing, dan percetakan. Kami hadir memenuhi kebutuhan bisnis Anda dengan kreativitas dan ketepatan yang meningkatkan daya tarik serta profesionalisme brand.',
    highlights: [
      'Revisi desain sesuai paket',
      'File master diserahkan ke Anda',
      'Layanan percetakan menyusul setelah desain',
      'Brand guideline untuk paket logo',
    ],
    packageHeading: 'Pilih paket desain all in',
    packages: [
      {
        name: 'Desain Banner',
        price: 'Rp70rb',
        note: '1 model desain dari 1 pesanan.',
        features: ['Revisi 2x', 'File JPG, PNG', 'Penyimpanan file 3 bulan'],
      },
      {
        name: 'Desain Sertifikat',
        price: 'Rp70rb',
        note: '1 model desain dari 1 pesanan.',
        features: ['Revisi 2x', 'File JPG, PNG, SVG, PDF, EPS', 'Penyimpanan file 3 bulan'],
      },
      {
        name: 'Desain Sablon',
        price: 'Rp150rb',
        note: '4 model desain dari 1 pesanan.',
        features: [
          'Revisi 5x',
          'File JPG, PNG, SVG, PDF, EPS, CDR / PSD',
          'Penyimpanan file 12 bulan',
        ],
      },
      {
        name: 'Desain Logo',
        price: 'Rp500rb',
        note: '2 pilihan desain, selaras dengan nama perusahaan.',
        features: ['Revisi 5x', '4-6 mockup', 'Brand guideline', 'Tanpa lisensi'],
      },
      {
        name: 'Desain Branding',
        price: 'Rp500rb',
        features: ['1 pilihan desain', 'Revisi 5x', '4-6 mockup'],
      },
      {
        name: 'Desain UI/UX',
        price: 'Rp1,5jt',
        features: ['UX analis', 'Wireframing', 'User interface desain', 'File PDF'],
      },
    ],
    extras: {
      title: 'Layanan percetakan',
      body: 'Setelah desain selesai, Anda tidak perlu mencari percetakan sendiri. Kami cetak langsung dari file yang sama supaya hasilnya konsisten.',
      items: [
        'Banner',
        'Sertifikat',
        'Stiker',
        'Kop surat',
        'Stempel',
        'Undangan',
        'Merchandise',
        'Signage',
        'Paket lengkap',
      ],
    },
  },
  {
    slug: 'wifi',
    name: 'Wifi Rinjan',
    headline: 'Akses internet murah, cepat, dan berkualitas',
    summary:
      'Layanan jaringan internet untuk mendukung pembelajaran, multimedia, dan bisnis online dengan biaya terjangkau.',
    intro:
      'Kami memberikan layanan jaringan internet sebagai media pendukung pembelajaran, multimedia, dan bisnis online dengan biaya terjangkau. Jaringan full fiber optik, tanpa batasan kuota, didukung tim ahli.',
    highlights: [
      'Tanpa batasan kuota',
      'Jaringan full fiber optik',
      'Biaya instalasi Rp150.000 dari normal Rp500.000',
      'Cakupan Kelurahan Ciater, Kecamatan Serpong',
    ],
    packageHeading: 'Pilih paket internet',
    packages: [
      {
        name: 'Home',
        price: 'Rp111K',
        unit: '/bulan',
        features: [
          'Up to 5 Mbps',
          'Tanpa batasan kuota',
          'Full fiber optik',
          'Kapasitas 4 gadget',
          'Signal relatif stabil',
          'Didukung tim ahli',
        ],
      },
      {
        name: 'Gamers',
        price: 'Rp166,5K',
        unit: '/bulan',
        features: ['Up to 10 Mbps', 'Tanpa batasan kuota', 'Kapasitas 10 gadget'],
      },
      {
        name: 'Business',
        price: 'Rp222K',
        unit: '/bulan',
        features: ['Up to 15 Mbps', 'Tanpa batasan kuota', 'Kapasitas 15 gadget'],
      },
      {
        name: 'Business Pro',
        price: 'Rp271,9K',
        unit: '/bulan',
        features: ['Up to 25 Mbps', 'Tanpa batasan kuota', 'Kapasitas 20 gadget'],
      },
    ],
    extras: {
      title: 'Cakupan area',
      body: 'Saat ini jaringan Wifi Rinjan tersedia di Kelurahan Ciater, Kecamatan Serpong, Kota Tangerang Selatan. Hubungi kami untuk memastikan ketersediaan di alamat Anda sebelum memesan.',
    },
    closing:
      'Butuh kapasitas lebih besar? Upgrade paket kapan saja tanpa mengganti perangkat.',
  },
  {
    slug: 'it-support',
    name: 'Rinjan IT Support',
    headline: 'Konsultasi seputar IT dan lainnya',
    summary:
      'Servis komputer dan laptop, rakit PC, pasang CCTV, instalasi jaringan komputer, FTTH, dan FTTX.',
    intro:
      'Rinjan IT Support memberikan layanan jasa IT untuk kebutuhan rumah maupun bisnis: service komputer dan laptop, rakit PC, pasang CCTV, instalasi jaringan komputer, FTTH, sampai FTTX.',
    highlights: [
      'Konsultasi gratis sebelum pengerjaan',
      'Penanganan di lokasi maupun bengkel',
      'Rakit PC sesuai anggaran dan kebutuhan',
      'Instalasi jaringan untuk kantor dan rumah',
    ],
    packageHeading: 'Layanan yang kami tangani',
    packages: [
      {
        name: 'Jasa IT Konsultan',
        price: 'Konsultasi',
        note: 'Pendampingan teknis untuk keputusan perangkat dan jaringan.',
        features: ['Audit kebutuhan', 'Rekomendasi perangkat', 'Perencanaan jaringan'],
      },
      {
        name: 'Jasa Rakit PC',
        price: 'Sesuai spesifikasi',
        note: 'Diracik menurut anggaran dan pemakaian Anda.',
        features: ['Pemilihan komponen', 'Perakitan', 'Instalasi sistem operasi'],
      },
      {
        name: 'Instalasi Jaringan FTTH',
        price: 'Sesuai survei',
        features: ['Penarikan kabel fiber', 'Pemasangan perangkat', 'Pengujian koneksi'],
      },
      {
        name: 'Jasa Pasang CCTV',
        price: 'Sesuai survei',
        features: ['Penentuan titik kamera', 'Instalasi dan konfigurasi', 'Akses lewat ponsel'],
      },
      {
        name: 'Service Komputer / Laptop',
        price: 'Sesuai diagnosa',
        features: ['Diagnosa kerusakan', 'Perbaikan perangkat', 'Instalasi ulang sistem'],
      },
    ],
  },
]

export const faqs = [
  {
    q: 'Berapa lama proses pembuatan website?',
    a: 'Landing page bisa selesai dalam 3 sampai 7 hari kerja setelah materi lengkap. Company profile dan toko online biasanya 2 sampai 4 minggu tergantung jumlah halaman dan revisi.',
  },
  {
    q: 'Apakah domain dan hosting sudah termasuk?',
    a: 'Ya. Setiap paket website sudah termasuk domain gratis (.com, .net, atau .my.id) dan hosting selama satu tahun pertama. Autobackup tersedia mulai paket Company Profile.',
  },
  {
    q: 'Area mana saja yang terjangkau Wifi Rinjan?',
    a: 'Saat ini layanan Wifi Rinjan mencakup Kelurahan Ciater, Kecamatan Serpong, Kota Tangerang Selatan. Hubungi kami untuk memastikan ketersediaan di lokasi Anda.',
  },
  {
    q: 'Apakah bisa minta desain custom di luar paket?',
    a: 'Bisa. Paket Custom Desain website mulai Rp11 juta, dan penambahan halaman Rp300.000 per halaman. Untuk kebutuhan desain, sampaikan lewat form kontak.',
  },
]
