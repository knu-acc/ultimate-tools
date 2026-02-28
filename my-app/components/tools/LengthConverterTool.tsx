"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

const M = 1;
const UNITS: Record<string, number> = {
  m: 1,
  km: 1000,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.34,
  yd: 0.9144,
  ft: 0.3048,
  in: 0.0254,
};

interface LengthConverterToolProps {
  t: (key: string) => string;
}

export function LengthConverterTool({ t }: LengthConverterToolProps) {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");

  const v = parseFloat(value);
  const result = !isNaN(v)
    ? ((v * UNITS[from]) / UNITS[to]).toFixed(4)
    : "";

  const resultLine = result ? `${value} ${from} = ${result} ${to}` : "";

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Конвертер длины: метры, км, см, мм, мили, ярды, футы, дюймы. Результат обновляется при вводе.
      </p>
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
            {Object.keys(UNITS).map((u) => (
              <option key={u} value={u}>{u}</option>
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
            {Object.keys(UNITS).map((u) => (
              <option key={u} value={u}>{u}</option>
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
          Введите число и выберите единицы «из» и «в» — результат появится ниже.
        </p>
      )}
    </div>
  );
}
