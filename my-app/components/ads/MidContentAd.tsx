"use client";

import { useAdsConsent } from "@/contexts/AdsConsentContext";
import { LazyAdSlot } from "./LazyAdSlot";

export function MidContentAd() {
  const { consent } = useAdsConsent();

  return (
    <LazyAdSlot minHeight={250} className="w-full my-6">
      <div className="w-full bg-background border border-[var(--border)] rounded-xl overflow-hidden relative">
        {consent === true ? (
          <div className="w-full min-h-[250px] flex items-center justify-center bg-[var(--accent-muted)]/10 text-sm text-[var(--muted)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <span>[Реклама: Mid Content 300x250 / Native]</span>
          </div>
        ) : (
          <div className="w-full min-h-[250px] flex items-center justify-center bg-[var(--accent-muted)]/5 text-xs text-[var(--muted)]">
            Реклама отключена
          </div>
        )}
      </div>
    </LazyAdSlot>
  );
}
