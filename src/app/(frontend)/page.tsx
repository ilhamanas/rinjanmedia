import Link from 'next/link'
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Section } from '@/components/sections/Section'
import { getServices } from '@/lib/payload'
import { faqs } from '@/lib/content'
import { site } from '@/lib/site'

export const revalidate = 60

const alasan = [
  'Layanan garansi selamanya',
  'Tersedia pilihan premium template',
  'Gratis setting email bisnis',
  'Domain dan hosting murah dan berkualitas',
  'Full akses pengelolaan website',
  'Dikerjakan oleh tim IT yang kompeten',
]

export default async function HomePage() {
  const services = await getServices()

  return (
    <>
      <section className="bg-brand-500 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 lg:px-6 lg:py-20">
          <div>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Raih peluang bisnis Anda bersama kami
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-50 lg:text-lg">
              Bisnis jauh lebih mudah dengan tim profesional yang berpengalaman. Yuk bangun
              bisnismu sekarang.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/kontak" variant="accent" size="lg">
                Mulai Sekarang
              </ButtonLink>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/60 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                Tanya lewat WhatsApp
              </a>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-2 gap-6 border-t border-white/25 pt-6 text-sm">
              <div>
                <dt className="text-brand-100">Berdiri sejak</dt>
                <dd className="mt-1 text-lg font-semibold">2018</dd>
              </div>
              <div>
                <dt className="text-brand-100">Domisili</dt>
                <dd className="mt-1 text-lg font-semibold">Tangerang Selatan</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/20 lg:p-8">
            <h2 className="text-lg font-semibold">Empat layanan, satu tim</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/layanan/${s.slug}`}
                    className="flex items-start gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/10"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sun-400"
                    />
                    <span>
                      <span className="font-semibold text-white">{s.title}</span>
                      <span className="block text-brand-100">{s.headline}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Section
        id="layanan"
        title="Temukan bisnis Anda"
        lead="Pilih layanan yang paling dekat dengan kebutuhan bisnis Anda sekarang."
      >
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <li key={s.slug} className="flex">
              <Link
                href={`/layanan/${s.slug}`}
                className="group flex w-full flex-col rounded-xl border border-brand-100 bg-white p-6 transition-colors hover:border-brand-400"
              >
                <h3 className="text-base font-bold text-ink-900 group-hover:text-brand-600">
                  {s.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-500">{s.summary}</p>
                <span className="mt-5 text-sm font-semibold text-brand-600">Selengkapnya</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="bg-brand-50" title="Mengapa harus Rinjan Media?">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <p className="text-base leading-relaxed text-ink-700">
            Kami menangani pembuatan website, desain, jaringan, dan dukungan IT dengan satu tim.
            Anda tidak perlu mengoordinasi beberapa vendor untuk kebutuhan digital yang saling
            berkaitan.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {alasan.map((a) => (
              <li key={a} className="flex items-start gap-2.5 text-sm text-ink-700">
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-brand-500"
                />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="Pertanyaan yang sering diajukan">
        <div className="mx-auto max-w-3xl divide-y divide-brand-100 border-y border-brand-100">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-left text-sm font-semibold text-ink-900 lg:text-base">
                {f.q}
                <span
                  aria-hidden="true"
                  className="text-brand-500 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section className="bg-ink-900 text-white">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-2xl font-bold lg:text-3xl">Ceritakan kebutuhan bisnis Anda</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-100 lg:text-base">
              Konsultasi awal gratis. Kami bantu tentukan layanan yang paling masuk akal untuk
              tahap bisnis Anda sekarang.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-brand-100">
              <li className="flex items-center gap-2.5">
                <Phone aria-hidden="true" className="size-4" />
                <a href={site.phoneHref} className="hover:text-white">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail aria-hidden="true" className="size-4" />
                <a href={`mailto:${site.email}`} className="hover:text-white">
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <span>{site.address}</span>
              </li>
            </ul>
          </div>
          <ButtonLink href="/kontak" variant="accent" size="lg">
            Minta Penawaran
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}
