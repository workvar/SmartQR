import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_DOMAIN || 'https://qrry.studio';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/create/',
          '/api/',
          '/login',
          '/auth/',
          '/test-db/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard',
          '/create/',
          '/api/',
          '/login',
          '/auth/',
          '/test-db/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
