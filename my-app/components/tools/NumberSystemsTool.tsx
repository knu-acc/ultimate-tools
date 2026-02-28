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

  const convert = () => {
    const num = parseInt(value, fromBase);
    if (isNaN(num)) return;
    setResult(num.toString(toBase).toUpperCase());
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Перевод числа между системами: двоичная (2), восьмеричная (8), десятичная (10), шестнадцатеричная (16). Введите число в исходной системе и нажмите «Конвертировать».
      </p>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--muted)]">{t("value")}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 font-mono"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm">{t("fromBase")}</label>
          <select
            value={fromBase}
            onChange={(e) => setFromBase(Number(e.target.value))}
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
          >
            {[2, 8, 10, 16].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm">{t("toBase")}</label>
          <select
            value={toBase}
            onChange={(e) => setToBase(Number(e.target.value))}
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
          >
            {[2, 8, 10, 16].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={convert}
        className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white"
      >
        {t("convert")}
      </button>
      {result ? (
        <div className="space-y-2">
          <div className="flex justify-end"><CopyButton text={result} label="Копировать" /></div>
          <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent)]/10 p-4 font-mono text-xl">
            {result}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Введите число (например 255 в десятичной), выберите исходную и целевую систему счисления — нажмите «Конвертировать».
        </p>
      )}
    </div>
  );
}
