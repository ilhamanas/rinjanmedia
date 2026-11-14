import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Lead', plural: 'Lead' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'service', 'status', 'createdAt'],
    group: 'Penjualan',
    description: 'Pesan masuk dari form kontak. Hanya bisa dilihat pengguna yang login.',
  },
  access: {
    // Lead berisi data pribadi: tidak boleh dibaca publik, dan tidak dibuat lewat REST langsung.
    read: ({ req: { user } }) => Boolean(user),
    create: () => false,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'name', label: 'Nama', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'WhatsApp', type: 'text', required: true },
    { name: 'service', label: 'Layanan diminati', type: 'text' },
    { name: 'message', label: 'Pesan', type: 'textarea', required: true },
    {
      name: 'source',
      label: 'Sumber',
      type: 'text',
      defaultValue: 'kontak',
      admin: { readOnly: true },
    },
    {
      name: 'status',
      label: 'Status tindak lanjut',
      type: 'select',
      defaultValue: 'baru',
      options: [
        { label: 'Baru', value: 'baru' },
        { label: 'Sudah dihubungi', value: 'dihubungi' },
        { label: 'Deal', value: 'deal' },
        { label: 'Tidak jadi', value: 'batal' },
      ],
    },
    {
      name: 'note',
      label: 'Catatan internal',
      type: 'textarea',
      admin: { description: 'Tidak terlihat oleh pengunjung.' },
    },
  ],
}
