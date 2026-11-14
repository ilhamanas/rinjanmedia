import React from 'react'

/**
 * Logo Rinjan untuk halaman login panel admin.
 *
 * Memakai dua berkas PNG, bukan satu: wordmark di logo resmi berwarna hitam
 * pekat dan tidak terbaca di permukaan gelap. `logo-rinjan-dark.png` adalah
 * turunan yang sama persis, hanya wordmark-nya dijadikan putih (bagian mark
 * berwarna tidak diubah). Mana yang tampil diatur CSS lewat `data-theme`.
 *
 * Dimensi intrinsik ditulis eksplisit supaya tidak ada pergeseran layout saat
 * gambar selesai dimuat (R-40).
 */
export function BrandLogo() {
  return (
    <>
      <img
        alt="Rinjan Media"
        className="rinjan-logo rinjan-logo--light"
        height={34}
        src="/logo-rinjan.png"
        width={166}
      />
      <img
        alt="Rinjan Media"
        className="rinjan-logo rinjan-logo--dark"
        height={34}
        src="/logo-rinjan-dark.png"
        width={166}
      />
    </>
  )
}

export default BrandLogo
