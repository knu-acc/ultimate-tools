"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface NumberSystemsToolProps {
  t: (key: string) => string;
}

export function NumberSystemsTool({ t }: NumberSystemsToolProps) {
  const [value, setValue] = useState("");
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(16);
  const [result, setResult] = useState("");

  const isValidForBase = (str: string, base: number): boolean => {
    if (!str.trim()) return false;
    const digits = "0123456789ABCDEF".slice(0, base);
    return str.toUpperCase().split("").every((c) => digits.includes(c));
  };

  const convert = () => {
    const trimmed = value.trim();
    if (!trimmed || !isValidForBase(trimmed, fromBase)) return;
    const num = parseInt(trimmed, fromBase);
    if (isNaN(num)) return;
    setResult(num.toString(toBase).toUpperCase());
  };

  const decimalValue = (() => {
    if (!value.trim() || !isValidForBase(value.trim(), fromBase)) return null;
    const num = parseInt(value.trim(), fromBase);
    return isNaN(num) ? null : num;
  })();

  const basePresets = [
    { label: "255 → hex", from: 10, to: 16, val: "255" },
    { label: "FF → dec", from: 16, to: 10, val: "FF" },
    { label: "1010 → dec", from: 2, to: 10, val: "1010" },
  ];

  return (
    <div className="space-y-6">
<div className="tool-input-zone">
        <span className="field-label">Быстрые примеры</span>
        <div className="flex flex-wrap gap-2 mb-4">
          {basePresets.map(({ label, from, to, val }) => (
            <button key={label} type="button" onClick={() => { setFromBase(from); setToBase(to); setValue(val); setResult(""); }} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium hover:bg-[var(--border)]/20">
              {label}
            </button>
          ))}
        </div>
        <label className="field-label">{t("value")}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Число в выбранной системе"
          className="input-base font-mono"
        />
        {value.trim() && !isValidForBase(value.trim(), fromBase) && (
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">Недопустимые символы для системы с основанием {fromBase}</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <div>
            <label className="field-label">{t("fromBase")}</label>
            <select value={fromBase} onChange={(e) => setFromBase(Number(e.target.value))} className="input-base">
              {[2, 8, 10, 16].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">{t("toBase")}</label>
            <select value={toBase} onChange={(e) => setToBase(Number(e.target.value))} className="input-base">
              {[2, 8, 10, 16].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="tool-action-bar"><button onClick={convert} className="btn-primary w-full sm:w-auto mt-2">
          {t("convert")}
        </button></div>
      </div>
      {result ? (
        <div className="tool-output-zone">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--foreground)]/70">Результат</span>
            <CopyButton text={result} label="Копировать" />
          </div>
          <div className="rounded-lg border border-[var(--accent)] bg-[var(--accent)]/10 p-4 font-mono text-xl">
            {result}
          </div>
        </div>
      ) : (
        <p className="empty-state">
          Введите число, выберите исходную и целевую систему, нажмите «Конвертировать».
        </p>
      )}
    </div>
  );
}
