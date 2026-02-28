"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface TipCalculatorToolProps {
  t: (key: string) => string;
}

export function TipCalculatorTool({ t }: TipCalculatorToolProps) {
  const [bill, setBill] = useState("");
  const [percent, setPercent] = useState(10);
  const [people, setPeople] = useState(1);
  const [roundTo, setRoundTo] = useState(0);

  const amount = parseFloat(bill) || 0;
  const tip = (amount * percent) / 100;
  let total = amount + tip;
  if (roundTo > 0) total = Math.ceil(total / roundTo) * roundTo;
  const perPerson = people > 0 ? total / people : 0;

  const summary = amount > 0
    ? people > 1
      ? `${t("tip")}: ${tip.toFixed(2)}\n${t("total")}: ${total.toFixed(2)}\n${t("perPerson")}: ${perPerson.toFixed(2)}`
      : `${t("tip")}: ${tip.toFixed(2)}\n${t("total")}: ${total.toFixed(2)}`
    : "";

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Чаевые от суммы счёта: укажите сумму, процент чаевых и количество человек — итог и доля с человека обновляются автоматически.
      </p>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("bill")}</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={bill}
          onChange={(e) => setBill(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 focus:border-[var(--accent)] focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">{t("tipPercent")} (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          value={percent}
          onChange={(e) => setPercent(Number(e.target.value) || 0)}
          className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 focus:border-[var(--accent)] focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">{t("people")}</label>
        <input
          type="number"
          min="1"
          value={people}
          onChange={(e) => setPeople(Math.max(1, Number(e.target.value) || 1))}
          className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 focus:border-[var(--accent)] focus:outline-none"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-[var(--muted)]">{t("tipPresets") || "Чаевые %"}:</span>
        {[5, 10, 15, 20].map((p) => (
          <button key={p} type="button" onClick={() => setPercent(p)} className={`rounded-lg px-3 py-1.5 text-sm ${percent === p ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] hover:bg-[var(--border)]/20"}`}>{p}%</button>
        ))}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("roundTotal") || "Округлить итог до"}</label>
        <select value={roundTo} onChange={(e) => setRoundTo(Number(e.target.value))} className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2">
          <option value={0}>{t("noRound") || "Не округлять"}</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      {amount > 0 ? (
        <div className="space-y-2">
          <div className="flex justify-end"><CopyButton text={summary} label="Копировать расчёт" /></div>
          <div className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">{t("tip")}</span>
              <span className="font-medium tabular-nums">{tip.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">{t("total")}</span>
              <span className="font-medium tabular-nums">{total.toFixed(2)}</span>
            </div>
            {people > 1 && (
              <div className="flex justify-between border-t border-[var(--border)] pt-2 text-sm">
                <span className="text-[var(--muted)]">{t("perPerson")}</span>
                <span className="font-medium tabular-nums">{perPerson.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Введите сумму счёта — чаевые и итог появятся ниже. Можно указать число гостей для расчёта с человека.
        </p>
      )}
    </div>
  );
}
