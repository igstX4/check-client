import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Автоматическое обновление сервис-воркера
      manifest: {
        name: 'Check Platform',
        short_name: 'Check Platform',
        description: 'Check Platform',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [

          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          
        ],
      },
    }),
  ],
});