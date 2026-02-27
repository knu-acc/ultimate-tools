import Link from "next/link";
import { loadTranslations, getNested } from "@/lib/i18n";
import { CATEGORIES, TOOLS } from "@/lib/tools-registry";
import type { Lang } from "@/lib/tools-registry";
import { ToolIcon } from "@/components/ToolIcon";
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
      <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
        <h1 className="mb-2 text-3xl font-bold text-[var(--foreground)]">
          {t(cat.key)}
        </h1>
        {catDescription && (
          <p className="mb-8 text-[var(--muted)]">
            {catDescription}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cat.tools.map((toolSlug) => {
            const tool = TOOLS[toolSlug];
            if (!tool) return null;
            return (
              <Link
                key={toolSlug}
                href={`/${validLang}/${category}/${toolSlug}`}
                className="tool-card block overflow-hidden"
              >
                <div className="card-accent-line" aria-hidden />
                <div className="flex items-start gap-4 p-4">
                  <div className="shrink-0">
                    <ToolIcon toolName={toolSlug} size="sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-[var(--foreground)]">
                      {t(tool.nameKey)}
                    </span>
                    <p className="mt-0.5 text-sm text-[var(--muted)] line-clamp-2">
                      {getNested(tData as Record<string, unknown>, tool.descriptionKey.replace(".description", ".cardDescription")) ?? t(tool.descriptionKey)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
