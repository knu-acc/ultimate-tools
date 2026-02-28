"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Type, Shuffle, Clock, Calculator, Image, Code, Share2, ArrowLeftRight, Key, MoreHorizontal } from "lucide-react";
import { CATEGORIES, TOOLS } from "@/lib/tools-registry";
import type { Lang } from "@/lib/tools-registry";

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

interface MobileNavProps {
  lang: Lang;
  translations: Record<string, string>;
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ lang, translations, open, onClose }: MobileNavProps) {
  const t = (key: string) => translations[key] ?? key;
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const currentCategory = segments[1];
  const currentTool = segments[2];

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Навигация"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-[min(320px,85vw)] bg-[var(--background)] border-l border-[var(--border)] shadow-2xl animate-in slide-in-from-right duration-200 overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <span className="font-semibold">{t("nav.home")}</span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--border)]/30"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          <Link
            href={`/${lang}`}
            onClick={onClose}
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm ${!currentCategory ? "bg-[var(--accent)]/20 font-medium text-[var(--accent)]" : ""}`}
          >
            {t("nav.home")}
          </Link>
          {Object.entries(CATEGORIES).map(([slug, { key, tools }]) => {
            const Icon = CATEGORY_ICONS[slug] ?? MoreHorizontal;
            const isActive = currentCategory === slug;
            return (
              <div key={slug}>
                <Link
                  href={`/${lang}/${slug}`}
                  onClick={onClose}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm ${isActive ? "bg-[var(--accent)]/20 font-medium text-[var(--accent)]" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                  {t(key)}
                </Link>
                {isActive && tools.length > 0 && (
                  <div className="ml-6 mt-1 space-y-0.5 pl-2 border-l border-[var(--border)]">
                    {tools.map((toolSlug) => (
                      <Link
                        key={toolSlug}
                        href={`/${lang}/${slug}/${toolSlug}`}
                        onClick={onClose}
                        className={`block rounded-lg px-2 py-2 text-sm ${currentTool === toolSlug ? "font-medium text-[var(--accent)]" : "text-[var(--muted)]"}`}
                      >
                        {TOOLS[toolSlug] ? t(TOOLS[toolSlug].nameKey) : toolSlug}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
