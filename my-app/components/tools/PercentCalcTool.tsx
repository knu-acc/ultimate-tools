"use client";

import { useState } from "react";

interface PercentCalcToolProps {
  t: (key: string) => string;
}

export function PercentCalcTool({ t }: PercentCalcToolProps) {
  const [value, setValue] = useState("");
  const [percent, setPercent] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calc = (mode: "of" | "from" | "diff") => {
    const v = parseFloat(value);
    const p = parseFloat(percent);
    if (isNaN(v) || isNaN(p)) return;
    if (mode === "of") setResult((v * p) / 100);
    else if (mode === "from") setResult(v ? (p / v) * 100 : 0);
    else setResult(v + (v * p) / 100);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm">{t("value")}</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm">{t("percent")}</label>
          <input
            type="number"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          { key: "percentOf", mode: "of" as const },
          { key: "percentFrom", mode: "from" as const },
          { key: "addPercent", mode: "diff" as const },
        ].map(({ key, mode }) => (
          <button
            key={key}
            onClick={() => calc(mode)}
            className="rounded-xl border border-[var(--border)] px-4 py-2 hover:border-[var(--accent)]"
          >
            {t(key)}
          </button>
        ))}
      </div>
      {result !== null && (
        <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent)]/10 p-4 text-xl font-bold">
          {result.toLocaleString()}
        </div>
      )}
    </div>
  );
}
