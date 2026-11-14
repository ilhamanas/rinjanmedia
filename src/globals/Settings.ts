import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Pengaturan Situs',
  admin: { group: 'Pengaturan' },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identitas',
          fields: [
            { name: 'siteName', label: 'Nama situs', type: 'text', defaultValue: 'Rinjan Media' },
            { name: 'tagline', label: 'Tagline', type: 'text' },
            {
              name: 'description',
              label: 'Deskripsi situs',
              type: 'textarea',
              admin: { description: 'Dipakai untuk meta description bawaan.' },
            },
          ],
        },
        {
          label: 'Kontak',
          fields: [
            { name: 'phone', label: 'Telepon', type: 'text' },
            { name: 'whatsapp', label: 'Nomor WhatsApp', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'address', label: 'Alamat', type: 'textarea' },
            { name: 'hours', label: 'Jam operasional', type: 'text' },
            { name: 'mapsEmbed', label: 'URL embed peta', type: 'text' },
            { name: 'mapsLink', label: 'URL tautan peta', type: 'text' },
          ],
        },
        {
          label: 'Sosial Media',
          fields: [
            {
              name: 'socials',
              label: 'Akun',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  label: 'Platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'WhatsApp', value: 'whatsapp' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'TikTok', value: 'tiktok' },
                  ],
                },
                { name: 'url', label: 'URL', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Analytics',
          fields: [
            {
              name: 'gtmId',
              label: 'Google Tag Manager ID',
              type: 'text',
              admin: { description: 'Contoh: GT-P36LTCV. Kosongkan untuk menonaktifkan.' },
            },
            { name: 'ga4Id', label: 'GA4 Measurement ID', type: 'text' },
          ],
        },
      ],
    },
  ],
}
