import { z } from 'zod'

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nama minimal 2 karakter.')
    .max(80, 'Nama maksimal 80 karakter.'),
  email: z.string().trim().email('Format email belum benar.'),
  phone: z
    .string()
    .trim()
    .min(9, 'Nomor WhatsApp minimal 9 digit.')
    .max(20, 'Nomor WhatsApp maksimal 20 digit.')
    .regex(/^[0-9+\-\s()]+$/, 'Nomor WhatsApp hanya boleh berisi angka dan tanda +, -, spasi.'),
  service: z.string().trim().min(1, 'Pilih layanan yang Anda minati.'),
  message: z
    .string()
    .trim()
    .min(10, 'Ceritakan kebutuhan Anda minimal 10 karakter.')
    .max(1000, 'Pesan maksimal 1000 karakter.'),
})

export type LeadInput = z.infer<typeof leadSchema>

export type LeadState = {
  status: 'idle' | 'invalid' | 'ready'
  errors: Record<string, string>
  values: LeadInput
  /** Tautan WhatsApp berisi pesan yang sudah terisi, dibuat setelah validasi lolos. */
  waUrl?: string
}

export const emptyLead: LeadInput = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
}

export function buildWhatsAppUrl(input: LeadInput) {
  const lines = [
    'Halo Rinjan Media, saya ingin bertanya.',
    '',
    `Nama: ${input.name}`,
    `Email: ${input.email}`,
    `WhatsApp: ${input.phone}`,
    `Layanan: ${input.service}`,
    '',
    input.message,
  ]
  return `https://wa.me/6289501100696?text=${encodeURIComponent(lines.join('\n'))}`
}
