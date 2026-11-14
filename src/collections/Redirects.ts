import type { CollectionConfig } from 'payload'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  labels: { singular: 'Redirect', plural: 'Redirect' },
  admin: {
    useAsTitle: 'fromPath',
    defaultColumns: ['fromPath', 'toPath', 'statusCode', 'enabled'],
    group: 'Pengaturan',
    description: 'Pengalihan URL lama WordPress ke URL baru.',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'fromPath',
      label: 'Dari',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Contoh: /rinjan-website' },
    },
    {
      name: 'toPath',
      label: 'Ke',
      type: 'text',
      required: true,
      admin: { description: 'Contoh: /layanan/website' },
    },
    {
      name: 'statusCode',
      label: 'Kode status',
      type: 'select',
      defaultValue: '301',
      options: [
        { label: '301: permanen', value: '301' },
        { label: '302: sementara', value: '302' },
      ],
    },
    { name: 'enabled', label: 'Aktif', type: 'checkbox', defaultValue: true },
  ],
}
