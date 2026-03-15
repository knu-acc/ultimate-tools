import type { Metadata } from 'next';
import './globals.css';
import ThemeRegistry from '@/src/theme/ThemeRegistry';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import { getStats } from '@/src/data/tools';

const stats = getStats();

export const metadata: Metadata = {
  title: {
    default: `Ultimate Tools — ${stats.totalTools}+ бесплатных онлайн инструментов`,
    template: '%s | Ultimate Tools',
  },
  description: `${stats.totalTools}+ бесплатных онлайн-инструментов: конвертеры единиц, калькуляторы, генератор паролей, JSON formatter, счётчик слов, QR-коды и многое другое. Работают прямо в браузере без регистрации.`,
  keywords: [
    'бесплатные онлайн инструменты',
    'онлайн калькулятор',
    'конвертер единиц онлайн',
    'генератор паролей онлайн',
    'JSON форматирование онлайн',
    'счётчик слов онлайн',
    'QR код генератор',
    'base64 кодирование',
    'regex тестер онлайн',
    'конвертер температуры',
    'ипотечный калькулятор',
    'SEO инструменты',
    'инструменты для разработчиков',
    'бесплатно без регистрации',
  ],
  applicationName: 'Ultimate Tools',
  authors: [{ name: 'Ultimate Tools', url: 'https://utools.app' }],
  creator: 'Ultimate Tools',
  publisher: 'Ultimate Tools',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Ultimate Tools',
    url: 'https://utools.app',
    title: `Ultimate Tools — ${stats.totalTools}+ бесплатных онлайн инструментов`,
    description: `Конвертеры, калькуляторы, генераторы, инструменты для разработчиков и многое другое. ${stats.totalTools}+ утилит — всё бесплатно, работает в браузере.`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Ultimate Tools — ${stats.totalTools}+ бесплатных онлайн-инструментов`,
    description: `${stats.totalTools}+ бесплатных онлайн-утилит в одном месте. Конвертеры, калькуляторы, генераторы, SEO, разработка.`,
    site: '@ultimatetools',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://utools.app',
    languages: { 'ru': 'https://utools.app' },
  },
  verification: {
    yandex: 'placeholder',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6750A4" />
        <meta name="geo.region" content="RU" />
        <meta name="geo.placename" content="Russia" />
        {/* WebSite JSON-LD с SearchAction для Rich Snippet */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Ultimate Tools',
              url: 'https://utools.app',
              description: `${stats.totalTools}+ бесплатных онлайн-инструментов`,
              inLanguage: 'ru',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://utools.app/?search={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Ultimate Tools',
              url: 'https://utools.app',
              description: `Сайт с ${stats.totalTools}+ бесплатными онлайн-инструментами`,
              logo: {
                '@type': 'ImageObject',
                url: 'https://utools.app/favicon.ico',
              },
            }),
          }}
        />
      </head>
      <body>
        <ThemeRegistry>
          <Header />
          <main style={{ minHeight: 'calc(100vh - 200px)' }}>
            {children}
          </main>
          <Footer />
        </ThemeRegistry>
      </body>
    </html>
  );
}
