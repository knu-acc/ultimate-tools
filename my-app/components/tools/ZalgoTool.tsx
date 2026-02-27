"use client";

import { useState } from "react";

const COMBINING = [
  "\u0300", "\u0301", "\u0302", "\u0303", "\u0304", "\u0305", "\u0306",
  "\u0307", "\u0308", "\u0309", "\u030A", "\u030B", "\u030C", "\u030D",
  "\u030E", "\u030F", "\u0310", "\u0311", "\u0312", "\u0313", "\u0314",
  "\u0315", "\u031A", "\u031B", "\u033D", "\u033E", "\u033F", "\u0340",
  "\u0341", "\u0342", "\u0343", "\u0344", "\u0346", "\u0347", "\u0348",
  "\u0349", "\u034A", "\u034B", "\u034C", "\u034D", "\u034E", "\u0350",
  "\u0351", "\u0352", "\u0357", "\u0358", "\u035B", "\u035C", "\u035D",
  "\u035E", "\u035F", "\u0360", "\u0361",
];

function zalgo(text: string, intensity: number): string {
  return text
    .split("")
    .map((c) => {
      if (/\s/.test(c)) return c;
      const count = Math.floor(Math.random() * intensity) + 1;
      const chars = Array.from({ length: count }, () =>
        COMBINING[Math.floor(Math.random() * COMBINING.length)]
      );
      return c + chars.join("");
    })
    .join("");
}

interface ZalgoToolProps {
  t: (key: string) => string;
}

export function ZalgoTool({ t }: ZalgoToolProps) {
  const [text, setText] = useState("Hello");
  const [intensity, setIntensity] = useState(5);

  return (
    <div className="space-y-6">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
      />
      <div>
        <label className="mb-2 block text-sm">{t("intensity")}</label>
        <input
          type="range"
          min={1}
          max={15}
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-sm text-[var(--muted)]">{intensity}</span>
      </div>
      <div>
        <div className="mb-2 text-sm text-[var(--muted)]">{t("result")}</div>
        <div className="min-h-[60px] rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-2xl">
          {text ? zalgo(text, intensity) : "—"}
        </div>
      </div>
    </div>
  );
}
