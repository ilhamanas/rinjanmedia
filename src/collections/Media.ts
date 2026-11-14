import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize'],
    group: 'Konten',
  },
  access: {
    // Media harus bisa dibaca publik supaya gambar tampil di halaman.
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: undefined, position: 'centre' },
      { name: 'card', width: 768, height: undefined, position: 'centre' },
      { name: 'hero', width: 1600, height: undefined, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Teks alternatif',
      type: 'text',
      required: true,
      admin: {
        description:
          'Wajib. Jelaskan isi gambar untuk pembaca layar dan saat gambar gagal dimuat.',
      },
    },
    {
      name: 'credit',
      label: 'Sumber / kredit',
      type: 'text',
      admin: { description: 'Opsional. Nama fotografer atau sumber gambar.' },
    },
  ],
}
