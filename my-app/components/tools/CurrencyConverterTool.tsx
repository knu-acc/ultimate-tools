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
    <div className="space-y-5">
      <div className="tool-input-zone">
        <div className="tool-zone-header"><span className="tool-zone-icon">💱</span><span>Ввод</span></div>
        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[var(--muted)]">{CURRENCIES[from]?.symbol}</span>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Введите сумму"
            className="tool-hero-input pl-12"
            autoFocus
          />
        </div>
        <span className="section-label">Валюта</span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CURRENCIES).map(([key, { label, symbol }]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFrom(key)}
              className={`chip ${from === key ? "chip-active" : ""}`}
            >
              {symbol} {key}
            </button>
          ))}
        </div>
      </div>

      {allResults && allResults.length > 0 ? (
        <div className="tool-output-zone">
          <div className="tool-zone-header"><span className="tool-zone-icon">📊</span><span>Результат</span></div>
          <div className="flex items-center justify-between mb-4">
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
