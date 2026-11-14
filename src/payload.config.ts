import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Categories, Posts } from './collections/Posts'
import { Services } from './collections/Services'
import { Leads } from './collections/Leads'
import { Redirects } from './collections/Redirects'
import { Settings } from './globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET belum diset. Salin .env.example ke .env lalu isi nilainya.')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' | Rinjan Media',
      icons: [{ rel: 'icon', type: 'image/png', url: '/icon-rinjan.png' }],
    },
    components: {
      Nav: '/components/admin/BrandNav#BrandNav',
      beforeDashboard: ['/components/admin/AdminStats#AdminStats'],
      graphics: {
        Logo: '/components/admin/BrandLogo#BrandLogo',
        Icon: '/components/admin/BrandIcon#BrandIcon',
      },
    },
  },
  collections: [Pages, Posts, Categories, Services, Media, Leads, Redirects, Users],
  globals: [Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  sharp,
  cors: [process.env.NEXT_PUBLIC_SERVER_URL ?? ''].filter(Boolean),
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL ?? ''].filter(Boolean),
  upload: {
    limits: { fileSize: 5_000_000 },
  },
})
