
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      manifest: {
        name: 'Идеальный день',
        short_name: 'Идеальный день',
        description: 'Планируй день в ритме своей энергии',
        theme_color: '#F6F8FA',
        background_color: '#F6F8FA',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        lang: 'ru',

        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
