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
      {/* Hero */}
      <section className="border-b border-[var(--border)] bg-[var(--bg-subtle)]">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text)] leading-tight">
            <span className="text-[var(--accent)]">{t("common.siteName")}</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-lg text-[var(--text-muted)] leading-relaxed">
            {t("common.homeSlogan")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#popular" className="btn-primary btn-primary-lg">
              {t("home.ctaTry")}
            </a>
            <a href="#popular" className="btn-secondary" style={{height: '46px', padding: '0 28px', fontSize: '15px', borderRadius: 'var(--radius-lg)'}}>
              {t("home.ctaChoose")}
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8 lg:py-14">
        {/* Popular tools */}
        <section id="popular" className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="block w-1 h-6 rounded-full bg-[var(--accent)]" />
            <h2 className="text-xl font-bold text-[var(--text)]">
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
          <div className="flex items-center gap-3 mb-5">
            <span className="block w-1 h-6 rounded-full bg-[var(--accent)]" />
            <h2 className="text-xl font-bold text-[var(--text)]">
              {t("home.categories")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(CATEGORIES).map(([catSlug, { key, tools }]) => {
              const Icon = CATEGORY_ICONS[catSlug] ?? MoreHorizontal;
              const descKey = catSlug === "dev-tools" ? "devTools" : catSlug;
              const catDescription = getNested(tData as Record<string, unknown>, `categories.${descKey}.description`);
              const exampleSlugs = tools.slice(0, 3);
              const exampleNames = exampleSlugs
                .map((s) => TOOLS[s]?.nameKey)
                .filter(Boolean)
                .map((k) => t(k));

              const CategoryCard = (
                <Link
                  key={catSlug}
                  href={`/${validLang}/${catSlug}`}
                  className="tool-card group flex flex-col p-5"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="shrink-0 p-2 rounded-lg bg-[var(--accent-muted)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors duration-150">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors block truncate">
                        {t(key)}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {tools.length} {t("home.toolsCount")}
                      </span>
                    </div>
                  </div>
                  {typeof catDescription === "string" && (
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2 mb-2 flex-1">
                      {catDescription}
                    </p>
                  )}
                  {exampleNames.length > 0 && (
                    <p className="text-xs text-[var(--text-faint)] truncate mt-auto">
                      {exampleNames.join(", ")}
                    </p>
                  )}
                </Link>
              );
              return CategoryCard;
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
