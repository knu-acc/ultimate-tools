import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] },
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'YandexBot', allow: '/' },
      { userAgent: 'YandexImages', allow: '/' },
    ],
    sitemap: 'https://utools.app/sitemap.xml',
  };
}
