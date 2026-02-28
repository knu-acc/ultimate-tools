"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface VolumeConverterToolProps {
  t: (key: string) => string;
}

const L_TO_ML = 1000;
const L_TO_GAL_US = 0.264172;
const L_TO_GAL_UK = 0.219969;
const L_TO_CUP = 4.22675;
const L_TO_FL_OZ = 33.814;
const L_TO_PT_US = 2.11338;
const L_TO_PT_UK = 1.75975;
const L_TO_QT_US = 1.05669;
const L_TO_QT_UK = 0.879877;

export function VolumeConverterTool({ t }: VolumeConverterToolProps) {
  const [liters, setLiters] = useState("");

  const L = parseFloat(liters) || 0;
  const ml = L * L_TO_ML;
  const galUs = L * L_TO_GAL_US;
  const galUk = L * L_TO_GAL_UK;
  const cup = L * L_TO_CUP;
  const flOz = L * L_TO_FL_OZ;
  const ptUs = L * L_TO_PT_US;
  const ptUk = L * L_TO_PT_UK;
  const qtUs = L * L_TO_QT_US;
  const qtUk = L * L_TO_QT_UK;

  const items = [
    { label: t("ml"), value: ml.toFixed(2) },
    { label: t("galUs"), value: galUs.toFixed(4) },
    { label: t("galUk"), value: galUk.toFixed(4) },
    { label: t("ptUs"), value: ptUs.toFixed(4) },
    { label: t("ptUk"), value: ptUk.toFixed(4) },
    { label: t("qtUs"), value: qtUs.toFixed(4) },
    { label: t("qtUk"), value: qtUk.toFixed(4) },
    { label: t("cup"), value: cup.toFixed(2) },
    { label: t("flOz"), value: flOz.toFixed(2) },
  ];
  const allLines = L > 0 ? items.map((i) => `${i.label}: ${i.value}`).join("\n") : "";

  const presets = [0.5, 1, 2, 5];

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">{t("description")}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {presets.map((p) => (
          <button key={p} type="button" onClick={() => setLiters(String(p))} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--border)]/20">{p} L</button>
        ))}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("liters")}</label>
        <input
          type="number"
          min={0}
          step={0.001}
          value={liters}
          onChange={(e) => setLiters(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 focus:border-[var(--accent)] focus:outline-none"
        />
      </div>
      {L > 0 ? (
        <div className="space-y-2">
          <div className="flex justify-end"><CopyButton text={allLines} label="Копировать все" /></div>
          <div className="grid gap-2 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex justify-between rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2 text-sm"
              >
                <span className="text-[var(--muted)]">{item.label}</span>
                <span className="font-medium tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Введите объём в литрах — эквиваленты в других единицах появятся ниже.
        </p>
      )}
    </div>
  );
}
