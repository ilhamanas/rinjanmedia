import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero, Section } from '@/components/sections/Section'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { getServices } from '@/lib/payload'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Layanan Kami',
  description:
    'Empat layanan Rinjan Media: pembuatan website, desain grafis dan percetakan, jaringan internet, serta IT support di Tangerang Selatan.',
}

export default async function LayananPage() {
  const services = await getServices()

  return (
    <>
      <PageHero title="Layanan Kami" breadcrumb="Layanan Kami" />

      <Section
        title="Empat layanan, satu tim"
        lead="Website, desain, jaringan, dan dukungan IT saling berkaitan. Anda bisa ambil satu layanan saja, atau gabungkan sesuai kebutuhan bisnis."
      >
        {services.length === 0 ? (
          <p className="text-center text-sm text-ink-500">
            Belum ada layanan yang terbit. Silakan cek kembali nanti.
          </p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <li key={s.slug} className="flex">
                <article className="flex w-full flex-col rounded-xl border border-brand-100 p-6 lg:p-8">
                  <h2 className="text-lg font-bold text-ink-900 lg:text-xl">{s.title}</h2>
                  <p className="mt-1 text-sm font-medium text-brand-600">{s.headline}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-500">{s.summary}</p>
                  {(s.highlights ?? []).length > 0 && (
                    <ul className="mt-5 space-y-2">
                      {(s.highlights ?? []).slice(0, 3).map((h) => (
                        <li
                          key={h.text}
                          className="flex items-start gap-2 text-sm text-ink-700"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-500"
                          />
                          {h.text}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-6">
                    <ButtonLink href={`/layanan/${s.slug}`} variant="outline">
                      Lihat detail {s.title}
                    </ButtonLink>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section className="bg-brand-50">
        <div className="grid gap-6 rounded-xl border border-brand-100 bg-white p-6 sm:grid-cols-[1fr_auto] sm:items-center lg:p-8">
          <div>
            <h2 className="text-xl font-bold text-ink-900 lg:text-2xl">
              Belum yakin harus mulai dari mana?
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Ceritakan kondisi bisnis Anda. Kami bantu pilih layanan yang paling masuk akal
              untuk tahap sekarang.
            </p>
          </div>
          <ButtonLink href="/kontak" variant="accent" size="lg">
            Konsultasi Gratis
          </ButtonLink>
        </div>
      </Section>

      <Section>
        <p className="text-center text-sm text-ink-500">
          Sedang mencari halaman lain?{' '}
          <Link
            href="/tentang"
            className="font-semibold text-brand-600 underline-offset-4 hover:underline"
          >
            Kenali Rinjan Media lebih dulu
          </Link>
          .
        </p>
      </Section>
    </>
  )
}
