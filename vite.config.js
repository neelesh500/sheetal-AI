import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Vercel aur GitHub Pages dono ke liye relative asset paths ensure karega
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer-motion';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            if (id.includes('react-router-dom') || id.includes('@remix-run')) {
              return 'vendor-router';
            }
            return 'vendor'; // Baki saare bache hue npm packages ke liye
          }
        }
      }
    },
    chunkSizeWarningLimit: 600, // Bundle size warning limit 500kb se increase karke 600kb kar diya hai
  }
})
