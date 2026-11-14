import React from 'react'

/**
 * Mark Rinjan untuk ikon kecil di breadcrumb panel admin.
 *
 * Dipakai di slot 16-18px, jadi hanya bagian mark (tanpa wordmark) yang masuk
 * akal di ukuran itu. Berkasnya `icon-rinjan.png`, mark resmi yang sama.
 */
export function BrandIcon() {
  return (
    <img
      alt=""
      aria-hidden="true"
      className="rinjan-mark"
      height={18}
      src="/icon-rinjan.png"
      width={19}
    />
  )
}

export default BrandIcon
