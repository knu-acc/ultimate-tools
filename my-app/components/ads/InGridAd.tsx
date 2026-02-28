"use client";

import { useAdsConsent } from "@/contexts/AdsConsentContext";
import { LazyAdSlot } from "./LazyAdSlot";
import { AdfoxRender } from "./AdfoxRender";
import { ADFOX_CONFIG } from "@/lib/adfox-config";

export function InGridAd() {
  const { consent } = useAdsConsent();

  if (consent !== true || !ADFOX_CONFIG.enabled) return null;

  return (
    <LazyAdSlot minHeight={250} className="h-full w-full rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--background)] flex items-center justify-center min-h-[250px]">
      <AdfoxRender blockId={ADFOX_CONFIG.blocks.inGrid} minHeight={250} />
    </LazyAdSlot>
  );
}
