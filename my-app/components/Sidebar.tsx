"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Type,
  Shuffle,
  Clock,
  Calculator,
  Image,
  Code,
  Share2,
  ArrowLeftRight,
  Key,
  MoreHorizontal,
} from "lucide-react";
import type { Lang } from "@/lib/tools-registry";
import { CATEGORIES, TOOLS } from "@/lib/tools-registry";

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

interface SidebarProps {
  lang: Lang;
  translations: Record<string, string>;
}

export function Sidebar({ lang, translations }: SidebarProps) {
  const t = (key: string) => translations[key] ?? key;
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const currentCategory = segments[1];
  const currentTool = segments[2];
  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto border-r border-[var(--border)] bg-[var(--background)]/80 p-4 lg:block">
      <nav className="space-y-1">
        <Link
          href={`/${lang}`}
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
            !currentCategory
              ? "bg-[var(--accent)]/20 font-medium text-[var(--accent)]"
              : "hover:bg-[var(--border)]/30"
          }`}
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
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                  isActive ? "bg-[var(--accent)]/20 font-medium text-[var(--accent)]" : "hover:bg-[var(--border)]/30"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t(key)}
              </Link>
              {isActive && tools.length > 0 && (
                <div className="ml-4 mt-1 space-y-0.5 border-l border-[var(--border)] pl-3">
                  {tools.map((toolSlug) => (
                    <Link
                      key={toolSlug}
                      href={`/${lang}/${slug}/${toolSlug}`}
                      className={`block rounded-lg px-2 py-1.5 text-xs transition-colors ${
                        currentTool === toolSlug
                          ? "font-medium text-[var(--accent)]"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      }`}
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

      {/* Ad placeholder */}
      <div className="mt-8">
        <div className="w-full min-h-[200px] bg-[var(--accent-muted)]/10 border border-[var(--border)] rounded-xl flex items-center justify-center text-xs text-[var(--muted)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          [Sidebar Ad]
        </div>
      </div>
    </aside>
  );
}
