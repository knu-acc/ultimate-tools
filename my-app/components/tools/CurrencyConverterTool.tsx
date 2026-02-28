"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

/* Статичные ориентировочные курсы к USD */
const CURRENCIES: Record<string, { rate: number; label: string; symbol: string }> = {
  USD: { rate: 1,        label: "Доллар США",   symbol: "$" },
  EUR: { rate: 1.08,     label: "Евро",          symbol: "€" },
  RUB: { rate: 0.0108,   label: "Рубль",         symbol: "₽" },
  KZT: { rate: 0.00206,  label: "Тенге",         symbol: "₸" },
  GBP: { rate: 1.27,     label: "Фунт стерл.",   symbol: "£" },
  CNY: { rate: 0.138,    label: "Юань",          symbol: "¥" },
  TRY: { rate: 0.031,    label: "Турецкая лира", symbol: "₺" },
  JPY: { rate: 0.0067,   label: "Иена",          symbol: "¥" },
  UAH: { rate: 0.024,    label: "Гривна",        symbol: "₴" },
  BYN: { rate: 0.31,     label: "Бел. рубль",    symbol: "Br" },
};

interface CurrencyConverterToolProps {
  t: (key: string) => string;
}

export function CurrencyConverterTool({ t }: CurrencyConverterToolProps) {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("USD");

  const v = parseFloat(value);

  const allResults = useMemo(() => {
    if (isNaN(v) || !v) return null;
    const baseUSD = v * CURRENCIES[from].rate;
    return Object.entries(CURRENCIES)
      .filter(([key]) => key !== from)
      .map(([key, { rate, label, symbol }]) => ({
        code: key,
        label,
        symbol,
        value: baseUSD / rate,
      }));
  }, [v, from]);

  const swap = (toCode: string) => {
    if (allResults) {
      const res = allResults.find((r) => r.code === toCode);
      if (res) {
        setValue(String(parseFloat(res.value.toPrecision(6))));
        setFrom(toCode);
      }
    }
  };

  const copyAll = () => {
    if (!allResults) return "";
    return allResults.map((r) => `${r.symbol}${r.value.toFixed(2)} ${r.code}`).join("\n");
  };

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">
        Конвертер валют с ориентировочными курсами. Для точных курсов используйте биржевые данные. Результаты обновляются мгновенно.
      </p>

      <div className="result-card">
        <span className="section-label">Сумма</span>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[140px]">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Введите сумму"
              className="input-base text-lg font-semibold"
              autoFocus
            />
          </div>
          <div className="min-w-[180px]">
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="input-base"
            >
              {Object.entries(CURRENCIES).map(([key, { label, symbol }]) => (
                <option key={key} value={key}>{symbol} {label} ({key})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {allResults && allResults.length > 0 ? (
        <div className="result-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-label mb-0">Результаты</span>
            <CopyButton text={copyAll()} label="Копировать всё" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {allResults.map(({ code, label, symbol, value: val }) => (
              <button
                key={code}
                type="button"
                onClick={() => swap(code)}
                className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-left transition-all hover:border-[var(--accent)] hover:shadow-md"
                title={`Переключить на ${label}`}
              >
                <div className="min-w-0">
                  <div className="text-lg font-bold tabular-nums truncate text-[var(--foreground)]">
                    {symbol}{val.toFixed(2)}
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">{label} ({code})</div>
                </div>
                <span className="text-xs text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity ml-2">↔</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--muted)] mt-3 text-center">⚠️ Курсы ориентировочные и фиксированные</p>
        </div>
      ) : (
        <div className="empty-state">
          Введите сумму — результаты во всех валютах появятся мгновенно
        </div>
      )}
    </div>
  );
}
