import Link from "next/link";
import type { Lang } from "@/lib/tools-registry";
import { CATEGORIES } from "@/lib/tools-registry";

interface FooterProps {
  lang: Lang;
  translations: Record<string, string>;
}

export function Footer({ lang, translations }: FooterProps) {
  const t = (key: string) => translations[key] ?? key;

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
              {t("footer.aboutTitle")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              {t("footer.about")}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
              {t("footer.categoriesTitle")}
            </h2>
            <ul className="mt-3 space-y-2">
              {Object.keys(CATEGORIES).map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/${lang}/${slug}`}
                    className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                  >
                    {t(CATEGORIES[slug].key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
              {t("footer.linksTitle")}
            </h2>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href={`/${lang}`}
                  className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                >
                  {t("footer.home")}
                </Link>
              </li>
              <li>
                <a
                  href={`/${lang}#popular`}
                  className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                >
                  {t("footer.popularTools")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-[var(--border)] pt-6 text-center text-sm text-[var(--muted)]">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
