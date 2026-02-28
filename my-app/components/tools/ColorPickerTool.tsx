"use client";

import { useState, useEffect } from "react";
import { CopyButton } from "@/components/CopyButton";

interface ColorPickerToolProps {
  t: (key: string) => string;
}

const PRESET_PALETTE = [
  ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"],
  ["#2C3E50", "#E74C3C", "#3498DB", "#1ABC9C", "#F39C12", "#9B59B6", "#1E90FF", "#FF69B4"],
  ["#00CED1", "#FF4500", "#32CD32", "#8A2BE2", "#FFD700", "#00FA9A", "#DC143C", "#20B2AA"],
  ["#F0F8FF", "#FAEBD7", "#F5F5DC", "#FFE4C4", "#E6E6FA", "#FFF0F5", "#F5DEB3", "#E0FFFF"],
];

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

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
    h = max === rn ? (gn - bn) / (max - min) : max === gn ? 2 + (bn - rn) / (max - min) : 4 + (rn - gn) / (max - min);
    h = (h * 60 + 360) % 360;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const RECENT_KEY = "color-picker-recent";
const RECENT_MAX = 12;

export function ColorPickerTool({ t }: ColorPickerToolProps) {
  const [color, setColor] = useState("#2563EB");
  const [alpha, setAlpha] = useState(100);
  const [recent, setRecent] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const s = localStorage.getItem(RECENT_KEY);
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, RECENT_MAX)));
    } catch {}
  }, [recent]);

  const pick = (c: string) => {
    setColor(c.startsWith("#") ? c : "#" + c);
    setRecent((prev) => [c.startsWith("#") ? c : "#" + c, ...prev.filter((x) => x !== (c.startsWith("#") ? c : "#" + c))].slice(0, RECENT_MAX));
  };

  const parsed = parseHex(color) ?? { r: 37, g: 99, b: 235, a: 255 };
  const a = (parsed.a / 255) * (alpha / 100);
  const hsl = rgbToHsl(parsed.r, parsed.g, parsed.b);

  const rgbStr = `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`;
  const rgbaStr = `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${a.toFixed(2)})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const hslaStr = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a.toFixed(2)})`;
  const hex6 = color.replace(/^#/, "").length === 3
    ? "#" + color.replace(/^#/, "").split("").map((c) => c + c).join("")
    : "#" + (color.replace(/^#/, "").slice(0, 6) || "000000");
  const hexWithAlpha = a < 1 ? hex6 + Math.round(a * 255).toString(16).padStart(2, "0") : hex6;

  const hexValid = !color || parseHex(color);
  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Выберите цвет из палитры, ползунка или введите HEX. Копируйте форматы для CSS (HEX, RGB, HSL). Недавние цвета сохраняются в браузере локально.
      </p>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <div className="mb-3 text-sm font-medium text-[var(--muted)]">Палитра</div>
        <div className="space-y-2">
          {PRESET_PALETTE.map((row, i) => (
            <div key={i} className="flex flex-wrap gap-1">
              {row.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => pick(c)}
                  className="h-9 w-9 rounded-lg border-2 border-[var(--border)] transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {recent.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
          <div className="mb-2 text-sm font-medium text-[var(--muted)]">Недавние</div>
          <div className="flex flex-wrap gap-2">
            {recent.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="h-8 w-8 rounded-lg border-2 border-[var(--border)] hover:ring-2 hover:ring-[var(--accent)]"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <div className="mb-2 text-sm font-medium text-[var(--muted)]">{t("color")}</div>
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="color"
            value={hex6}
            onChange={(e) => pick(e.target.value)}
            className="h-14 w-14 cursor-pointer rounded-xl border-2 border-[var(--border)] bg-transparent"
          />
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#000000 или #RGB или #RRGGBBAA"
              className={`w-full max-w-[220px] rounded-xl border px-4 py-3 font-mono text-sm bg-transparent ${hexValid ? "border-[var(--border)]" : "border-amber-500"}`}
            />
            {!hexValid && color.trim() && (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">Недопустимый HEX (используйте #RGB, #RRGGBB или #RRGGBBAA)</p>
            )}
          </div>
        </div>
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-[var(--muted)]">{t("alpha") || "Прозрачность"}</span>
            <span className="font-medium">{alpha}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={alpha}
            onChange={(e) => setAlpha(Number(e.target.value))}
            className="h-2 w-full accent-[var(--accent)]"
          />
        </div>
      </div>

      <div className="rounded-xl border-2 p-4 text-center" style={{ backgroundColor: hex6, opacity: alpha / 100 }}>
        <span className="text-sm font-medium drop-shadow-md" style={{ color: parsed.r + parsed.g + parsed.b > 380 ? "#111" : "#fff" }}>
          Предпросмотр фона
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { name: "HEX", value: alpha < 100 ? hexWithAlpha : hex6 },
          { name: "RGB", value: rgbStr },
          { name: "RGBA", value: rgbaStr },
          { name: "HSL", value: hslStr },
          { name: "HSLA", value: hslaStr },
        ].map(({ name, value }) => (
          <div key={name} className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-4 py-3">
            <span className="text-sm font-medium text-[var(--muted)]">{name}</span>
            <div className="flex min-w-0 items-center gap-2">
              <code className="truncate font-mono text-sm">{value}</code>
              <CopyButton text={value} label={`Копировать ${name}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
