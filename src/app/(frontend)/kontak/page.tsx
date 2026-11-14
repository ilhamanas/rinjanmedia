import type { Metadata } from 'next'
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { PageHero, Section } from '@/components/sections/Section'
import { ContactForm } from '@/components/sections/ContactForm'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Kontak Kami',
  description:
    'Hubungi Rinjan Media lewat WhatsApp, email, atau form kontak. Kantor di Serpong, Tangerang Selatan. Jam operasional Senin–Minggu 09.00–21.00 WIB.',
}

export default function KontakPage() {
  return (
    <>
      <PageHero title="Kontak Kami" breadcrumb="Kontak Kami" />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className="text-2xl font-bold text-ink-900 lg:text-3xl">
              Ingin terhubung dengan kami?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-700 lg:text-base">
              Punya pertanyaan tentang layanan, butuh bantuan teknis, atau ingin penawaran
              khusus? Isi form di bawah dan kami balas pada jam operasional.
            </p>

            <h3 className="mt-10 text-lg font-bold text-ink-900">Tinggalkan pesan</h3>
            <div className="mt-4">
              <ContactForm />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-ink-900 lg:text-3xl">
              Head Office Tangerang Selatan
            </h2>

            <div className="mt-5 overflow-hidden rounded-xl border border-brand-100">
              <iframe
                src={site.mapsEmbed}
                title="Peta lokasi Rinjan Media di Serpong, Tangerang Selatan"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full border-0 lg:h-72"
              />
            </div>

            <dl className="mt-8 space-y-6">
              <div className="flex gap-4">
                <Phone aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-ink-900" />
                <div>
                  <dt className="text-sm font-semibold text-ink-900">Telepon</dt>
                  <dd className="mt-1 text-sm text-ink-700">
                    <a href={site.phoneHref} className="hover:text-brand-600">
                      {site.phone}
                    </a>
                    <span className="block text-xs text-ink-500">WhatsApp only</span>
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-ink-900" />
                <div>
                  <dt className="text-sm font-semibold text-ink-900">Alamat</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink-700">{site.address}</dd>
                  <dd className="mt-2">
                    <a
                      href={site.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-brand-600 underline-offset-4 hover:underline"
                    >
                      Buka di Google Maps
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-ink-900" />
                <div>
                  <dt className="text-sm font-semibold text-ink-900">Email</dt>
                  <dd className="mt-1 break-all text-sm text-ink-700">
                    <a href={`mailto:${site.email}`} className="hover:text-brand-600">
                      {site.email}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-ink-900" />
                <div>
                  <dt className="text-sm font-semibold text-ink-900">Jam operasional</dt>
                  <dd className="mt-1 text-sm text-ink-700">
                    {site.hours}
                    <span className="block text-xs text-ink-500">
                      Termasuk hari libur nasional
                    </span>
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <MessageCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-ink-900" />
                <div>
                  <dt className="text-sm font-semibold text-ink-900">WhatsApp</dt>
                  <dd className="mt-1 text-sm text-ink-700">
                    <a
                      href={site.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-brand-600 underline-offset-4 hover:underline"
                    >
                      Chat langsung
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </Section>
    </>
  )
}
