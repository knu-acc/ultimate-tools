"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

const RATES: Record<string, number> = {
  USD: 1,
  EUR: 1.08,
  RUB: 0.011,
  KZT: 0.0021,
  GBP: 1.27,
};

interface CurrencyConverterToolProps {
  t: (key: string) => string;
}

export function CurrencyConverterTool({ t }: CurrencyConverterToolProps) {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  const v = parseFloat(value);
  const result = !isNaN(v)
    ? ((v * RATES[from]) / RATES[to]).toFixed(2)
    : "";
  const resultLine = result ? `${value} ${from} = ${result} ${to}` : "";

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">{t("staticRates")}</p>
      <button type="button" onClick={swap} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--border)]/20">{t("swap") || "↔ Поменять"}</button>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm">{t("value")}</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm">{t("from")}</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
          >
            {Object.keys(RATES).map((c) => (
              <option key={c} value={c}>{t(`unit_${c}`) || c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm">{t("to")}</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
          >
            {Object.keys(RATES).map((c) => (
              <option key={c} value={c}>{t(`unit_${c}`) || c}</option>
            ))}
          </select>
        </div>
      </div>
      {result ? (
        <div className="space-y-2">
          <div className="flex justify-end"><CopyButton text={resultLine} label="Копировать" /></div>
          <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent)]/10 p-4 text-xl font-bold tabular-nums">
            {result} {to}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Введите сумму и выберите валюты — курс фиксированный, для актуальных данных используйте обменник.
        </p>
      )}
    </div>
  );
}
