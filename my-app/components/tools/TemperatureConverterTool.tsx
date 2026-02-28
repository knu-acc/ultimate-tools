"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

function toKelvin(val: number, from: string): number {
  if (from === "K") return val;
  if (from === "C") return val + 273.15;
  if (from === "F") return (val - 32) * (5 / 9) + 273.15;
  if (from === "R") return val * (5 / 9);
  return val;
}

function fromKelvin(k: number, to: string): number {
  if (to === "K") return k;
  if (to === "C") return k - 273.15;
  if (to === "F") return (k - 273.15) * (9 / 5) + 32;
  if (to === "R") return k * (9 / 5);
  return k;
}

const TEMP_UNITS: { key: string; label: string; symbol: string }[] = [
  { key: "C", label: "Цельсий (°C)", symbol: "°C" },
  { key: "F", label: "Фаренгейт (°F)", symbol: "°F" },
  { key: "K", label: "Кельвин (K)", symbol: "K" },
  { key: "R", label: "Ранкин (°R)", symbol: "°R" },
];

interface TemperatureConverterToolProps { t: (key: string) => string; }

export function TemperatureConverterTool({ t }: TemperatureConverterToolProps) {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("C");

  const v = parseFloat(value);

  const allResults = useMemo(() => {
    if (isNaN(v)) return null;
    const k = toKelvin(v, from);
    return TEMP_UNITS
      .filter((u) => u.key !== from)
      .map((u) => ({
        unit: u.key,
        label: u.label,
        symbol: u.symbol,
        value: fromKelvin(k, u.key),
      }));
  }, [v, from]);

  const swap = (toUnit: string) => {
    if (allResults) {
      const res = allResults.find((r) => r.unit === toUnit);
      if (res) {
        setValue(String(parseFloat(res.value.toPrecision(6))));
        setFrom(toUnit);
      }
    }
  };

  const copyAll = () => {
    if (!allResults) return "";
    return allResults.map((r) => `${r.value.toFixed(2)} ${r.symbol}`).join("\n");
  };

  const presets = [
    { label: "0°C (замерзание)", val: "0", unit: "C" },
    { label: "100°C (кипение)", val: "100", unit: "C" },
    { label: "36.6°C (тело)", val: "36.6", unit: "C" },
    { label: "−40° (одинаково)", val: "-40", unit: "C" },
  ];

  return (
    <div className="space-y-6">
<div className="tool-input-zone">
        <div className="tool-zone-header"><span className="tool-zone-icon">✏️</span><span>Ввод</span></div>
        <span className="section-label">Значение</span>
        <div className="flex flex-wrap gap-2 mb-4">
          {presets.map(({ label, val, unit }) => (
            <button
              key={label}
              type="button"
              onClick={() => { setValue(val); setFrom(unit); }}
              className={`chip ${value === val && from === unit ? "chip-active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[140px]">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Введите температуру"
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
              {TEMP_UNITS.map((u) => (
                <option key={u.key} value={u.key}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {allResults && allResults.length > 0 ? (
        <div className="tool-output-zone">
          <div className="tool-zone-header"><span className="tool-zone-icon">📊</span><span>Результат</span></div>
          <div className="flex items-center justify-between mb-4">
            <span className="section-label mb-0">Результаты</span>
            <CopyButton text={copyAll()} label="Копировать всё" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {allResults.map(({ unit, label, symbol, value: val }) => (
              <button
                key={unit}
                type="button"
                onClick={() => swap(unit)}
                className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-left transition-all hover:border-[var(--accent)] hover:shadow-md"
                title={`Переключить на ${label}`}
              >
                <div className="min-w-0">
                  <div className="text-lg font-bold tabular-nums truncate text-[var(--foreground)]">
                    {val.toFixed(2)} {symbol}
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
          Введите температуру — результаты во всех шкалах появятся мгновенно
        </div>
      )}
    </div>
  );
}
