"use client";

import { useState } from "react";

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
      <div>
        <label className="mb-2 block text-sm">{t("value")}</label>
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
      {result && (
        <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent)]/10 p-4 font-mono text-xl">
          {result}
        </div>
      )}
    </div>
  );
}
