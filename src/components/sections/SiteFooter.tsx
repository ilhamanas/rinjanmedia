import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { nav, site } from '@/lib/site'

const layanan = nav.find((n) => 'children' in n)?.children ?? []

const socialIcon = {
  Facebook: Facebook,
  Instagram: Instagram,
  WhatsApp: MessageCircle,
} as const

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-brand-700 text-brand-50">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.3fr]">
          <div>
            <Image
              src="/logo-rinjan.png"
              alt="Rinjan Media"
              width={297}
              height={61}
              className="h-9 w-auto brightness-0 invert"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-100">
              Melayani pembuatan website, desain, jaringan internet, dan dukungan IT
              untuk bisnis di Tangerang Selatan sejak 2018.
            </p>
            <ul className="mt-6 flex gap-3">
              {site.socials.map((s) => {
                const Icon = socialIcon[s.label as keyof typeof socialIcon] ?? MessageCircle
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${site.name} di ${s.label}`}
                      className="inline-flex size-10 items-center justify-center rounded-full bg-brand-600 text-white transition-colors hover:bg-accent-600"
                    >
                      <Icon aria-hidden="true" className="size-4" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <nav aria-label="Tautan footer">
            <h2 className="text-sm font-semibold text-white">Layanan</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {layanan.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-brand-100 hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/tentang" className="text-brand-100 hover:text-white">
                  Tentang Rinjan
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-brand-100 hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold text-white">Hubungi Kami</h2>
            <ul className="mt-4 space-y-3 text-sm text-brand-100">
              <li className="flex gap-2.5">
                <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <a href={site.phoneHref} className="hover:text-white">
                  {site.phone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <a href={`mailto:${site.email}`} className="break-all hover:text-white">
                  {site.email}
                </a>
              </li>
              <li className="flex gap-2.5">
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <span className="leading-relaxed">{site.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-brand-600 pt-6 text-xs text-brand-200">
          <p>&copy; {new Date().getFullYear()} Rinjan Media. Seluruh hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}
