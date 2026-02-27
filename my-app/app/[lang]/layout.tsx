import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { loadTranslations, flattenTranslations } from "@/lib/i18n";
import type { Lang } from "@/lib/tools-registry";

const LANGS = ["ru", "kz", "en"] as const;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
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
