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
<div className="tool-input-zone">
        <div className="tool-zone-header"><span className="tool-zone-icon">✏️</span><span>Ввод</span></div>
        <span className="section-label">Сумма и ставка</span>
        <div className="mb-4">
          <label className="field-label">{t("amount")}</label>
          <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Сумма" className="input-base" />
        </div>
        <div className="mb-4">
          <label className="field-label">{t("vatRate")}</label>
          <div className="flex gap-2">
            {[0, 10, 20].map((n) => (
              <button key={n} type="button" onClick={() => setVatRate(n)} className={`chip ${vatRate === n ? "chip-active" : ""}`}>{n}%</button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={includeVat} onChange={(e) => setIncludeVat(e.target.checked)} className="rounded" />
          <span className="text-sm">{t("includeVat")}</span>
        </label>
        <div className="tool-action-bar"><button onClick={calc} className="btn-primary w-full sm:w-auto mt-2">{t("calculate")}</button></div>
      </div>
      {vat !== null && total !== null ? (
        <div className="tool-output-zone">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--foreground)]/70">Результат</span>
            <CopyButton text={summary} label="Копировать расчёт" />
          </div>
          <div className="space-y-2 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
            {includeVat && net !== null && <div className="flex justify-between"><span className="text-[var(--muted)]">{t("withoutVat") || "Без НДС"}</span><span className="tabular-nums font-medium">{net.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span className="text-[var(--muted)]">{t("vat")}</span><span className="tabular-nums font-medium">{vat.toFixed(2)}</span></div>
            <div className="flex justify-between border-t border-[var(--border)] pt-2"><span className="text-[var(--muted)]">{t("total")}</span><span className="tabular-nums font-medium">{total.toFixed(2)}</span></div>
          </div>
        </div>
      ) : (
        <p className="empty-state">
          Введите сумму, выберите ставку и отметьте «Включён ли НДС», нажмите «Рассчитать».
        </p>
      )}
    </div>
  );
}
