import next from 'eslint-config-next'
import nextTs from 'eslint-config-next/typescript'

const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      '.dev/**',
      '.verify/**',
      'media/**',
      'next-env.d.ts',
      'src/app/(payload)/admin/importMap.js',
    ],
  },
  ...next,
  ...nextTs,
]

export default config
