"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

function toKelvin(val: number, from: string): number {
  if (from === "K") return val;
  if (from === "C") return val + 273.15;
  if (from === "F") return (val - 32) * (5 / 9) + 273.15;
  return val;
}
function fromKelvin(k: number, to: string): number {
  if (to === "K") return k;
  if (to === "C") return k - 273.15;
  if (to === "F") return (k - 273.15) * (9 / 5) + 32;
  return k;
}

interface TemperatureConverterToolProps {
  t: (key: string) => string;
}

export function TemperatureConverterTool({ t }: TemperatureConverterToolProps) {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("C");
  const [to, setTo] = useState("F");

  const v = parseFloat(value);
  const k = !isNaN(v) ? toKelvin(v, from) : NaN;
  const result = !isNaN(k) ? fromKelvin(k, to).toFixed(4) : "";
  const resultLine = result ? `${value} °${from} = ${result} °${to}` : "";

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">{t("description")}</p>
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
            <option value="C">{t("unit_C")}</option>
            <option value="F">{t("unit_F")}</option>
            <option value="K">{t("unit_K")}</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm">{t("to")}</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
          >
            <option value="C">{t("unit_C")}</option>
            <option value="F">{t("unit_F")}</option>
            <option value="K">{t("unit_K")}</option>
          </select>
        </div>
      </div>
      {result ? (
        <div className="space-y-2">
          <div className="flex justify-end"><CopyButton text={resultLine} label="Копировать" /></div>
          <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent)]/10 p-4 text-xl font-bold tabular-nums">
            {result} °{to}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Введите значение и выберите единицы «из» и «в».
        </p>
      )}
    </div>
  );
}
