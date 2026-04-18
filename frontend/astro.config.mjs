import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

const API_BASE = process.env.PUBLIC_API_BASE_URL || 'http://localhost:8000';

async function fetchSlugs(path) {
  try {
    const res = await fetch(`${API_BASE}/api/v1${path}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || data || []).map((item) => item.slug).filter(Boolean);
  } catch {
    return [];
  }
}

const [blogSlugs, trekSlugs, expeditionSlugs] = await Promise.all([
  fetchSlugs('/blog/posts?limit=500&status=published'),
  fetchSlugs('/treks?limit=500&status=published'),
  fetchSlugs('/expeditions?limit=500&status=published'),
]);

const dynamicPages = [
  ...blogSlugs.map((s) => `https://globaleventstravels.com/blog/${s}/`),
  ...trekSlugs.map((s) => `https://globaleventstravels.com/treks/${s}/`),
  ...expeditionSlugs.map((s) => `https://globaleventstravels.com/expeditions/${s}/`),
];

export default defineConfig({
  site: 'https://globaleventstravels.com',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap({
      customPages: dynamicPages,
    }),
  ],
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  vite: {
    define: {
      __API_BASE_URL__: JSON.stringify(
        process.env.PUBLIC_API_BASE_URL || 'http://localhost:8000'
      ),
    },
  },
});

