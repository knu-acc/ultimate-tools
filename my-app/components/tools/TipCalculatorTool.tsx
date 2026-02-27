"use client";

import { useState } from "react";

interface TipCalculatorToolProps {
  t: (key: string) => string;
}

export function TipCalculatorTool({ t }: TipCalculatorToolProps) {
  const [bill, setBill] = useState("");
  const [percent, setPercent] = useState(10);
  const [people, setPeople] = useState(1);

  const amount = parseFloat(bill) || 0;
  const tip = (amount * percent) / 100;
  const total = amount + tip;
  const perPerson = people > 0 ? total / people : 0;

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">{t("bill")}</label>
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
      {amount > 0 && (
        <div className="space-y-2 rounded-xl border border-[var(--border)] p-4">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted)]">{t("tip")}</span>
            <span className="font-medium">{tip.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted)]">{t("total")}</span>
            <span className="font-medium">{total.toFixed(2)}</span>
          </div>
          {people > 1 && (
            <div className="flex justify-between border-t border-[var(--border)] pt-2 text-sm">
              <span className="text-[var(--muted)]">{t("perPerson")}</span>
              <span className="font-medium">{perPerson.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
