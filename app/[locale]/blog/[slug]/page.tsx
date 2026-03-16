import { Metadata } from 'next';
import ArticlePage from '@/app/blog/[slug]/ArticlePage';
import { articles, getArticleBySlug } from '@/src/data/articles';
import { LOCALES } from '@/src/i18n/index';

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of LOCALES) {
    for (const a of articles) {
      params.push({ locale, slug: a.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: locale === 'en' ? 'Article not found' : 'Статья не найдена' };
  const BASE = 'https://ulti-tools.com';

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      siteName: 'Ultimate Tools',
      locale: locale === 'en' ? 'en_US' : 'ru_RU',
      url: `${BASE}/${locale}/blog/${slug}`,
    },
    alternates: {
      canonical: `${BASE}/${locale}/blog/${slug}`,
      languages: {
        'ru': `${BASE}/ru/blog/${slug}`,
        'en': `${BASE}/en/blog/${slug}`,
        'x-default': `${BASE}/ru/blog/${slug}`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  return <ArticlePage slug={slug} />;
}
