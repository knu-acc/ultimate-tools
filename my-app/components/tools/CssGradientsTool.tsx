"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface CssGradientsToolProps {
  t: (key: string) => string;
}

const PRESET_GRADIENTS = [
  { name: "Закат", colors: ["#ff7e5f", "#feb47b"], angle: 90 },
  { name: "Океан", colors: ["#667eea", "#764ba2"], angle: 135 },
  { name: "Мята", colors: ["#11998e", "#38ef7d"], angle: 90 },
  { name: "Лаванда", colors: ["#a8edea", "#fed6e3"], angle: 0 },
  { name: "Персик", colors: ["#ffecd2", "#fcb69f"], angle: 120 },
  { name: "Ночь", colors: ["#0f0c29", "#302b63", "#24243e"], angle: 180 },
  { name: "Радуга", colors: ["#ff9a9e", "#fecfef", "#fecfef"], angle: 45 },
  { name: "Коралл", colors: ["#ff9966", "#ff5e62"], angle: 90 },
  { name: "Зелень", colors: ["#56ab2f", "#a8e063"], angle: 135 },
  { name: "Лёд", colors: ["#2193b0", "#6dd5ed"], angle: 90 },
];

const ANGLE_PRESETS = [0, 45, 90, 135, 180, 225, 270, 315];

export function CssGradientsTool({ t }: CssGradientsToolProps) {
  const [color1, setColor1] = useState("#667eea");
  const [color2, setColor2] = useState("#764ba2");
  const [color3, setColor3] = useState("");
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<"linear" | "radial">("linear");

  const colors = [color1, color2, ...(color3 ? [color3] : [])];
  const css =
    type === "linear"
      ? `linear-gradient(${angle}deg, ${colors.join(", ")})`
      : `radial-gradient(circle, ${colors.join(", ")})`;
  const fullCss = `background: ${css};`;

  const applyPreset = (p: (typeof PRESET_GRADIENTS)[0]) => {
    setColor1(p.colors[0]);
    setColor2(p.colors[1] ?? p.colors[0]);
    setColor3(p.colors[2] ?? "");
    setAngle(p.angle);
    setType("linear");
  };

  return (
    <div className="space-y-6">
<div className="tool-input-zone">
        <div className="mb-3 text-sm font-medium text-[var(--muted)]">Готовые градиенты</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {PRESET_GRADIENTS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="flex flex-col overflow-hidden rounded-xl border-2 border-[var(--border)] transition hover:border-[var(--accent)]"
            >
              <div
                className="h-14 w-full"
                style={{ background: `linear-gradient(${p.angle}deg, ${p.colors.join(", ")})` }}
              />
              <span className="bg-[var(--card-bg)] px-2 py-1 text-center text-xs font-medium">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">{t("color1")}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="h-10 w-12 cursor-pointer rounded-lg border border-[var(--border)]"
            />
            <input
              type="text"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="input-base font-mono text-sm flex-1"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">{t("color2")}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="h-10 w-12 cursor-pointer rounded-lg border border-[var(--border)]"
            />
            <input
              type="text"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="input-base font-mono text-sm flex-1"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm text-[var(--muted)]">Цвет 3 (необязательно)</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color3 || "#888"}
              onChange={(e) => setColor3(e.target.value)}
              className="h-10 w-12 cursor-pointer rounded-lg border border-[var(--border)]"
            />
            <input
              type="text"
              value={color3}
              onChange={(e) => setColor3(e.target.value)}
              placeholder="#hex или пусто"
              className="input-base font-mono text-sm flex-1"
            />
          </div>
        </div>
      </div>

      {type === "linear" && (
        <div className="result-card">
          <div className="mb-2 text-sm font-medium text-[var(--muted)]">Угол (градусы)</div>
          <div className="flex flex-wrap gap-2">
            {ANGLE_PRESETS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAngle(a)}
                className={`rounded-lg px-3 py-2 text-sm tabular-nums ${angle === a ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] hover:bg-[var(--border)]/20"}`}
              >
                {a}°
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="h-2 flex-1 accent-[var(--accent)]"
            />
            <span className="w-12 text-right font-mono font-medium">{angle}°</span>
          </div>
        </div>
      )}

      <div className="result-card">
        <div className="mb-2 text-sm font-medium text-[var(--muted)]">Предпросмотр</div>
        <div className="h-36 rounded-xl border-2 border-[var(--border)] shadow-inner" style={{ background: css }} />
      </div>

      <div className="tool-output-zone">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--foreground)]/70">CSS</span>
          <CopyButton text={fullCss} label="Копировать CSS" />
        </div>
        <pre className="select-all overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm">
          {fullCss}
        </pre>
      </div>
    </div>
  );
}
