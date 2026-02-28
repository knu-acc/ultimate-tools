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

  const [overpayment, setOverpayment] = useState<number | null>(null);

  const calc = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(months, 10);
    if (isNaN(P) || isNaN(r) || isNaN(n) || n <= 0) return;
    const m = r ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : P / n;
    setPayment(m);
    setOverpayment(m * n - P);
  };

  const setTerm = (m: number) => {
    setMonths(String(m));
  };

  const termPresets = [12, 24, 36, 60, 120];
  const monthsNum = parseInt(months, 10);
  const totalRepay = payment !== null && !isNaN(monthsNum) ? payment * monthsNum : null;

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Аннуитетный платёж по кредиту: сумма, годовая ставка (%) и срок в месяцах. Результат — ежемесячный платёж и переплата. Расчёт ориентировочный, без учёта комиссий и страховок.
      </p>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <span className="mb-3 block text-sm font-medium text-[var(--muted)]">{t("months")} — быстрый выбор</span>
        <div className="flex flex-wrap gap-2 mb-4">
          {termPresets.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setTerm(m)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium ${months === String(m) ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--accent)]" : "border-[var(--border)] hover:bg-[var(--border)]/20"}`}
            >
              {m} мес
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("principal")}</label>
            <input
              type="number"
              min="0"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="Сумма"
              className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("rate")} (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="Ставка"
              className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("months")}</label>
            <input
              type="number"
              min="1"
              max="600"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              placeholder="Срок"
              className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
        </div>
        <button
          onClick={calc}
          className="mt-4 rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white hover:opacity-90"
        >
          {t("calculate")}
        </button>
      </div>
      {payment !== null ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--muted)]">Результат</span>
            <CopyButton text={`${t("monthlyPayment")}: ${payment.toFixed(2)}${overpayment != null && overpayment > 0 ? `\n${t("overpayment") || "Переплата"}: ${overpayment.toFixed(2)}` : ""}`} label="Копировать расчёт" />
          </div>
          <div className="rounded-lg border border-[var(--accent)] bg-[var(--accent)]/10 p-4 space-y-1">
            <div className="text-2xl font-bold tabular-nums">{payment.toFixed(2)}</div>
            <div className="text-sm text-[var(--muted)]">{t("monthlyPayment")}</div>
            {overpayment !== null && overpayment > 0 && (
              <p className="text-sm text-[var(--muted)]">{t("overpayment") || "Переплата"}: <span className="font-medium tabular-nums">{overpayment.toFixed(2)}</span></p>
            )}
            {totalRepay !== null && (
              <p className="text-sm text-[var(--muted)]">Итого к возврату: <span className="font-medium tabular-nums">{totalRepay.toFixed(2)}</span></p>
            )}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Введите сумму, ставку и срок (или выберите пресет срока), нажмите «Рассчитать».
        </p>
      )}
    </div>
  );
}
