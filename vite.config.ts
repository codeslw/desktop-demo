import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  },
  build: {
    sourcemap: true,
    // assetsDir: 'src/assets',
    minify: 'esbuild'
  },
  assetsInclude : ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif", "**/*.svg", "**/*.webp"]
})