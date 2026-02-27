"use client";

import { useState, useMemo } from "react";

interface ColorContrastToolProps {
  t: (key: string) => string;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace(/^#/, "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(L1: number, L2: number): number {
  const [light, dark] = L1 >= L2 ? [L1, L2] : [L2, L1];
  return (light + 0.05) / (dark + 0.05);
}

export function ColorContrastTool({ t }: ColorContrastToolProps) {
  const [fg, setFg] = useState("#2c2f36");
  const [bg, setBg] = useState("#ffffff");

  const result = useMemo(() => {
    const rgbFg = hexToRgb(fg);
    const rgbBg = hexToRgb(bg);
    if (!rgbFg || !rgbBg) return null;
    const Lfg = luminance(rgbFg[0], rgbFg[1], rgbFg[2]);
    const Lbg = luminance(rgbBg[0], rgbBg[1], rgbBg[2]);
    const ratio = contrastRatio(Lfg, Lbg);
    const aa = ratio >= 4.5;
    const aaLarge = ratio >= 3;
    const aaa = ratio >= 7;
    const aaaLarge = ratio >= 4.5;
    return { ratio, aa, aaLarge, aaa, aaaLarge };
  }, [fg, bg]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">{t("foreground")}</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-[var(--border)]"
            />
            <input
              type="text"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="flex-1 rounded-xl border border-[var(--border)] bg-transparent px-3 py-2 font-mono text-sm focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{t("background")}</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-[var(--border)]"
            />
            <input
              type="text"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="flex-1 rounded-xl border border-[var(--border)] bg-transparent px-3 py-2 font-mono text-sm focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div
        className="rounded-xl border border-[var(--border)] p-6 text-center"
        style={{ backgroundColor: bg, color: fg }}
      >
        <p className="font-medium">{t("sample")}</p>
      </div>
      {result && (
        <div className="space-y-2 rounded-xl border border-[var(--border)] p-4 text-sm">
          <p><span className="text-[var(--muted)]">{t("ratio")}:</span> {result.ratio.toFixed(2)}:1</p>
          <p>{t("aa")}: {result.aa ? "✓" : "✗"} | {t("aaLarge")}: {result.aaLarge ? "✓" : "✗"} | {t("aaa")}: {result.aaa ? "✓" : "✗"}</p>
        </div>
      )}
    </div>
  );
}
