import type { Metadata } from 'next'
import { PenLine } from 'lucide-react'
import { PageHero, Section } from '@/components/sections/Section'
import { ButtonLink } from '@/components/ui/ButtonLink'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Catatan dan panduan seputar website, desain, jaringan, dan IT untuk pelaku usaha dari Rinjan Media.',
}

export default function BlogPage() {
  return (
    <>
      <PageHero title="Blog" breadcrumb="Blog" />

      <Section>
        <div className="mx-auto max-w-xl rounded-xl border border-dashed border-brand-300 bg-brand-50 p-8 text-center lg:p-12">
          <PenLine aria-hidden="true" className="mx-auto size-8 text-brand-500" />
          <h2 className="mt-4 text-xl font-bold text-ink-900">Belum ada artikel</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            Arsip tulisan dari situs lama sedang kami rapikan dan tulis ulang. Halaman ini
            akan terisi begitu artikel pertama siap terbit.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">
            Sementara itu, kalau ada pertanyaan teknis soal website, desain, atau jaringan,
            tanyakan langsung saja.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/kontak" variant="accent">
              Tanya lewat form
            </ButtonLink>
            <ButtonLink href="/layanan" variant="outline">
              Lihat layanan
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  )
}
