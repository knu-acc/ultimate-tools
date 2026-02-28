const fs = require('fs');

const newSlider = `"use client";

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
    scrollRef.current.scrollBy({
      left: dir === "left" ? -560 : 560,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group/slider">
      {/* Scroll track */}
      <div
        ref={scrollRef}
        className="hidden-scrollbar flex gap-4 overflow-x-auto pb-1"
        style={{ scrollSnapType: "x mandatory" }}
        aria-label="Популярные инструменты"
      >
        {items.map(({ slug, category, title, description }) => (
          <div
            key={slug}
            className="relative flex-shrink-0 w-[280px]"
            style={{ scrollSnapAlign: "start" }}
          >
            <Link
              href={\`/\${lang}/\${category}/\${slug}\`}
              className="tool-card group flex flex-col p-5 h-full"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="shrink-0 p-2 rounded-lg bg-[var(--accent-muted)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors duration-150">
                  <ToolIcon toolName={slug} size="md" />
                </div>
                <span className="font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors truncate">
                  {title}
                </span>
              </div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed flex-1 line-clamp-3">
                {description}
              </p>
            </Link>
            <FavoriteStar slug={slug} className="absolute top-3 right-3 z-10" />
          </div>
        ))}
      </div>

      {/* Nav buttons — visible on md+ screens */}
      <button
        type="button"
        onClick={() => scroll("left")}
        className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-sm text-[var(--text-muted)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-colors"
        aria-label="Назад"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-sm text-[var(--text-muted)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-colors"
        aria-label="Вперёд"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
`;

fs.writeFileSync('c:/Users/Овсянка/Desktop/pil-cpy-app/my-app/components/PopularToolsSlider.tsx', newSlider, 'utf8');
console.log('Slider rewritten.');
