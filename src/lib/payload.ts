import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Satu instance Payload untuk dipakai di Server Component.
 * Payload 3 berjalan di dalam proses Next.js, jadi tidak perlu HTTP call.
 */
export const getPayloadClient = async () => getPayload({ config })

/** Tipe minimal yang dipakai halaman. Sengaja longgar supaya tidak terikat generated types. */
export type ServiceDoc = {
  id: number | string
  title: string
  slug: string
  headline: string
  summary: string
  intro: string
  highlights?: { text: string }[] | null
  packages?: {
    name: string
    price: string
    unit?: string | null
    note?: string | null
    features?: { text: string }[] | null
    featured?: boolean | null
  }[] | null
  extras?: {
    title?: string | null
    body?: string | null
    items?: { text: string }[] | null
  } | null
  closing?: string | null
  order?: number | null
  seo?: { title?: string | null; description?: string | null; noindex?: boolean | null } | null
}

export type SettingsDoc = {
  siteName?: string | null
  tagline?: string | null
  description?: string | null
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  address?: string | null
  hours?: string | null
  mapsEmbed?: string | null
  mapsLink?: string | null
  socials?: { platform: string; url: string }[] | null
  gtmId?: string | null
}

/**
 * Ambil semua layanan yang terbit, terurut.
 * `depth: 0` cukup karena kita hanya butuh field teks.
 */
export async function getServices(): Promise<ServiceDoc[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    where: { status: { equals: 'published' } },
    sort: 'order',
    limit: 20,
    depth: 0,
  })
  return result.docs as unknown as ServiceDoc[]
}

export async function getServiceBySlug(slug: string): Promise<ServiceDoc | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 0,
  })
  return (result.docs[0] as unknown as ServiceDoc) ?? null
}

export async function getSettings(): Promise<SettingsDoc | null> {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'settings', depth: 0 })
  return settings as unknown as SettingsDoc
}
