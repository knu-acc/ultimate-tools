"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

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
  const [seed, setSeed] = useState(0);
  const result = useMemo(() => (text ? zalgo(text, intensity) : ""), [text, intensity, seed]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        «Залго-текст»: добавляет диакритику к буквам. Регулируйте интенсивность и нажимайте «Ещё раз» для нового варианта.
      </p>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
      />
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--muted)]">{t("intensity")}</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={15}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="h-2 w-full max-w-[200px] accent-[var(--accent)]"
          />
          <span className="tabular-nums text-sm text-[var(--muted)]">{intensity}</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-[var(--muted)]">{t("result")}</span>
          <div className="flex gap-2">
            {result && <CopyButton text={result} label="Скопировать" />}
            {text && (
              <button
                type="button"
                onClick={() => setSeed((s) => s + 1)}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--accent)]/10"
              >
                Ещё раз
              </button>
            )}
          </div>
        </div>
        <div className="min-h-[60px] rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 text-2xl leading-relaxed">
          {result || <span className="text-[var(--muted)]">Введите текст для залго-эффекта</span>}
        </div>
      </div>
    </div>
  );
}
