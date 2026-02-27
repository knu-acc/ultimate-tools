"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Wrench, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/tools-registry";
import { LANGUAGES } from "@/lib/i18n";

interface HeaderProps {
  lang: Lang;
  translations: Record<string, string>;
}

export function Header({ lang, translations }: HeaderProps) {
  const t = (key: string) => translations[key] ?? key;
  const { theme, setTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-xl shadow-sm">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        <Link
          href={`/${lang}`}
          className="flex items-center gap-2 font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
        >
          <Wrench className="h-6 w-6" />
          <span>{t("common.siteName")}</span>
        </Link>

        <div className="flex items-center gap-2">
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
                      className={`block rounded-lg px-3 py-2 text-sm hover:bg-[var(--accent)]/20 ${
                        l.code === lang ? "font-semibold text-[var(--accent)]" : ""
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
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[var(--accent)]/20 ${
                      theme === "light" ? "font-semibold text-[var(--accent)]" : ""
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
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[var(--accent)]/20 ${
                      theme === "dark" ? "font-semibold text-[var(--accent)]" : ""
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
  );
}
