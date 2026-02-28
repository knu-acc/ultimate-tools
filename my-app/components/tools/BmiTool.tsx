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
      <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">
        Индекс массы тела — быстрая оценка. Результат обновляется мгновенно.
      </p>

      <div className="result-card">
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
        <div className="result-card">
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

          {/* BMI visual scale */}
          <div className="relative">
            <div className="flex rounded-full overflow-hidden h-4">
              <div className="bg-blue-400 flex-[2.5]" />
              <div className="bg-blue-300 flex-[2]" />
              <div className="bg-green-500 flex-[6.5]" />
              <div className="bg-yellow-400 flex-[5]" />
              <div className="bg-orange-400 flex-[5]" />
              <div className="bg-red-400 flex-[5]" />
              <div className="bg-red-600 flex-[4]" />
            </div>
            <div
              className="absolute top-[-6px] w-3 h-7 bg-[var(--foreground)] rounded-sm transition-all shadow-md"
              style={{ left: `calc(${scalePos}% - 6px)` }}
            />
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
