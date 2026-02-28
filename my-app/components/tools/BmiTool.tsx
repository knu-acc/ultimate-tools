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

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Индекс массы тела по весу (кг) и росту (см). Ориентир для оценки нормы, недостатка или избытка веса.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm">{t("weight")} (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm">{t("height")} (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
          />
        </div>
      </div>
      <button
        onClick={calc}
        className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white"
      >
        {t("calculate")}
      </button>
      {bmi !== null ? (
        <div className="space-y-2">
          <div className="flex justify-end"><CopyButton text={summary} label="Копировать результат" /></div>
          <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent)]/10 p-4">
            <div className="text-2xl font-bold tabular-nums">{bmi.toFixed(1)}</div>
            <div className="text-sm text-[var(--muted)]">{status}</div>
            {idealMin && idealMax && (
              <p className="mt-2 text-xs text-[var(--muted)]">{t("idealRange") || "Норма ИМТ 18.5–25 ≈ вес (кг)"}: {idealMin} – {idealMax}</p>
            )}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Укажите вес в кг и рост в см, нажмите «Рассчитать» — получите ИМТ и категорию.
        </p>
      )}
    </div>
  );
}
