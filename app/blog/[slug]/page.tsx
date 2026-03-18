import { Metadata } from 'next';
import ArticlePage from './ArticlePage';
import { articles, getArticleBySlug, getArticlesByTool } from '@/src/data/articles';
import { getToolBySlug } from '@/src/data/tools';

export async function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: 'Статья не найдена' };
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
      locale: 'ru_RU',
      url: `https://ulti-tools.com/blog/${slug}`,
    },
    alternates: {
      canonical: `https://ulti-tools.com/blog/${slug}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Resolve data on the server — ArticlePage no longer imports the 1.6MB articles module
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
