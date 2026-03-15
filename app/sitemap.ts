import { MetadataRoute } from 'next';
import { tools, toolGroups } from '@/src/data/tools';
import { articles } from '@/src/data/articles';

const BASE_URL = 'https://ulti-tools.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];

  // Group pages
  const groupPages: MetadataRoute.Sitemap = toolGroups.map(g => ({
    url: `${BASE_URL}/group/${g.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Tool pages
  const toolPages: MetadataRoute.Sitemap = tools.map(t => ({
    url: `${BASE_URL}/tools/${t.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: (t as any).featured ? 1.0 : t.implemented ? 0.9 : 0.6,
  }));

  // Article pages
  const articlePages: MetadataRoute.Sitemap = articles.map(a => ({
    url: `${BASE_URL}/blog/${a.slug}`,
    lastModified: a.date,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...groupPages, ...toolPages, ...articlePages];
}
