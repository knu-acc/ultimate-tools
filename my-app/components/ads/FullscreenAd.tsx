"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAdsConsent } from "@/contexts/AdsConsentContext";
import { ADFOX_CONFIG } from "@/lib/adfox-config";

export function FullscreenAd() {
  const { consent } = useAdsConsent();
  const pathname = usePathname();

  useEffect(() => {
    if (consent !== true || !ADFOX_CONFIG.enabled) return;

    // Срабатывает при загрузке и смене роута (полноэкранный блок Adfox)
    try {
      window.yaContextCb = window.yaContextCb || [];
      window.yaContextCb.push(() => {
        if (window.Ya && window.Ya.Context) {
          window.Ya.Context.AdvManager.render({
            renderTo: ADFOX_CONFIG.blocks.fullscreen,
            blockId: ADFOX_CONFIG.blocks.fullscreen,
          });
        }
      });
    } catch (e) {
      console.error("Fullscreen Adfox render error:", e);
    }
  }, [consent, pathname]);

  if (consent !== true || !ADFOX_CONFIG.enabled) return null;

  return (
    <div id={ADFOX_CONFIG.blocks.fullscreen} style={{ display: 'none' }}></div>
  );
}

