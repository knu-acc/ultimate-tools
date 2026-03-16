import './globals.css';
import { Roboto } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { getStats } from '@/src/data/tools';
import ThemeRegistry from '@/src/theme/ThemeRegistry';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

const stats = getStats();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6750A4" />
        <meta name="geo.region" content="RU" />
        <meta name="geo.placename" content="Russia" />
        {/* WebSite JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Ultimate Tools',
              url: 'https://ulti-tools.com',
              description: `${stats.totalTools}+ бесплатных онлайн-инструментов`,
              inLanguage: ['ru', 'en'],
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: 'https://ulti-tools.com/?search={search_term_string}' },
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
              url: 'https://ulti-tools.com',
              description: `Сайт с ${stats.totalTools}+ бесплатными онлайн-инструментами`,
              logo: { '@type': 'ImageObject', url: 'https://ulti-tools.com/favicon.ico' },
            }),
          }}
        />
      </head>
      <body className={roboto.className}>
        {/* MD3 Accessibility: Skip-to-content link (WCAG 2.1 SC 2.4.1) */}
        <a href="#main-content" className="skip-to-content">
          Перейти к содержимому
        </a>
        <AppRouterCacheProvider>
          <ThemeRegistry>{children}</ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
