import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, CheckCircle2, Phone } from 'lucide-react'
import { PageHero, Section } from '@/components/sections/Section'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { getServiceBySlug, getServices } from '@/lib/payload'
import { site } from '@/lib/site'

type Params = { params: Promise<{ slug: string }> }

export const revalidate = 60

export async function generateStaticParams() {
  const services = await getServices()
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return { title: 'Layanan tidak ditemukan' }

  return {
    title: service.seo?.title || service.title,
    description: service.seo?.description || service.summary,
    alternates: { canonical: `/layanan/${service.slug}` },
    robots: service.seo?.noindex ? { index: false, follow: false } : undefined,
  }
}

const listText = (items?: { text: string }[] | null) =>
  (items ?? []).map((i) => i.text).filter(Boolean)

export default async function LayananDetailPage({ params }: Params) {
  const { slug } = await params
  const [service, allServices] = await Promise.all([getServiceBySlug(slug), getServices()])
  if (!service) notFound()

  const others = allServices.filter((s) => s.slug !== service.slug)
  const highlights = listText(service.highlights)
  const packages = service.packages ?? []
  const extras = service.extras

  return (
    <>
      <PageHero title={service.title} breadcrumb={service.title} />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <h2 className="text-2xl font-bold leading-snug text-ink-900 lg:text-3xl">
              {service.headline}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-700 lg:text-base">
              {service.intro}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/kontak" variant="accent">
                Konsultasi Gratis
              </ButtonLink>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-brand-300 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
              >
                <Phone aria-hidden="true" className="size-4" />
                WhatsApp
              </a>
            </div>
          </div>

          {highlights.length > 0 && (
            <aside className="rounded-xl border border-brand-100 bg-brand-50 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-700">
                Yang Anda dapat
              </h2>
              <ul className="mt-4 space-y-3">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-ink-700">
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-brand-500"
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </Section>

      {packages.length > 0 && (
        <Section className="bg-brand-50" title="Paket dan harga">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((p) => (
              <li key={p.name} className="flex">
                <article
                  className={
                    p.featured
                      ? 'flex w-full flex-col rounded-xl border-2 border-brand-500 bg-white p-6'
                      : 'flex w-full flex-col rounded-xl border border-brand-100 bg-white p-6'
                  }
                >
                  {p.featured && (
                    <span className="mb-3 inline-block w-fit rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white">
                      Populer
                    </span>
                  )}
                  <h3 className="text-base font-bold text-ink-900">{p.name}</h3>
                  <p className="mt-2 text-xl font-bold text-brand-700">
                    {p.price}
                    {p.unit && (
                      <span className="text-sm font-medium text-ink-500">{p.unit}</span>
                    )}
                  </p>
                  {p.note && <p className="mt-2 text-sm text-ink-500">{p.note}</p>}
                  <ul className="mt-4 flex-1 space-y-2">
                    {listText(p.features).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-ink-700">
                        <Check
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0 text-brand-500"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5">
                    <ButtonLink
                      href="/kontak"
                      variant={p.featured ? 'accent' : 'outline'}
                      className="w-full"
                    >
                      Pesan Sekarang
                    </ButtonLink>
                  </div>
                </article>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-xs text-ink-500">
            Harga di atas mengikuti daftar harga yang berlaku saat halaman ini diperbarui.
            Konfirmasi harga terbaru lewat form kontak sebelum memesan.
          </p>
        </Section>
      )}

      {extras?.title && (
        <Section>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold text-ink-900 lg:text-2xl">{extras.title}</h2>
            {extras.body && (
              <p className="mt-3 text-sm leading-relaxed text-ink-700 lg:text-base">
                {extras.body}
              </p>
            )}
            {listText(extras.items).length > 0 && (
              <ul className="mt-5 space-y-2.5 border-t border-brand-100 pt-5">
                {listText(extras.items).map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-ink-700">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-500"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {service.closing && (
              <p className="mt-5 text-sm leading-relaxed text-ink-500">{service.closing}</p>
            )}
          </div>
        </Section>
      )}

      <Section className="bg-ink-900 text-white">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-2xl font-bold lg:text-3xl">Tertarik dengan {service.title}?</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-100 lg:text-base">
              Konsultasi awal gratis. Kami bantu hitung kebutuhan dan estimasi biaya sebelum
              Anda memutuskan.
            </p>
          </div>
          <ButtonLink href="/kontak" variant="accent" size="lg">
            Hubungi Kami
          </ButtonLink>
        </div>
      </Section>

      {others.length > 0 && (
        <Section title="Layanan lainnya">
          <ul className="grid gap-5 sm:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug} className="flex">
                <Link
                  href={`/layanan/${o.slug}`}
                  className="group flex w-full flex-col rounded-xl border border-brand-100 p-6 transition-colors hover:border-brand-400"
                >
                  <h3 className="text-base font-bold text-ink-900 group-hover:text-brand-600">
                    {o.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{o.summary}</p>
                  <span className="mt-4 text-sm font-semibold text-brand-600">Selengkapnya</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  )
}
