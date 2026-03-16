import { Metadata } from 'next';
import GroupPage from './GroupPage';
import { toolGroups, getToolsByGroup, getGroupBySlug } from '@/src/data/tools';

export async function generateStaticParams() {
  return toolGroups.map(g => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const group = getGroupBySlug(slug);
  if (!group) return { title: 'Категория не найдена' };
  const groupTools = getToolsByGroup(group.id);
  const toolNames = groupTools.slice(0, 5).map(t => t.name).join(', ');
  const allKeywords = [...new Set(groupTools.flatMap(t => t.keywords))].slice(0, 15);

  const title = `${group.name} онлайн — ${groupTools.length} бесплатных инструментов`;
  const description = `${groupTools.length} бесплатных онлайн-инструментов: ${toolNames} и другие. ${group.description}. Без регистрации, работают в браузере.`;

  return {
    title,
    description,
    keywords: allKeywords,
    openGraph: {
      title: `${group.name} — бесплатные онлайн-инструменты | Ultimate Tools`,
      description,
      images: [{ url: 'https://ulti-tools.com/opengraph-image', width: 1200, height: 630 }],
      siteName: 'Ultimate Tools',
      locale: 'ru_RU',
      type: 'website',
      url: `https://ulti-tools.com/group/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://ulti-tools.com/group/${slug}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GroupPage slug={slug} />;
}
