import { Metadata } from 'next';
import GroupPage from '@/app/group/[slug]/GroupPage';
import { toolGroups, getToolsByGroup, getGroupBySlug } from '@/src/data/tools';
import { LOCALES } from '@/src/i18n/index';

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of LOCALES) {
    for (const g of toolGroups) {
      params.push({ locale, slug: g.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const group = getGroupBySlug(slug);
  if (!group) return { title: locale === 'en' ? 'Category not found' : 'Категория не найдена' };
  const groupTools = getToolsByGroup(group.id);
  const isEn = locale === 'en';
  const BASE = 'https://ulti-tools.com';

  const groupName = isEn ? ((group as any).nameEn || group.name) : group.name;
  const toolNames = groupTools.slice(0, 5).map(t => isEn ? ((t as any).nameEn || t.name) : t.name).join(', ');

  const title = isEn
    ? `${groupName} Online — ${groupTools.length} Free Tools`
    : `${group.name} онлайн — ${groupTools.length} бесплатных инструментов`;

  const description = isEn
    ? `${groupTools.length} free online tools: ${toolNames} and more. No registration, works in your browser.`
    : `${groupTools.length} бесплатных онлайн-инструментов: ${toolNames} и другие. Без регистрации, работают в браузере.`;

  return {
    title,
    description,
    openGraph: {
      title: `${groupName} — Free Online Tools | Ultimate Tools`,
      description,
      siteName: 'Ultimate Tools',
      locale: isEn ? 'en_US' : 'ru_RU',
      type: 'website',
      url: `${BASE}/${locale}/group/${slug}`,
    },
    alternates: {
      canonical: `${BASE}/${locale}/group/${slug}`,
      languages: {
        'ru': `${BASE}/ru/group/${slug}`,
        'en': `${BASE}/en/group/${slug}`,
        'x-default': `${BASE}/ru/group/${slug}`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  return <GroupPage slug={slug} />;
}
