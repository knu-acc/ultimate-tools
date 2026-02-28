"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

interface PercentCalcToolProps {
  t: (key: string) => string;
}

const fmt = (n: number) => parseFloat(n.toPrecision(10)).toLocaleString("ru-RU", { maximumFractionDigits: 6 });

export function PercentCalcTool({ t }: PercentCalcToolProps) {
  const [value, setValue] = useState("");
  const [percent, setPercent] = useState("");

  const v = parseFloat(value);
  const p = parseFloat(percent);
  const ok = !isNaN(v) && !isNaN(p);

  const results = useMemo(() => {
    if (!ok) return null;
    return [
      { label: `${p}% от ${v}`, desc: "Процент от числа", value: (v * p) / 100 },
      { label: `${p} — это X% от ${v}`, desc: "Доля в процентах", value: v ? (p / v) * 100 : 0, suffix: "%" },
      { label: `${v} + ${p}%`, desc: "Прибавить процент", value: v + (v * p) / 100 },
      { label: `${v} − ${p}%`, desc: "Вычесть процент", value: v - (v * p) / 100 },
    ];
  }, [v, p, ok]);

  const percentPresets = [5, 10, 15, 20, 25, 50];

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">
        Введите число и процент — все 4 операции рассчитываются мгновенно.
      </p>

      <div className="result-card">
        <span className="section-label">Исходные данные</span>
        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          <div>
            <label className="field-label">Число</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Например, 500"
              className="input-base text-lg font-semibold"
              autoFocus
            />
          </div>
          <div>
            <label className="field-label">Процент</label>
            <input
              type="number"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              placeholder="Например, 15"
              className="input-base text-lg font-semibold"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {percentPresets.map((pr) => (
            <button
              key={pr}
              type="button"
              onClick={() => setPercent(String(pr))}
              className={`chip ${percent === String(pr) ? "chip-active" : ""}`}
            >
              {pr}%
            </button>
          ))}
        </div>
      </div>

      {results ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {results.map((r, i) => (
            <div key={i} className="result-card group">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs text-[var(--muted)]">{r.desc}</span>
                <CopyButton text={String(r.value)} label="" />
              </div>
              <div className="text-2xl font-bold tabular-nums text-[var(--foreground)]">
                {fmt(r.value)}{r.suffix || ""}
              </div>
              <div className="text-sm text-[var(--muted)] mt-1">{r.label}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          Введите число и процент — все результаты появятся автоматически
        </div>
      )}
    </div>
  );
}
