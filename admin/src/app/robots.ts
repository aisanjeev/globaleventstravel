import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isIndexable = process.env.NEXT_PUBLIC_ROBOTS === 'index,follow';

  if (isIndexable) {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
      },
    };
  }

  // Staging / local: block all crawlers
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}
