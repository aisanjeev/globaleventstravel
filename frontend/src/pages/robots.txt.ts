import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const isIndexable = import.meta.env.PUBLIC_ROBOTS === 'index,follow';

  const content = isIndexable
    ? // Production: allow all crawlers
      `User-agent: *
Allow: /

Sitemap: ${import.meta.env.PUBLIC_SITE_URL || 'https://globaleventstravels.com'}/sitemap-index.xml
`
    : // Staging / local: block all crawlers
      `User-agent: *
Disallow: /
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
