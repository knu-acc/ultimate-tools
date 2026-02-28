"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ToolIcon } from "@/components/ToolIcon";
import { FavoriteStar } from "@/components/FavoriteStar";

export type PopularToolItem = {
  slug: string;
  category: string;
  title: string;
  description: string;
};

interface PopularToolsSliderProps {
  items: PopularToolItem[];
  lang: string;
}

export function PopularToolsSlider({ items, lang }: PopularToolsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.clientWidth * 0.85;
    scrollRef.current.scrollBy({ left: dir === "left" ? -width : width, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        aria-label="Популярные инструменты"
      >
        {items.map(({ slug, category, title, description }) => (
          <div
            key={slug}
            className="relative flex-shrink-0 w-[min(85vw,320px)] sm:w-[280px] lg:w-[300px]"
            style={{ scrollSnapAlign: "start" }}
          >
            <Link
              href={`/${lang}/${category}/${slug}`}
              className="tool-card group flex flex-col p-5 h-full block border border-[var(--border)] rounded-xl hover:border-[var(--accent)]/50 transition-colors"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="shrink-0 p-2.5 rounded-xl bg-[var(--accent-muted)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors duration-300">
                  <ToolIcon toolName={slug} size="md" />
                </div>
                <span className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors duration-300 truncate">
                  {title}
                </span>
              </div>
              <p className="text-sm text-[var(--muted)] leading-relaxed flex-1 line-clamp-3">
                {description}
              </p>
            </Link>
            <FavoriteStar slug={slug} className="absolute top-3 right-3 z-10" />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 rounded-full bg-[var(--background)] border border-[var(--border)] shadow-md flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-colors hidden sm:flex"
        aria-label="Предыдущий"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 rounded-full bg-[var(--background)] border border-[var(--border)] shadow-md flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-colors hidden sm:flex"
        aria-label="Следующий"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
