import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { EntityType, groupNavItems, type EntityToGroup } from '@payloadcms/ui/shared'
import React from 'react'

import type { PayloadRequest, ServerProps } from 'payload'

import { NavShellClient, type NavGroupData } from './NavShellClient'

/**
 * Navigasi samping panel admin versi Rinjan.
 *
 * Mengganti `admin.components.Nav` supaya sidebar bisa memuat ikon per koleksi
 * dan kotak identitas, seperti referensi desain.
 *
 * Perilaku keyboard TIDAK ditulis ulang. NavShellClient memakai useNav() dari
 * NavProvider yang sudah dipasang Payload di Root, lalu meniru NavWrapper:
 * `inert` saat nav tertutup dan `tabIndex -1` pada tiap tautan.
 *
 * Catatan tipe: `req` ada di props runtime tetapi tidak dideklarasikan pada
 * ServerProps, jadi dibaca lewat cast sempit di bawah.
 */

type BrandNavProps = ServerProps & { req?: Partial<PayloadRequest> }

/** Label Payload bisa berupa string atau objek per-bahasa. */
function labelToText(label: unknown): string {
  if (typeof label === 'string') return label
  if (label && typeof label === 'object') {
    const values = Object.values(label as Record<string, unknown>)
    const first = values.find((v) => typeof v === 'string')
    if (typeof first === 'string') return first
  }
  return ''
}

export async function BrandNav(props: BrandNavProps) {
  const { payload, permissions, i18n, user, visibleEntities, req } = props

  if (!payload?.config) return null

  const { admin, collections, globals, routes } = payload.config
  const adminRoute = routes.admin
  const { afterNav, afterNavLinks, beforeNav, beforeNavLinks, settingsMenu } =
    admin.components

  const visibleCollections = visibleEntities?.collections ?? collections.map((c) => c.slug)
  const visibleGlobals = visibleEntities?.globals ?? globals.map((g) => g.slug)

  const entities: EntityToGroup[] = [
    ...collections
      .filter(({ slug }) => visibleCollections.includes(slug))
      .map((collection) => ({ entity: collection, type: EntityType.collection }) as const),
    ...globals
      .filter(({ slug }) => visibleGlobals.includes(slug))
      .map((global) => ({ entity: global, type: EntityType.global }) as const),
  ]

  const rawGroups = groupNavItems(entities, permissions ?? { canAccessAdmin: false, collections: {}, globals: {} } as never, i18n)

  // Ratakan ke bentuk sederhana supaya komponen client tidak perlu membawa
  // seluruh objek konfigurasi koleksi.
  const groups: NavGroupData[] = rawGroups.map((group) => ({
    label: group.label,
    entities: group.entities.map((entity) => ({
      slug: entity.slug,
      label: labelToText(entity.label) || entity.slug,
      type: entity.type,
    })),
  }))

  // Preferensi grup tersimpan di koleksi payload-preferences.
  let navPreferences: { groups?: Record<string, { open?: boolean }> } | null = null
  try {
    if (req?.payload && user?.id) {
      const prefs = await req.payload.find({
        collection: 'payload-preferences',
        depth: 0,
        limit: 1,
        pagination: false,
        req,
        where: {
          and: [
            { key: { equals: 'nav' } },
            { 'user.relationTo': { equals: user.collection ?? 'users' } },
            { 'user.value': { equals: user.id } },
          ],
        },
      })
      navPreferences = (prefs?.docs?.[0]?.value as typeof navPreferences) ?? null
    }
  } catch {
    navPreferences = null
  }

  const serverProps = { i18n, payload, permissions, req, user }
  const render = (Component: unknown) =>
    RenderServerComponent({
      Component: Component as never,
      importMap: payload.importMap,
      serverProps,
    })

  return (
    <NavShellClient
      adminRoute={adminRoute}
      afterNav={render(afterNav)}
      afterNavLinks={render(afterNavLinks)}
      beforeNav={render(beforeNav)}
      beforeNavLinks={render(beforeNavLinks)}
      groups={groups}
      logoutHref={`${adminRoute}/logout`}
      navPreferences={navPreferences}
      settingsMenu={Array.isArray(settingsMenu) ? settingsMenu.map(render) : []}
      siteName="Rinjan Media"
    />
  )
}

export default BrandNav
