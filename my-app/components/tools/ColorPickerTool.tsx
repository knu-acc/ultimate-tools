"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface ColorPickerToolProps {
  t: (key: string) => string;
}

function parseHex(hex: string): { r: number; g: number; b: number; a: number } | null {
  const h = hex.replace(/^#/, "").trim();
  if (/^[0-9A-Fa-f]{6}$/.test(h)) {
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: 255,
    };
  }
  if (/^[0-9A-Fa-f]{3}$/.test(h)) {
    return {
      r: parseInt(h[0] + h[0], 16),
      g: parseInt(h[1] + h[1], 16),
      b: parseInt(h[2] + h[2], 16),
      a: 255,
    };
  }
  if (/^[0-9A-Fa-f]{8}$/.test(h)) {
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: parseInt(h.slice(6, 8), 16),
    };
  }
  return null;
}

function hexToRgb(hex: string) {
  const parsed = parseHex(hex);
  if (!parsed) return { r: 255, g: 140, b: 0, a: 255 };
  return parsed;
}

export function ColorPickerTool({ t }: ColorPickerToolProps) {
  const [color, setColor] = useState("#FF8C00");
  const [alpha, setAlpha] = useState(100);

  const rgb = hexToRgb(color);
  const a = Math.round((rgb.a / 255) * (alpha / 100) * 255) / 255;
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

  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const rgbaStr = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a.toFixed(2)})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const hslaStr = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a.toFixed(2)})`;
  const hex6 = color.replace(/^#/, "").length === 3
    ? color.replace(/^#/, "").split("").map((c) => c + c).join("")
    : color.replace(/^#/, "").slice(0, 6);
  const hexWithAlpha = a < 1 ? `#${hex6}${Math.round(a * 255).toString(16).padStart(2, "0")}` : color;

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Выберите цвет — отображаются HEX, RGB и HSL. Любое значение можно скопировать для CSS или дизайна.
      </p>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--muted)]">{t("color")}</label>
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
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--muted)]">{t("alpha") || "Прозрачность (%)"}</label>
        <input
          type="range"
          min={0}
          max={100}
          value={alpha}
          onChange={(e) => setAlpha(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-sm text-[var(--muted)]">{alpha}%</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm text-[var(--muted)]">RGB</span>
            <CopyButton text={rgbStr} label="Копировать RGB" />
          </div>
          <div className="font-mono text-sm">{rgbStr}</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm text-[var(--muted)]">RGBA</span>
            <CopyButton text={rgbaStr} label="Копировать RGBA" />
          </div>
          <div className="font-mono text-sm">{rgbaStr}</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm text-[var(--muted)]">HSL</span>
            <CopyButton text={hslStr} label="Копировать HSL" />
          </div>
          <div className="font-mono text-sm">{hslStr}</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm text-[var(--muted)]">HSLA</span>
            <CopyButton text={hslaStr} label="Копировать HSLA" />
          </div>
          <div className="font-mono text-sm">{hslaStr}</div>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-xl border border-[var(--border)] p-4 sm:col-span-2 lg:col-span-1">
          <div className="h-16 w-full rounded border-2" style={{ backgroundColor: color, opacity: alpha / 100 }} />
          <CopyButton text={alpha < 100 ? hexWithAlpha : color} label="Копировать HEX" />
        </div>
      </div>
    </div>
  );
}
