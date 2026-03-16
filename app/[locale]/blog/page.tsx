import { Metadata } from 'next';
import BlogPage from '@/app/blog/BlogPage';
import { LOCALES } from '@/src/i18n/index';

export async function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const BASE = 'https://ulti-tools.com';

  return {
    title: isEn ? 'Blog — Articles, Guides and Tips' : 'Блог — статьи, руководства и советы',
    description: isEn
      ? 'Articles, guides and tips for using online tools. Converters, generators, calculators — detailed guides.'
      : 'Статьи, руководства и советы по использованию онлайн-инструментов.',
    openGraph: {
      title: isEn ? 'Blog | Ultimate Tools' : 'Блог | Ultimate Tools',
      description: isEn ? 'Articles and guides on online tools' : 'Статьи и руководства по онлайн-инструментам',
      images: [{ url: 'https://ulti-tools.com/opengraph-image', width: 1200, height: 630 }],
      siteName: 'Ultimate Tools',
      locale: isEn ? 'en_US' : 'ru_RU',
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? 'Blog | Ultimate Tools' : 'Блог | Ultimate Tools',
      description: isEn ? 'Articles and guides on online tools' : 'Статьи и руководства по онлайн-инструментам',
    },
    alternates: {
      canonical: `${BASE}/${locale}/blog`,
      languages: {
        'ru': `${BASE}/ru/blog`,
        'en': `${BASE}/en/blog`,
        'x-default': `${BASE}/ru/blog`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <BlogPage />;
}
