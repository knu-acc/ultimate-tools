"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface BmiToolProps {
  t: (key: string) => string;
}

export function BmiTool({ t }: BmiToolProps) {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);

  const calc = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (isNaN(w) || isNaN(h) || h <= 0) return;
    setBmi(w / (h * h));
  };

  const status =
    bmi !== null
      ? bmi < 18.5
        ? t("underweight")
        : bmi < 25
          ? t("normal")
          : bmi < 30
            ? t("overweight")
            : t("obese")
      : "";

  const summary = bmi !== null ? `ИМТ: ${bmi.toFixed(1)} — ${status}` : "";
  const h = parseFloat(height) / 100;
  const idealMin = h > 0 ? (18.5 * h * h).toFixed(1) : "";
  const idealMax = h > 0 ? (25 * h * h).toFixed(1) : "";

  const heightPresets = [160, 170, 180, 190];

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Индекс массы тела (ИМТ) по весу (кг) и росту (см). Ориентир для оценки нормы, недостатка или избытка веса. Не заменяет консультацию врача.
      </p>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <span className="mb-3 block text-sm font-medium text-[var(--muted)]">Вес и рост</span>
        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("weight")} (кг)</label>
            <input
              type="number"
              min="20"
              max="300"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("height")} (см)</label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="number"
                min="100"
                max="250"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
                className="w-24 rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)]"
              />
              {heightPresets.map((h) => (
                <button key={h} type="button" onClick={() => setHeight(String(h))} className={`rounded-lg border px-3 py-2 text-sm font-medium ${height === String(h) ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--accent)]" : "border-[var(--border)] hover:bg-[var(--border)]/20"}`}>
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={calc} className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white hover:opacity-90">
          {t("calculate")}
        </button>
      </div>
      {bmi !== null ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--muted)]">Результат</span>
            <CopyButton text={summary} label="Копировать результат" />
          </div>
          <div className="rounded-lg border border-[var(--accent)] bg-[var(--accent)]/10 p-4">
            <div className="text-2xl font-bold tabular-nums">{bmi.toFixed(1)}</div>
            <div className="text-sm font-medium text-[var(--muted)]">{status}</div>
            {idealMin && idealMax && (
              <p className="mt-2 text-xs text-[var(--muted)]">{t("idealRange") || "Норма ИМТ 18.5–25 ≈ вес (кг)"}: {idealMin} – {idealMax}</p>
            )}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Укажите вес в кг и рост в см, нажмите «Рассчитать».
        </p>
      )}
    </div>
  );
}
