"use client";

import { useEffect, useState } from "react";
import { useAdsConsent } from "@/contexts/AdsConsentContext";

export function StickyBottomAd() {
  const [show, setShow] = useState(false);
  const { consent } = useAdsConsent();

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show || consent !== true) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-2 px-2 lg:hidden pointer-events-none">
      <div className="pointer-events-auto bg-background/95 backdrop-blur shadow-lg border border-[var(--border)] rounded-t-xl p-2 pb-1 relative transition-all duration-300 w-full max-w-[400px]">
        <div className="w-full flex items-center justify-center h-[50px] bg-[var(--accent-muted)]/20 text-xs text-[var(--muted)] overflow-hidden rounded relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          [Sticky Mobile Ad 320x50]
        </div>
      </div>
    </div>
  );
}
