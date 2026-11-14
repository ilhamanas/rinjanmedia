import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Pengguna', plural: 'Pengguna' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Pengaturan',
  },
  auth: true,
  access: {
    // Hanya admin yang boleh mengelola pengguna.
    create: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', label: 'Nama', type: 'text', required: true },
    {
      name: 'role',
      label: 'Peran',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin: akses penuh', value: 'admin' },
        { label: 'Editor: kelola konten', value: 'editor' },
      ],
      access: {
        // Editor tidak boleh menaikkan perannya sendiri.
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
}
