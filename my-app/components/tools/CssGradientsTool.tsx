"use client";

import { useState } from "react";

interface CssGradientsToolProps {
  t: (key: string) => string;
}

export function CssGradientsTool({ t }: CssGradientsToolProps) {
  const [color1, setColor1] = useState("#FF8C00");
  const [color2, setColor2] = useState("#FF4500");
  const [angle, setAngle] = useState(90);

  const css = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

  return (
    <div className="space-y-6">
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
      </div>
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
      <div
        className="h-32 rounded-xl"
        style={{ background: css }}
      />
      <div
        className="cursor-pointer select-all rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm"
        onClick={() => navigator.clipboard.writeText(`background: ${css};`)}
      >
        background: {css};
      </div>
    </div>
  );
}
