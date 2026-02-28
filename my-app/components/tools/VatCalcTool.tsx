"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

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

  const summary = vat !== null && total !== null
    ? `${t("vat")}: ${vat.toFixed(2)}\n${t("total")}: ${total.toFixed(2)}`
    : "";

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        НДС из суммы с НДС или начисление НДС на сумму без НДС. Выберите ставку и отметьте, включён ли НДС в введённую сумму.
      </p>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--muted)]">{t("amount")}</label>
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
      {vat !== null && total !== null ? (
        <div className="space-y-2">
          <div className="flex justify-end"><CopyButton text={summary} label="Копировать расчёт" /></div>
          <div className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
            <div><span className="text-[var(--muted)]">{t("vat")}:</span> <span className="tabular-nums font-medium">{vat.toFixed(2)}</span></div>
            <div><span className="text-[var(--muted)]">{t("total")}:</span> <span className="tabular-nums font-medium">{total.toFixed(2)}</span></div>
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Введите сумму, выберите ставку НДС и укажите, включён ли НДС в сумму — нажмите «Рассчитать».
        </p>
      )}
    </div>
  );
}
