import Link from "next/link";
import { loadTranslations, getNested } from "@/lib/i18n";
import { CATEGORIES, TOOLS } from "@/lib/tools-registry";
import type { Lang } from "@/lib/tools-registry";
import { ToolIcon } from "@/components/ToolIcon";
import { FavoriteStar } from "@/components/FavoriteStar";
import { TopBannerAd } from "@/components/ads/TopBannerAd";
import { MidContentAd } from "@/components/ads/MidContentAd";
import { InGridAd } from "@/components/ads/InGridAd";
import { Fragment } from "react";
import type { Metadata } from "next";

const LANGS = ["ru", "kz", "en"] as const;

export function generateStaticParams() {
  const params: { lang: string; category: string }[] = [];
  for (const lang of LANGS) {
    for (const category of Object.keys(CATEGORIES)) {
      params.push({ lang, category });
    }
  }
  return params;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ultimate-tools.example.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; category: string }>;
}): Promise<Metadata> {
  const { lang, category } = await params;
  const validLang = ["ru", "kz", "en"].includes(lang) ? (lang as Lang) : "ru";
  const cat = CATEGORIES[category];
  if (!cat) return { title: "Ultimate Tools" };
  const tData = await loadTranslations(validLang);
  const t = (key: string) => getNested(tData as Record<string, unknown>, key) ?? key;
  const categoryName = t(cat.key);
  const catDescKey = `categories.${category}.description`;
  const catDesc = getNested(tData as Record<string, unknown>, catDescKey);
  const titles = { ru: `${categoryName} — инструменты онлайн`, kz: `${categoryName} — онлайн құралдар`, en: `${categoryName} — Online Tools` };
  const descriptions = {
    ru: catDesc && typeof catDesc === "string" ? catDesc : `Бесплатные онлайн-инструменты: ${categoryName}. Все расчёты в браузере, без регистрации.`,
    kz: catDesc && typeof catDesc === "string" ? catDesc : `Тегін онлайн құралдар: ${categoryName}. Браузерде, тіркеусіз.`,
    en: catDesc && typeof catDesc === "string" ? catDesc : `Free online tools: ${categoryName}. All in browser, no signup.`,
  };
  const canonical = `${BASE_URL}/${validLang}/${category}`;
  return {
    title: titles[validLang],
    description: descriptions[validLang],
    alternates: { canonical },
    openGraph: { title: titles[validLang], description: descriptions[validLang], url: canonical },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ lang: string; category: string }>;
}) {
  const { lang, category } = await params;
  const validLang = ["ru", "kz", "en"].includes(lang) ? (lang as Lang) : "ru";
  const cat = CATEGORIES[category];
  if (!cat) return null;

  const tData = await loadTranslations(validLang);
  const t = (key: string) => getNested(tData as Record<string, unknown>, key) ?? key;
  const catDescKey = `categories.${category}.description`;
  const catDescription = t(catDescKey) !== catDescKey ? t(catDescKey) : null;

  return (
    <div className="min-h-screen">
      <div className="bg-[var(--background)] border-b border-[var(--border)] relative overflow-hidden">
        <div className="bg-noise" />
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16 relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] pb-2">
            {t(cat.key)}
          </h1>
          {catDescription && (
            <p className="mt-4 max-w-2xl mx-auto text-lg text-[var(--muted)] leading-relaxed">
              {catDescription}
            </p>
          )}
        </div>
      </div>

      {/* Top Banner specific to category page */}
      <div className="mx-auto max-w-5xl px-6 pt-6 lg:px-8">
        <TopBannerAd />
      </div>

      <div className="mx-auto max-w-5xl px-6 py-6 lg:px-8 lg:py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cat.tools.map((toolSlug, i) => {
            const tool = TOOLS[toolSlug];
            if (!tool) return null;
            
            const ToolCard = (
              <div key={toolSlug} className="relative h-full h-min-[160px]">
                <Link
                  href={`/${validLang}/${category}/${toolSlug}`}
                  className="tool-card group flex flex-col p-5 h-full"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="shrink-0 p-2.5 rounded-xl bg-[var(--accent-muted)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors duration-300">
                      <ToolIcon toolName={toolSlug} size="md" />
                    </div>
                    <span className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors duration-300">
                      {t(tool.nameKey)}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--muted)] leading-relaxed flex-1">
                    {getNested(tData as Record<string, unknown>, tool.descriptionKey.replace(".description", ".cardDescription")) ?? t(tool.descriptionKey)}
                  </p>
                </Link>
                <FavoriteStar slug={toolSlug} className="absolute top-3 right-3" />
              </div>
            );

            // Вставляем рекламу в сетку после 3-го и 8-го инструмента
            if (i === 2 || i === 7) {
              return (
                <Fragment key={`fragment-${toolSlug}`}>
                  {ToolCard}
                  <div key={`cat-grid-ad-${i}`} className="col-span-1 border border-[var(--border)] rounded-xl overflow-hidden min-h-[160px]">
                    <InGridAd />
                  </div>
                </Fragment>
              );
            }
            return ToolCard;
          })}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-12 lg:px-8">
        <MidContentAd />
      </div>
    </div>
  );
}
