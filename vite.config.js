import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Firebase en chunk separado → se cachea independiente del código de la app
        manualChunks(id) {
          if (id.includes('/node_modules/firebase/')) return 'firebase'
          if (id.includes('/node_modules/react') || id.includes('/node_modules/react-dom')) return 'react-vendor'
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo.png', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
      },
      manifest: {
        name: 'CH Instalaciones Eléctricas',
        short_name: 'CH Instalaciones',
        description: 'Panel de administración — CH Instalaciones Eléctricas',
        theme_color: '#fbbf24',
        background_color: '#020617',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/admin',
        scope: '/',
        lang: 'es',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Trabajos',
            url: '/admin#admin/trabajos',
            description: 'Registrar un trabajo',
          },
          {
            name: 'Marcación',
            url: '/admin#admin/marcacion',
            description: 'Control de asistencia',
          },
        ],
      },
    }),
  ],
})
