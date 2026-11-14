import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import '../globals.css'
import { SiteHeader } from '@/components/sections/SiteHeader'
import { SiteFooter } from '@/components/sections/SiteFooter'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://rinjanmedia.com'),
  title: {
    default: 'Rinjan Media | Website, Desain, Wifi, dan IT Support',
    template: '%s | Rinjan Media',
  },
  description:
    'Rinjan Media melayani pembuatan website, desain grafis, pemasangan wifi, dan IT support untuk bisnis di Tangerang Selatan dan sekitarnya.',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Rinjan Media',
    url: '/',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={poppins.variable}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Lewati ke konten utama
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
