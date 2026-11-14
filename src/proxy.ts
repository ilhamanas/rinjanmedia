import { NextResponse, type NextRequest } from 'next/server'

/**
 * Redirect 301/302 dari koleksi `redirects` di CMS.
 *
 * Dibaca lewat REST (bukan Payload lokal) karena middleware berjalan di
 * Edge runtime. Hasil di-cache 60 detik supaya tidak menembak DB tiap request.
 */

let cache: { at: number; map: Map<string, { to: string; code: number }> } | null = null
const TTL = 60_000

async function loadRedirects(baseUrl: string) {
  if (cache && Date.now() - cache.at < TTL) return cache.map

  const map = new Map<string, { to: string; code: number }>()
  try {
    const res = await fetch(
      `${baseUrl}/api/redirects?limit=200&depth=0&where[enabled][equals]=true`,
      { headers: { 'Content-Type': 'application/json' } }
    )
    if (res.ok) {
      const data = await res.json()
      for (const doc of data.docs ?? []) {
        if (!doc.fromPath || !doc.toPath) continue
        const from = doc.fromPath.replace(/\/$/, '') || '/'
        map.set(from, { to: doc.toPath, code: Number(doc.statusCode) || 301 })
      }
    }
  } catch {
    // DB belum siap / offline: jangan blokir situs, cukup lewati redirect.
  }

  cache = { at: Date.now(), map }
  return map
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Jangan sentuh admin, API, aset statis, dan file Next.
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const key = pathname.replace(/\/$/, '') || '/'
  const redirects = await loadRedirects(request.nextUrl.origin)
  const match = redirects.get(key)

  if (!match) return NextResponse.next()

  const target = new URL(match.to, request.nextUrl.origin)
  target.search = search
  return NextResponse.redirect(target, match.code)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo-rinjan.png|icon-rinjan.png|media).*)'],
}
