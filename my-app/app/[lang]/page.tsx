import Link from "next/link";
import { loadTranslations, getNested } from "@/lib/i18n";
import { CATEGORIES, TOOLS } from "@/lib/tools-registry";
import type { Lang } from "@/lib/tools-registry";
import { ToolIcon } from "@/components/ToolIcon";
import type { Metadata } from "next";

const FEATURED_TOOLS: { slug: string; category: string }[] = [
  { slug: "random-number", category: "random" },
  { slug: "password-generator", category: "random" },
  { slug: "word-counter", category: "text" },
  { slug: "bmi", category: "math" },
  { slug: "json-formatter", category: "dev-tools" },
  { slug: "base64", category: "graphics" },
];

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ultimate-tools.example.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["ru", "kz", "en"].includes(lang) ? (lang as Lang) : "ru";
  const titles = { ru: "Ultimate Tools — 100+ бесплатных веб-инструментов онлайн", kz: "Ultimate Tools — 100+ тегін веб-құралдар", en: "Ultimate Tools — 100+ Free Web Tools Online" };
  const descriptions = {
    ru: "Более 100 бесплатных онлайн-инструментов: калькуляторы процентов и ИМТ, генераторы паролей и QR-кодов, конвертеры, счётчик слов, JSON, Base64. Всё в браузере — без регистрации, данные не передаются.",
    kz: "100+ тегін онлайн құралдар: калькуляторлар, генераторлар, түрлендіргіштер. Тіркеусіз, барлығы браузерде.",
    en: "100+ free online tools: percentage and BMI calculators, password and QR generators, converters, word counter, JSON, Base64. All in browser — no signup, no data sent.",
  };
  const canonical = `${BASE_URL}/${validLang}`;
  return {
    title: titles[validLang],
    description: descriptions[validLang],
    alternates: { canonical },
    openGraph: { title: titles[validLang], description: descriptions[validLang], url: canonical },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const validLang = ["ru", "kz", "en"].includes(lang) ? (lang as Lang) : "ru";
  const tData = await loadTranslations(validLang);
  const t = (key: string) => getNested(tData as Record<string, unknown>, key) ?? key;

  return (
    <div className="min-h-screen">
      {/* Hero — мягкий градиент в тон страницы, без резкого перехода */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="gradient-hero px-6 pt-14 pb-16 lg:px-8 lg:pt-20 lg:pb-20">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] lg:text-5xl">
              {t("common.siteName")}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
              {t("common.homeSlogan")}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 pb-12 lg:px-8">
        {/* Popular tools — 4–6 cards */}
        <section id="popular" className="-mt-6 mb-12">
          <h2 className="mb-4 text-xl font-semibold text-[var(--foreground)]">
            {t("home.popularTools")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_TOOLS.map(({ slug, category }) => {
              const tool = TOOLS[slug];
              if (!tool) return null;
              return (
                <Link
                  key={slug}
                  href={`/${validLang}/${category}/${slug}`}
                  className="tool-card flex items-start gap-4 p-4"
                >
                  <div className="shrink-0">
                    <ToolIcon toolName={slug} size="md" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-[var(--foreground)]">
                      {t(tool.nameKey)}
                    </span>
                    <p className="mt-0.5 text-sm text-[var(--muted)] line-clamp-2">
                      {getNested(tData as Record<string, unknown>, tool.descriptionKey.replace(".description", ".cardDescription")) ?? t(tool.descriptionKey)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Categories — gradient strip, 2–3 tool name examples */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-[var(--foreground)]">
            {t("home.categories")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(CATEGORIES).map(([catSlug, { key, tools }]) => {
              const exampleSlugs = tools.slice(0, 3);
              const exampleNames = exampleSlugs
                .map((s) => TOOLS[s]?.nameKey)
                .filter(Boolean)
                .map((k) => t(k));
              return (
                <Link
                  key={catSlug}
                  href={`/${validLang}/${catSlug}`}
                  className="tool-card block overflow-hidden"
                >
                  <div className="card-accent-line" aria-hidden />
                  <div className="p-4">
                    <span className="font-medium text-[var(--foreground)]">
                      {t(key)}
                    </span>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {tools.length} {t("home.toolsCount")}
                    </p>
                    {exampleNames.length > 0 && (
                      <p className="mt-2 text-xs text-[var(--muted)]">
                        {exampleNames.join(" · ")}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
