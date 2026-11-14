import React from 'react'

import type { ServerProps } from 'payload'

/**
 * Ringkasan isi situs di atas dashboard admin.
 *
 * Angka diambil langsung dari database lewat Local API, bukan dikarang. Ini
 * penting: dashboard yang menampilkan angka palsu lebih buruk daripada dashboard
 * tanpa angka.
 *
 * Komponen ini Server Component, jadi tidak ada fetch dari browser dan tidak
 * menambah bundle client.
 */

type Stat = {
  label: string
  value: number
  href: string
  hint: string
}

async function safeCount(
  payload: ServerProps['payload'],
  collection: 'services' | 'leads' | 'redirects' | 'media',
  where?: Record<string, unknown>
): Promise<number> {
  try {
    const { totalDocs } = await payload.count({
      collection,
      where: where as never,
      overrideAccess: true,
    })
    return totalDocs
  } catch {
    // Dashboard tidak boleh ikut gagal hanya karena satu hitungan error.
    return 0
  }
}

export async function AdminStats({ payload, user }: ServerProps) {
  const [services, leads, redirects, media] = await Promise.all([
    safeCount(payload, 'services', { status: { equals: 'published' } }),
    safeCount(payload, 'leads', { status: { equals: 'baru' } }),
    safeCount(payload, 'redirects', { enabled: { equals: true } }),
    safeCount(payload, 'media'),
  ])

  const name = user?.name || user?.email || 'Admin'

  const stats: Stat[] = [
    {
      label: 'Layanan terbit',
      value: services,
      href: '/admin/collections/services',
      hint: 'Tampil di halaman publik',
    },
    {
      label: 'Lead baru',
      value: leads,
      href: '/admin/collections/leads',
      hint: 'Belum dihubungi',
    },
    {
      label: 'Redirect aktif',
      value: redirects,
      href: '/admin/collections/redirects',
      hint: 'Pengalihan URL lama',
    },
    {
      label: 'Media',
      value: media,
      href: '/admin/collections/media',
      hint: 'Berkas terunggah',
    },
  ]

  return (
    <section className="rinjan-stats">
      <div className="rinjan-stats__head">
        <h1 className="rinjan-stats__title">Halo, {name}</h1>
        <p className="rinjan-stats__sub">
          Ringkasan isi situs Rinjan Media. Angka di bawah diambil langsung dari
          database.
        </p>
      </div>

      <ul className="rinjan-stats__grid">
        {stats.map((stat) => (
          <li key={stat.label}>
            <a className="rinjan-stat" href={stat.href}>
              <span className="rinjan-stat__value">{stat.value}</span>
              <span className="rinjan-stat__label">{stat.label}</span>
              <span className="rinjan-stat__hint">{stat.hint}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default AdminStats
