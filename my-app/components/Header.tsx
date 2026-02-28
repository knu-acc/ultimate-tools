"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Wrench, ChevronDown, Search, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/tools-registry";
import { LANGUAGES } from "@/lib/i18n";
import { SearchModal } from "@/components/SearchModal";
import { MobileNav } from "@/components/MobileNav";

interface HeaderProps {
  lang: Lang;
  translations: Record<string, string>;
}

export function Header({ lang, translations }: HeaderProps) {
  const t = (key: string) => translations[key] ?? key;
  const { theme, setTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/70 backdrop-blur-2xl transition-all duration-300">
        <div className="flex h-16 items-center justify-between px-4 lg:px-8 mx-auto max-w-[1400px]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--border)]/30"
              aria-label="Меню"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link
              href={`/${lang}`}
              className="flex items-center gap-2 font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
            >
              <Wrench className="h-6 w-6" />
              <span>{t("common.siteName")}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--border)]/30 transition-colors"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">{t("common.search")}</span>
              <kbd className="hidden md:inline text-xs px-1.5 py-0.5 rounded bg-[var(--border)]/50">⌘K</kbd>
            </button>
          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setLangOpen(!langOpen);
                setThemeOpen(false);
              }}
              className="flex items-center gap-1 rounded-xl border border-[var(--border)] bg-transparent px-3 py-2 text-sm hover:bg-[var(--border)]/30 transition-colors"
              aria-label={t("common.language")}
            >
              {lang.toUpperCase()}
              <ChevronDown className="h-4 w-4" />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 top-full mt-1 rounded-xl border border-[var(--border)] bg-[var(--background)] p-1 shadow-lg backdrop-blur-xl"
                >
                  {LANGUAGES.map((l) => (
                    <Link
                      key={l.code}
                      href={`/${l.code}`}
                      className={`block rounded-lg px-3 py-2 text-sm hover:bg-[var(--accent)]/20 ${l.code === lang ? "font-semibold text-[var(--accent)]" : ""
                        }`}
                      onClick={() => setLangOpen(false)}
                    >
                      {l.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setThemeOpen(!themeOpen);
                setLangOpen(false);
              }}
              className="rounded-xl border border-[var(--border)] bg-transparent p-2 hover:bg-[var(--border)]/30 transition-colors"
              aria-label={t("common.theme")}
            >
              {theme === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>
            <AnimatePresence>
              {themeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 top-full mt-1 rounded-xl border border-[var(--border)] bg-[var(--background)] p-1 shadow-lg backdrop-blur-xl"
                >
                  <button
                    onClick={() => {
                      setTheme("light");
                      setThemeOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[var(--accent)]/20 ${theme === "light" ? "font-semibold text-[var(--accent)]" : ""
                      }`}
                  >
                    <Sun className="h-4 w-4" />
                    {t("common.light")}
                  </button>
                  <button
                    onClick={() => {
                      setTheme("dark");
                      setThemeOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[var(--accent)]/20 ${theme === "dark" ? "font-semibold text-[var(--accent)]" : ""
                      }`}
                  >
                    <Moon className="h-4 w-4" />
                    {t("common.dark")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>

      <SearchModal lang={lang} translations={translations} open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileNav lang={lang} translations={translations} open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
