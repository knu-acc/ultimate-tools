"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

const UNITS: Record<string, { factor: number; label: string }> = {
  kg: { factor: 1, label: "Килограмм (kg)" },
  g: { factor: 0.001, label: "Грамм (g)" },
  mg: { factor: 0.000001, label: "Миллиграмм (mg)" },
  t: { factor: 1000, label: "Тонна (t)" },
  lb: { factor: 0.453592, label: "Фунт (lb)" },
  oz: { factor: 0.0283495, label: "Унция (oz)" },
  ct: { factor: 0.0002, label: "Карат (ct)" },
};

interface WeightConverterToolProps {
  t: (key: string) => string;
}

export function WeightConverterTool({ t }: WeightConverterToolProps) {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("kg");

  const v = parseFloat(value);

  const allResults = useMemo(() => {
    if (isNaN(v) || !v) return null;
    const baseKg = v * UNITS[from].factor;
    return Object.entries(UNITS)
      .filter(([key]) => key !== from)
      .map(([key, { factor, label }]) => ({
        unit: key,
        label,
        value: baseKg / factor,
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
    <div className="space-y-5">
      <div className="tool-input-zone">
        <div className="tool-zone-header"><span className="tool-zone-icon">✏️</span><span>Ввод</span></div>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Введите число"
          className="tool-hero-input mb-4"
          autoFocus
        />
        <span className="section-label">Единица измерения</span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(UNITS).map(([key, { label }]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFrom(key)}
              className={`chip ${from === key ? "chip-active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {allResults && allResults.length > 0 ? (
        <div className="tool-output-zone">
          <div className="tool-zone-header"><span className="tool-zone-icon">📊</span><span>Результат</span></div>
          <div className="flex items-center justify-between mb-4">
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
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-1">{unit}</div>
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
  if (Math.abs(n) >= 1e9) return n.toExponential(3);
  if (Math.abs(n) >= 1000) return n.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
  if (Math.abs(n) >= 1) return n.toLocaleString("ru-RU", { maximumFractionDigits: 4 });
  if (Math.abs(n) >= 0.001) return n.toLocaleString("ru-RU", { maximumFractionDigits: 6 });
  return n.toExponential(3);
}
