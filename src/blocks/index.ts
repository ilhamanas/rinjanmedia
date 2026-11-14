import type { Block } from 'payload'

/**
 * Blok konten terstruktur. Dipakai di koleksi Pages dan Services.
 * Setiap blok dirender oleh komponen React sendiri di
 * `src/components/blocks/BlockRenderer.tsx` — bukan HTML mentah.
 */

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Hero' },
  fields: [
    { name: 'eyebrow', label: 'Label kecil di atas judul', type: 'text' },
    { name: 'heading', label: 'Judul', type: 'text', required: true },
    { name: 'subheading', label: 'Subjudul', type: 'textarea' },
    {
      name: 'actions',
      label: 'Tombol',
      type: 'array',
      maxRows: 2,
      fields: [
        { name: 'label', label: 'Teks tombol', type: 'text', required: true },
        { name: 'href', label: 'Tujuan', type: 'text', required: true },
        {
          name: 'style',
          label: 'Gaya',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primer', value: 'primary' },
            { label: 'Aksen', value: 'accent' },
            { label: 'Garis tepi', value: 'outline' },
          ],
        },
      ],
    },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Teks kaya', plural: 'Teks kaya' },
  fields: [
    {
      name: 'content',
      label: 'Isi',
      type: 'richText',
      required: true,
    },
    {
      name: 'width',
      label: 'Lebar',
      type: 'select',
      defaultValue: 'prose',
      options: [
        { label: 'Sempit (nyaman dibaca)', value: 'prose' },
        { label: 'Penuh', value: 'full' },
      ],
    },
  ],
}

export const ServicesGridBlock: Block = {
  slug: 'servicesGrid',
  labels: { singular: 'Grid layanan', plural: 'Grid layanan' },
  fields: [
    { name: 'heading', label: 'Judul section', type: 'text' },
    { name: 'lead', label: 'Deskripsi singkat', type: 'textarea' },
    {
      name: 'source',
      label: 'Sumber data',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'Semua layanan aktif', value: 'all' },
        { label: 'Pilih manual', value: 'manual' },
      ],
    },
    {
      name: 'services',
      label: 'Layanan',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'manual',
      },
    },
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'Ajakan bertindak', plural: 'Ajakan bertindak' },
  fields: [
    { name: 'heading', label: 'Judul', type: 'text', required: true },
    { name: 'body', label: 'Deskripsi', type: 'textarea' },
    { name: 'buttonLabel', label: 'Teks tombol', type: 'text', required: true },
    { name: 'buttonHref', label: 'Tujuan tombol', type: 'text', required: true },
  ],
}

export const FaqBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQ' },
  fields: [
    { name: 'heading', label: 'Judul section', type: 'text' },
    {
      name: 'items',
      label: 'Pertanyaan',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'question', label: 'Pertanyaan', type: 'text', required: true },
        { name: 'answer', label: 'Jawaban', type: 'textarea', required: true },
      ],
    },
  ],
}

export const contentBlocks = [HeroBlock, RichTextBlock, ServicesGridBlock, CtaBlock, FaqBlock]
