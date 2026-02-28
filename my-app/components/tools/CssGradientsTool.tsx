"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface CssGradientsToolProps {
  t: (key: string) => string;
}

export function CssGradientsTool({ t }: CssGradientsToolProps) {
  const [color1, setColor1] = useState("#FF8C00");
  const [color2, setColor2] = useState("#FF4500");
  const [color3, setColor3] = useState("");
  const [angle, setAngle] = useState(90);
  const [type, setType] = useState<"linear" | "radial">("linear");

  const colors = [color1, color2, ...(color3 ? [color3] : [])];
  const css =
    type === "linear"
      ? `linear-gradient(${angle}deg, ${colors.join(", ")})`
      : `radial-gradient(circle, ${colors.join(", ")})`;
  const fullCss = `background: ${css};`;

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Линейный или радиальный градиент из 2–3 цветов. Результат в виде CSS — можно скопировать в стили.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType("linear")}
          className={`rounded-lg px-3 py-2 text-sm font-medium ${type === "linear" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)]"}`}
        >
          Linear
        </button>
        <button
          type="button"
          onClick={() => setType("radial")}
          className={`rounded-lg px-3 py-2 text-sm font-medium ${type === "radial" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)]"}`}
        >
          Radial
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm">{t("color1")}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="h-10 w-10 cursor-pointer rounded"
            />
            <input
              type="text"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="flex-1 rounded-xl border border-[var(--border)] px-3 py-2 font-mono text-sm"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm">{t("color2")}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="h-10 w-10 cursor-pointer rounded"
            />
            <input
              type="text"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="flex-1 rounded-xl border border-[var(--border)] px-3 py-2 font-mono text-sm"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm text-[var(--muted)]">{t("color3") || "Цвет 3 (необязательно)"}</label>
            <div className="flex gap-2">
              <input type="color" value={color3 || "#888"} onChange={(e) => setColor3(e.target.value)} className="h-10 w-10 cursor-pointer rounded" />
              <input type="text" value={color3} onChange={(e) => setColor3(e.target.value)} placeholder="#hex или пусто" className="flex-1 rounded-xl border border-[var(--border)] px-3 py-2 font-mono text-sm" />
          </div>
        </div>
      </div>
      {type === "linear" && (
      <div>
        <label className="mb-2 block text-sm">{t("angle")}</label>
        <input
          type="range"
          min={0}
          max={360}
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-sm">{angle}°</span>
      </div>
      )}
      <div className="h-32 rounded-xl border border-[var(--border)]" style={{ background: css }} />
      <div className="space-y-2">
        <div className="flex justify-end"><CopyButton text={fullCss} label="Копировать CSS" /></div>
        <div className="select-all rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 font-mono text-sm">
          {fullCss}
        </div>
      </div>
    </div>
  );
}
