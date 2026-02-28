"use client";

import { useEffect, useState } from "react";
import { useAdsConsent } from "@/contexts/AdsConsentContext";
import { AdfoxRender } from "./AdfoxRender";
import { ADFOX_CONFIG } from "@/lib/adfox-config";

export function StickyBottomAd() {
  const [show, setShow] = useState(false);
  const { consent } = useAdsConsent();

  useEffect(() => {
    // Ждем пару секунд перед показом sticky-рекламы
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show || consent !== true || !ADFOX_CONFIG.enabled) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-2 px-2 lg:hidden pointer-events-none">
      <div className="pointer-events-auto bg-background/95 backdrop-blur shadow-lg border border-[var(--border)] rounded-t-xl p-2 pb-1 relative transition-all duration-300 w-full max-w-[400px]">
        {/* Кнопка закрытия (опционально) */}
        <button
          onClick={() => setShow(false)}
          className="absolute -top-3 -right-2 bg-background border border-[var(--border)] text-[var(--muted)] hover:text-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md z-10"
        >
          ✕
        </button>
        <AdfoxRender blockId={ADFOX_CONFIG.blocks.stickyBottom} minHeight={50} />
      </div>
    </div>
  );
}
