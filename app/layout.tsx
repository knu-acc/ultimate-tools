import type { Metadata } from 'next';
import './globals.css';
import ThemeRegistry from '@/src/theme/ThemeRegistry';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import { getStats } from '@/src/data/tools';

const stats = getStats();

export const metadata: Metadata = {
  title: {
    default: `Ultimate Tools — ${stats.totalTools}+ бесплатных онлайн утилит`,
    template: '%s | Ultimate Tools',
  },
  description: `Более ${stats.totalTools} бесплатных онлайн-инструментов: конвертеры, калькуляторы, генераторы, утилиты для разработчиков, SEO и многое другое. Работает прямо в браузере!`,
  keywords: [
    'онлайн инструменты', 'конвертер валют', 'генератор паролей', 'JSON форматирование',
    'калькулятор', 'конвертер единиц', 'бесплатные утилиты', 'SEO инструменты',
  ],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Ultimate Tools',
    title: `Ultimate Tools — ${stats.totalTools}+ бесплатных онлайн утилит`,
    description: `Конвертеры, калькуляторы, генераторы и утилиты для разработчиков. Всё бесплатно, работает в браузере.`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ultimate Tools',
    description: `${stats.totalTools}+ бесплатных онлайн-инструментов в одном месте`,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/', languages: { 'ru': '/' } },
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
