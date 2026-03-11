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
  return {
    title: `${tool.name} — бесплатный онлайн инструмент`,
    description: `${tool.description}. Бесплатно, без регистрации. Работает в браузере. ${group?.name} | Ultimate Tools.`,
    openGraph: {
      title: `${tool.name} | Ultimate Tools`,
      description: tool.description,
    },
    keywords: tool.keywords,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ToolPage slug={slug} />;
}
