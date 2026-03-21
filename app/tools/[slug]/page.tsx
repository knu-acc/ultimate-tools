import { Metadata } from 'next';
import ToolPage from './ToolPage';
import { tools, getToolBySlug, toolGroups } from '@/src/data/tools';
import { buildKeywordSet, genericSiteKeywords } from '@/src/seo/keywords';

export async function generateStaticParams() {
  return tools.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: 'Инструмент не найден' };
  const group = toolGroups.find(g => g.id === tool.groupId);

  const title = (tool as any).seoTitle || `${tool.name} онлайн — бесплатный инструмент`;
  const description = (tool as any).seoDescription ||
    `${tool.description}. Бесплатно, без регистрации. Работает в браузере. Категория: ${group?.name}. Ultimate Tools — 150+ бесплатных онлайн-утилит.`;

  const keywords = buildKeywordSet(
    [
      ...(tool.keywords || []),
      tool.name,
      `${tool.name} онлайн`,
      `${slug} инструмент`,
      tool.description,
      group?.name || '',
      'онлайн',
      'бесплатно',
      'без регистрации',
      'Ultimate Tools',
    ],
    genericSiteKeywords(false),
    15
  );

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: `${title} | Ultimate Tools`,
      description,
      images: [{ url: 'https://ulti-tools.com/opengraph-image', width: 1200, height: 630 }],
      url: `https://ulti-tools.com/ru/tools/${slug}`,
      type: 'website',
      locale: 'ru_RU',
      siteName: 'Ultimate Tools',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Ultimate Tools`,
      description,
    },
    alternates: {
      canonical: `https://ulti-tools.com/ru/tools/${slug}`,
      languages: {
        'ru': `https://ulti-tools.com/ru/tools/${slug}`,
        'en': `https://ulti-tools.com/en/tools/${slug}`,
        'x-default': `https://ulti-tools.com/ru/tools/${slug}`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ToolPage slug={slug} />;
}
