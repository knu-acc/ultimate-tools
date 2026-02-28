"use client";

import { useAdsConsent } from "@/contexts/AdsConsentContext";
import { LazyAdSlot } from "./LazyAdSlot";
import { AdfoxRender } from "./AdfoxRender";
import { ADFOX_CONFIG } from "@/lib/adfox-config";

export function MidContentAd() {
  const { consent } = useAdsConsent();

  if (consent !== true || !ADFOX_CONFIG.enabled) return null;

  return (
    <LazyAdSlot minHeight={250} className="w-full my-6 flex justify-center">
      <AdfoxRender blockId={ADFOX_CONFIG.blocks.midContent} minHeight={250} />
    </LazyAdSlot>
  );
}
