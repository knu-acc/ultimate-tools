import Link from "next/link";
import { loadTranslations, getNested } from "@/lib/i18n";
import { CATEGORIES, TOOLS } from "@/lib/tools-registry";
import type { Lang } from "@/lib/tools-registry";
import { ToolIcon } from "@/components/ToolIcon";
import { FavoriteStar } from "@/components/FavoriteStar";
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
      {/* Premium Hero with Subtle Noise and Gradients */}
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--background)]">
        <div className="bg-noise" />
        <div className="gradient-hero px-6 py-20 lg:px-8 lg:py-28 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-purple-500 pb-2">
              {t("common.siteName")}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-[var(--muted)] leading-relaxed">
              {t("common.homeSlogan")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#popular"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3 text-base font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
              >
                {t("home.ctaTry")}
              </a>
              <a
                href="#popular"
                className="inline-flex items-center justify-center rounded-xl border-2 border-[var(--accent)] px-6 py-3 text-base font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
              >
                {t("home.ctaChoose")}
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
        {/* Popular tools */}
        <section id="popular" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-[var(--accent)] to-purple-500" />
            <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
              {t("home.popularTools")}
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_TOOLS.map(({ slug, category }) => {
              const tool = TOOLS[slug];
              if (!tool) return null;
              return (
                <div key={slug} className="relative">
                  <Link
                    href={`/${validLang}/${category}/${slug}`}
                    className="tool-card group flex flex-col p-5"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="shrink-0 p-2.5 rounded-xl bg-[var(--accent-muted)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors duration-300">
                        <ToolIcon toolName={slug} size="md" />
                      </div>
                      <span className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors duration-300">
                        {t(tool.nameKey)}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--muted)] leading-relaxed flex-1">
                      {getNested(tData as Record<string, unknown>, tool.descriptionKey.replace(".description", ".cardDescription")) ?? t(tool.descriptionKey)}
                    </p>
                  </Link>
                  <FavoriteStar slug={slug} className="absolute top-3 right-3" />
                </div>
              );
            })}
          </div>
        </section>

        {/* Categories */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
            <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
              {t("home.categories")}
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                  className="tool-card block overflow-hidden group"
                >
                  <div className="card-accent-line" aria-hidden />
                  <div className="p-5 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-lg text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                        {t(key)}
                      </span>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--accent-muted)] text-[var(--accent)]">
                        {tools.length}
                      </span>
                    </div>
                    {exampleNames.length > 0 && (
                      <p className="mt-auto pt-4 text-sm text-[var(--muted)] leading-relaxed">
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
