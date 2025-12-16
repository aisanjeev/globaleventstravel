import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://globaleventstravels.com',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap(),
  ],
  output: 'static',
  vite: {
    define: {
      __API_BASE_URL__: JSON.stringify(
        process.env.PUBLIC_API_BASE_URL || 'http://localhost:8000'
      ),
    },
  },
});

