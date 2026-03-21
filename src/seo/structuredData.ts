/**
 * Structured Data & SEO Metadata Utilities
 * Generates JSON-LD schema, meta tags, and SEO metadata for all pages
 */

interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
}

interface ToolSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  inLanguage: string;
  url: string;
  abstract?: string;
  applicationCategory?: string;
  author?: {
    '@type': string;
    name: string;
  };
  potentialAction?: {
    '@type': string;
    target: string | { '@type': string; urlTemplate: string };
  };
}

/**
 * Generate Breadcrumb Schema
 * Used for navigation structure
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQ Schema
 * Improves SEO for FAQ pages
 */
export function generateFAQSchema(faqs: FAQItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Organization Schema
 * Main organization information for search engines
 */
export function generateOrganizationSchema(config: {
  name: string;
  url: string;
  logo: string;
  description: string;
  socialProfiles?: string[];
}): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name,
    url: config.url,
    logo: config.logo,
    description: config.description,
    sameAs: config.socialProfiles || [],
  };
}

/**
 * Generate Software Application Schema
 * Describes a tool as a web application
 */
export function generateSoftwareApplicationSchema(config: {
  name: string;
  description: string;
  url: string;
  language: string;
  category?: string;
  authorName?: string;
}): ToolSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: config.name,
    description: config.description,
    inLanguage: config.language,
    url: config.url,
    applicationCategory: config.category || 'Utility',
    ...(config.authorName && {
      author: {
        '@type': 'Person',
        name: config.authorName,
      },
    }),
    potentialAction: {
      '@type': 'UseAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: config.url,
      },
    },
  };
}

/**
 * Generate Open Graph Meta Tags
 * Improves social media sharing
 */
export function generateOpenGraphTags(config: {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  locale?: string;
}): Record<string, string> {
  return {
    'og:title': config.title,
    'og:description': config.description,
    'og:url': config.url,
    'og:type': config.type || 'website',
    ...(config.image && { 'og:image': config.image }),
    ...(config.locale && { 'og:locale': config.locale }),
  };
}

/**
 * Generate Twitter Card Meta Tags
 * Improves Twitter/X sharing
 */
export function generateTwitterTags(config: {
  title: string;
  description: string;
  image?: string;
  handle?: string;
}): Record<string, string> {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': config.title,
    'twitter:description': config.description,
    ...(config.image && { 'twitter:image': config.image }),
    ...(config.handle && { 'twitter:creator': config.handle }),
  };
}

/**
 * Generate Meta Tags Object
 * Complete SEO meta tags for a page
 */
export function generateMetaTags(config: {
  title: string;
  description: string;
  keywords: string[];
  url: string;
  image?: string;
  author?: string;
  canonical?: string;
  robots?: string;
  locale?: string;
  twitterHandle?: string;
}): Record<string, string> {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords.join(', '),
    author: config.author || '',
    'og:title': config.title,
    'og:description': config.description,
    'og:url': config.url,
    'og:type': 'website',
    ...(config.image && { 'og:image': config.image }),
    ...(config.locale && { 'og:locale': config.locale }),
    'twitter:card': 'summary_large_image',
    'twitter:title': config.title,
    'twitter:description': config.description,
    ...(config.image && { 'twitter:image': config.image }),
    ...(config.twitterHandle && { 'twitter:creator': config.twitterHandle }),
    ...(config.canonical && { 'canonical': config.canonical }),
    'robots': config.robots || 'index, follow',
    'viewport': 'width=device-width, initial-scale=1.0',
  };
}

/**
 * Generate Alternate Links (hreflang)
 * For multilingual SEO
 */
export function generateAlternateLinks(config: {
  defaultUrl: string;
  languages: Array<{ lang: string; url: string }>;
}): Array<{ rel: string; hrefLang: string; href: string }> {
  const links = [
    {
      rel: 'alternate',
      hrefLang: 'x-default',
      href: config.defaultUrl,
    },
    ...config.languages.map((lang) => ({
      rel: 'alternate',
      hrefLang: lang.lang,
      href: lang.url,
    })),
  ];

  return links;
}

/**
 * Generate Sitemap Entry
 * For sitemap generation
 */
export function generateSitemapEntry(config: {
  url: string;
  lastmod?: Date;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}): object {
  return {
    url: config.url,
    ...(config.lastmod && {
      lastmod: config.lastmod.toISOString().split('T')[0],
    }),
    ...(config.changefreq && { changefreq: config.changefreq }),
    ...(config.priority && { priority: config.priority }),
  };
}

/**
 * Preconnect Links Generator
 * Optimizes third-party connections
 */
export function generatePreconnectLinks(domains: string[]): Array<{
  rel: 'preconnect' | 'dns-prefetch';
  href: string;
}> {
  return domains.map((domain) => ({
    rel: 'preconnect',
    href: domain,
  }));
}

/**
 * SEO Config Template
 * Copy and customize for your application
 */
export const SEO_CONFIG = {
  site: {
    name: 'Ultimate Tools Collection',
    description: 'Free, powerful online tools for productivity, calculation, and conversion',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ultimate-tools.com',
    logo: '/logo.png',
    author: 'Ultimate Tools Team',
    twitterHandle: '@ultimate_tools',
  },
  keywords: {
    general: [
      'online tools',
      'free tools',
      'converters',
      'calculators',
      'generators',
      'productivity',
    ],
    tools: {
      calculator: ['calculator', 'compute', 'math', 'calculate'],
      converter: ['converter', 'convert', 'transformation', 'change format'],
      generator: ['generator', 'create', 'make', 'generate'],
    },
  },
  robotsPolicy: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  languageAlternates: [
    { lang: 'en', url: 'https://ultimate-tools.com/en' },
    { lang: 'ru', url: 'https://ultimate-tools.com/ru' },
  ],
  socialProfiles: [
    'https://twitter.com/ultimate_tools',
    'https://github.com/ultimate-tools',
    'https://linkedin.com/company/ultimate-tools',
  ],
};

/**
 * Export Next.js Metadata Object
 * Usage in layout.tsx or page.tsx:
 * export const metadata: Metadata = getPageMetadata({...})
 */
export function getPageMetadata(config: {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  locale?: string;
  canonical?: string;
}): object {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords?.join(', '),
    openGraph: {
      title: config.title,
      description: config.description,
      ...(config.image && { images: [{ url: config.image }] }),
      locale: config.locale || 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      ...(config.image && { image: config.image }),
    },
    ...(config.canonical && { alternates: { canonical: config.canonical } }),
  };
}
