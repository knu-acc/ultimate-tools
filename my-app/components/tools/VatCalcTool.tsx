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
  const [net, setNet] = useState<number | null>(null);

  const calc = () => {
    const a = parseFloat(amount);
    if (isNaN(a)) return;
    const rate = vatRate / 100;
    if (includeVat) {
      const netVal = a / (1 + rate);
      setNet(netVal);
      setVat(a - netVal);
      setTotal(a);
    } else {
      setNet(a);
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
        Выделение НДС из суммы с НДС или начисление НДС на сумму без НДС. Ставка 0, 10 или 20%. Отметьте, включён ли НДС в введённую сумму. Расчёт в браузере.
      </p>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <span className="mb-3 block text-sm font-medium text-[var(--muted)]">Сумма и ставка</span>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("amount")}</label>
          <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Сумма" className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">{t("vatRate")}</label>
          <div className="flex gap-2">
            {[0, 10, 20].map((n) => (
              <button key={n} type="button" onClick={() => setVatRate(n)} className={`rounded-lg px-4 py-2 text-sm font-medium ${vatRate === n ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] hover:bg-[var(--border)]/20"}`}>{n}%</button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={includeVat} onChange={(e) => setIncludeVat(e.target.checked)} className="rounded" />
          <span className="text-sm">{t("includeVat")}</span>
        </label>
        <button onClick={calc} className="mt-4 rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white hover:opacity-90">{t("calculate")}</button>
      </div>
      {vat !== null && total !== null ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--muted)]">Результат</span>
            <CopyButton text={summary} label="Копировать расчёт" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
            {includeVat && net !== null && <div className="flex justify-between"><span className="text-[var(--muted)]">{t("withoutVat") || "Без НДС"}</span><span className="tabular-nums font-medium">{net.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span className="text-[var(--muted)]">{t("vat")}</span><span className="tabular-nums font-medium">{vat.toFixed(2)}</span></div>
            <div className="flex justify-between border-t border-[var(--border)] pt-2"><span className="text-[var(--muted)]">{t("total")}</span><span className="tabular-nums font-medium">{total.toFixed(2)}</span></div>
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Введите сумму, выберите ставку и отметьте «Включён ли НДС», нажмите «Рассчитать».
        </p>
      )}
    </div>
  );
}
