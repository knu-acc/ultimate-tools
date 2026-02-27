"use client";

import { useState } from "react";

interface ColorPickerToolProps {
  t: (key: string) => string;
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

export function ColorPickerTool({ t }: ColorPickerToolProps) {
  const [color, setColor] = useState("#FF8C00");

  const rgb = hexToRgb(color);
  const hsl = (() => {
    const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
      h = max === r ? (g - b) / (max - min) : max === g ? 2 + (b - r) / (max - min) : 4 + (r - g) / (max - min);
      h = (h * 60 + 360) % 360;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  })();

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm">{t("color")}</label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-14 w-14 cursor-pointer rounded-xl border-0"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="flex-1 rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 font-mono"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] p-4">
          <div className="text-sm text-[var(--muted)]">RGB</div>
          <div className="font-mono">rgb({rgb.r}, {rgb.g}, {rgb.b})</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] p-4">
          <div className="text-sm text-[var(--muted)]">HSL</div>
          <div className="font-mono">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</div>
        </div>
        <div
          className="cursor-pointer rounded-xl border-2 p-4"
          style={{ backgroundColor: color }}
          onClick={() => navigator.clipboard.writeText(color)}
        />
      </div>
    </div>
  );
}
