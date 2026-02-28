"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

const UNITS: Record<string, number> = {
  sec: 1, min: 60, hr: 3600, day: 86400, week: 604800,
};

const UNIT_DATA: Record<string, { factor: number; label: string }> = {
  "sec": { factor: UNITS["sec"], label: "Секунда (s)" },
  "min": { factor: UNITS["min"], label: "Минута (min)" },
  "hr": { factor: UNITS["hr"], label: "Час (h)" },
  "day": { factor: UNITS["day"], label: "День (d)" },
  "week": { factor: UNITS["week"], label: "Неделя (wk)" },
};

interface TimeConverterToolProps { t: (key: string) => string; }

export function TimeConverterTool({ t }: TimeConverterToolProps) {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("min");

  const v = parseFloat(value);

  const allResults = useMemo(() => {
    if (isNaN(v) || !v) return null;
    const base = v * UNIT_DATA[from].factor;
    return Object.entries(UNIT_DATA)
      .filter(([key]) => key !== from)
      .map(([key, { factor, label }]) => ({
        unit: key,
        label,
        value: base / factor,
      }));
  }, [v, from]);

  const swap = (toUnit: string) => {
    if (allResults) {
      const res = allResults.find((r) => r.unit === toUnit);
      if (res) {
        setValue(String(parseFloat(res.value.toPrecision(8))));
        setFrom(toUnit);
      }
    }
  };

  const copyAll = () => {
    if (!allResults) return "";
    return allResults.map((r) => `${formatNum(r.value)} ${r.unit}`).join("\n");
  };

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">{t("description")}</p>

      <div className="result-card">
        <span className="section-label">Значение</span>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[140px]">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Введите число"
              className="input-base text-lg font-semibold"
              autoFocus
            />
          </div>
          <div className="min-w-[160px]">
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="input-base"
            >
              {Object.entries(UNIT_DATA).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {allResults && allResults.length > 0 ? (
        <div className="result-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-label mb-0">Результаты</span>
            <CopyButton text={copyAll()} label="Копировать всё" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {allResults.map(({ unit, label, value: val }) => (
              <button
                key={unit}
                type="button"
                onClick={() => swap(unit)}
                className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-left transition-all hover:border-[var(--accent)] hover:shadow-md"
                title={`Переключить на ${label}`}
              >
                <div className="min-w-0">
                  <div className="text-lg font-bold tabular-nums truncate text-[var(--foreground)]">
                    {formatNum(val)}
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">{label}</div>
                </div>
                <span className="text-xs text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity ml-2">↔</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          Введите число — результаты во всех единицах появятся мгновенно
        </div>
      )}
    </div>
  );
}

function formatNum(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e12) return n.toExponential(3);
  if (Math.abs(n) >= 1000) return n.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
  if (Math.abs(n) >= 1) return n.toLocaleString("ru-RU", { maximumFractionDigits: 4 });
  if (Math.abs(n) >= 0.0001) return n.toLocaleString("ru-RU", { maximumFractionDigits: 6 });
  return n.toExponential(3);
}
