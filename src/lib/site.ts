export const site = {
  name: 'Rinjan Media',
  tagline: 'Solusi digital untuk bisnis Anda',
  phone: '+62 895-0110-0696',
  phoneHref: 'tel:+6289501100696',
  whatsapp: 'https://wa.me/6289501100696',
  email: 'rinjanmedia@gmail.com',
  addressShort: 'Serpong, Tangerang Selatan',
  address:
    'Tangerang Selatan (Head Office), Jl. Ciater Rawa Macek RT.007 RW.003 Kel. Ciater Kec. Serpong, Kota Tangerang Selatan, Banten 15310',
  hours: 'Senin - Minggu, 09.00 - 21.00 WIB',
  /** Embed peta dari halaman kontak lama, apa adanya. */
  mapsEmbed:
    'https://maps.google.com/maps?q=rinjan%20media&t=m&z=14&output=embed',
  mapsLink: 'https://maps.google.com/maps?q=rinjan%20media&t=m&z=14',
  socials: [
    { label: 'Facebook', href: 'https://www.facebook.com/rinjanmedia' },
    { label: 'Instagram', href: 'https://www.instagram.com/rinjanmedia' },
    { label: 'WhatsApp', href: 'https://wa.me/6289501100696' },
  ],
} as const

export const nav = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang Rinjan', href: '/tentang' },
  {
    label: 'Layanan Kami',
    href: '/layanan',
    children: [
      { label: 'Rinjan Website', href: '/layanan/website' },
      { label: 'Rinjan Desain', href: '/layanan/desain' },
      { label: 'Wifi Rinjan', href: '/layanan/wifi' },
      { label: 'Rinjan IT Support', href: '/layanan/it-support' },
    ],
  },
  { label: 'Blog', href: '/blog' },
  { label: 'Kontak Kami', href: '/kontak' },
] as const
