"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Wrench } from "lucide-react";
import { TOOLS, CATEGORIES } from "@/lib/tools-registry";
import type { Lang } from "@/lib/tools-registry";

type SearchModalProps = {
  lang: Lang;
  translations: Record<string, string>;
  open: boolean;
  onClose: () => void;
};

function getToolList(): { slug: string; category: string }[] {
  const list: { slug: string; category: string }[] = [];
  for (const [cat, { tools }] of Object.entries(CATEGORIES)) {
    for (const slug of tools) {
      if (TOOLS[slug]) list.push({ slug, category: cat });
    }
  }
  return list;
}

const TOOL_LIST = getToolList();

export function SearchModal({ lang, translations, open, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const t = (key: string) => translations[key] ?? key;

  const filtered = useMemo(() => {
    if (!query.trim()) return TOOL_LIST.slice(0, 20);
    const q = query.toLowerCase().trim();
    return TOOL_LIST.filter(({ slug }) => {
      const meta = TOOLS[slug];
      const name = t(meta.nameKey).toLowerCase();
      const desc = t(meta.descriptionKey).toLowerCase();
      return name.includes(q) || desc.includes(q) || slug.replace(/-/g, " ").includes(q);
    });
  }, [query, translations]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => (s + 1) % Math.max(1, filtered.length));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => (s - 1 + filtered.length) % Math.max(1, filtered.length));
      }
      if (e.key === "Enter" && filtered[selected]) {
        e.preventDefault();
        const { slug, category } = filtered[selected];
        onClose();
        router.push(`/${lang}/${category}/${slug}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, filtered, selected, lang, router]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center pt-[15vh] px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
          <Search className="h-5 w-5 text-[var(--muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("common.search")}
            className="flex-1 bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline text-xs text-[var(--muted)] px-2 py-1 rounded bg-[var(--border)]/50">Esc</kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-sm text-[var(--muted)]">Ничего не найдено</p>
          ) : (
            filtered.map(({ slug, category }, i) => {
              const meta = TOOLS[slug];
              const isSelected = i === selected;
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push(`/${lang}/${category}/${slug}`);
                  }}
                  onMouseEnter={() => setSelected(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${isSelected ? "bg-[var(--accent)]/20 text-[var(--accent)]" : "hover:bg-[var(--border)]/20"}`}
                >
                  <Wrench className="h-4 w-4 shrink-0 text-[var(--muted)]" />
                  <span className="font-medium">{t(meta.nameKey)}</span>
                  <span className="text-xs text-[var(--muted)] truncate">{t(meta.descriptionKey)}</span>
                </button>
              );
            })
          )}
        </div>
        <div className="border-t border-[var(--border)] px-4 py-2 text-xs text-[var(--muted)]">
          ↑↓ навигация · Enter открыть
        </div>
      </div>
    </div>
  );
}
