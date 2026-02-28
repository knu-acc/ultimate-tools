"use client";

import { useEffect, useState } from "react";

export function MidContentAd() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[250px] bg-[var(--accent-muted)]/30 animate-pulse rounded-xl my-6 flex items-center justify-center">
        <span className="text-sm text-[var(--muted)]">Загрузка рекламы...</span>
      </div>
    );
  }

  return (
    <div className="w-full my-6 bg-background border border-[var(--border)] rounded-xl overflow-hidden relative">
      <div className="w-full min-h-[250px] flex items-center justify-center bg-[var(--accent-muted)]/10 text-sm text-[var(--muted)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
        <span>[Реклама: Mid Content 300x250 / Native]</span>
      </div>
    </div>
  );
}
