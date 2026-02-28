"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface LoanCalcToolProps {
  t: (key: string) => string;
}

export function LoanCalcTool({ t }: LoanCalcToolProps) {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [payment, setPayment] = useState<number | null>(null);

  const calc = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(months, 10);
    if (isNaN(P) || isNaN(r) || isNaN(n) || n <= 0) return;
    const m = r ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : P / n;
    setPayment(m);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Аннуитетный платёж: сумма кредита, годовая ставка в % и срок в месяцах. Результат — ежемесячный платёж.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm">{t("principal")}</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm">{t("rate")} (%)</label>
          <input
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm">{t("months")}</label>
          <input
            type="number"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
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
      {payment !== null ? (
        <div className="space-y-2">
          <div className="flex justify-end">
            <CopyButton text={`${t("monthlyPayment")}: ${payment.toFixed(2)}`} label="Копировать платёж" />
          </div>
          <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent)]/10 p-4">
            <div className="text-2xl font-bold tabular-nums">{payment.toFixed(2)}</div>
            <div className="text-sm text-[var(--muted)]">{t("monthlyPayment")}</div>
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Введите сумму, ставку и срок — нажмите «Рассчитать» для ежемесячного платежа.
        </p>
      )}
    </div>
  );
}
