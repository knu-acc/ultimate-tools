import type { Lang } from "./tools-registry";
import { TOOLS } from "./tools-registry";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ultimate-tools.example.com";
const LANGS = ["ru", "kz", "en"] as const;

export interface ToolSeoData {
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  keywords?: Record<Lang, string[]>;
}

export const TOOL_SEO: Record<string, ToolSeoData> = Object.fromEntries(
  Object.keys(TOOLS).map((slug) => [
    slug,
    {
      title: {
        ru: `${slug} — Ultimate Tools`,
        kz: `${slug} — Ultimate Tools`,
        en: `${slug} — Ultimate Tools`,
      },
      description: {
        ru: `Бесплатный онлайн-инструмент ${slug}. Работает в браузере без отправки данных.`,
        kz: `Тегін онлайн құрал ${slug}. Деректер жібермей браузерде жұмыс істейді.`,
        en: `Free online tool ${slug}. Runs in browser without sending data.`,
      },
    },
  ])
);

export function getToolMetadata(
  toolName: string,
  lang: Lang,
  category: string,
  t: (key: string) => string
) {
  const tool = TOOLS[toolName];
  if (!tool) return null;

  const canonicalUrl = `${BASE_URL}/${lang}/${category}/${toolName}`;
  const title = t(tool.nameKey) + " — Ultimate Tools";
  const description = t(tool.descriptionKey);

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[l] = `${BASE_URL}/${l}/${category}/${toolName}`;
  }

  return {
    title,
    description,
    canonical: canonicalUrl,
    alternates,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Ultimate Tools",
      locale: lang === "ru" ? "ru_RU" : lang === "kz" ? "kk_KZ" : "en_US",
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) =>
        l === "ru" ? "ru_RU" : l === "kz" ? "kk_KZ" : "en_US"
      ),
      type: "website",
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
    },
  };
}

export function getBreadcrumbSchema(
  items: { name: string; url?: string }[],
  baseUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url && { item: `${baseUrl}${item.url}` }),
    })),
  };
}

export function getFaqSchema(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function getWebSiteSchema(baseUrl: string, name: string, description: string, lang: string = "ru") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    description,
    url: baseUrl,
    inLanguage: ["ru", "en", "kk"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/{lang}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getHowToSchema(
  name: string,
  description: string,
  steps: { name: string; text: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function getOrganizationSchema(baseUrl: string, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: baseUrl,
    description,
    logo: `${baseUrl}/window.svg`,
  };
}
