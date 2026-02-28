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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="mb-2 block text-sm">{t("count")}</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
            className="w-24 rounded-xl border border-[var(--border)] bg-transparent px-3 py-2"
          />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
          <span className="text-sm">{t("uppercase") || "ЗАГЛАВНЫЕ"}</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={noDashes} onChange={(e) => setNoDashes(e.target.checked)} />
          <span className="text-sm">{t("noDashes") || "Без дефисов"}</span>
        </label>
      </div>
      <motion.button
        onClick={generate}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white"
      >
        {t("generate")}
      </motion.button>
      {uuids.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-end">
            <CopyButton text={uuids.join("\n")} />
          </div>
          {uuids.map((id, i) => (
            <div
              key={i}
              className="cursor-pointer select-all rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 font-mono text-sm"
            >
              {id}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
