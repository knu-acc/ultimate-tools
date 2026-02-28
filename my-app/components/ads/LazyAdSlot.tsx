"use client";

import { useEffect, useRef, useState } from "react";

type LazyAdSlotProps = {
  children: React.ReactNode;
  /** Min height to reserve space and avoid layout shift */
  minHeight?: number;
  className?: string;
};

/** Renders children only when the slot enters the viewport (Intersection Observer). */
export function LazyAdSlot({ children, minHeight = 90, className = "" }: LazyAdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e?.isIntersecting) setInView(true);
      },
      { rootMargin: "100px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ minHeight: inView ? undefined : minHeight }}
    >
      {inView ? children : (
        <div
          className="w-full bg-[var(--accent-muted)]/20 animate-pulse rounded-xl flex items-center justify-center"
          style={{ minHeight }}
        >
          <span className="text-xs text-[var(--muted)]">Реклама</span>
        </div>
      )}
    </div>
  );
}
