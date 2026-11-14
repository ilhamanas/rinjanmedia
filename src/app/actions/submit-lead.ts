'use server'

import { revalidatePath } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { leadSchema, type LeadInput } from '@/lib/lead'

export type LeadResult = {
  ok: boolean
  message: string
  errors?: Record<string, string>
}

/**
 * Simpan lead ke koleksi `leads`.
 *
 * Koleksi `leads` sengaja menolak `create` dari REST publik
 * (lihat src/collections/Leads.ts), jadi satu-satunya jalan masuk
 * adalah Server Action ini — yang memakai Payload lokal, bukan HTTP.
 */
export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const parsed = leadSchema.safeParse(input)

  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? '')
      if (key && !errors[key]) errors[key] = issue.message
    }
    return { ok: false, message: 'Ada isian yang perlu diperbaiki.', errors }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'leads',
      data: {
        ...parsed.data,
        source: 'kontak',
        status: 'baru',
      },
      // Lewati access control karena ini jalur server yang sudah divalidasi.
      overrideAccess: true,
    })

    revalidatePath('/admin/collections/leads')
    return {
      ok: true,
      message:
        'Pesan Anda sudah kami terima. Tim akan menghubungi Anda pada jam kerja Senin sampai Minggu, 09.00–21.00 WIB.',
    }
  } catch (error) {
    console.error('[submitLead] gagal menyimpan lead:', error)
    return {
      ok: false,
      message:
        'Pesan gagal disimpan karena gangguan di server kami. Silakan hubungi kami lewat WhatsApp atau email.',
    }
  }
}
