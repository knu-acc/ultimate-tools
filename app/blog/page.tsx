import { Metadata } from 'next';
import BlogPage from './BlogPage';

export const metadata: Metadata = {
  title: 'Блог — статьи, руководства и советы',
  description: 'Статьи, руководства и советы по использованию онлайн-инструментов. Конвертеры, генераторы, калькуляторы — подробные гайды.',
  openGraph: {
    title: 'Блог | Ultimate Tools',
    description: 'Статьи и руководства по онлайн-инструментам',
  },
};

export default function Page() {
  return <BlogPage />;
}
