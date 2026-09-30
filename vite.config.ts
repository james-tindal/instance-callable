import { defineConfig } from 'vite-plus'

import lint from './oxlint.config'
import pack from './tsdown.config'

export default defineConfig({
  check: { fmt: false },
  lint,
  pack,
  test: {
    include: ['src/**/*.test.ts'],
  },
})
