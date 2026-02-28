import Link from "next/link";
import { Type, Shuffle, Clock, Calculator, Image, Code, Share2, ArrowLeftRight, Key, MoreHorizontal } from "lucide-react";
import { loadTranslations, getNested } from "@/lib/i18n";
import { CATEGORIES, TOOLS } from "@/lib/tools-registry";
import type { Lang } from "@/lib/tools-registry";
import { PopularToolsSlider } from "@/components/PopularToolsSlider";
import type { Metadata } from "next";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  text: Type,
  random: Shuffle,
  time: Clock,
  math: Calculator,
  graphics: Image,
  "dev-tools": Code,
  social: Share2,
  converters: ArrowLeftRight,
  crypto: Key,
  misc: MoreHorizontal,
};

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
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] pb-2">
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
            <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent-hover)]" />
            <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
              {t("home.popularTools")}
            </h2>
          </div>
          <PopularToolsSlider
            items={FEATURED_TOOLS.map(({ slug, category }) => {
              const tool = TOOLS[slug];
              if (!tool) return { slug, category, title: slug, description: "" };
              const camelSlug = slug.split("-").map((s, i) => (i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1))).join("");
              const cardDesc = getNested(tData as Record<string, unknown>, `tools.${camelSlug}.cardDescription`);
              const description = (typeof cardDesc === "string" ? cardDesc : null) ?? t(tool.descriptionKey);
              return { slug, category, title: t(tool.nameKey), description };
            })}
            lang={validLang}
          />
        </section>

        {/* Categories */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent-hover)]" />
            <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
              {t("home.categories")}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
            {Object.entries(CATEGORIES).map(([catSlug, { key, tools }]) => {
              const Icon = CATEGORY_ICONS[catSlug] ?? MoreHorizontal;
              const descKey = catSlug === "dev-tools" ? "devTools" : catSlug;
              const catDescription = getNested(tData as Record<string, unknown>, `categories.${descKey}.description`);
              const exampleSlugs = tools.slice(0, 3);
              const exampleNames = exampleSlugs
                .map((s) => TOOLS[s]?.nameKey)
                .filter(Boolean)
                .map((k) => t(k));
              return (
                <Link
                  key={catSlug}
                  href={`/${validLang}/${catSlug}`}
                  className="block overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 transition-colors hover:border-[var(--accent)]/50 group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="shrink-0 p-2 rounded-lg bg-[var(--accent-muted)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors block truncate">
                        {t(key)}
                      </span>
                      <span className="text-xs font-medium text-[var(--muted)]">
                        {tools.length} {t("home.toolsCount")}
                      </span>
                    </div>
                  </div>
                  {typeof catDescription === "string" && (
                    <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2 mb-3">
                      {catDescription}
                    </p>
                  )}
                  {exampleNames.length > 0 && (
                    <p className="text-xs text-[var(--muted)] leading-relaxed truncate">
                      {exampleNames.join(", ")}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
