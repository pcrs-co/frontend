import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  // All plugins go inside this single array
  plugins: [
    tailwindcss(),
    react(),
    svgr(),
    visualizer({
      open: true, // Opens the report in your browser after a build
      filename: 'build-stats.html', // Optional: give the report a clear name
    }),
  ],
})