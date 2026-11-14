import type { CollectionConfig } from 'payload'
import { contentBlocks } from '../blocks'

/** Field SEO yang dipakai ulang di beberapa koleksi. */
export const seoFields = [
  {
    name: 'seo',
    label: 'SEO',
    type: 'group' as const,
    fields: [
      {
        name: 'title',
        label: 'Judul SEO',
        type: 'text' as const,
        admin: { description: 'Kosongkan untuk memakai judul halaman. Ideal 50–60 karakter.' },
      },
      {
        name: 'description',
        label: 'Deskripsi SEO',
        type: 'textarea' as const,
        admin: { description: 'Ideal 150–160 karakter.' },
      },
      {
        name: 'image',
        label: 'Gambar OG',
        type: 'upload' as const,
        relationTo: 'media' as const,
      },
      {
        name: 'noindex',
        label: 'Jangan indeks halaman ini',
        type: 'checkbox' as const,
        defaultValue: false,
      },
    ],
  },
]

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Halaman', plural: 'Halaman' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    group: 'Konten',
  },
  access: {
    // Hanya halaman berstatus published yang bisa dibaca publik.
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  versions: {
    drafts: { autosave: { interval: 800 } },
    maxPerDoc: 20,
  },
  fields: [
    { name: 'title', label: 'Judul', type: 'text', required: true },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Contoh: tentang. Tanpa garis miring di depan.' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            if (data?.title) {
              return String(data.title)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'blocks',
      label: 'Isi halaman',
      type: 'blocks',
      blocks: contentBlocks,
      minRows: 1,
    },
    ...seoFields,
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
