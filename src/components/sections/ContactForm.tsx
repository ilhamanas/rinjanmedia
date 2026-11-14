'use client'

import { useId, useRef, useState, useTransition } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react'
import { submitLead } from '@/app/actions/submit-lead'
import { buildWhatsAppUrl, emptyLead, leadSchema, type LeadInput } from '@/lib/lead'
import { cn } from '@/lib/utils'

const layananOptions = [
  'Rinjan Website',
  'Rinjan Desain',
  'Wifi Rinjan',
  'Rinjan IT Support',
  'Lainnya',
]

const fieldBase =
  'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200'

type Status =
  | { kind: 'idle' }
  | { kind: 'invalid'; errors: Record<string, string> }
  | { kind: 'saved'; message: string; submitted: LeadInput }
  | { kind: 'failed'; message: string }

export function ContactForm() {
  const id = useId()
  const [values, setValues] = useState<LeadInput>(emptyLead)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [isPending, startTransition] = useTransition()
  const feedbackRef = useRef<HTMLDivElement>(null)

  const errors = status.kind === 'invalid' ? status.errors : {}

  function setField<K extends keyof LeadInput>(key: K, value: LeadInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (status.kind === 'invalid') {
      setStatus({ kind: 'invalid', errors: { ...status.errors, [key]: '' } })
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    // Honeypot: hanya bot yang mengisi field tersembunyi ini.
    if (String(formData.get('website') ?? '').trim() !== '') return

    // Validasi di klien supaya umpan balik instan.
    const parsed = leadSchema.safeParse(values)
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? '')
        if (key && !nextErrors[key]) nextErrors[key] = issue.message
      }
      setStatus({ kind: 'invalid', errors: nextErrors })
      requestAnimationFrame(() => feedbackRef.current?.focus())
      return
    }

    startTransition(async () => {
      const result = await submitLead(parsed.data)
      if (result.ok) {
        setStatus({ kind: 'saved', message: result.message, submitted: parsed.data })
        setValues(emptyLead)
      } else if (result.errors) {
        setStatus({ kind: 'invalid', errors: result.errors })
      } else {
        setStatus({ kind: 'failed', message: result.message })
      }
      requestAnimationFrame(() => feedbackRef.current?.focus())
    })
  }

  if (status.kind === 'saved') {
    return (
      <div
        ref={feedbackRef}
        tabIndex={-1}
        role="status"
        className="rounded-xl border border-brand-200 bg-brand-50 p-6"
      >
        <CheckCircle2 aria-hidden="true" className="size-6 text-brand-600" />
        <h3 className="mt-3 text-base font-bold text-ink-900">Pesan terkirim</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">{status.message}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={buildWhatsAppUrl(status.submitted)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-brand-300 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-white"
          >
            <Send aria-hidden="true" className="size-4" />
            Lanjut di WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setStatus({ kind: 'idle' })}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-ink-700 underline underline-offset-4 hover:text-brand-700"
          >
            Kirim pesan lain
          </button>
        </div>
      </div>
    )
  }

  const errorList = Object.entries(errors).filter(([, message]) => Boolean(message))

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {status.kind === 'failed' && (
        <div
          ref={feedbackRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border border-accent-500/40 bg-accent-500/5 p-4"
        >
          <p className="flex items-start gap-2 text-sm font-semibold text-accent-700">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {status.message}
          </p>
        </div>
      )}

      {errorList.length > 0 && (
        <div
          ref={feedbackRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border border-accent-500/40 bg-accent-500/5 p-4"
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-accent-700">
            <AlertCircle aria-hidden="true" className="size-4" />
            {errorList.length === 1
              ? 'Ada satu isian yang perlu diperbaiki.'
              : `Ada ${errorList.length} isian yang perlu diperbaiki.`}
          </p>
          <ul className="mt-2 space-y-1 pl-6 text-sm text-ink-700">
            {errorList.map(([key, message]) => (
              <li key={key} className="list-disc">
                <a href={`#${id}-${key}`} className="underline underline-offset-2">
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id={`${id}-name`}
          label="Nama"
          required
          error={errors.name}
          hint="Nama Anda atau nama bisnis."
        >
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={`${id}-name-desc`}
            className={cn(fieldBase, errors.name ? 'border-accent-500' : 'border-brand-200')}
            placeholder="Nama lengkap"
          />
        </Field>

        <Field
          id={`${id}-phone`}
          label="Nomor WhatsApp"
          required
          error={errors.phone}
          hint="Contoh: 0895 0110 0696."
        >
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => setField('phone', e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={`${id}-phone-desc`}
            className={cn(fieldBase, errors.phone ? 'border-accent-500' : 'border-brand-200')}
            placeholder="08xx xxxx xxxx"
          />
        </Field>
      </div>

      <Field
        id={`${id}-email`}
        label="Email"
        required
        error={errors.email}
        hint="Kami pakai untuk mengirim penawaran tertulis."
      >
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => setField('email', e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={`${id}-email-desc`}
          className={cn(fieldBase, errors.email ? 'border-accent-500' : 'border-brand-200')}
          placeholder="nama@bisnis.com"
        />
      </Field>

      <Field
        id={`${id}-service`}
        label="Layanan yang diminati"
        required
        error={errors.service}
      >
        <select
          id={`${id}-service`}
          name="service"
          value={values.service}
          onChange={(e) => setField('service', e.target.value)}
          aria-invalid={Boolean(errors.service)}
          aria-describedby={`${id}-service-desc`}
          className={cn(
            fieldBase,
            errors.service ? 'border-accent-500' : 'border-brand-200',
            !values.service && 'text-ink-300'
          )}
        >
          <option value="">Pilih layanan</option>
          {layananOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id={`${id}-message`}
        label="Pesan"
        required
        error={errors.message}
        hint={`${values.message.length}/1000 karakter.`}
      >
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          value={values.message}
          onChange={(e) => setField('message', e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={`${id}-message-desc`}
          className={cn(
            fieldBase,
            'resize-y',
            errors.message ? 'border-accent-500' : 'border-brand-200'
          )}
          placeholder="Ceritakan kebutuhan Anda, misalnya jenis usaha dan target waktu."
        />
      </Field>

      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${id}-website`}>Jangan diisi</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isPending ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              Mengirim…
            </>
          ) : (
            <>
              <Send aria-hidden="true" className="size-4" />
              Kirim Pesan
            </>
          )}
        </button>
        <p className="mt-3 text-xs leading-relaxed text-ink-500">
          Data hanya dipakai untuk membalas pertanyaan Anda.
        </p>
      </div>
    </form>
  )
}

type FieldProps = {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}

function Field({ id, label, required, error, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-900">
        {label}
        {required && (
          <span className="ml-1 text-accent-600" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (wajib diisi)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-desc`} className="mt-1.5 text-xs font-medium text-accent-700">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-desc`} className="mt-1.5 text-xs text-ink-500">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
