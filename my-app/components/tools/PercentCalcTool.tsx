"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface PercentCalcToolProps {
  t: (key: string) => string;
}

export function PercentCalcTool({ t }: PercentCalcToolProps) {
  const [value, setValue] = useState("");
  const [percent, setPercent] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calc = (mode: "of" | "from" | "diff" | "subtract") => {
    const v = parseFloat(value);
    const p = parseFloat(percent);
    if (isNaN(v) || isNaN(p)) return;
    if (mode === "of") setResult((v * p) / 100);
    else if (mode === "from") setResult(v ? (p / v) * 100 : 0);
    else if (mode === "diff") setResult(v + (v * p) / 100);
    else setResult(v - (v * p) / 100);
  };

  const operations = [
    { key: "percentOf", mode: "of" as const },
    { key: "percentFrom", mode: "from" as const },
    { key: "addPercent", mode: "diff" as const },
    { key: "subtractPercent", mode: "subtract" as const },
  ];
  const percentPresets = [5, 10, 15, 20, 25, 50];

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Расчёт процентов: от числа, доля в %, прибавка или вычитание. Введите значение и процент (или пресет), выберите операцию. Все расчёты в браузере.
      </p>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <span className="mb-3 block text-sm font-medium text-[var(--muted)]">Исходные данные</span>
        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("value")}</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Число"
              className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("percent")}</label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="number"
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
                placeholder="%"
                className="w-24 rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)]"
              />
              {percentPresets.map((p) => (
                <button key={p} type="button" onClick={() => setPercent(String(p))} className={`rounded-lg border px-3 py-2 text-sm font-medium ${percent === String(p) ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--accent)]" : "border-[var(--border)] hover:bg-[var(--border)]/20"}`}>
                  {p}%
                </button>
              ))}
            </div>
          </div>
        </div>
        <span className="mb-2 block text-sm font-medium text-[var(--muted)]">Операция</span>
        <div className="flex flex-wrap gap-2">
          {operations.map(({ key, mode }) => (
            <button key={key} onClick={() => calc(mode)} className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:border-[var(--accent)] hover:bg-[var(--accent)]/10">
              {t(key)}
            </button>
          ))}
        </div>
      </div>
      {result !== null ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--muted)]">Результат</span>
            <CopyButton text={String(result)} label="Копировать результат" />
          </div>
          <div className="rounded-lg border border-[var(--accent)] bg-[var(--accent)]/10 p-4 text-xl font-bold tabular-nums">
            {result.toLocaleString()}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Введите число и процент, выберите операцию — результат можно скопировать.
        </p>
      )}
    </div>
  );
}
