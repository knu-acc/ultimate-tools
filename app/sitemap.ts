import { MetadataRoute } from 'next';
import { tools, toolGroups } from '@/src/data/tools';
import { articles } from '@/src/data/articles';

const BASE_URL = 'https://ulti-tools.com';
const LOCALES = ['ru', 'en'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const entries: MetadataRoute.Sitemap = [];
  const implementedTools = tools.filter(t => t.implemented);

  for (const locale of LOCALES) {
    const localeAlternates = { ru: `${BASE_URL}/ru`, en: `${BASE_URL}/en`, 'x-default': `${BASE_URL}/ru` };

    // Home
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: localeAlternates,
      },
    });

    // Blog index
    entries.push({
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: { ru: `${BASE_URL}/ru/blog`, en: `${BASE_URL}/en/blog`, 'x-default': `${BASE_URL}/ru/blog` },
      },
    });

    // Group pages
    for (const g of toolGroups) {
      entries.push({
        url: `${BASE_URL}/${locale}/group/${g.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            ru: `${BASE_URL}/ru/group/${g.slug}`,
            en: `${BASE_URL}/en/group/${g.slug}`,
            'x-default': `${BASE_URL}/ru/group/${g.slug}`,
          },
        },
      });
    }

    // Tool pages
    for (const t of implementedTools) {
      entries.push({
        url: `${BASE_URL}/${locale}/tools/${t.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: (t as any).featured ? 1.0 : 0.9,
        alternates: {
          languages: {
            ru: `${BASE_URL}/ru/tools/${t.slug}`,
            en: `${BASE_URL}/en/tools/${t.slug}`,
            'x-default': `${BASE_URL}/ru/tools/${t.slug}`,
          },
        },
      });
    }

    // Article pages
    for (const a of articles) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${a.slug}`,
        lastModified: a.date,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            ru: `${BASE_URL}/ru/blog/${a.slug}`,
            en: `${BASE_URL}/en/blog/${a.slug}`,
            'x-default': `${BASE_URL}/ru/blog/${a.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
