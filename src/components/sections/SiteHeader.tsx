'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { nav, site } from '@/lib/site'

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)

  // Tutup menu setiap kali rute berubah.
  // Dilakukan saat render (bukan di useEffect) agar tidak memicu render berantai —
  // pola resmi React: https://react.dev/learn/you-might-not-need-an-effect
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMobileOpen(false)
    setOpenMenu(null)
  }

  useEffect(() => {
    if (!mobileOpen && !openMenu) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        setOpenMenu(null)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen, openMenu])

  useEffect(() => {
    if (!openMenu) return
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [openMenu])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 lg:h-20 lg:px-6">
        <Link href="/" className="shrink-0" aria-label="Rinjan Media, ke beranda">
          <Image
            src="/logo-rinjan.png"
            alt="Rinjan Media"
            width={297}
            height={61}
            priority
            className="h-8 w-auto lg:h-10"
          />
        </Link>

        <nav ref={navRef} className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          {nav.map((item) =>
            'children' in item ? (
              <div key={item.href} className="relative">
                <button
                  type="button"
                  aria-expanded={openMenu === item.label}
                  aria-haspopup="true"
                  onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                  className={cn(
                    'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'text-brand-600'
                      : 'text-ink-700 hover:text-brand-600'
                  )}
                >
                  {item.label}
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      'size-4 transition-transform',
                      openMenu === item.label && 'rotate-180'
                    )}
                  />
                </button>
                {openMenu === item.label && (
                  <ul className="absolute left-0 top-full mt-2 w-56 overflow-hidden rounded-lg border border-brand-100 bg-white py-1 shadow-lg">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-ink-700 hover:bg-brand-50 hover:text-brand-700"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive(item.href) ? 'text-brand-600' : 'text-ink-700 hover:text-brand-600'
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/kontak"
            className="hidden rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-700 sm:inline-block"
          >
            Minta Penawaran
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            className="rounded-md p-2 text-ink-700 hover:bg-brand-50 lg:hidden"
          >
            {mobileOpen ? (
              <X aria-hidden="true" className="size-6" />
            ) : (
              <Menu aria-hidden="true" className="size-6" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Navigasi seluler"
          className="border-t border-brand-100 bg-white lg:hidden"
        >
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'block border-b border-brand-50 py-3 text-sm font-medium',
                    isActive(item.href) ? 'text-brand-600' : 'text-ink-700'
                  )}
                >
                  {item.label}
                </Link>
                {'children' in item && (
                  <ul className="pb-2 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block py-2 text-sm text-ink-500 hover:text-brand-600"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="py-4">
              <Link
                href="/kontak"
                className="block rounded-lg bg-accent-600 px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Minta Penawaran
              </Link>
            </li>
          </ul>
        </nav>
      )}

      <span className="sr-only">{site.tagline}</span>
    </header>
  )
}
