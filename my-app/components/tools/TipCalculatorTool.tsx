"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

interface TipCalculatorToolProps {
  t: (key: string) => string;
}

const fmt = (n: number) => n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function TipCalculatorTool({ t }: TipCalculatorToolProps) {
  const [bill, setBill] = useState("");
  const [percent, setPercent] = useState(10);
  const [people, setPeople] = useState(1);
  const [roundTo, setRoundTo] = useState(0);

  const amount = parseFloat(bill) || 0;

  const { tip, total, perPerson } = useMemo(() => {
    const tip = (amount * percent) / 100;
    let total = amount + tip;
    if (roundTo > 0) total = Math.ceil(total / roundTo) * roundTo;
    const perPerson = people > 0 ? total / people : 0;
    return { tip, total, perPerson };
  }, [amount, percent, people, roundTo]);

  const summary = amount > 0
    ? `Чаевые: ${fmt(tip)}\nИтого: ${fmt(total)}${people > 1 ? `\nС человека: ${fmt(perPerson)}` : ""}`
    : "";

  return (
    <div className="space-y-6">
<div className="tool-input-zone">
        <div className="tool-zone-header"><span className="tool-zone-icon">✏️</span><span>Ввод</span></div>
        <span className="section-label">Счёт и настройки</span>
        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          <div>
            <label className="field-label">Сумма счёта</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
              placeholder="Например, 2500"
              className="input-base text-lg font-semibold"
              autoFocus
            />
          </div>
          <div>
            <label className="field-label">Процент чаевых</label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={percent}
                onChange={(e) => setPercent(Number(e.target.value) || 0)}
                className="input-base w-24"
              />
              {[5, 10, 15, 20].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPercent(p)}
                  className={`chip ${percent === p ? "chip-active" : ""}`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="field-label">Гостей</label>
            <input
              type="number"
              min="1"
              value={people}
              onChange={(e) => setPeople(Math.max(1, Number(e.target.value) || 1))}
              className="input-base w-24"
            />
          </div>
          <div>
            <label className="field-label">Округлить до</label>
            <select
              value={roundTo}
              onChange={(e) => setRoundTo(Number(e.target.value))}
              className="input-base"
            >
              <option value={0}>Не округлять</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {amount > 0 ? (
        <div className="tool-output-zone">
          <div className="tool-zone-header"><span className="tool-zone-icon">📊</span><span>Результат</span></div>
          <div className="flex items-center justify-between mb-4">
            <span className="section-label mb-0">Результат</span>
            <CopyButton text={summary} label="Копировать" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="stat-card">
              <div className="stat-value text-[var(--accent)]">{fmt(tip)}</div>
              <div className="stat-label">Чаевые</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{fmt(total)}</div>
              <div className="stat-label">Итого</div>
            </div>
            {people > 1 && (
              <div className="stat-card">
                <div className="stat-value">{fmt(perPerson)}</div>
                <div className="stat-label">С человека</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          Введите сумму счёта — чаевые и итог появятся автоматически
        </div>
      )}
    </div>
  );
}
