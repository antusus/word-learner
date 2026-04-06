import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
const basePath = '/word-learner/';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        mode: 'development',
      },
      includeAssets: ['favicon.svg', 'icon.svg'],
      manifest: {
        name: 'Word Learner',
        short_name: 'WordLearner',
        description: 'A fun app to help kids learn English words',
        start_url: basePath,
        scope: basePath,
        display: 'standalone',
        background_color: '#f7f8fc',
        theme_color: '#667eea',
        icons: [
          {
            src: `${basePath}icon.svg`,
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: `${basePath}icon.svg`,
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
  base: basePath,
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
