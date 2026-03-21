import './globals.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { getStats } from '@/src/data/tools';
import ThemeRegistry from '@/src/theme/ThemeRegistry';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { RootClientProvider } from './RootClientProvider';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

const stats = getStats();

export const metadata: Metadata = {
  metadataBase: new URL('https://ulti-tools.com'),
};

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
        {/* ── CRITICAL CSS: Inlined for above-the-fold rendering ──
             Includes: reset styles, theme colors, focus indicators, skip-link.
             Non-critical CSS deferred via globals.css import at module level. */}
        <style dangerouslySetInnerHTML={{
          __html: `*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;--ut-bg:#FEF7FF;--ut-text:#1D1B20}body{background-color:var(--ut-bg)!important;color:var(--ut-text)!important}::selection{background-color:rgba(103,80,164,0.2)}.skip-to-content{position:absolute;top:-9999px;left:8px;z-index:9999;padding:12px 24px;background:#6750A4;color:#fff;font-weight:500;font-size:.875rem;border-radius:0 0 10px 10px;text-decoration:none;letter-spacing:.1px;transition:top 150ms cubic-bezier(.2,0,0,1)}.skip-to-content:focus-visible{top:0;outline:3px solid #fff;outline-offset:2px}a:focus-visible,button:focus-visible,[role="button"]:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,[tabindex]:focus-visible{outline:3px solid #6750A4;outline-offset:2px;border-radius:10px}a:focus:not(:focus-visible),button:focus:not(:focus-visible),[role="button"]:focus:not(:focus-visible){outline:none}.MuiChip-root.Mui-focusVisible{outline:3px solid #6750A4;outline-offset:2px}.MuiCardActionArea-root.Mui-focusVisible{outline:3px solid #6750A4;outline-offset:-3px}[data-theme="dark"] a:focus-visible,[data-theme="dark"] button:focus-visible,[data-theme="dark"] [role="button"]:focus-visible,[data-theme="dark"] [tabindex]:focus-visible{outline-color:#D0BCFF}`
        }} />
        <meta name="distribution" content="global" />
        <meta name="coverage" content="Worldwide" />
        <meta name="rating" content="General" />
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
              sameAs: [],
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
              areaServed: 'Worldwide',
              availableLanguage: ['ru', 'en'],
            }),
          }}
        />
        {/* AEO JSON-LD: Site-level FAQ for answer engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Что такое Ultimate Tools?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Ultimate Tools — это каталог из ${stats.totalTools}+ бесплатных онлайн-инструментов, которые работают прямо в браузере без регистрации.`,
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What is Ultimate Tools?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Ultimate Tools is a catalog of ${stats.totalTools}+ free online tools that run directly in your browser with no registration.`,
                  },
                },
              ],
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
        <ErrorBoundary>
          <AppRouterCacheProvider>
            <RootClientProvider>
              <ThemeRegistry>{children}</ThemeRegistry>
            </RootClientProvider>
          </AppRouterCacheProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
