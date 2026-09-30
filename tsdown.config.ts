import { defineConfig } from 'vite-plus/pack'

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm', 'cjs'],
  platform: 'neutral',
  sourcemap: true,
})
