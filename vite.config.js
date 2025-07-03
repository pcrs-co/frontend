import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // 👈 This is important for Netlify!
  plugins: [
    tailwindcss(),
    react(),
    svgr(),
    visualizer({
      open: true,
      filename: 'build-stats.html',
    }),
  ],
})
