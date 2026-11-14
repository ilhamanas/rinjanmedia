import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type PageHeroProps = {
  title: string
  breadcrumb: string
  className?: string
}

export function PageHero({ title, breadcrumb, className }: PageHeroProps) {
  return (
    <section className={cn('bg-brand-500 py-14 text-white lg:py-20', className)}>
      <div className="mx-auto max-w-6xl px-4 text-center lg:px-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-brand-50">
          <span>Beranda</span>
          <span aria-hidden="true" className="mx-2">
            /
          </span>
          <span className="text-white">{breadcrumb}</span>
        </p>
      </div>
    </section>
  )
}

type SectionProps = {
  children: ReactNode
  className?: string
  id?: string
  title?: string
  lead?: string
}

export function Section({ children, className, id, title, lead }: SectionProps) {
  return (
    <section id={id} className={cn('py-12 lg:py-16', className)}>
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        {title && (
          <header className="mb-8 lg:mb-12">
            <h2 className="text-center text-xl font-bold text-ink-900 sm:text-2xl lg:text-3xl">
              {title}
            </h2>
            {lead && (
              <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-ink-500 lg:text-base">
                {lead}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
