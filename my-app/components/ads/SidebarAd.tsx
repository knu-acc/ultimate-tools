"use client";

import { useAdsConsent } from "@/contexts/AdsConsentContext";
import { LazyAdSlot } from "./LazyAdSlot";
import { AdfoxRender } from "./AdfoxRender";
import { ADFOX_CONFIG } from "@/lib/adfox-config";

export function SidebarAd() {
  const { consent } = useAdsConsent();

  if (consent !== true || !ADFOX_CONFIG.enabled) return null;

  return (
    <div className="w-full my-4 flex justify-center">
      <LazyAdSlot minHeight={400} className="w-full flex justify-center">
        <AdfoxRender blockId={ADFOX_CONFIG.blocks.sidebar} minHeight={400} />
      </LazyAdSlot>
    </div>
  );
}
