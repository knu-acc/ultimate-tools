"use client";

import { useState } from "react";

interface VatCalcToolProps {
  t: (key: string) => string;
}

export function VatCalcTool({ t }: VatCalcToolProps) {
  const [amount, setAmount] = useState("");
  const [vatRate, setVatRate] = useState(20);
  const [includeVat, setIncludeVat] = useState(true);
  const [vat, setVat] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  const calc = () => {
    const a = parseFloat(amount);
    if (isNaN(a)) return;
    const rate = vatRate / 100;
    if (includeVat) {
      const net = a / (1 + rate);
      setVat(a - net);
      setTotal(a);
    } else {
      setVat(a * rate);
      setTotal(a + a * rate);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm">{t("amount")}</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm">{t("vatRate")}</label>
        <select
          value={vatRate}
          onChange={(e) => setVatRate(Number(e.target.value))}
          className="rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
        >
          {[0, 10, 20].map((n) => (
            <option key={n} value={n}>{n}%</option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={includeVat}
          onChange={(e) => setIncludeVat(e.target.checked)}
        />
        {t("includeVat")}
      </label>
      <button
        onClick={calc}
        className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white"
      >
        {t("calculate")}
      </button>
      {vat !== null && total !== null && (
        <div className="space-y-2 rounded-xl border border-[var(--border)] p-4">
          <div><span className="text-[var(--muted)]">{t("vat")}:</span> {vat.toFixed(2)}</div>
          <div><span className="text-[var(--muted)]">{t("total")}:</span> {total.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}
