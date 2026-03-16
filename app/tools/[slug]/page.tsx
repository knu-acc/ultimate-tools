import { Metadata } from 'next';
import ToolPage from './ToolPage';
import { tools, getToolBySlug, toolGroups } from '@/src/data/tools';

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

  const keywords = [
    ...tool.keywords,
    'онлайн',
    'бесплатно',
    'без регистрации',
    group?.name || '',
    'Ultimate Tools',
  ].filter(Boolean);

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: `${title} | Ultimate Tools`,
      description,
      images: [{ url: 'https://ulti-tools.com/opengraph-image', width: 1200, height: 630 }],
      url: `https://ulti-tools.com/tools/${slug}`,
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
      canonical: `https://ulti-tools.com/tools/${slug}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ToolPage slug={slug} />;
}
