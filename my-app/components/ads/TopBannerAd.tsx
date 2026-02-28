"use client";

import { useAdsConsent } from "@/contexts/AdsConsentContext";
import { LazyAdSlot } from "./LazyAdSlot";
import { AdfoxRender } from "./AdfoxRender";
import { ADFOX_CONFIG } from "@/lib/adfox-config";

export function TopBannerAd() {
  const { consent } = useAdsConsent();

  // Если нет согласия или локально отключено, не рендерим ничего
  if (consent !== true || !ADFOX_CONFIG.enabled) return null;

  return (
    <LazyAdSlot minHeight={90} className="w-full my-4">
      <AdfoxRender blockId={ADFOX_CONFIG.blocks.topBanner} minHeight={90} />
    </LazyAdSlot>
  );
}
