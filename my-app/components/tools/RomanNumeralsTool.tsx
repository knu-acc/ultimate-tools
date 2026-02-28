"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

const ROMAN: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(n: number): string {
  let r = "";
  for (const [v, s] of ROMAN) {
    while (n >= v) {
      r += s;
      n -= v;
    }
  }
  return r;
}

function fromRoman(s: string): number {
  let n = 0;
  const map: Record<string, number> = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
  for (let i = 0; i < s.length; i++) {
    const cur = map[s[i]] ?? 0;
    const next = map[s[i + 1]] ?? 0;
    n += cur < next ? -cur : cur;
  }
  return n;
}

interface RomanNumeralsToolProps {
  t: (key: string) => string;
}

export function RomanNumeralsTool({ t }: RomanNumeralsToolProps) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"to" | "from">("to");
  const [result, setResult] = useState("");
  const [live, setLive] = useState(false);

  const convert = () => {
    if (mode === "to") {
      const n = parseInt(input, 10);
      if (!isNaN(n) && n > 0 && n < 4000) setResult(toRoman(n));
    } else {
      const n = fromRoman(input.toUpperCase());
      setResult(n ? String(n) : t("invalid"));
    }
  };

  const liveResult =
    live && input
      ? mode === "to"
        ? (() => {
            const n = parseInt(input, 10);
            return !isNaN(n) && n > 0 && n < 4000 ? toRoman(n) : "";
          })()
        : (() => {
            const n = fromRoman(input.toUpperCase());
            return n ? String(n) : "";
          })()
      : result;

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">
        Арабские числа в римские (1–3999) и обратно. Выберите направление, введите значение и нажмите «Конвертировать».
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setMode("to")}
          className={`rounded-xl px-4 py-2 ${mode === "to" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)]"}`}
        >
          {t("toRoman")}
        </button>
        <button
          onClick={() => setMode("from")}
          className={`rounded-xl px-4 py-2 ${mode === "from" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)]"}`}
        >
          {t("fromRoman")}
        </button>
        <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <input type="checkbox" checked={live} onChange={(e) => setLive(e.target.checked)} />
          {t("liveUpdate") || "При вводе"}
        </label>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === "to" ? "2024" : "MMXXIV"}
        className="input-base font-mono"
      />
      <button
        onClick={convert}
        className="btn-primary w-full sm:w-auto mt-2"
      >
        {t("convert")}
      </button>
      {(liveResult || result) ? (
        <div className="space-y-2">
          <div className="flex justify-end"><CopyButton text={liveResult || result} label="Копировать" /></div>
          <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent)]/10 p-4 font-mono text-xl">
            {liveResult || result}
          </div>
        </div>
      ) : (
        <p className="empty-state">
          Выберите «В римские» или «Из римских», введите число (например 2024 или MMXXIV) и нажмите «Конвертировать».
        </p>
      )}
    </div>
  );
}
