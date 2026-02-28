"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

const UNITS: Record<string, number> = {
  L: 1,
  mL: 0.001,
  m3: 1000,
  gal_us: 3.78541,
  gal_uk: 4.54609,
  cup: 0.236588,
  fl_oz: 0.0295735,
  pt_us: 0.473176,
  qt_us: 0.946353,
  tbsp: 0.0147868,
};

const UNIT_DATA: Record<string, { factor: number; label: string }> = {
  "L":      { factor: UNITS["L"],      label: "Литр (L)" },
  "mL":     { factor: UNITS["mL"],     label: "Миллилитр (mL)" },
  "m3":     { factor: UNITS["m3"],     label: "Куб. метр (m³)" },
  "gal_us": { factor: UNITS["gal_us"], label: "Галлон US (gal)" },
  "gal_uk": { factor: UNITS["gal_uk"], label: "Галлон UK (gal)" },
  "cup":    { factor: UNITS["cup"],    label: "Чашка US (cup)" },
  "fl_oz":  { factor: UNITS["fl_oz"],  label: "Жидк. унция (fl oz)" },
  "pt_us":  { factor: UNITS["pt_us"],  label: "Пинта US (pt)" },
  "qt_us":  { factor: UNITS["qt_us"],  label: "Кварта US (qt)" },
  "tbsp":   { factor: UNITS["tbsp"],   label: "Ст. ложка (tbsp)" },
};

interface VolumeConverterToolProps { t: (key: string) => string; }

export function VolumeConverterTool({ t }: VolumeConverterToolProps) {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("L");

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
          Введите число — результаты во всех единицах объёма появятся мгновенно
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
