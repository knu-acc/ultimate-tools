import Link from "next/link";
import { loadTranslations, getNested } from "@/lib/i18n";
import type { Lang } from "@/lib/tools-registry";
import type { Metadata } from "next";

const LANGS = ["ru", "kz", "en"] as const;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const validLang = ["ru", "kz", "en"].includes(lang) ? (lang as Lang) : "ru";
  const tData = await loadTranslations(validLang);
  const title = getNested(tData as Record<string, unknown>, "pages.terms.title") ?? "Условия использования | Ultimate Tools";
  return { title };
}

export default async function TermsPage({
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
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">
          {t("pages.terms.title")}
        </h1>
        <div className="prose prose-[var(--foreground)] space-y-4 text-[var(--muted)] leading-relaxed">
          <p>{t("pages.terms.p1")}</p>
          <p>{t("pages.terms.p2")}</p>
          <p>{t("pages.terms.p3")}</p>
        </div>
        <p className="mt-8">
          <Link href={`/${validLang}`} className="text-[var(--accent)] hover:underline">
            ← {t("footer.home")}
          </Link>
        </p>
      </div>
    </div>
  );
}
