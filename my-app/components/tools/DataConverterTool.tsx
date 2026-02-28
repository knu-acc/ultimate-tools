"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

const UNITS: Record<string, number> = {
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
  TB: 1024 * 1024 * 1024 * 1024,
  PB: 1024 * 1024 * 1024 * 1024 * 1024,
};

interface DataConverterToolProps {
  t: (key: string) => string;
}

export function DataConverterTool({ t }: DataConverterToolProps) {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("MB");
  const [to, setTo] = useState("GB");

  const v = parseFloat(value);
  const result = !isNaN(v)
    ? ((v * UNITS[from]) / UNITS[to]).toFixed(6)
    : "";

  const resultLine = result ? `${value} ${from} = ${result} ${to}` : "";

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">{t("description")}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={swap} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--border)]/20">{t("swap") || "↔ Поменять"}</button>
      </div>
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
              <option key={u} value={u}>{t(`unit_${u}`) || u}</option>
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
              <option key={u} value={u}>{t(`unit_${u}`) || u}</option>
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
          Введите объём данных и выберите единицы (B, KB, MB, GB, TB, PB).
        </p>
      )}
    </div>
  );
}
