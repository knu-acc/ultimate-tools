"use client";

import { useState, useRef } from "react";

interface RulerToolProps {
  t: (key: string) => string;
}

export function RulerTool({ t }: RulerToolProps) {
  const [unit, setUnit] = useState<"px" | "cm">("px");
  const [dpi, setDpi] = useState(96);
  const containerRef = useRef<HTMLDivElement>(null);

  const pxPerCm = (dpi / 2.54);
  const width = unit === "px" ? 400 : 10;
  const displayWidth = unit === "px" ? width : width * pxPerCm;

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Линейка в пикселях или сантиметрах. Выберите единицу и DPI экрана — длина шкалы отображается в выбранных единицах.
      </p>
      <div className="flex gap-4">
        <div>
          <label className="mb-2 block text-sm">{t("unit")}</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as "px" | "cm")}
            className="rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
          >
            <option value="px">px</option>
            <option value="cm">cm</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm">DPI</label>
          <input
            type="number"
            value={dpi}
            onChange={(e) => setDpi(Number(e.target.value) || 96)}
            className="w-24 rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
          />
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative h-16 rounded-xl border-2 border-[var(--border)] bg-[var(--background)]"
        style={{ width: `${displayWidth}px` }}
      >
        {Array.from({ length: unit === "px" ? Math.floor(width / 10) : 11 }).map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 border-l border-[var(--foreground)]/30"
            style={{
              left: `${(unit === "px" ? i * 10 : i * pxPerCm)}px`,
              height: i % 5 === 0 ? "100%" : "50%",
            }}
          />
        ))}
        {Array.from({ length: unit === "px" ? Math.floor(width / 10) + 1 : 11 }).map((_, i) => (
          <div
            key={`l-${i}`}
            className="absolute bottom-0 text-xs text-[var(--muted)]"
            style={{
              left: `${(unit === "px" ? i * 10 : i * pxPerCm) - 6}px`,
              transform: "translateY(100%)",
            }}
          >
            {i * (unit === "px" ? 10 : 1)}
          </div>
        ))}
      </div>
      <p className="text-sm text-[var(--muted)]">
        {displayWidth.toFixed(0)}px = {unit === "px" ? width : width} {unit}
      </p>
    </div>
  );
}
