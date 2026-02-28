"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";

interface UuidToolProps {
  t: (key: string) => string;
}

function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function UuidTool({ t }: UuidToolProps) {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);

  const format = (id: string) => {
    let s = id;
    if (noDashes) s = s.replace(/-/g, "");
    if (uppercase) s = s.toUpperCase();
    return s;
  };

  const generate = () => {
    setUuids(Array.from({ length: count }, () => format(generateUUID())));
  };

  const countPresets = [1, 5, 10, 20];

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">
        Генерация UUID v4 в браузере. Идентификаторы криптографически случайные. Данные никуда не отправляются.
      </p>
      <div className="result-card">
        <span className="section-label">{t("count")}</span>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {countPresets.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setCount(n)}
              className={`chip ${count === n ? "chip-active" : ""}`}
            >
              {n}
            </button>
          ))}
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
            className="w-20 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-center focus:border-[var(--accent)] transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="rounded" />
            <span className="text-sm">{t("uppercase") || "ЗАГЛАВНЫЕ"}</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={noDashes} onChange={(e) => setNoDashes(e.target.checked)} className="rounded" />
            <span className="text-sm">{t("noDashes") || "Без дефисов"}</span>
          </label>
        </div>
      </div>
      <motion.button
        onClick={generate}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full sm:w-auto mt-2"
      >
        {t("generate")}
      </motion.button>
      {uuids.length > 0 && (
        <div className="result-card">
          <div className="mb-2 flex justify-end">
            <CopyButton text={uuids.join("\n")} label="Копировать все" />
          </div>
          <div className="space-y-2">
            {uuids.map((id, i) => (
              <div
                key={i}
                className="cursor-pointer select-all rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 font-mono text-sm"
              >
                {id}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
