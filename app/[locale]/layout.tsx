import type { Metadata } from 'next';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import MainContent from '@/src/components/MainContent';
import { getStats, tools, toolGroups } from '@/src/data/tools';
import { LOCALES } from '@/src/i18n/index';

const stats = getStats();

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const BASE = 'https://ulti-tools.com';

  return {
    title: {
      default: isEn
        ? `Ultimate Tools — ${stats.totalTools}+ Free Online Tools`
        : `Ultimate Tools — ${stats.totalTools}+ бесплатных онлайн инструментов`,
      template: '%s | Ultimate Tools',
    },
    description: isEn
      ? `${stats.totalTools}+ free online tools: unit converters, calculators, password generator, JSON formatter, word counter, QR codes and more. Work right in your browser without registration.`
      : `${stats.totalTools}+ бесплатных онлайн-инструментов: конвертеры единиц, калькуляторы, генератор паролей, JSON formatter, счётчик слов, QR-коды и многое другое. Работают прямо в браузере без регистрации.`,
    keywords: isEn
      ? ['free online tools', 'online calculator', 'unit converter online', 'password generator', 'JSON formatter', 'word counter', 'QR code generator', 'developer tools', 'free no registration']
      : ['бесплатные онлайн инструменты', 'онлайн калькулятор', 'конвертер единиц онлайн', 'генератор паролей онлайн', 'JSON форматирование онлайн', 'счётчик слов онлайн', 'QR код генератор', 'инструменты для разработчиков', 'бесплатно без регистрации'],
    applicationName: 'Ultimate Tools',
    authors: [{ name: 'Ultimate Tools', url: BASE }],
    creator: 'Ultimate Tools',
    publisher: 'Ultimate Tools',
    openGraph: {
      type: 'website',
      locale: isEn ? 'en_US' : 'ru_RU',
      siteName: 'Ultimate Tools',
      url: `${BASE}/${locale}`,
      title: isEn
        ? `Ultimate Tools — ${stats.totalTools}+ Free Online Tools`
        : `Ultimate Tools — ${stats.totalTools}+ бесплатных онлайн инструментов`,
      description: isEn
        ? `Converters, calculators, generators, developer tools and more. ${stats.totalTools}+ utilities — all free, works in your browser.`
        : `Конвертеры, калькуляторы, генераторы, инструменты для разработчиков и многое другое. ${stats.totalTools}+ утилит — всё бесплатно, работает в браузере.`,
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn
        ? `Ultimate Tools — ${stats.totalTools}+ Free Online Tools`
        : `Ultimate Tools — ${stats.totalTools}+ бесплатных онлайн-инструментов`,
      description: isEn
        ? `${stats.totalTools}+ free online utilities in one place.`
        : `${stats.totalTools}+ бесплатных онлайн-утилит в одном месте.`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    alternates: {
      canonical: `${BASE}/${locale}`,
      languages: {
        'ru': `${BASE}/ru`,
        'en': `${BASE}/en`,
        'x-default': `${BASE}/ru`,
      },
    },
    verification: { yandex: 'placeholder' },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <>
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
    </>
  );
}
