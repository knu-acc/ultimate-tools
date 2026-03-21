import { Metadata } from 'next';
import BlogPage from './BlogPage';
import { buildKeywordSet, genericSiteKeywords } from '@/src/seo/keywords';

export const metadata: Metadata = {
  title: 'Блог — статьи, руководства и советы',
  description: 'Статьи, руководства и советы по использованию онлайн-инструментов. Конвертеры, генераторы, калькуляторы — подробные гайды.',
  keywords: buildKeywordSet(
    [
      'блог про онлайн инструменты',
      'seo руководства',
      'гайды по конвертерам',
      'гайды по калькуляторам',
      'руководства для разработчиков',
      'как пользоваться онлайн инструментами',
      'статьи по веб инструментам',
    ],
    genericSiteKeywords(false),
    15
  ),
  openGraph: {
    title: 'Блог | Ultimate Tools',
    description: 'Статьи и руководства по онлайн-инструментам',
    siteName: 'Ultimate Tools',
    locale: 'ru_RU',
  },
  alternates: {
    canonical: 'https://ulti-tools.com/ru/blog',
    languages: {
      ru: 'https://ulti-tools.com/ru/blog',
      en: 'https://ulti-tools.com/en/blog',
      'x-default': 'https://ulti-tools.com/ru/blog',
    },
  },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <BlogPage />;
}
