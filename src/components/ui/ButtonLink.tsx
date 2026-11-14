import Link from 'next/link'
import { cn } from '@/lib/utils'

type ButtonProps = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'accent' | 'outline'
  size?: 'md' | 'lg'
  className?: string
  external?: boolean
}

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className,
  external,
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-lg font-semibold transition-colors',
    size === 'md' ? 'px-5 py-2.5 text-sm' : 'px-6 py-3 text-base',
    variant === 'primary' && 'bg-brand-500 text-white hover:bg-brand-600',
    variant === 'accent' && 'bg-accent-600 text-white hover:bg-accent-700',
    variant === 'outline' && 'border border-brand-500 text-brand-600 hover:bg-brand-50',
    className
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}
