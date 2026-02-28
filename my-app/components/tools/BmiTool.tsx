"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

interface BmiToolProps {
  t: (key: string) => string;
}

const BMI_ZONES = [
  { max: 16, label: "Выраженный дефицит", color: "#3b82f6" },
  { max: 18.5, label: "Недостаточный вес", color: "#60a5fa" },
  { max: 25, label: "Норма", color: "#22c55e" },
  { max: 30, label: "Избыточный вес", color: "#f59e0b" },
  { max: 35, label: "Ожирение I", color: "#f97316" },
  { max: 40, label: "Ожирение II", color: "#ef4444" },
  { max: 100, label: "Ожирение III", color: "#dc2626" },
];

function getZone(bmi: number) {
  return BMI_ZONES.find((z) => bmi < z.max) || BMI_ZONES[BMI_ZONES.length - 1];
}

export function BmiTool({ t }: BmiToolProps) {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const heightPresets = [155, 160, 165, 170, 175, 180];

  const result = useMemo(() => {
    const w = parseFloat(weight);
    const hCm = parseFloat(height);
    if (isNaN(w) || isNaN(hCm) || hCm <= 0 || w <= 0) return null;
    const h = hCm / 100;
    const bmi = w / (h * h);
    const zone = getZone(bmi);
    const idealMin = 18.5 * h * h;
    const idealMax = 25 * h * h;
    return { bmi, zone, idealMin, idealMax };
  }, [weight, height]);

  const summary = result
    ? `ИМТ: ${result.bmi.toFixed(1)} — ${result.zone.label}\nНорма веса: ${result.idealMin.toFixed(1)}–${result.idealMax.toFixed(1)} кг`
    : "";

  /* Position on a 15–45 BMI scale */
  const scalePos = result ? Math.min(100, Math.max(0, ((result.bmi - 15) / 30) * 100)) : 0;

  return (
    <div className="space-y-6">
<div className="tool-input-zone">
        <div className="tool-zone-header"><span className="tool-zone-icon">✏️</span><span>Ввод</span></div>
        <span className="section-label">Параметры</span>
        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          <div>
            <label className="field-label">Вес (кг)</label>
            <input
              type="number"
              min="20"
              max="300"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              className="input-base text-lg font-semibold"
              autoFocus
            />
          </div>
          <div>
            <label className="field-label">Рост (см)</label>
            <input
              type="number"
              min="100"
              max="250"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="175"
              className="input-base text-lg font-semibold"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {heightPresets.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHeight(String(h))}
              className={`chip ${height === String(h) ? "chip-active" : ""}`}
            >
              {h} см
            </button>
          ))}
        </div>
      </div>

      {result ? (
        <div className="tool-output-zone">
          <div className="tool-zone-header"><span className="tool-zone-icon">📊</span><span>Результат</span></div>
          <div className="flex items-center justify-between mb-4">
            <span className="section-label mb-0">Результат</span>
            <CopyButton text={summary} label="Копировать" />
          </div>

          <div className="grid gap-3 sm:grid-cols-3 mb-5">
            <div className="stat-card">
              <div className="stat-value" style={{ color: result.zone.color }}>
                {result.bmi.toFixed(1)}
              </div>
              <div className="stat-label">ИМТ</div>
            </div>
            <div className="stat-card">
              <div className="text-lg font-bold" style={{ color: result.zone.color }}>
                {result.zone.label}
              </div>
              <div className="stat-label">Категория</div>
            </div>
            <div className="stat-card">
              <div className="text-lg font-bold tabular-nums">
                {result.idealMin.toFixed(1)}–{result.idealMax.toFixed(1)}
              </div>
              <div className="stat-label">Норма веса (кг)</div>
            </div>
          </div>

          {/* BMI visual scale with labeled zones */}
          <div className="relative mt-2">
            <div className="flex rounded-full overflow-hidden h-5 gap-px">
              <div className="bg-blue-400 flex-[2.5] relative group">
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white opacity-80">&lt;16</span>
              </div>
              <div className="bg-blue-300 flex-[2] relative">
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white opacity-80">16-18.5</span>
              </div>
              <div className="bg-green-500 flex-[6.5] relative">
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white opacity-90">Норма</span>
              </div>
              <div className="bg-yellow-400 flex-[5] relative">
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white opacity-80">25-30</span>
              </div>
              <div className="bg-orange-400 flex-[5] relative">
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white opacity-80">30-35</span>
              </div>
              <div className="bg-red-400 flex-[5] relative">
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white opacity-80">35-40</span>
              </div>
              <div className="bg-red-600 flex-[4] relative">
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white opacity-80">&gt;40</span>
              </div>
            </div>
            {/* Position indicator with tooltip */}
            <div
              className="absolute -top-1 transition-all duration-300"
              style={{ left: `calc(${scalePos}% - 8px)` }}
            >
              <div className="w-4 h-7 bg-[var(--foreground)] rounded-sm shadow-lg border-2 border-white dark:border-gray-800" />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-[var(--foreground)] text-[var(--background)] px-2 py-0.5 text-xs font-bold whitespace-nowrap shadow">
                {result.bmi.toFixed(1)}
              </div>
            </div>
            <div className="flex justify-between text-xs text-[var(--muted)] mt-2">
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>35</span>
              <span>40</span>
              <span>45</span>
            </div>
          </div>

          <p className="text-xs text-[var(--muted)] mt-4 text-center">
            ⚠️ ИМТ — ориентировочный показатель. Не заменяет консультацию врача.
          </p>
        </div>
      ) : (
        <div className="empty-state">
          Введите вес и рост — ИМТ рассчитается автоматически
        </div>
      )}
    </div>
  );
}
