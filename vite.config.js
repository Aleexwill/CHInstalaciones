import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo.png'],
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
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/logo.png',
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
