import { loadTranslations, getNested, flattenTranslations } from "@/lib/i18n";
import { TOOLS, CATEGORIES } from "@/lib/tools-registry";
import { TOOL_TRANSLATION_KEYS } from "@/lib/tool-keys";
import { TOOL_SEO, getToolSeoFallback } from "@/lib/seo-tool-metadata";
import type { Lang } from "@/lib/tools-registry";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolRenderer } from "@/components/tools/ToolRenderer";
import { ToolIcon } from "@/components/ToolIcon";
import { ShareButton } from "@/components/ShareButton";
import { TopBannerAd } from "@/components/ads/TopBannerAd";
import { MidContentAd } from "@/components/ads/MidContentAd";
import {
  getBreadcrumbSchema,
  getFaqSchema,
  getHowToSchema,
} from "@/lib/seo-metadata";
import type { Metadata } from "next";

const LANGS = ["ru", "kz", "en"] as const;

export function generateStaticParams() {
  const params: { lang: string; category: string; toolName: string }[] = [];
  for (const lang of LANGS) {
    for (const [category, meta] of Object.entries(CATEGORIES)) {
      for (const toolName of meta.tools) {
        if (TOOLS[toolName]) params.push({ lang, category, toolName });
      }
    }
  }
  return params;
}
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

  // LSI suffix for long-tail SEO
  const TITLE_SUFFIX: Record<string, string> = {
    ru: " — бесплатно онлайн",
    kz: " — тегін онлайн",
    en: " — Free Online",
  };
  const baseName = seo?.title?.[validLang];
  const title = baseName
    ? baseName
    : `${toolName}${TITLE_SUFFIX[lang] ?? " — Ultimate Tools"}`;

  const descriptionRaw = seo?.description?.[validLang] ?? (validLang === "ru" ? "Бесплатный онлайн-инструмент: все расчёты в браузере, данные не передаются. Без регистрации." : validLang === "kz" ? "Тегін онлайн құрал: барлық есептеулер браузерде, деректер жіберілмейді." : "Free online tool: all processing in browser, no data sent. No signup.");
  const suffix = lang === "ru" ? " Бесплатно, без регистрации." : lang === "kz" ? " Тегін, тіркеусіз." : " Free, no signup.";
  const description = descriptionRaw.length >= 140 ? descriptionRaw : descriptionRaw + suffix;

  // Merge SEO keywords with tool name variants for long-tail coverage
  const baseKeywords = seo?.keywords?.[validLang] ?? [];
  const extraKeywords: Record<string, string[]> = {
    ru: ["бесплатно", "онлайн", "без регистрации", toolName],
    kz: ["тегін", "онлайн", "тіркеусіз", toolName],
    en: ["free", "online", "no signup", toolName],
  };
  const keywords = [...new Set([...baseKeywords, ...(extraKeywords[lang] ?? [])])];
  const canonicalUrl = `${BASE_URL}/${lang}/${category}/${toolName}`;

  // BCP-47 compliant hreflang (kz → kk)
  const langToLocale: Record<string, string> = { ru: "ru_RU", kz: "kk_KZ", en: "en_US" };
  const langToBcp47: Record<string, string> = { ru: "ru", kz: "kk", en: "en" };
  const hreflangAlternates: Record<string, string> = {};
  for (const l of LANGS) {
    hreflangAlternates[langToBcp47[l]] = alternates[l];
  }
  hreflangAlternates["x-default"] = `${BASE_URL}/ru/${category}/${toolName}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Ultimate Tools",
      locale: langToLocale[lang] ?? "ru_RU",
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

  const CURRENCY_BY_LANG: Record<string, string> = { ru: "RUB", kz: "KZT", en: "USD" };
  const FEATURE_BY_LANG: Record<string, string[]> = {
    ru: [toolDesc, "Без регистрации", "Работает офлайн", "Конфиденциально — данные не отправляются"],
    kz: [toolDesc, "Тіркеусіз", "Офлайн жұмыс істейді", "Деректер жіберілмейді"],
    en: [toolDesc, "No signup required", "Works offline", "Private — no data sent"],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: toolNameFormatted,
    description: toolDesc,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    url: `${BASE_URL}/${validLang}/${category}/${toolName}`,
    inLanguage: validLang === "ru" ? "ru" : validLang === "kz" ? "kk" : "en",
    offers: { "@type": "Offer", price: "0", priceCurrency: CURRENCY_BY_LANG[validLang] ?? "USD" },
    featureList: FEATURE_BY_LANG[validLang] ?? FEATURE_BY_LANG.en,
    isAccessibleForFree: true,
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

  // HowTo schema: generic 3-step instruction for all tools
  const HOW_TO_STEPS: Record<string, { name: string; text: string }[]> = {
    ru: [
      { name: "Откройте инструмент", text: `Перейдите на страницу «${toolNameFormatted}». Регистрация не требуется.` },
      { name: "Введите данные", text: "Заполните поля ввода. Все операции выполняются мгновенно на вашем устройстве." },
      { name: "Получите результат", text: "Результат автоматически отобразится ниже. Скопируйте или скачайте его." },
    ],
    kz: [
      { name: "құралды ашыңыз", text: `«${toolNameFormatted}» бетіне өтіңіз. Тіркеу қажет емес.` },
      { name: "Деректерді енгізіңіз", text: "Енгізу өрістерін толтырыңыз. Барлық есептеулер құрылғыңызда орындалады." },
      { name: "Нәтижені алыңыз", text: "Нәтиже лезде көрсетіледі. Көшіріп алыңыз немесе жүктеп алыңыз." },
    ],
    en: [
      { name: "Open the tool", text: `Navigate to the “${toolNameFormatted}” page. No registration required.` },
      { name: "Enter your data", text: "Fill in the input fields. All processing happens instantly on your device." },
      { name: "Get the result", text: "The result appears automatically below. Copy or download it as needed." },
    ],
  };
  const howToSchema = getHowToSchema(
    toolNameFormatted,
    toolDesc,
    HOW_TO_STEPS[validLang] ?? HOW_TO_STEPS.en
  );

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <main className="mx-auto max-w-4xl" id="main-content">
          <Breadcrumbs lang={validLang} items={breadcrumbItems} translations={translations} />

          {/* ── Tool-first: interactive tool at the very top ── */}
          <article className="mt-4 relative" aria-labelledby="tool-heading">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] rounded-[24px] blur opacity-10"></div>
            <div className="relative rounded-[22px] border border-[var(--border)] bg-[var(--card-bg)] shadow-2xl p-6 sm:p-8 lg:p-10">
              {/* Compact inline header inside the tool card */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
                <div className="p-2.5 bg-gradient-to-br from-[var(--accent-muted)] to-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--accent)] shrink-0">
                  <ToolIcon toolName={toolName} size="md" />
                </div>
                <h1 id="tool-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)] flex-1 min-w-0">{t(tool.nameKey)}</h1>
                <ShareButton
                  url={`${BASE_URL}/${validLang}/${category}/${toolName}`}
                  title={toolNameFormatted}
                  text={toolDesc}
                  shareLabel={t("toolPage.share")}
                  copyToast={validLang === "ru" ? "Ссылка скопирована" : validLang === "kz" ? "Сілтеме көшірілді" : "Link copied"}
                  shareToast={validLang === "ru" ? "Поделено" : validLang === "kz" ? "Бөлінді" : "Shared"}
                />
              </div>
              <ToolRenderer
                toolName={toolName}
                translations={translations}
                toolKey={toolKey}
              />
            </div>
          </article>

          <TopBannerAd />

          {/* ── Collapsible About section (description + seoIntro + seoContent) ── */}
          <details className="tool-about-section mt-8">
            <summary>
              {validLang === "ru" ? "Подробнее об инструменте" : validLang === "kz" ? "Құрал туралы толығырақ" : "About this tool"}
            </summary>
            <div className="tool-about-content space-y-6">
              <p className="text-[15px] leading-relaxed text-[var(--muted)]">{toolDesc}</p>
              {(TOOL_SEO[toolName]?.seoIntro ?? getToolSeoFallback(toolName).seoIntro)?.[validLang] && (
                <p className="text-[15px] leading-relaxed text-[var(--foreground)]">
                  {(TOOL_SEO[toolName] ?? getToolSeoFallback(toolName)).seoIntro?.[validLang]}
                </p>
              )}
              {hasSeoContent && seoContentSections!.map((sec, i) => (
                <div key={i}>
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">{sec.h2}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--muted)]">{sec.body}</p>
                </div>
              ))}
            </div>
          </details>

          <MidContentAd />

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
                    className="group rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6 transition-all hover:border-[var(--border-focus)] hover:shadow-lg"
                    itemScope
                    itemType="https://schema.org/Question"
                  >
                    <h3 className="text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors" itemProp="name">
                      {item.q}
                    </h3>
                    <div
                      itemScope
                      itemProp="acceptedAnswer"
                      itemType="https://schema.org/Answer"
                      className="mt-3 relative"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent-hover)] opacity-20 group-hover:opacity-100 transition-opacity"></div>
                      <p className="pl-4 text-[15px] text-[var(--muted)] leading-relaxed" itemProp="text">
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
