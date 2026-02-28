"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    yaContextCb: (() => void)[];
    Ya?: {
      Context: {
        AdvManager: {
          render: (params: { renderTo: string; blockId: string; type?: string }) => void;
        };
      };
    };
  }
}

interface AdfoxRenderProps {
  blockId: string;
  minHeight?: number;
}

export function AdfoxRender({ blockId, minHeight }: AdfoxRenderProps) {
  useEffect(() => {
    try {
      window.yaContextCb = window.yaContextCb || [];
      window.yaContextCb.push(() => {
        if (window.Ya && window.Ya.Context) {
          window.Ya.Context.AdvManager.render({
            renderTo: blockId,
            blockId: blockId,
          });
        }
      });
    } catch (e) {
      console.error("Adfox render error:", e);
    }
  }, [blockId]);

  return (
    <div className="w-full relative rounded-xl overflow-hidden flex items-center justify-center bg-[var(--background)]">
      {/* Контейнер, куда Adfox вставит рекламу. ID должен совпадать с blockId */}
      <div id={blockId} className="w-full" style={{ minHeight: minHeight ? `${minHeight}px` : undefined }}></div>
    </div>
  );
}
