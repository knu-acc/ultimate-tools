import { Metadata } from 'next';
import ArticlePage from '@/app/blog/[slug]/ArticlePage';
import { articles, getArticleBySlug, getArticlesByTool } from '@/src/data/articles';
import { getToolBySlug } from '@/src/data/tools';
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

  const isEn = locale === 'en';
  const title = isEn ? (article.titleEn || article.title) : article.title;
  const description = isEn ? (article.descriptionEn || article.description) : article.description;

  return {
    title,
    description,
    keywords: article.keywords,
    openGraph: {
      title,
      description,
      images: [{ url: 'https://ulti-tools.com/opengraph-image', width: 1200, height: 630 }],
      type: 'article',
      publishedTime: article.date,
      siteName: 'Ultimate Tools',
      locale: isEn ? 'en_US' : 'ru_RU',
      url: `${BASE}/${locale}/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
  // Resolve data on the server — prevents 1.6MB articles module from client bundle
  const article = getArticleBySlug(slug) ?? null;
  const relatedArticles = article
    ? getArticlesByTool(article.toolSlug)
        .filter(a => a.slug !== article.slug)
        .map(({ slug, title, titleEn }) => ({ slug, title, titleEn }))
    : [];
  const rawTool = article ? getToolBySlug(article.toolSlug) : null;
  const tool = rawTool ? {
    slug: rawTool.slug,
    name: rawTool.name,
    nameEn: (rawTool as any).nameEn,
    description: rawTool.description,
    descriptionEn: (rawTool as any).descriptionEn,
  } : null;

  return <ArticlePage article={article} relatedArticles={relatedArticles} tool={tool} />;
}
