import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ut_recent_tools';
const MAX_RECENT = 8;

export function useRecentTools() {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecentSlugs(JSON.parse(stored));
    } catch {}
  }, []);

  const addRecentTool = useCallback((slug: string) => {
    setRecentSlugs(prev => {
      const filtered = prev.filter(s => s !== slug);
      const updated = [slug, ...filtered].slice(0, MAX_RECENT);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  return { recentSlugs, addRecentTool };
}
