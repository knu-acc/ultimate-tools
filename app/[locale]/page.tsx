import HomePage from '@/app/HomePage';
import { Metadata } from 'next';
import { getStats } from '@/src/data/tools';
import { buildKeywordSet, genericSiteKeywords } from '@/src/seo/keywords';

const stats = getStats();

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const base = 'https://ulti-tools.com';

  const title = isEn
    ? `Ultimate Tools — ${stats.totalTools}+ Free Online Tools for Daily Tasks`
    : `Ultimate Tools — ${stats.totalTools}+ бесплатных онлайн-инструментов на каждый день`;
  const description = isEn
    ? `${stats.totalTools}+ free web tools: converters, calculators, generators, JSON/regex tools and image utilities. Fast, private, no signup.`
    : `${stats.totalTools}+ бесплатных веб-инструментов: конвертеры, калькуляторы, генераторы, JSON/regex и инструменты для изображений. Быстро, приватно, без регистрации.`;

  return {
    title,
    description,
    keywords: buildKeywordSet(
      isEn
        ? [
            'best online tools',
            'free browser tools',
            'daily productivity tools',
            'web utilities collection',
            'converter calculator generator',
            'developer utilities online',
            'ultimate tools homepage',
          ]
        : [
            'лучшие онлайн инструменты',
            'бесплатные инструменты в браузере',
            'ежедневные инструменты для работы',
            'коллекция веб утилит',
            'конвертер калькулятор генератор',
            'утилиты для разработчиков онлайн',
            'главная ultimate tools',
          ],
      genericSiteKeywords(isEn),
      15
    ),
    openGraph: {
      title,
      description,
      url: `${base}/${locale}`,
      type: 'website',
      locale: isEn ? 'en_US' : 'ru_RU',
      siteName: 'Ultimate Tools',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: 'Ultimate Tools' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${base}/${locale}`,
      languages: {
        ru: `${base}/ru`,
        en: `${base}/en`,
        'x-default': `${base}/ru`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <HomePage />;
}
