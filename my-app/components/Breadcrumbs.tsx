"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Lang } from "@/lib/tools-registry";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  lang: Lang;
  items: BreadcrumbItem[];
  translations: Record<string, string>;
}

export function Breadcrumbs({ lang, items, translations }: BreadcrumbsProps) {
  const t = (key: string) => translations[key] ?? key;
  return (
    <nav aria-label={t("toolPage.breadcrumbs")} className="flex items-center gap-1 text-sm text-[var(--muted)]">
      <Link href={`/${lang}`} className="hover:text-[var(--accent)] transition-colors">
        {t("nav.home")}
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link href={item.href} className="hover:text-[var(--accent)] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--foreground)]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
