import type { Metadata } from 'next'
import { CheckCircle2 } from 'lucide-react'
import { PageHero, Section } from '@/components/sections/Section'
import { ButtonLink } from '@/components/ui/ButtonLink'

export const metadata: Metadata = {
  title: 'Tentang Rinjan',
  description:
    'Rinjan Media adalah badan usaha perorangan yang dibangun dari kolaborasi bisnis pemuda kreatif sejak 2018 di Tangerang Selatan.',
}

const misi = [
  'Memberikan edukasi kepada masyarakat tentang sistem digital.',
  'Menjadi mitra bisnis yang andal demi membangun bersama pelaku bisnis.',
  'Meningkatkan pengetahuan dan keterampilan dalam bidang teknologi informasi dan komunikasi kepada masyarakat.',
]

export default function TentangPage() {
  return (
    <>
      <PageHero title="Tentang Rinjan" breadcrumb="Tentang Rinjan" />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              Tentang Kami
            </p>
            <h2 className="mt-2 text-2xl font-bold text-ink-900 lg:text-3xl">Rinjan Media</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-700 lg:text-base">
              <p>
                Rinjan Media merupakan badan usaha perorangan yang dibangun dari
                kolaborasi-kolaborasi bisnis pemuda kreatif sejak tahun 2018. Kami
                dibentuk oleh pemuda dari organisasi Remaja Islam Nurul Jannah
                (Rinjan) yang melihat kreativitas dan potensi dalam peluang bisnis
                digital.
              </p>
              <p>
                Dari situ kami membangun Rinjan Media untuk mewujudkan sebuah impian
                menjadi kenyataan: membantu pelaku usaha kecil dan menengah masuk
                ke ranah digital tanpa harus menguasai teknisnya sendiri.
              </p>
            </div>
          </div>

          <aside className="rounded-xl border border-brand-100 bg-brand-50 p-6">
            <h3 className="text-base font-bold text-ink-900">Sekilas</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-ink-500">Berdiri</dt>
                <dd className="font-semibold text-ink-900">2018</dd>
              </div>
              <div>
                <dt className="text-ink-500">Bentuk usaha</dt>
                <dd className="font-semibold text-ink-900">Badan usaha perorangan</dd>
              </div>
              <div>
                <dt className="text-ink-500">Basis</dt>
                <dd className="font-semibold text-ink-900">Serpong, Tangerang Selatan</dd>
              </div>
              <div>
                <dt className="text-ink-500">Lini layanan</dt>
                <dd className="font-semibold text-ink-900">Website, desain, wifi, IT support</dd>
              </div>
            </dl>
          </aside>
        </div>
      </Section>

      <Section className="bg-brand-50">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-ink-900 lg:text-3xl">Visi</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700 lg:text-base">
              Menjadi platform bisnis digital terkemuka di Indonesia.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink-900 lg:text-3xl">Misi</h2>
            <ul className="mt-3 space-y-3">
              {misi.map((m) => (
                <li key={m} className="flex items-start gap-2.5 text-sm text-ink-700 lg:text-base">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-500" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 rounded-xl border border-brand-100 p-6 sm:grid-cols-[1fr_auto] sm:items-center lg:p-8">
          <div>
            <h2 className="text-xl font-bold text-ink-900 lg:text-2xl">
              Ingin berdiskusi lebih jauh?
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Kami terbuka untuk pertanyaan seputar layanan maupun kerja sama.
            </p>
          </div>
          <ButtonLink href="/kontak" variant="accent" size="lg">
            Hubungi Kami
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}
