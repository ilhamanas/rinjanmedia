import type { CollectionConfig } from 'payload'
import { seoFields } from './Pages'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Kategori', plural: 'Kategori' },
  admin: { useAsTitle: 'name', group: 'Konten' },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', label: 'Nama', type: 'text', required: true },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    { name: 'description', label: 'Deskripsi', type: 'textarea' },
  ],
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Artikel', plural: 'Artikel' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
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
      admin: { position: 'sidebar' },
    },
    {
      name: 'excerpt',
      label: 'Ringkasan',
      type: 'textarea',
      required: true,
      maxLength: 200,
      admin: { description: 'Tampil di daftar blog dan hasil pencarian. Maksimal 200 karakter.' },
    },
    {
      name: 'cover',
      label: 'Gambar sampul',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Rasio 16:9 disarankan.' },
    },
    {
      name: 'category',
      label: 'Kategori',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar' },
    },
    {
      name: 'content',
      label: 'Isi artikel',
      type: 'richText',
      required: true,
    },
    {
      name: 'publishedAt',
      label: 'Tanggal terbit',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
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
