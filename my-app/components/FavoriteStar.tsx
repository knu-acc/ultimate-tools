"use client";

import { Star } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";

interface FavoriteStarProps {
  slug: string;
  className?: string;
}

export function FavoriteStar({ slug, className = "" }: FavoriteStarProps) {
  const { has, toggle } = useFavorites();
  const isFav = has(slug);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={`p-1.5 rounded-lg transition-colors ${isFav ? "text-amber-500 hover:bg-amber-500/20" : "text-[var(--muted)] hover:text-amber-500 hover:bg-[var(--border)]/30"} ${className}`}
      aria-label={isFav ? "Убрать из избранного" : "Добавить в избранное"}
      title={isFav ? "Убрать из избранного" : "В избранное"}
    >
      <Star className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
    </button>
  );
}
