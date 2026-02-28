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
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--background)] relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-50" />
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 relative z-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 pr-0 lg:pr-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--foreground)]">
              {t("footer.aboutTitle")}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
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
              {t("footer.socialTitle")}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-3">
              <li>
                <a
                  href="https://t.me/ultimate_tools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                  aria-label="Telegram"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href="https://vk.com/ultimate_tools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                  aria-label="ВКонтакте"
                >
                  ВКонтакте
                </a>
              </li>
            </ul>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)] mt-6">
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
              <li>
                <Link
                  href={`/${lang}/about`}
                  className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                >
                  {t("footer.aboutLink")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/privacy`}
                  className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                >
                  {t("footer.privacyLink")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/terms`}
                  className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                >
                  {t("footer.termsLink")}
                </Link>
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
