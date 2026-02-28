"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

interface LoanCalcToolProps {
  t: (key: string) => string;
}

const fmt = (n: number) => n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function LoanCalcTool({ t }: LoanCalcToolProps) {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");

  const termPresets = [12, 24, 36, 60, 120, 240];

  const result = useMemo(() => {
    const P = parseFloat(principal);
    const annualRate = parseFloat(rate);
    const n = parseInt(months, 10);
    if (isNaN(P) || P <= 0 || isNaN(annualRate) || isNaN(n) || n <= 0) return null;
    const r = annualRate / 100 / 12;
    const payment = r > 0
      ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : P / n;
    const totalRepay = payment * n;
    const overpayment = totalRepay - P;
    return { payment, totalRepay, overpayment };
  }, [principal, rate, months]);

  const summary = result
    ? `Ежемесячно: ${fmt(result.payment)}\nИтого: ${fmt(result.totalRepay)}\nПереплата: ${fmt(result.overpayment)}`
    : "";

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">
        Аннуитетный кредитный калькулятор. Введите сумму, ставку и срок — расчёт обновляется мгновенно.
      </p>

      <div className="result-card">
        <span className="section-label">Параметры кредита</span>

        <div className="flex flex-wrap gap-2 mb-4">
          {termPresets.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMonths(String(m))}
              className={`chip ${months === String(m) ? "chip-active" : ""}`}
            >
              {m >= 12 ? `${m / 12} ${m === 12 ? "год" : m <= 48 ? "года" : "лет"}` : `${m} мес`}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="field-label">Сумма</label>
            <input
              type="number"
              min="0"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="1 000 000"
              className="input-base text-lg font-semibold"
              autoFocus
            />
          </div>
          <div>
            <label className="field-label">Ставка (% год.)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="12"
              className="input-base text-lg font-semibold"
            />
          </div>
          <div>
            <label className="field-label">Срок (мес.)</label>
            <input
              type="number"
              min="1"
              max="600"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              placeholder="36"
              className="input-base text-lg font-semibold"
            />
          </div>
        </div>
      </div>

      {result ? (
        <div className="result-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-label mb-0">Результат</span>
            <CopyButton text={summary} label="Копировать" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="stat-card">
              <div className="stat-value text-[var(--accent)]">{fmt(result.payment)}</div>
              <div className="stat-label">Ежемесячный платёж</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{fmt(result.totalRepay)}</div>
              <div className="stat-label">Итого к возврату</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-red-500">{fmt(result.overpayment)}</div>
              <div className="stat-label">Переплата</div>
            </div>
          </div>

          {/* Visual bar showing principal vs overpayment */}
          {result.overpayment > 0 && (
            <div className="mt-4">
              <div className="flex rounded-full overflow-hidden h-3">
                <div
                  className="bg-[var(--accent)] transition-all"
                  style={{ width: `${(parseFloat(principal) / result.totalRepay) * 100}%` }}
                />
                <div className="bg-red-400/60 flex-1" />
              </div>
              <div className="flex justify-between text-xs text-[var(--muted)] mt-1">
                <span>Тело: {((parseFloat(principal) / result.totalRepay) * 100).toFixed(1)}%</span>
                <span>Проценты: {((result.overpayment / result.totalRepay) * 100).toFixed(1)}%</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          Введите сумму, ставку и срок — расчёт появится автоматически
        </div>
      )}
    </div>
  );
}
