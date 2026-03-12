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
  return {
    title: `${group.name} — ${groupTools.length} бесплатных онлайн инструментов`,
    description: `${group.description}. Инструменты: ${groupTools.slice(0, 3).map(t => t.name).join(', ')} и другие. Бесплатно.`,
    keywords: [...new Set(groupTools.flatMap(t => t.keywords))].slice(0, 10),
    openGraph: {
      title: `${group.name} | Ultimate Tools`,
      description: group.description,
    },
    alternates: {
      canonical: `https://utools.app/group/${slug}`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GroupPage slug={slug} />;
}
