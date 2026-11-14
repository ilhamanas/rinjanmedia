import type { Metadata } from 'next'
import Link from 'next/link'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { nav } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Halaman tidak ditemukan',
  robots: { index: false, follow: false },
}

type Crumb = { label: string; href: string }

export default function NotFound() {
  const links: Crumb[] = []
  for (const item of nav) {
    links.push({ label: item.label, href: item.href })
    if ('children' in item) {
      for (const child of item.children) links.push({ label: child.label, href: child.href })
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 lg:px-6 lg:py-28">
      <div className="max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Galat 404</p>
        <h1 className="mt-3 text-3xl font-bold text-ink-900 lg:text-4xl">
          Halaman yang Anda cari tidak ada
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-700 lg:text-base">
          Alamatnya mungkin berubah saat kami membangun ulang situs ini. Coba salah satu tautan
          di bawah, atau hubungi kami kalau Anda yakin halaman ini seharusnya ada.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/" variant="primary">
            Kembali ke beranda
          </ButtonLink>
          <ButtonLink href="/kontak" variant="outline">
            Hubungi kami
          </ButtonLink>
        </div>

        <h2 className="mt-12 text-sm font-semibold text-ink-900">Halaman lain</h2>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {links.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-brand-600 underline-offset-4 hover:underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
