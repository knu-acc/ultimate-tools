"use client";

import { createContext, useContext, useCallback, useState, useEffect } from "react";

const STORAGE_KEY = "ultimate-tools-favorites";

type FavoritesContextValue = {
  favorites: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  useEffect(() => {
    if (favorites.length === 0 && typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const has = useCallback((slug: string) => favorites.includes(slug), [favorites]);
  const toggle = useCallback((slug: string) => {
    setFavorites((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, has, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  return ctx ?? { favorites: [], has: () => false, toggle: () => {} };
}
