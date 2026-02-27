"use client";

import { useState } from "react";

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

  const convert = () => {
    if (mode === "to") {
      const n = parseInt(input, 10);
      if (!isNaN(n) && n > 0 && n < 4000) setResult(toRoman(n));
    } else {
      const n = fromRoman(input.toUpperCase());
      setResult(n ? String(n) : t("invalid"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
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
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === "to" ? "2024" : "MMXXIV"}
        className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 font-mono"
      />
      <button
        onClick={convert}
        className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white"
      >
        {t("convert")}
      </button>
      {result && (
        <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent)]/10 p-4 font-mono text-xl">
          {result}
        </div>
      )}
    </div>
  );
}
