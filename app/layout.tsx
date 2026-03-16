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
    // lang="ru" is the SSR default; the inline blocking script below overwrites it
    // with the correct locale before React hydrates (suppressed hydration warning).
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
        {/* ── Blocking theme + locale detection ──
             Runs synchronously BEFORE React hydrates to prevent:
             1. Light→dark theme flash (FOUC)
             2. Wrong lang attribute
             Sets data-theme, CSS custom properties, and lang on <html> */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement,s=d.style;var m=localStorage.getItem('theme-mode');var dark=m==='dark'||(m!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);d.setAttribute('data-theme',dark?'dark':'light');if(dark){s.setProperty('--ut-bg','#141218');s.setProperty('--ut-text','#E6E0E9');s.colorScheme='dark'}else{s.setProperty('--ut-bg','#FEF7FF');s.setProperty('--ut-text','#1D1B20');s.colorScheme='light'}var p=location.pathname.match(/^\\/(en|ru)/);if(p)d.lang=p[1]}catch(e){}})()`,
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
