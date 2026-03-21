import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/', '/admin/', '/private/', '/draft/'] },
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'YandexBot', allow: '/' },
      { userAgent: 'YandexImages', allow: '/' },
    ],
    host: 'https://ulti-tools.com',
    sitemap: 'https://ulti-tools.com/sitemap.xml',
  };
}
