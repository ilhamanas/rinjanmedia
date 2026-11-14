import type { CollectionConfig } from 'payload'
import { contentBlocks } from '../blocks'
import { seoFields } from './Pages'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Layanan', plural: 'Layanan' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order', 'status'],
    group: 'Konten',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'title', label: 'Nama layanan', type: 'text', required: true },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Dipakai di URL: /layanan/<slug>' },
    },
    {
      name: 'headline',
      label: 'Headline',
      type: 'text',
      required: true,
      admin: { description: 'Satu kalimat ajakan, tampil di bawah nama layanan.' },
    },
    {
      name: 'summary',
      label: 'Ringkasan',
      type: 'textarea',
      required: true,
      maxLength: 220,
      admin: { description: 'Tampil di kartu layanan pada beranda dan halaman /layanan.' },
    },
    {
      name: 'intro',
      label: 'Paragraf pembuka',
      type: 'textarea',
      required: true,
    },
    {
      name: 'highlights',
      label: 'Poin unggulan',
      type: 'array',
      fields: [{ name: 'text', label: 'Teks', type: 'text', required: true }],
    },
    {
      name: 'packages',
      label: 'Paket & harga',
      type: 'array',
      fields: [
        { name: 'name', label: 'Nama paket', type: 'text', required: true },
        { name: 'price', label: 'Harga', type: 'text', required: true },
        { name: 'unit', label: 'Satuan', type: 'text', admin: { description: 'Misal: /bulan' } },
        { name: 'note', label: 'Catatan', type: 'textarea' },
        {
          name: 'features',
          label: 'Fitur',
          type: 'array',
          fields: [{ name: 'text', label: 'Teks', type: 'text', required: true }],
        },
        { name: 'featured', label: 'Tandai populer', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'extras',
      label: 'Bagian tambahan',
      type: 'group',
      fields: [
        { name: 'title', label: 'Judul', type: 'text' },
        { name: 'body', label: 'Deskripsi', type: 'textarea' },
        {
          name: 'items',
          label: 'Daftar poin',
          type: 'array',
          fields: [{ name: 'text', label: 'Teks', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'closing',
      label: 'Catatan penutup',
      type: 'textarea',
    },
    {
      name: 'blocks',
      label: 'Blok tambahan (opsional)',
      type: 'blocks',
      blocks: contentBlocks,
      admin: { description: 'Untuk konten di luar struktur paket di atas.' },
    },
    ...seoFields,
    {
      name: 'order',
      label: 'Urutan tampil',
      type: 'number',
      defaultValue: 10,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draf', value: 'draft' },
        { label: 'Terbit', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
