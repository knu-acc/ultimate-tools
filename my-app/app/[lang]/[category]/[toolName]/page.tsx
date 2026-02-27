import { loadTranslations, getNested, flattenTranslations } from "@/lib/i18n";
import { TOOLS, CATEGORIES } from "@/lib/tools-registry";
import { TOOL_TRANSLATION_KEYS } from "@/lib/tool-keys";
import { TOOL_SEO, getToolSeoFallback } from "@/lib/seo-tool-metadata";
import type { Lang } from "@/lib/tools-registry";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolRenderer } from "@/components/tools/ToolRenderer";
import { ToolIcon } from "@/components/ToolIcon";
import {
  getBreadcrumbSchema,
  getFaqSchema,
} from "@/lib/seo-metadata";
import type { Metadata } from "next";

const LANGS = ["ru", "kz", "en"] as const;
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ultimate-tools.example.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; category: string; toolName: string }>;
}): Promise<Metadata> {
  const { lang, category, toolName } = await params;
  const tool = TOOLS[toolName];
  if (!tool) return { title: "Ultimate Tools" };

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[l] = `${BASE_URL}/${l}/${category}/${toolName}`;
  }

  const seo = TOOL_SEO[toolName] ?? getToolSeoFallback(toolName);
  const validLang = lang as Lang;
  const title = seo?.title?.[validLang] ?? `${toolName} — Ultimate Tools`;
  const descriptionRaw = seo?.description?.[validLang] ?? (validLang === "ru" ? "Бесплатный онлайн-инструмент: все расчёты в браузере, данные не передаются. Без регистрации." : validLang === "kz" ? "Тегін онлайн құрал: барлық есептеулер браузерде, деректер жіберілмейді." : "Free online tool: all processing in browser, no data sent. No signup.");
  const suffix = lang === "ru" ? " Бесплатно, без регистрации." : lang === "kz" ? " Тегін, тіркеусіз." : " Free, no signup.";
  const description = descriptionRaw.length >= 140 ? descriptionRaw : descriptionRaw + suffix;
  const keywords = seo?.keywords?.[validLang] ?? ["онлайн инструмент", "бесплатно", toolName];
  const canonicalUrl = `${BASE_URL}/${lang}/${category}/${toolName}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Ultimate Tools",
      locale: lang === "ru" ? "ru_RU" : lang === "kz" ? "kk_KZ" : "en_US",
      type: "website",
      images: [{ url: `${BASE_URL}/og.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ lang: string; category: string; toolName: string }>;
}) {
  const { lang, category, toolName } = await params;
  const validLang = ["ru", "kz", "en"].includes(lang) ? (lang as Lang) : "ru";
  const tool = TOOLS[toolName];
  if (!tool) return null;

  const tData = await loadTranslations(validLang);
  const translations = flattenTranslations(tData as Record<string, unknown>);
  const t = (key: string) => translations[key] ?? getNested(tData as Record<string, unknown>, key) ?? key;
  const cat = CATEGORIES[category];
  const toolKey = TOOL_TRANSLATION_KEYS[toolName] ?? `tools.${toolName}`;

  const breadcrumbItems = [
    { label: cat ? t(cat.key) : category, href: `/${validLang}/${category}` },
    { label: t(tool.nameKey) },
  ];

  const faqSlug = toolName.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const faqData = getNested(tData as Record<string, unknown>, `faq.${faqSlug}`);
  const faqItems = faqData && typeof faqData === "object"
    ? Object.entries(faqData as Record<string, string>)
        .filter(([k]) => k.startsWith("q"))
        .map((_, i) => ({
          q: getNested(tData as Record<string, unknown>, `faq.${faqSlug}.q${i + 1}`) ?? "",
          a: getNested(tData as Record<string, unknown>, `faq.${faqSlug}.a${i + 1}`) ?? "",
        }))
        .filter((item) => item.q && item.a)
    : [];

  const instructions = getNested(tData as Record<string, unknown>, `instructions.${faqSlug}`) as string | undefined;

  const similarTools = (tool.similarTools ?? []).map((slug) => {
    const meta = TOOLS[slug];
    const toolCategory = meta?.category ?? category;
    return {
      slug,
      href: `/${validLang}/${toolCategory}/${slug}`,
      label: meta ? t(meta.nameKey) : slug,
    };
  });

  const toolNameFormatted = t(tool.nameKey);
  const toolDesc = t(tool.descriptionKey);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: toolNameFormatted,
    description: toolDesc,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    url: `${BASE_URL}/${validLang}/${category}/${toolName}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "RUB" },
    featureList: [toolDesc, "Без регистрации", "Работает офлайн", "Конфиденциально"],
  };

  const breadcrumbSchema = getBreadcrumbSchema(
    [
      { name: t("nav.home"), url: `/${validLang}` },
      { name: cat ? t(cat.key) : category, url: `/${validLang}/${category}` },
      { name: t(tool.nameKey) },
    ],
    BASE_URL
  );

  const faqSchema = faqItems.length > 0 ? getFaqSchema(faqItems) : null;

  const seoContentSections = getNested(tData as Record<string, unknown>, `seoContent.${faqSlug}.sections`) as { h2: string; body: string }[] | undefined;
  const hasSeoContent = Array.isArray(seoContentSections) && seoContentSections.length > 0;

  const categoryTools = cat ? cat.tools.filter((s) => s !== toolName).slice(0, 5) : [];
  const categoryToolsWithMeta = categoryTools
    .map((s) => {
      const meta = TOOLS[s];
      if (!meta) return null;
      return { slug: s, nameKey: meta.nameKey, href: `/${validLang}/${category}/${s}` };
    })
    .filter((x): x is { slug: string; nameKey: string; href: string } => x !== null);

  const seoData = TOOL_SEO[toolName] ?? getToolSeoFallback(toolName);
  const keywordsList = seoData?.keywords?.[validLang];
  const keywordsHeading = validLang === "ru" ? "Популярные запросы" : validLang === "kz" ? "Танымал сұраулар" : "Popular searches";

  return (
    <div>
      <div className="card-accent-line h-px w-full" aria-hidden />
      <div className="p-6 lg:p-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <main className="mx-auto max-w-4xl" id="main-content">
          <Breadcrumbs lang={validLang} items={breadcrumbItems} translations={translations} />
          <header className="mt-6">
            <div className="flex items-start gap-4">
              <ToolIcon toolName={toolName} size="lg" className="shrink-0" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">{t(tool.nameKey)}</h1>
                <p className="mt-1 text-[var(--muted)]">{t(tool.descriptionKey)}</p>
              </div>
            </div>
          </header>

          {(TOOL_SEO[toolName]?.seoIntro ?? getToolSeoFallback(toolName).seoIntro) && (
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--accent-muted)]/50 p-5 text-[15px] leading-relaxed text-[var(--foreground)]">
              {(TOOL_SEO[toolName] ?? getToolSeoFallback(toolName)).seoIntro?.[validLang]}
            </div>
          )}

          <article className="mt-6" aria-labelledby="tool-heading">
            <h2 id="tool-heading" className="sr-only">
              {validLang === "ru" ? "Как пользоваться инструментом" : validLang === "kz" ? "Құралды қалай пайдалану керек" : "How to use the tool"}
            </h2>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
              <ToolRenderer
                toolName={toolName}
                translations={translations}
                toolKey={toolKey}
              />
            </div>
          </article>

          <section className="mt-10" aria-labelledby="seo-content-heading">
            <h2 id="seo-content-heading" className="mb-4 text-xl font-semibold text-[var(--foreground)]">
              {validLang === "ru" ? "Подробнее об инструменте" : validLang === "kz" ? "Құрал туралы толығырақ" : "More about this tool"}
            </h2>
            <div className="space-y-8 rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
              {hasSeoContent ? (
                seoContentSections!.map((sec, i) => (
                  <div key={i}>
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">{sec.h2}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[var(--muted)]">{sec.body}</p>
                  </div>
                ))
              ) : (
                <p className="text-[15px] leading-relaxed text-[var(--muted)]">
                  {(TOOL_SEO[toolName] ?? getToolSeoFallback(toolName)).seoIntro?.[validLang]}
                </p>
              )}
            </div>
          </section>

          {instructions && (
            <section className="mt-10" aria-labelledby="instructions-heading">
              <h2 id="instructions-heading" className="mb-4 text-lg font-semibold text-[var(--foreground)]">
                {t("toolPage.instructions")}
              </h2>
              <p className="text-[var(--muted)] leading-relaxed">{instructions}</p>
            </section>
          )}

          {categoryToolsWithMeta.length > 0 && (
            <section className="mt-10" aria-labelledby="category-links-heading">
              <h2 id="category-links-heading" className="mb-4 text-lg font-semibold text-[var(--foreground)]">
                {validLang === "ru" ? "Все инструменты категории" : validLang === "kz" ? "Санаттағы барлық құралдар" : "All tools in category"}:{" "}
                <a href={`/${validLang}/${category}`} className="text-[var(--accent)] hover:underline">
                  {cat ? t(cat.key) : category}
                </a>
              </h2>
              <ul className="flex flex-wrap gap-2">
                {categoryToolsWithMeta.map((x) => (
                  <li key={x.slug}>
                    <a
                      href={x.href}
                      className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      {t(x.nameKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {similarTools.length > 0 && (
            <section className="mt-10" aria-labelledby="similar-heading">
              <h2 id="similar-heading" className="mb-4 text-lg font-semibold text-[var(--foreground)]">
                {t("toolPage.similarTools")}
              </h2>
              <ul className="flex flex-wrap gap-3">
                {similarTools.map((st) => (
                  <li key={st.slug}>
                    <a
                      href={st.href}
                      className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-medium text-[var(--foreground)] transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-muted)] hover:text-[var(--accent)]"
                    >
                      <ToolIcon toolName={st.slug} size="sm" />
                      {st.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {keywordsList && keywordsList.length > 0 && (
            <section className="mt-10" aria-labelledby="keywords-heading">
              <h2 id="keywords-heading" className="mb-3 text-lg font-semibold text-[var(--foreground)]">
                {keywordsHeading}
              </h2>
              <p className="mb-2 text-sm text-[var(--muted)]">
                {validLang === "ru" ? "Частые запросы пользователей по этой теме:" : validLang === "kz" ? "Осы тақырып бойынша жиі сұраулар:" : "Frequent user searches on this topic:"}
              </p>
              <ul className="flex flex-wrap gap-2">
                {keywordsList.slice(0, 10).map((k) => (
                  <li key={k}>
                    <span className="rounded-lg bg-[var(--border)]/50 px-3 py-1 text-sm text-[var(--muted)]">
                      {k}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {faqItems.length > 0 && (
            <section className="mt-10" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="mb-4 text-lg font-semibold text-[var(--foreground)]">
                {t("toolPage.faq")}
              </h2>
              <ul className="space-y-4">
                {faqItems.map((item, i) => (
                  <li
                    key={i}
                    className="rounded-xl border border-[var(--border)] p-4"
                    itemScope
                    itemType="https://schema.org/Question"
                  >
                    <h3 className="font-medium text-[var(--foreground)]" itemProp="name">
                      {item.q}
                    </h3>
                    <div
                      itemScope
                      itemProp="acceptedAnswer"
                      itemType="https://schema.org/Answer"
                    >
                      <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed" itemProp="text">
                        {item.a}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
