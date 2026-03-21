import { Metadata } from 'next';
import ToolPage from '@/app/tools/[slug]/ToolPage';
import { tools, getToolBySlug, toolGroups } from '@/src/data/tools';
import { LOCALES } from '@/src/i18n/index';
import { buildKeywordSet, genericSiteKeywords } from '@/src/seo/keywords';

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of LOCALES) {
    for (const t of tools) {
      params.push({ locale, slug: t.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: locale === 'en' ? 'Tool not found' : 'Инструмент не найден' };
  const group = toolGroups.find(g => g.id === tool.groupId);
  const isEn = locale === 'en';
  const BASE = 'https://ulti-tools.com';

  const title = isEn
    ? (tool as any).seoTitleEn || `${(tool as any).nameEn || tool.name} Online — Free Tool`
    : (tool as any).seoTitle || `${tool.name} онлайн — бесплатный инструмент`;

  const description = isEn
    ? (tool as any).seoDescriptionEn || `${(tool as any).descriptionEn || tool.description}. Free, no registration. Works in your browser.`
    : (tool as any).seoDescription || `${tool.description}. Бесплатно, без регистрации. Работает в браузере.`;

  return {
    title,
    description,
    keywords: buildKeywordSet(
      [
        ...(tool.keywords || []),
        isEn ? ((tool as any).nameEn || tool.name) : tool.name,
        `${isEn ? ((tool as any).nameEn || tool.name) : tool.name} ${isEn ? 'online' : 'онлайн'}`,
        `${slug} ${isEn ? 'tool' : 'инструмент'}`,
        isEn ? 'online tool' : 'онлайн инструмент',
        isEn ? 'free web app' : 'бесплатный веб инструмент',
        isEn ? ((tool as any).descriptionEn || tool.description) : tool.description,
        isEn ? ((group as any)?.nameEn || group?.name || '') : (group?.name || ''),
        'Ultimate Tools',
      ],
      genericSiteKeywords(isEn),
      15
    ),
    openGraph: {
      title: `${title} | Ultimate Tools`,
      description,
      images: [{ url: 'https://ulti-tools.com/opengraph-image', width: 1200, height: 630 }],
      url: `${BASE}/${locale}/tools/${slug}`,
      type: 'website',
      locale: isEn ? 'en_US' : 'ru_RU',
      siteName: 'Ultimate Tools',
    },
    twitter: { card: 'summary_large_image', title: `${title} | Ultimate Tools`, description },
    alternates: {
      canonical: `${BASE}/${locale}/tools/${slug}`,
      languages: {
        'ru': `${BASE}/ru/tools/${slug}`,
        'en': `${BASE}/en/tools/${slug}`,
        'x-default': `${BASE}/ru/tools/${slug}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
    other: {
      'og:locale:alternate': isEn ? 'ru_RU' : 'en_US',
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  return <ToolPage slug={slug} />;
}
