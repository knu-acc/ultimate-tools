import { NextRequest, NextResponse } from 'next/server';

const LOCALES = ['ru', 'en'];
const DEFAULT_LOCALE = 'ru';

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('locale')?.value;
  if (cookieLocale && LOCALES.includes(cookieLocale)) return cookieLocale;

  const acceptLang = request.headers.get('accept-language');
  if (acceptLang) {
    const preferred = acceptLang.split(',').map(l => l.split(';')[0].trim().slice(0, 2));
    for (const lang of preferred) {
      if (LOCALES.includes(lang)) return lang;
    }
  }

  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname === '/manifest.json' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2|ttf|css|js|map)$/)
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = LOCALES.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = getLocale(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  newUrl.search = request.nextUrl.search;
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: ['/((?!_next|api|favicon|manifest\\.json|robots\\.txt|sitemap\\.xml|.*\\..+).*)'],
};