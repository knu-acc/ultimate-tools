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
    description: `${group.description}. ${groupTools.length} инструментов в категории "${group.name}". Бесплатно, работает в браузере.`,
    openGraph: {
      title: `${group.name} | Ultimate Tools`,
      description: group.description,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GroupPage slug={slug} />;
}
