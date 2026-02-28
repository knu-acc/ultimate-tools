import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { loadTranslations, flattenTranslations } from "@/lib/i18n";
import type { Lang } from "@/lib/tools-registry";
import { SetDocumentLang } from "@/components/SetDocumentLang";
import type { Metadata } from "next";

const LANGS = ["ru", "kz", "en"] as const;
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ultimate-tools.example.com";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const hreflangAlternates: Record<string, string> = {};
  for (const l of LANGS) {
    const bcp47 = l === "kz" ? "kk" : l;
    hreflangAlternates[bcp47] = `${BASE_URL}/${l}`;
  }
  hreflangAlternates["x-default"] = `${BASE_URL}/ru`;

  return {
    alternates: {
      canonical: `${BASE_URL}/${lang}`,
      languages: hreflangAlternates,
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const validLang = ["ru", "kz", "en"].includes(lang) ? (lang as Lang) : "ru";
  const tData = await loadTranslations(validLang);
  const translations = flattenTranslations(tData as Record<string, unknown>);

  return (
    <div className="flex min-h-screen flex-col">
      <SetDocumentLang lang={validLang} />
      <Header lang={validLang} translations={translations} />
      <div className="flex flex-1">
        <Sidebar lang={validLang} translations={translations} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">{children}</main>
          <Footer lang={validLang} translations={translations} />
        </div>
      </div>
    </div>
  );
}
