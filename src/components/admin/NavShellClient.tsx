'use client'

import { Link, useNav } from '@payloadcms/ui'
import { EntityType } from '@payloadcms/ui/shared'
import { usePathname } from 'next/navigation'
import React from 'react'

/**
 * Bagian client dari navigasi admin.
 *
 * Semua yang menyangkut keyboard diambil dari Payload, bukan ditulis ulang:
 * - `useNav()` memberi navOpen dari NavProvider yang dipasang Root.
 * - Saat nav tertutup, <aside> diberi `inert` sehingga seluruh sidebar keluar
 *   dari urutan Tab. Ini meniru NavWrapper bawaan; tanpa ini Tab masuk ke menu
 *   yang tidak terlihat di layar kecil.
 * - Tiap tautan memakai tabIndex -1 saat nav tertutup, sama seperti bawaan.
 */

type NavEntity = {
  slug: string
  label: string
  type: string
}

export type NavGroupData = {
  label: string
  entities: NavEntity[]
}

const ICON_PATHS: Record<string, string> = {
  pages: 'M4 4h10l4 4v12H4zM14 4v4h4',
  posts: 'M5 4h14v16H5zM8 8h8M8 12h8M8 16h5',
  categories: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  services: 'M4 7h16M4 12h16M4 17h10',
  media: 'M4 5h16v14H4zM8 11l3 3 3-3 4 4H6z',
  leads: 'M4 5h16v11H8l-4 4z',
  redirects: 'M4 8h11l-3-3M20 16H9l3 3',
  users: 'M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM5 20a7 7 0 0 1 14 0',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2M18 12h2M12 4v2M12 18v2',
}

function NavIcon({ slug }: { slug: string }) {
  const d = ICON_PATHS[slug]
  if (!d) return null
  return (
    <svg
      aria-hidden="true"
      className="rinjan-nav__icon"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.7}
      viewBox="0 0 24 24"
    >
      <path d={d} />
    </svg>
  )
}

export function NavShellClient({
  adminRoute,
  afterNav,
  afterNavLinks,
  beforeNav,
  beforeNavLinks,
  groups,
  logout,
  navPreferences,
  settingsMenu,
  siteName,
}: {
  adminRoute: string
  afterNav: React.ReactNode
  afterNavLinks: React.ReactNode
  beforeNav: React.ReactNode
  beforeNavLinks: React.ReactNode
  groups: NavGroupData[]
  logout: React.ReactNode
  navPreferences: { groups?: Record<string, { open?: boolean }> } | null
  settingsMenu: React.ReactNode[]
  siteName: string
}) {
  const { hydrated, navOpen, navRef, setNavOpen, shouldAnimate } = useNav()
  const pathname = usePathname() ?? ''

  const className = [
    'nav',
    navOpen && 'nav--nav-open',
    shouldAnimate && 'nav--nav-animate',
    hydrated && 'nav--nav-hydrated',
    'rinjan-nav',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside className={className} inert={!navOpen ? true : undefined}>
      <div className="nav__scroll" ref={navRef}>
        {beforeNav}

        <div className="rinjan-nav__brand">
          <span aria-hidden="true" className="rinjan-nav__brand-mark">
            R
          </span>
          <span className="rinjan-nav__brand-name">{siteName}</span>
          <button
            aria-label="Sembunyikan menu"
            className="rinjan-nav__collapse"
            onClick={() => setNavOpen(false)}
            tabIndex={navOpen ? 0 : -1}
            type="button"
          >
            <svg
              aria-hidden="true"
              fill="none"
              height="16"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="16"
            >
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
        </div>

        <nav aria-label="Navigasi utama" className="nav__wrap">
          {beforeNavLinks}

          {groups.map((group) => {
            const open = navPreferences?.groups?.[group.label]?.open ?? true
            return (
              <section className="rinjan-nav__group" key={group.label}>
                <h2 className="rinjan-nav__group-label">{group.label}</h2>
                {open && (
                  <ul className="rinjan-nav__list">
                    {group.entities.map((entity) => {
                      const href =
                        entity.type === EntityType.collection
                          ? `${adminRoute}/collections/${entity.slug}`
                          : `${adminRoute}/globals/${entity.slug}`

                      // Aturan aktif harus sama dengan bawaan Payload. Kalau
                      // hanya memakai startsWith, beberapa item bisa aktif
                      // sekaligus (mis. /admin/collections/services vs .../services-x).
                      const isActive =
                        pathname.startsWith(href) &&
                        ['/', undefined].includes(pathname[href.length])

                      return (
                        <li key={entity.slug}>
                          <Link
                            aria-current={isActive ? 'page' : undefined}
                            className={`nav__link rinjan-nav__link${isActive ? ' rinjan-nav__link--active' : ''}`}
                            href={href}
                            prefetch={false}
                            tabIndex={navOpen ? 0 : -1}
                          >
                            <NavIcon slug={entity.slug} />
                            <span className="nav__link-label">{entity.label}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>
            )
          })}

          {afterNavLinks}

          <div className="nav__controls rinjan-nav__controls">
            {settingsMenu}
            {logout}
          </div>
        </nav>

        {afterNav}
      </div>
    </aside>
  )
}

export default NavShellClient
