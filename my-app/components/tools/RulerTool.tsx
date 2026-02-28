"use client";

import { useState, useMemo } from "react";

interface RulerToolProps {
  t: (key: string) => string;
}

type Unit = "cm" | "mm" | "in";

const MM_PER_PX = 0.264583333; // ~96 DPI
const IN_PER_PX = 1 / 96;

function pxToUnit(px: number, unit: Unit): number {
  if (unit === "cm") return px * MM_PER_PX / 10;
  if (unit === "mm") return px * MM_PER_PX;
  return px * IN_PER_PX;
}

export function RulerTool({ t }: RulerToolProps) {
  const [unit, setUnit] = useState<Unit>("cm");
  const [lengthPx, setLengthPx] = useState(400);

  const unitLabel = unit === "cm" ? (t("unitCm") || "см") : unit === "mm" ? (t("unitMm") || "мм") : (t("unitIn") || "дюймы");
  const step = unit === "cm" ? 1 : unit === "mm" ? 10 : 1; // marks every step
  const totalInUnit = pxToUnit(lengthPx, unit);
  const marks = useMemo(() => {
    const list: { value: number; isMajor: boolean }[] = [];
    const stepSize = unit === "in" ? 0.25 : unit === "cm" ? 0.5 : 5;
    for (let v = 0; v <= totalInUnit + 0.01; v += stepSize) {
      const isMajor = unit === "in" ? v % 1 === 0 : unit === "cm" ? v % 1 === 0 : v % 10 === 0;
      list.push({ value: v, isMajor });
    }
    return list;
  }, [totalInUnit, unit]);

  const fontScale = useMemo(() => {
    const base = lengthPx / 30;
    return Math.max(10, Math.min(24, Math.floor(base)));
  }, [lengthPx]);

  const lengthPresets = [300, 400, 500, 600, 800];

  return (
    <div className="space-y-6">
<div className="tool-input-zone">
        <div className="tool-zone-header"><span className="tool-zone-icon">✏️</span><span>Ввод</span></div>
        <span className="section-label">{t("unit") || "Единица"}</span>
        <div className="flex flex-wrap gap-2">
          {(["cm", "mm", "in"] as const).map((u) => (
            <button key={u} type="button" onClick={() => setUnit(u)} className={`chip ${unit === u ? "chip-active" : ""}`}>
              {u === "cm" ? (t("unitCm") || "См") : u === "mm" ? (t("unitMm") || "Мм") : (t("unitIn") || "Дюймы")}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-output-zone">
        <span className="field-label">{t("length") || "Длина линейки"}</span>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {lengthPresets.map((px) => (
            <button key={px} type="button" onClick={() => setLengthPx(px)} className={`rounded-lg border px-3 py-2 text-sm font-medium tabular-nums ${lengthPx === px ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--accent)]" : "border-[var(--border)] hover:bg-[var(--border)]/20"}`}>
              {px} px
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-[var(--muted)] mb-1">
          <span>{lengthPx} px</span>
          <span className="font-mono font-medium text-[var(--foreground)]">≈ {unit === "in" ? totalInUnit.toFixed(2) : totalInUnit.toFixed(1)} {unitLabel}</span>
        </div>
        <input type="range" min={200} max={800} step={20} value={lengthPx} onChange={(e) => setLengthPx(Number(e.target.value))} className="h-2 w-full accent-[var(--accent)]" />
      </div>

      <div className="overflow-x-auto rounded-xl border-2 border-[var(--border)] bg-[var(--background)] p-2">
        <div
          className="relative flex h-16 shrink-0 items-end bg-[var(--card-bg)]"
          style={{ width: lengthPx + "px", minWidth: lengthPx + "px" }}
        >
          {marks.map((m) => {
            const x = (m.value / totalInUnit) * lengthPx;
            return (
              <div
                key={m.value}
                className="absolute bottom-0 flex flex-col items-center"
                style={{ left: x + "px", transform: "translateX(-50%)" }}
              >
                <div
                  className={`shrink-0 bg-[var(--foreground)] ${m.isMajor ? "h-6 w-0.5" : "h-3 w-px"}`}
                />
                {m.isMajor && (
                  <span
                    className="mt-0.5 font-mono tabular-nums text-[var(--foreground)]"
                    style={{ fontSize: fontScale + "px", lineHeight: 1 }}
                  >
                    {m.value % 1 === 0 ? m.value : m.value.toFixed(1)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-1 text-center text-xs text-[var(--muted)]">
          0 — линейка в пикселях (при 96 DPI). Единицы: {unitLabel}.
        </div>
      </div>
    </div>
  );
}
