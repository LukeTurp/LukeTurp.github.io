import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  base: '/',
  build: {
    // GitHub Pages serves main → /docs. Files in public/ (_config.yml, .well-known, robots.txt) are copied in.
    outDir: 'docs',
    emptyOutDir: true,
  },
  plugins: [react(), legacy({ modernPolyfills: true, renderLegacyChunks: false })],
})
